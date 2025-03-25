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

  // Generate descriptive pages using the standard Gemini model after courseData is loaded
  useEffect(() => {
    async function generateDescriptiveQA() {
      if (!courseData) return;
      try {
        // Construct a detailed prompt that includes course data and examples for descriptive pages
        const prompt = `You are provided with a course outline and details below. Your task is to generate a structured textbook-style content breakdown, organized by chapters and pages, with each page containing 250-300 words.

### Course Information:
Course Title: ${courseData.outline.courseTitle}
Course Summary: ${courseData.outline.courseSummary}

### Chapters and Topics:
${courseData.outline.chapters
  .map(
    (chapter) => `
Chapter: ${chapter.chapterTitle}
Summary: ${chapter.chapterSummary}
Topics: ${chapter.topics.join(", ")}
`
  )
  .join("\n")}

### Output Format:
Generate the output as a JSON array. Each entry in the array should represent a chapter and include:
- "chapter": The chapter title.
- "pages": An array of objects, each representing a page, containing:
  - "pageNumber": The page number.
  - "title": The title of the page.
  - "content": A detailed explanation of the topic covered on that page (250-300 words).

Below is an example of the expected output:

\`\`\`json
[
  {
    "chapter": "Understanding Special Entry Darshan (SED)",
    "pages": [
      {
        "pageNumber": 1,
        "title": "What is Special Entry Darshan?",
        "content": "The Special Entry Darshan (SED) at Tirumala Tirupati Devasthanams (TTD) is a system designed to provide a streamlined and convenient darshan experience for devotees. Unlike the traditional Sarva Darshan, where pilgrims may have to wait for long hours, the SED offers a pre-booked time slot for visiting the temple. This facility ensures that devotees can plan their pilgrimage in advance, minimizing uncertainty and reducing wait times significantly. \n\nThe SED system was introduced to enhance the efficiency of darshan and provide an orderly experience. Devotees can book their darshan slots online through the official TTD website, selecting their preferred date and time. The ticket usually comes with additional benefits, such as quicker access to the sanctum and, in some cases, complimentary prasadam. \n\nOverall, the SED is an excellent option for those looking to avoid the long queues and ensure a smooth and spiritually fulfilling darshan at Tirumala."
      },
      {
        "pageNumber": 2,
        "title": "Benefits of SED",
        "content": "The Special Entry Darshan (SED) provides multiple benefits to devotees seeking a streamlined and efficient darshan experience. One of the primary advantages is the significantly reduced waiting time. Since the slots are pre-booked, pilgrims no longer have to stand in long queues for hours, ensuring a more comfortable experience. \n\nAnother key benefit is the organized entry process. With specific time slots allocated, the flow of devotees is regulated, leading to a more peaceful and structured visit. The SED also ensures that pilgrims can plan their trips better, as they have a confirmed darshan schedule in advance. \n\nMoreover, the SED ticket sometimes includes perks like access to special queue lines and prasadam offerings, making the pilgrimage more fulfilling. Overall, this system enhances the overall experience by providing a well-structured, time-efficient, and comfortable visit to the sacred shrine."
      }
    ]
  }
]
\`\`\``.trim();

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
        setError(err.message || "Error generating descriptive pages");
      }
    }
    generateDescriptiveQA();
  }, [courseData]);

  return (
    <div className="px-4 bg-black min-h-screen py-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Course Content</h1>
      {loading && <p className="text-white">Loading course data...</p>}
      {error && (
        <pre className="text-red-400 bg-gray-800 p-4 rounded">{error}</pre>
      )}
      {!loading && descriptiveQA.length > 0 ? (
        <div className="flex flex-col gap-8">
          {descriptiveQA.map((chapter, chapterIdx) => (
            <div key={chapterIdx} className="border border-gray-700 rounded p-4 bg-gray-900">
              <h2 className="text-xl font-bold mb-2 text-white">
                Chapter: {chapter.chapter}
              </h2>
              {chapter.pages && chapter.pages.length > 0 ? (
                chapter.pages.map((page, pageIdx) => (
                  <div key={pageIdx} className="mb-4 p-4 border border-gray-600 rounded bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white">
                        Page {page.pageNumber}: {page.title}
                      </span>
                    </div>
                    <p className="text-gray-300">{page.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-white">No pages available for this chapter.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-white">No descriptive pages generated.</p>
      )}
    </div>
  );
}
