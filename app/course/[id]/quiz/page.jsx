"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure you've installed this package
import QuizCardItem from "./QuizCardItem";
import StepProgress from "./StepProgress";

export default function QuizKingDisplay() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state for quiz interaction
  const [stepCount, setStepCount] = useState(0);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");

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

  const checkAnswer = (selectedOption, currentQuiz) => {
    if (selectedOption === currentQuiz.correctAnswer) {
      setIsCorrectAnswer(true);
    } else {
      setIsCorrectAnswer(false);
      setCorrectAnswer(currentQuiz.correctAnswer);
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      if (stepCount < quizQuestions.length - 1) {
        setStepCount((prevStep) => prevStep + 1);
        setIsCorrectAnswer(null); // Reset the answer state for the next question
      }
    }, 1000); // Adjust the delay as needed
  };

  const goToCoursePage = () => {
    // Navigate to course page (adjust the URL as needed)
    window.location.href = `/courses/${id}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Quiz King</h1>
      {loading && <p className="text-white">Loading Quiz...</p>}
      {error && (
        <pre className="text-red-400 bg-gray-800 p-4 rounded">{error}</pre>
      )}
      {!loading && quizQuestions.length > 0 ? (
        <>
          <StepProgress
            data={quizQuestions}
            stepCount={stepCount}
            setStepCount={(value) => {
              setStepCount(value);
              setIsCorrectAnswer(null); // reset answer state on step change
            }}
          />

          <div>
            <QuizCardItem
              className="mt-10 mb-5"
              quiz={quizQuestions[stepCount]}
              userSelectedOption={(v) =>
                checkAnswer(v, quizQuestions[stepCount])
              }
            />
          </div>
          {isCorrectAnswer === false && (
            <div className="border p-3 border-red-700 bg-red-200 rounded-lg mt-16">
              <h2 className="font-bold text-lg text-red-600">Incorrect</h2>
              <p className="text-red-600">
                Correct answer is {correctAnswer}
              </p>
            </div>
          )}
          {isCorrectAnswer === true && (
            <div className="border p-3 border-green-700 bg-green-200 rounded-lg">
              <h2 className="font-bold text-lg text-green-600">Correct</h2>
              <p className="text-green-600">Your answer is correct</p>
            </div>
          )}

          {/* Show "Go to Course Page" button on the last quiz question */}
          {stepCount === quizQuestions.length - 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={goToCoursePage}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                Go to Course Page
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && <p className="text-white">Loading Quiz...</p>
      )}
    </div>
  );
}
