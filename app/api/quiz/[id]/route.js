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
You are provided with a course outline and details below. Your task is to generate a set of quiz questions that test understanding of the course content.

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

Please generate quiz questions as a JSON array. Each quiz question should be an object with the following keys:
- "question": The quiz question text.
- "options": An array of possible answer options.
- "correctAnswer": The correct answer from the options.
    `.trim();

    // Generate quiz questions using Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    const jsonString = extractJSONFromCodeBlock(responseText);
    const quizQuestions = JSON.parse(jsonString);

    // Return the generated quiz questions as JSON
    return NextResponse.json({ quizQuestions });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
