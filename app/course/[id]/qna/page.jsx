"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure you've installed this package

export default function DescriptiveQA() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [descriptiveQA, setDescriptiveQA] = useState([]);
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

  // Generate descriptive questions and answers using the standard Gemini model after courseData is loaded
  useEffect(() => {
    async function generateDescriptiveQA() {
      if (!courseData) return;
      try {
        // Construct a detailed prompt that includes course data and examples for descriptive Q&A
        const prompt = `
You are provided with a course outline and details below. Your task is to generate a set of descriptive questions and their answers that test understanding of the course content.

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

        // Initialize the Gemini API client using your API key
        const genAI = new GoogleGenerativeAI("AIzaSyB1H4OY1bqt8CUJbMNCtGBUNyqc64YvAyI");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);

        // Assume the response is in a markdown code block with JSON content
        const responseText = result.response.text();
        const jsonString = extractJSONFromCodeBlock(responseText);
        const parsedDescriptiveQA = JSON.parse(jsonString);
        setDescriptiveQA(parsedDescriptiveQA);
      } catch (err) {
        setError(err.message || "Error generating descriptive questions and answers");
      }
    }
    generateDescriptiveQA();
  }, [courseData]);

  return (
    <div className="px-4 bg-black min-h-screen py-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Descriptive Q&A</h1>
      {loading && <p className="text-white">Loading course data...</p>}
      {error && (
        <pre className="text-red-400 bg-gray-800 p-4 rounded">{error}</pre>
      )}
      {!loading && descriptiveQA.length > 0 ? (
        <div className="flex flex-col gap-4">
          {descriptiveQA.map((item, idx) => (
            <div key={idx} className="border border-gray-700 rounded p-4 bg-gray-900">
              <div className="font-bold mb-2 text-white">{item.question}</div>
              <div className="text-gray-300">{item.answer}</div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-white">No descriptive questions and answers generated.</p>
      )}
    </div>
  );
}
