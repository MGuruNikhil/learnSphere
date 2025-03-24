"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import React from "react";

const courses = [
  {
    id: 1,
    title: "Data Structures and Algorithms",
    description: "This course provides a moderate-level introduction to data structures and algorithms.",
    status: "Ready",
    progress: 80,
  },
  {
    id: 2,
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript for building web applications.",
    status: "Ready",
    progress: 65,
  },
  {
    id: 3,
    title: "Database Management Systems",
    description: "Understand relational databases, SQL, and normalization techniques.",
    status: "In Progress",
    progress: 40,
  },
];

export default function Dashboard() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-4 text-xl font-semibold">
          Please sign in to access your dashboard.
        </p>
        <SignInButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-20 rounded-lg">
      {/* Header Section */}
      <div className="shadow-lg p-6 w-full max-w-4xl flex items-center gap-6 rounded-lg ">
        <div>
          <h1 className="text-2xl font-bold">Hello, {user?.fullName}</h1>
          <p className="text-lg">
            Welcome back, it&aposs time to get back and start learning a new course.
          </p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold">Your Courses</h2>
        <div className="mt-6 space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="p-6 rounded-lg shadow-md flex justify-between items-center w-full border border-transparent dark:border-white/[0.2] group-hover:border-slate-700">
              <div>
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-lg">{course.description}</p>
                <p>Status: {course.status}</p>
                <p>Progress: {course.progress}%</p>
              </div>
              <button className="px-6 py-2 font-semibold shadow-md rounded-lg bg-pink-500">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
