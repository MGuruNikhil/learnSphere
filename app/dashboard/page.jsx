"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { isSignedIn, user } = useUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        console.log(data);
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-20 rounded-lg">
      {/* Header Section */}
      <div className="shadow-lg p-6 w-full max-w-4xl flex items-center justify-between gap-6 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold">Hello, {user?.fullName}</h1>
          <p className="text-lg">
            Welcome back, it&aposs time to get back and start learning a new course.
          </p>
        </div>
        <Link href="/course">
          <button className="px-6 py-2 rounded-md text-lg font-semibold shadow-md text-pink-500 cursor-pointer">
            + Create New
          </button>
        </Link>
      </div>

      {/* Courses Section */}
      <div className="mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold">Your Courses</h2>
        <div className="mt-6 space-y-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 gap-2 rounded-lg shadow-md flex justify-between items-center w-full border border-transparent dark:border-white/[0.2] group-hover:border-slate-700"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{course.outline.courseTitle}</h3>
                <p>{course.outline.courseSummary}</p>
              </div>
              <Link href={`/course/${course._id}`} className="cursor-pointer">
                <button className="px-6 py-2 font-semibold shadow-md rounded-lg bg-pink-500 cursor-pointer">
                  View
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
