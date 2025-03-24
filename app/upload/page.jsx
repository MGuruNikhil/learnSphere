"use client";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Upload() {
  const [userName, setUserName] = useState('');
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || files.length === 0) {
      setMessage('Please provide a name and at least one PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('userName', userName);
    // Append each file to the FormData under the same field name
    Array.from(files).forEach((file) => {
      formData.append('pdfFiles', file);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        let msg = '';
        // If multiple files are returned, loop over them
        data.files.forEach((file) => {
          msg += `Url: ${file.fileUrl}\nText: ${file.text}\n\n`;
        });
        setMessage(msg);
      } else {
        setMessage(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage('Upload failed due to network error');
    }
  };

  return (
    <div className='container mx-auto py-20'>
      <h1>Upload PDF(s)</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        <button type="submit">Upload</button>
      </form>
      {/* Render the AI generated text using ReactMarkdown to support markdown formatting */}
      <div className='mt-4'>
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
}
