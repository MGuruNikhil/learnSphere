// /app/api/generateStudyContent/route.ts

import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { 
  GenerateStudyTypeContentAiModel, 
  GenerateQuizAiModel, 
  GenerateQnAAiModel,
  generateNotesAiModel 
} from "../../../configs/AiModel";

// Interfaces to type the course outline and its chapters.
interface Chapter {
  chapterTitle: string;
  chapterSummary: string;
  topics: string[];
  emoji: string;
}

interface CourseOutline {
  courseTitle: string;
  courseSummary: string;
  chapters: Chapter[];
}

// This interface represents the overall document stored in the database.
interface CourseDocument {
  _id: { $oid: string };
  userName: string;
  courseType: string;
  difficultyLevel: string;
  outline: CourseOutline;
  createdAt: { $date: { $numberLong: string } };
}

/**
 * POST endpoint to generate study content.
 * The request body should include:
 * - id: the course document ID (as a string)
 * - type: the study content type ("Flashcard", "Quiz", "QA", "notes")
 */
export async function POST(req: Request) {
  try {
    const { id, type }: { id: string; type: string } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ message: "Missing required fields (id, type)" }, { status: 400 });
    }

    // Retrieve the course document from the database.
    const courseData = await getCourseData(id);
    if (!courseData || !courseData.outline) {
      return NextResponse.json({ message: "Course data not found" }, { status: 404 });
    }
    
    // Use the outline as the course data for generating study content.
    const course: CourseOutline = courseData.outline;

    // Prepare chapter topics as a string for the prompt.
    const chapters = course.chapters
      .map(chapter => `${chapter.chapterTitle}: ${chapter.topics.join(", ")}`)
      .join(" | ");
    
    // Select the appropriate AI model and construct the prompt based on the study type.
    let aiModel;
    let prompt = "";
    
    switch (type) {
      case "Flashcard":
        aiModel = GenerateStudyTypeContentAiModel;
        prompt = `Generate flashcards on topic: ${chapters} in JSON format with front and back content. Maximum 15 cards.`;
        break;
      case "Quiz":
        aiModel = GenerateQuizAiModel;
        prompt = `Generate a quiz on topic: ${chapters} with questions, options, and answers in JSON Format. Maximum 10 questions.`;
        break;
      case "QA":
        aiModel = GenerateQnAAiModel;
        prompt = `Generate a detailed Q&A on topic: ${chapters} in JSON format with each question and a detailed answer. Maximum 10 pairs.`;
        break;
      case "notes":
        aiModel = generateNotesAiModel;
        prompt = `Generate detailed notes on topic: ${chapters}. Include all topic points with detailed explanations.`;
        break;
      default:
        return NextResponse.json({ message: `Unsupported study type: ${type}` }, { status: 400 });
    }
    
    console.log(`Generating ${type} for course: ${course.courseTitle}`);
    
    // Call the selected AI model with the constructed prompt.
    const aiResponse = await aiModel.sendMessage(prompt);
    let result = await aiResponse.response.text();
    
    // For JSON-based responses, remove markdown code blocks and validate JSON.
    if (type !== "notes") {
      result = result.replace(/```json\n?/, "").replace(/```\n?/, "");
      try {
        JSON.parse(result);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
      }
    }
    
    return NextResponse.json({
      content: result,
      message: `${type} generated successfully`
    });
    
  } catch (error: any) {
    console.error("Error generating study content:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * Retrieves a course document from MongoDB by its ID.
 * The document includes the full structure, and the course outline is used for generating study content.
 */
export async function getCourseData(id: string): Promise<CourseDocument | null> {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("Missing DATABASE_URL in environment variables");
  }
  const client = await MongoClient.connect(uri);
  const db = client.db("courseDB"); // Replace with your specific database name
  const course = await db
    .collection("courseOutlines") // Replace with your collection name
    .findOne({ _id: new ObjectId(id) });
  await client.close();
  return course as unknown as CourseDocument;
}
