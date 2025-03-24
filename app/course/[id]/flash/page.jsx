"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function FlashcardsDisplay() {
  const [flashcards, setFlashcards] = useState([]);

  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course data');
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
    if (text.startsWith("```json")) {
      return text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    }
    return text;
  };

  // Simulate processing the Gemini API response
  useEffect(() => {
    try {
      const candidate = sampleGeminiResponse.candidates[0];
      const responseText = candidate.content.parts[0].text;
      const jsonString = extractJSONFromCodeBlock(responseText);
      const parsedFlashcards = JSON.parse(jsonString);
      setFlashcards(parsedFlashcards);
    } catch (err) {
      setError(err.message || "Unexpected error occurred");
    }
  }, []);

  return (
    <div className="px-4 bg-black min-h-screen py-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Flashcards</h1>
      {error && (
        <pre className="text-red-400 bg-gray-800 p-4 rounded">
          {error}
        </pre>
      )}
      {flashcards.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {flashcards.map((card, idx) => (
            <div
              key={idx}
              className="w-64 border border-gray-700 rounded p-4 bg-gray-900"
            >
              <div className="font-bold mb-2 text-white">
                {card.front}
              </div>
              <div className="text-gray-300">{card.back}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}
