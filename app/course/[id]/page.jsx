"use client";

import Chapter from "../../components/Chapter";
import StudyMaterial from "../../components/study-material";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Course() {
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
        console.log("Course Data:", data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-black min-h-screen">
      <div></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
    <div>Try Again..</div>
    </div>
  }

  if (!courseData) {
    return <div className="flex items-center justify-center min-h-screen">
    <div>Crouse not found</div>
    </div>
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <div className="flex items-center justify-center gap-2 max-w-5xl mx-auto mt-4 rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700">
        <p className="text-5xl w-[10%]">📚</p>
        <div className="flex flex-col w-[90%]">
          <h1 className="text-3xl font-bold">{courseData.outline.courseTitle}</h1>
          <p className="text-zinc-400">{courseData.outline.courseSummary}</p>
        </div>
      </div>
      <StudyMaterial id={id} />
      <Chapter chapters={courseData.outline.chapters} />
    </div>
  );
}
