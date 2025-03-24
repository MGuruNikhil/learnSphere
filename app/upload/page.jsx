"use client";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Upload() {
  const { isSignedIn, user } = useUser(); 
  const [userName, setUserName] = useState(user?.fullName || "");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      setMessage("You must be signed in to upload files.");
      return;
    }

    if (!userName || files.length === 0) {
      setMessage("Please provide a name and at least one PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("userName", userName);
    Array.from(files).forEach((file) => {
      formData.append("pdfFiles", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(res.ok ? `Upload successful: ${JSON.stringify(data)}` : data.error);
    } catch (error) {
      setMessage("Upload failed due to network error.");
    }
  };

  return (
    <div className="container mx-auto py-20">
      <h1>Upload PDF(s)</h1>
      {!isSignedIn ? (
        <div>
          <p>Please sign in to upload files.</p>
          <SignInButton />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled
          />
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <button type="submit">Upload</button>
        </form>
      )}
      <div className="mt-4">
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
}
