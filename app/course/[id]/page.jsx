// app/course/[id]/page.jsx

import Chapter from "../../components/Chapter";
import StudyMaterial from "../../components/study-material";
import React from "react";
import { MongoClient, ObjectId } from "mongodb";

// Helper function to fetch the course data from MongoDB

async function getCourseData(id) {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("Missing MONGO_URI in environment variables");
  }
  const client = await MongoClient.connect(uri);
  const db = client.db("courseDB"); // Use your specific database name
  // Use your specific collection name where the course outlines are stored.
  const course = await db.collection("courseOutlines").findOne({ _id: new ObjectId(id) });
  await client.close();
  return course;
}


// This is now an async server component. Next.js will pass the route params to it.
export default async function Course({ params }) {
  const { id } = params;
  const courseData = await getCourseData(id);

  // Ensure courseData exists and has the expected structure
  if (!courseData) {
    return <p>Course not found</p>;
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
      <Chapter />
    </div>
  );
}
