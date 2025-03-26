"use client";

import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure this package is installed

export default function GeminiChaptersByTopicRaw() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [chapterResponses, setChapterResponses] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper to extract JSON from a code block
  const extractJSONFromCodeBlock = (text) => {
    const trimmed = text.trim();
    if (trimmed.startsWith("```json")) {
      // Remove the starting ```json and the trailing ```
      const withoutStart = trimmed.substring(7);
      const withoutEnd = withoutStart.substring(0, withoutStart.lastIndexOf("```"));
      return withoutEnd.trim();
    }
    return text;
  };
  
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

  // Fetch course data from your API endpoint using the passed courseId prop


  // For each chapter, call Gemini to generate chapter responses using a normal call
  useEffect(() => {
    async function generateChapterResponses() {
      if (!courseData) return;
      try {
        const prompt = `
        You are provided with the following chapter details:
        
        Course Title: ${courseData.outline.courseTitle}
        Course Summary: ${courseData.outline.courseSummary}
        Chapters:
        ${courseData.outline.chapters
          .map(
            (chapter) => `
        Chapter: ${chapter.chapterTitle}
        Summary: ${chapter.chapterSummary}
        Topics: ${chapter.topics.join(", ")}
        `
          )
          .join("\n")}
        
        For each chapter and for each topic in that chapter, generate a structured response according to these strict instructions:
        
        1. Output exactly a valid JSON array and nothing else. Do not include any additional text, markdown formatting, or code block markers.
        2. Each element of the JSON array must be an object with exactly two keys:
           - "chapter": a string representing the chapter title.
           - "articles": an array of article objects.
        3. Each article object must have exactly two keys:
           - "topic": a string representing the topic name.
           - "pages": an array of page objects.
        4. Each page object must have exactly three keys:
           - "pageNumber": an integer (starting at 1).
           - "title": a string that includes an HTML <h3> tag formatted exactly as "<h3>Chapter Title: Topic - [Page Title]</h3>".
           - "content": a string that includes an HTML <h4> tag for a subheading followed by a <p> tag with a detailed explanation. Optionally, include an <iframe> for an embedded YouTube video if relevant.
        
        For example, if the course details are:
        
        Course Title: "Intro to Programming"  
        Course Summary: "Learn the basics of programming."  
        Chapters:  
        - Chapter Title: "Basics"  
          Summary: "An introduction to programming concepts."  
          Topics: ["Variables", "Loops"]
        
        Then the expected JSON output is:
        
        [
          {
            "chapter": "Basics",
            "articles": [
              {
                "topic": "Variables",
                "pages": [
                  {
                    "pageNumber": 1,
                    "title": "<h3>Basics: Topic - Variables</h3>",
                    "content": "<h4>Introduction</h4><p>Variables store data values in programming languages.</p>"
                  }
                ]
              },
              {
                "topic": "Loops",
                "pages": [
                  {
                    "pageNumber": 1,
                    "title": "<h3>Basics: Topic - Loops</h3>",
                    "content": "<h4>Introduction</h4><p>Loops allow you to iterate over data sets repeatedly.</p>"
                  }
                ]
              }
            ]
          }
        ]
        
        Now, using the provided chapter details above, produce only the JSON array in your response, with no additional text or formatting.
        `.trim();
        

        // Initialize Gemini API client and call the model normally
        const genAI = new GoogleGenerativeAI("AIzaSyD9MVN0_xur59fVI-JBG0zmdG12YDQhOZw");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        const jsonString = extractJSONFromCodeBlock(responseText);
        
        const parsedChapterResponses = JSON.parse(jsonString);
        setChapterResponses(parsedChapterResponses);
      } catch (err) {
        setError(err.message || "Error generating chapter responses");
      }
    }
    generateChapterResponses();
  }, [courseData]);

  // Reset topic index when chapter changes
  useEffect(() => {
    setCurrentTopicIndex(0);
  }, [currentChapterIndex]);

  // Topic-level navigation handlers
  const handleTopicNext = () => {
    const currentArticles = chapterResponses[currentChapterIndex].articles;
    if (currentTopicIndex < currentArticles.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
    } else if (currentChapterIndex < chapterResponses.length - 1) {
      // Move to next chapter's first topic
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentTopicIndex(0);
    }
  };

  const handleTopicPrev = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1);
    } else if (currentChapterIndex > 0) {
      // Move to previous chapter's last topic
      const prevArticles = chapterResponses[currentChapterIndex - 1].articles;
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentTopicIndex(prevArticles.length - 1);
    }
  };

  // Allow clicking a chapter dot to jump directly to that chapter
  const handleChapterSelect = (index) => {
    setCurrentChapterIndex(index);
    setCurrentTopicIndex(0);
  };

  if (loading) return  <div className="flex items-center justify-center min-h-screen">
  Generating the notes...
