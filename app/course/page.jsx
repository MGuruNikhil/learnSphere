"use client";

import { useState } from "react";

export default function UploadPage() {
  const [msg, setMsg] = useState("");
  const [courseType, setCourseType] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setPdfFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("msg", msg);
    formData.append("courseType", courseType);
    formData.append("difficultyLevel", difficultyLevel);
    formData.append("userName", "your-username"); 

    // Append each selected PDF file
    for (let i = 0; i < pdfFiles.length; i++) {
      formData.append("pdfFiles", pdfFiles[i]);
    }

    try {
      const response = await fetch("/api/generate-course-ouline", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setResult(data);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="py-20">
      <h1>Generate Course Material</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Message:{" "}
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
              className="border border-white rounded-md p-1 "
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Course Type:{" "}
            <input
              type="text"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              required
              className="border border-white rounded-md p-1 "

            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Difficulty Level:{" "}
            <input
              type="text"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              required
              className="border border-white rounded-md p-1 "
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            PDF Files:{" "}
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              required
              accept="application/pdf"
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Generated Course Outline</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
