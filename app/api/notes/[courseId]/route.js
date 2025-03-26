import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to extract JSON from a code block (if Gemini returns wrapped JSON)
function extractJSONFromCodeBlock(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("```json")) {
    const withoutStart = trimmed.substring(7);
    const withoutEnd = withoutStart.substring(0, withoutStart.lastIndexOf("```"));
    return withoutEnd.trim();
  }
  return text;
}

export async function GET(request, { params }) {
  try {
    const { courseId } = params;
    const uri = process.env.DATABASE_URL;
    if (!uri) {
      throw new Error("Missing DATABASE_URL in environment variables");
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(uri);

    // 1. Fetch course data from courseDB.courseOutlines
    const course = await client
      .db("courseDB")
      .collection("courseOutlines")
      .findOne({ _id: new ObjectId(courseId) });

    if (!course) {
      await client.close();
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 2. Check if a note for this course already exists in the "notes" database
    const noteCollection = client.db("notes").collection("notes");
    const existingNote = await noteCollection.findOne({ courseId });
    if (existingNote) {
      await client.close();
      return NextResponse.json(existingNote);
    }

    // 3. Construct the Gemini prompt using the course details
    const prompt = `
        You are provided with the following chapter details:
        
        Course Title: ${course.outline.courseTitle}
        Course Summary: ${course.outline.courseSummary}
        Chapters:
        ${course.outline.chapters
          .map(
            (chapter) => `
        Chapter: ${chapter.chapterTitle}
        Summary: ${chapter.chapterSummary}
        Topics: ${chapter.topics.join(", ")}
        `
          )
          .join("\n")}
        
        For each chapter and for each topic in that chapter, generate a structured response according to these strict instructions:
        
        1. Output exactly a valid JSON array and nothing else. Do not include any additional text, markdown formatting, or code block markers.
        2. Each element of the JSON array must be an object with exactly two keys:
           - "chapter": a string representing the chapter title.
           - "articles": an array of article objects.
        3. Each article object must have exactly two keys:
           - "topic": a string representing the topic name.
           - "pages": an array of page objects.
        4. Each page object must have exactly three keys:
           - "pageNumber": an integer (starting at 1).
           - "title": a string that includes an HTML <h3> tag formatted exactly as "<h3>Chapter Title: Topic - [Page Title]</h3>".
           - "content": a string that includes an HTML <h4> tag for a subheading followed by a <p> tag with a detailed explanation. Optionally, include an <iframe> for an embedded YouTube video if relevant.
        
        For example, if the course details are:
        
        Course Title: "Intro to Programming"  
        Course Summary: "Learn the basics of programming."  
        Chapters:  
        - Chapter Title: "Basics"  
          Summary: "An introduction to programming concepts."  
          Topics: ["Variables", "Loops"]
        
        Then the expected JSON output is:
        
        [
          {
            "chapter": "Basics",
            "articles": [
              {
                "topic": "Variables",
                "pages": [
                  {
                    "pageNumber": 1,
                    "title": "<h3>Basics: Topic - Variables</h3>",
                    "content": "<h4>Introduction</h4><p>Variables store data values in programming languages.</p>"
                  }
                ]
              },
              {
                "topic": "Loops",
                "pages": [
                  {
                    "pageNumber": 1,
                    "title": "<h3>Basics: Topic - Loops</h3>",
                    "content": "<h4>Introduction</h4><p>Loops allow you to iterate over data sets repeatedly.</p>"
                  }
                ]
              }
            ]
          }
        ]
        
        Now, using the provided chapter details above, produce only the JSON array in your response, with no additional text or formatting.
    `.trim();

    // 4. Initialize Gemini API client and generate chapter responses
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in environment variables");
    }
    const genAI = new GoogleGenerativeAI(API_KEY); // Replace "API_KEY" with your actual Gemini API key
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    const jsonString = extractJSONFromCodeBlock(responseText);
    let parsedChapterResponses;
    try {
      parsedChapterResponses = JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse Gemini response JSON:", err);
      throw new Error("Failed to parse Gemini response JSON : ");
    }

    // 5. Build the note object to store
    const noteObject = {
      courseId,
      note: { chapters: parsedChapterResponses },
      generatedAt: new Date().toISOString(),
    };

    // 6. Save the generated note in the "notes" database
    await noteCollection.insertOne(noteObject);
    await client.close();

    return NextResponse.json(noteObject);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