</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen">Try again later...</div>;
  if (!chapterResponses.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Generating the notes...
      </div>
    );
  }

  const currentChapter = chapterResponses[currentChapterIndex];
  const currentArticle = currentChapter.articles[currentTopicIndex];

  return (
    <div className="container py-20">
      {/* Chapter Header */}
      <header className="chapter-header">
        <h1>{currentChapter.chapter}</h1>
      </header>
      {/* Chapter Dots Navigation */}
      <div className="chapter-dots">
        {chapterResponses.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentChapterIndex ? "active" : ""}`}
            onClick={() => handleChapterSelect(idx)}
          />
        ))}
      </div>

      {/* Topic Navigation Controls */}
      <div className="topic-navigation">
        <button onClick={handleTopicPrev} className="nav-button">Previous Topic</button>
        <span className="page-info">
          Topic {currentTopicIndex + 1} of {currentChapter.articles.length}
        </span>
        <button onClick={handleTopicNext} className="nav-button">Next Topic</button>
      </div>

      {/* Topic Content */}
      <section className="content-section">
        <div className="article">
          <h2>{currentArticle.topic}</h2>
          {currentArticle.pages[0] && (
            <>
              <div
                className="page-title"
                dangerouslySetInnerHTML={{ __html: currentArticle.pages[0].title }}
              />
              <div
                className="page-content"
                dangerouslySetInnerHTML={{ __html: currentArticle.pages[0].content }}
              />
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
        }
        /* Chapter dots */
        .chapter-dots {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .dot {
          height: 12px;
          width: 12px;
          margin: 0 5px;
          background-color: #bbb;
          border-radius: 50%;
          display: inline-block;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .dot.active {
          background-color: #0070f3;
        }
        /* Chapter header */
        .chapter-header h1 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
        }
        /* Topic Navigation */
        .topic-navigation {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        .topic-navigation .nav-button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          margin: 0 10px;
        }
        .topic-navigation .nav-button:hover {
          background-color: #005bb5;
        }
        .page-info {
          font-size: 16px;
          font-weight: bold;
        }
        /* Topic content */
        .content-section {
          line-height: 1.6;
        }
        .article {
          margin-bottom: 30px;
        }
        .article h2 {
          font-size: 1.75rem;
          margin-bottom: 15px;
        }
        .page-title h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }
        .page-content h4 {
          font-size: 1.25rem;
          margin-bottom: 10px;
        }
        .page-content p {
          font-size: 1rem;
        }
        /* Responsive Styles */
        @media (max-width: 768px) {
          .topic-navigation {
            flex-direction: column;
            text-align: center;
          }
          .topic-navigation .nav-button {
            width: 100%;
            margin-bottom: 10px;
          }
          .page-info {
            margin-bottom: 10px;
          }
          .chapter-header h1 {
            font-size: 1.75rem;
          }
          .article h2 {
            font-size: 1.5rem;
          }
          .page-title h3 {
            font-size: 1.25rem;
          }
          .page-content h4 {
            font-size: 1.1rem;
          }
          .page-content p {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
