import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function to extract JSON from a markdown code block
function extractJSONFromCodeBlock(text) {
  const regex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(regex);
  return match ? match[1] : text;
}

export async function GET(request, context) {
  try {
    // Await the context before accessing params
    const { params } = await context;
    const { id } = params;
    
    const uri = process.env.DATABASE_URL;
    if (!uri) {
      throw new Error("Missing DATABASE_URL in environment variables");
    }

    // Connect to MongoDB and fetch the course outline
    const client = await MongoClient.connect(uri);
    const db = client.db("courseDB");
    const course = await db
      .collection("courseOutlines")
      .findOne({ _id: new ObjectId(id) });
    await client.close();

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Build the prompt using the course outline data
    const prompt = `
You are provided with a course outline and details below. Your task is to generate a set of descriptive questions and their detailed answers that test understanding of the course content.

Course Title: ${course.outline.courseTitle}
Course Summary: ${course.outline.courseSummary}
Chapters and Topics:
${course.outline.chapters
  .map(
    (chapter) => `
Chapter: ${chapter.chapterTitle}
Summary: ${chapter.chapterSummary}
Topics: ${chapter.topics.join(", ")}
`
  )
  .join("\n")}

Please generate descriptive questions and answers as a JSON array. Each entry in the array should be an object with the following keys:
- "question": The descriptive question text.
- "answer": A detailed answer that explains the concept.

Below are two examples of correctly formatted descriptive questions and answers:

Example 1:
\`\`\`json
[
  {
    "question": "Explain the concept of Special Entry Darshan (SED) and its benefits.",
    "answer": "Special Entry Darshan (SED) is a service designed to reduce waiting times by providing a dedicated entry process, ensuring a smoother and more organized darshan experience."
  },
  {
    "question": "Describe the booking process for SED.",
    "answer": "The booking process for SED involves visiting the TTD website, selecting the desired darshan slot, and confirming the booking, which helps streamline entry and reduce queues."
  }
]
\`\`\`

Example 2:
\`\`\`json
[
  {
    "question": "What is the primary purpose of SED?",
    "answer": "The primary purpose of SED is to offer devotees a premium darshan experience by minimizing the traditional long waiting times through an organized booking system."
  },
  {
    "question": "How does SED improve the overall darshan experience?",
    "answer": "SED improves the darshan experience by reducing crowd congestion, ensuring timely entry, and providing a more efficient system for managing the flow of visitors."
  }
]
\`\`\`

Based on the course outline above, generate a new set of descriptive questions and answers.
    `.trim();

    // Generate descriptive Q&A using Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    const jsonString = extractJSONFromCodeBlock(responseText);
    const descriptiveQA = JSON.parse(jsonString);

    // Return the generated descriptive Q&A
    return NextResponse.json({ descriptiveQA });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
