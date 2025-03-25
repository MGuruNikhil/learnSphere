"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure you've installed this package

export default function QuizKingDisplay() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course data from API endpoint
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

  // Helper function to extract JSON content from a markdown code block
  const extractJSONFromCodeBlock = (text) => {
    const regex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(regex);
    return match ? match[1] : text;
  };

  // Generate quiz questions using the standard Gemini model after courseData is loaded
  useEffect(() => {
    async function generateQuizQuestions() {
      if (!courseData) return;
      try {
        // Construct a detailed prompt that includes course data and example quiz questions
        const prompt = `
You are provided with a course outline and details below. Your task is to generate a set of quiz questions that test understanding of the course content.

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

Please generate quiz questions as a JSON array. Each quiz question should be an object with the following keys:
- "question": The quiz question text.
- "options": An array of possible answer options.
- "correctAnswer": The correct answer from the options.

Below are two examples of correctly formatted quiz questions:

Example 1:
\`\`\`json
[
  {
    "question": "What does SED stand for in the context of darshan services?",
    "options": [
      "Special Entry Darshan",
      "Standard Entry Darshan",
      "Super Exclusive Darshan",
      "Selective Entry Darshan"
    ],
    "correctAnswer": "Special Entry Darshan"
  },
  {
    "question": "Which of the following is a benefit of SED?",
    "options": [
      "Long waiting times",
      "Reduced queues",
      "Unorganized entry",
      "No booking process"
    ],
    "correctAnswer": "Reduced queues"
  }
]
\`\`\`

Example 2:
\`\`\`json
[
  {
    "question": "What is the primary purpose of SED?",
    "options": [
      "To increase waiting times",
      "To offer a premium darshan experience",
      "To provide free darshan",
      "To discourage online booking"
    ],
    "correctAnswer": "To offer a premium darshan experience"
  },
  {
    "question": "How can one book SED?",
    "options": [
      "By visiting the TTD website",
      "By calling customer service",
      "By visiting the temple in person",
      "Through social media"
    ],
    "correctAnswer": "By visiting the TTD website"
  }
]
\`\`\`

Based on the course outline above, generate a new set of quiz questions.
        `.trim();

        // Initialize the Gemini API client using your API key
        const genAI = new GoogleGenerativeAI("AIzaSyB1H4OY1bqt8CUJbMNCtGBUNyqc64YvAyI");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);

        // Assume the response is in a markdown code block with JSON content
        const responseText = result.response.text();
        const jsonString = extractJSONFromCodeBlock(responseText);
        const parsedQuizQuestions = JSON.parse(jsonString);
        setQuizQuestions(parsedQuizQuestions);
      } catch (err) {
        setError(err.message || "Error generating quiz questions");
      }
    }
    generateQuizQuestions();
  }, [courseData]);

  return (
    <div className="px-4 bg-black min-h-screen py-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Quiz King</h1>
      {loading && <p className="text-white">Loading course data...</p>}
      {error && (
        <pre className="text-red-400 bg-gray-800 p-4 rounded">{error}</pre>
      )}
      {!loading && quizQuestions.length > 0 ? (
        <div className="flex flex-col gap-4">
          {quizQuestions.map((question, idx) => (
            <div key={idx} className="border border-gray-700 rounded p-4 bg-gray-900">
              <div className="font-bold mb-2 text-white">{question.question}</div>
              <ul className="list-disc list-inside">
                {question.options.map((option, optIdx) => (
                  <li key={optIdx} className="text-gray-300">{option}</li>
                ))}
              </ul>
              <div className="mt-2 text-green-400">Answer: {question.correctAnswer}</div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-white">No quiz questions generated.</p>
      )}
    </div>
  );
}
