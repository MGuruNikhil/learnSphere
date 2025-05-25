"use client";
import React from "react";
import Link from "next/link";

export function AnimatedModalDemo() {
  return (
    <div className="py-0 flex items-center justify-center">
      <Link
        href="/dashboard"
        className="bg-black dark:bg-white dark:text-black text-white px-6 py-2 rounded-md flex items-center justify-center group/modal-btn relative overflow-hidden"
      >
        <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
          Dashboard
        </span>
        <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500">
          🚀 📓 🚀
        </div>
      </Link>
    </div>
  );
}
