"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HoverEffect } from "../../../components/ui/card-hover-effect";

export default function FlashcardsDisplay() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        const data = await response.json();
        setCourseData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCourseData();
  }, [id]);

  const extractJSONFromCodeBlock = (text) => {
    const regex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(regex);
    return match ? match[1] : text;
  };

  useEffect(() => {
    async function generateFlashcards() {
      if (!courseData) return;
      try {
        const prompt = `
You are provided with a course outline and details below. Your task is to generate a set of flashcards that help summarize the course content.

Course Title: ${courseData.outline.courseTitle}
Course Summary: ${courseData.outline.courseSummary}
Chapters and Topics:
${courseData.outline.chapters
  .map(
    (chapter) => `
Chapter: ${chapter.chapterTitle}
Summary: ${chapter.chapterSummary}
Topics: ${chapter.topics.join(", ")}
`
  )
  .join("\n")}

Please generate flashcards as a JSON array, where each flashcard is an object with two keys: "front" for the question and "back" for the answer.
        `.trim();

        const genAI = new GoogleGenerativeAI("AIzaSyB1H4OY1bqt8CUJbMNCtGBUNyqc64YvAyI");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);

        const responseText = result.response.text();
        const jsonString = extractJSONFromCodeBlock(responseText);
        const parsedFlashcards = JSON.parse(jsonString);
        setFlashcards(parsedFlashcards);
      } catch (err) {
        setError(err.message || "Error generating flashcards");
      }
    }
    generateFlashcards();
  }, [courseData]);

  const transformedFlashcards = flashcards.map((card) => ({
    icon: "⭐", // Star icon
    chapterTitle: card.front,
    chapterSummary: card.back,
    link: "#", // No link needed for flashcards
  }));

  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Flashcards</h1>
      {loading && <p className="text-white">Loading course data...</p>}
      {error && (
        <pre className="text-red-400 bg-gray-800 p-4 rounded">{error}</pre>
      )}
      {!loading && flashcards.length > 0 ? (
        <HoverEffect items={transformedFlashcards} />
      ) : (
        !loading && <p className="text-white">No flashcards available.</p>
      )}
    </div>
  );
}