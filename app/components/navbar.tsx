"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
export default function Appbar() {
  const [bgOpacity, setBgOpacity] = useState(1);

  

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Calculate opacity: from 1 at scrollY=0 to 0.5 at scrollY>=200
      const newOpacity = Math.max(0.45, 1 - scrollY / 200);
      setBgOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black relative">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full p-2"
      >
        <motion.div
          initial={{ opacity: 1, scale: 1, backgroundColor: "rgba(0,0,0,1)" }}
          animate={{
            backgroundColor: `rgba(0,0,0,${bgOpacity})`,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 backdrop-blur-xl rounded-2xl border border-neutral-700 shadow-lg"
        >
          <div className="flex h-16 items-center justify-between relative text-white">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="flex items-center space-x-1 transition-opacity hover:opacity-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                <span className="hidden font-bold font-mono text-xl sm:inline-block">
                  Learn<span className="text-pink-500">Sphere</span>
                </span>
              </Link>
            </motion.div>

            {/* Navigation Menu Buttons */}
            <div className="flex items-center gap-4">
              {/* Home */}
              <Link href="/">
                <Button variant="ghost" className="text-white">
                  Home
                </Button>
              </Link>

              {/* Products */}
              <Link href="/upload">
                <Button variant="ghost" className="text-white hover:cursor-pointer">
                  Upload
                </Button>
              </Link>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-white hover:text-gray-400 transition">Sign In</button>
                </SignInButton>
              </SignedOut>


            </div>
          </div>
        </motion.div>
      </motion.header>
    </div>
  );
}
