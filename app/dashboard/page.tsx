"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header Section */}
      <div className="bg-gray-900 shadow-lg rounded-lg p-6">
        <div className="bg-gray-800 p-5 rounded-lg flex items-center gap-4">
          <img
            src={user?.imageUrl}
            alt="User Avatar"
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div>
            <h1 className="text-2xl font-bold">Hello, {user?.fullName}</h1>
            <p className="text-gray-400">
              Welcome back! Time to continue your learning journey.
            </p>
          </div>
        </div>
      </div>

      {/* Study Material Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Your Study Material</h2>
        <div className="mt-4 p-4 bg-gray-800 rounded-lg flex justify-between items-center">
          <p className="text-gray-300">No study materials available.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
