"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [msg, setMsg] = useState("");
  const [courseType, setCourseType] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

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
      router.push(`/course/${data.insertedId}`);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Generate Course Material</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">Message:</label>
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            required
            className="w-full p-2 border rounded-md  focus:outline-none focus:ring-2 border-transparent dark:border-white/[0.2] group-hover:border-slate-700"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Course Type:</label>
          <input
            type="text"
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 border-transparent dark:border-white/[0.2] group-hover:border-slate-700"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Difficulty Level:</label>
          <input
            type="text"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 border-transparent dark:border-white/[0.2] group-hover:border-slate-700"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">PDF Files:</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            required
            accept="application/pdf"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 border-transparent dark:border-white/[0.2] group-hover:border-slate-700"
          />
        </div>
        <button
          
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-2 rounded-md transition disabled:bg-gray-500 text-pink-500 cursor-pointer hover:bg-pink-500 hover:text-white"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-600 text-white rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
