"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure you've installed this package

export default function FlashcardsDisplay() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
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

  // Sample Gemini API response (with valid JSON wrapped in a markdown code block)
  const sampleGeminiResponse = {
    "candidates": [
      {
        "content": {
          "parts": [
            {
              "text": "```json\n[\n  {\n    \"front\": \"What is Special Entry Darshan (SED)?\",\n    \"back\": \"A paid darshan allowing devotees to enter through a dedicated queue, offering a shorter waiting time compared to free darshan lines.\"\n  },\n  {\n    \"front\": \"What are the benefits of Special Entry Darshan?\",\n    \"back\": \"Shorter waiting time, dedicated entry point, and a more organized darshan experience.\"\n  },\n  {\n    \"front\": \"What is the cost of Special Entry Darshan?\",\n    \"back\": \"Typically around INR 300 per person. Price is subject to change; always verify on the official TTD website.\"\n  },\n  {\n    \"front\": \"How does SED differ from other Darshan types?\",\n    \"back\": \"SED requires a payment for a shorter queue, whereas free darshan types involve longer waiting times.\"\n  }\n]\n```"
            }
          ],
          "role": "model"
        },
        "finishReason": "MAX_TOKENS",
        "avgLogprobs": -0.29954081257497234
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 153,
      "candidatesTokenCount": 254,
      "totalTokenCount": 407,
      "promptTokensDetails": [
        {
          "modality": "TEXT",
          "tokenCount": 153
        }
      ],
      "candidatesTokensDetails": [
        {
          "modality": "TEXT",
          "tokenCount": 254
        }
      ]
    },
    "modelVersion": "gemini-2.0-flash"
  };

  // Helper function to extract JSON content from a markdown code block
  const extractJSONFromCodeBlock = (text) => {
    const regex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(regex);
    return match ? match[1] : text;
  };

  // Generate flashcards using Gemini API after courseData is loaded
  useEffect(() => {
    async function generateFlashcards() {
      if (!courseData) return;
      try {
        // Construct a detailed prompt that includes course data and example flashcards
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
        
Below are two examples of correctly formatted flashcards:
        
Example 1:
\`\`\`json
[
  {
    "front": "What is Special Entry Darshan (SED)?",
    "back": "SED is a paid darshan option offering devotees a shorter waiting time with a dedicated entry."
  },
  {
    "front": "How do you book a Special Entry Darshan?",
    "back": "Booking is completed online through the official TTD portal, which provides clear instructions and confirmation details."
  },
  {
    "front": "What are the benefits of SED?",
    "back": "Benefits include reduced waiting times, dedicated entry points, and an organized darshan experience."
  }
]
\`\`\`
        
Example 2:
\`\`\`json
[
  {
    "front": "Define Special Entry Darshan.",
    "back": "It is a premium darshan option at TTD that allows devotees to bypass long queues with a faster entry process."
  },
  {
    "front": "What steps are involved in booking SED?",
    "back": "The process involves visiting the TTD website, filling out the booking form, making a payment, and receiving a confirmation."
  },
  {
    "front": "Mention one key feature of the SED service.",
    "back": "A key feature is the dedicated queue system that minimizes waiting times."
  }
]
\`\`\`
        
Based on the course outline above, generate a new set of flashcards.
        `.trim();

        // Initialize the Gemini API client using your API key
        const genAI = new GoogleGenerativeAI("AIzaSyB1H4OY1bqt8CUJbMNCtGBUNyqc64YvAyI");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);

        // Assume the response is in a markdown code block with JSON content
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

  return (
    <div className="px-4 bg-black min-h-screen py-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Flashcards</h1>
      {loading && <p className="text-white">Loading course data...</p>}
      {error && (
        <pre className="text-red-400 bg-gray-800 p-4 rounded">{error}</pre>
      )}
      {!loading && flashcards.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {flashcards.map((card, idx) => (
            <div
              key={idx}
              className="w-64 border border-gray-700 rounded p-4 bg-gray-900"
            >
              <div className="font-bold mb-2 text-white">{card.front}</div>
              <div className="text-gray-300">{card.back}</div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-white">No flashcards generated.</p>
      )}
    </div>
  );
}
