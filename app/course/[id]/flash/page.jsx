"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FlashcardsDisplay() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToCoursePage = () => {
    window.location.href = `/course/${id}`;
  };

  // Fetch both course data and flashcards from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/flash/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch course data");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Handlers for navigating flashcards
  const goToPrevious = () => {
    if (isAnimating || !data?.flashcards?.length) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? data.flashcards.length - 1 : prev - 1));
    setIsFlipped(false);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating || !data?.flashcards?.length) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === data.flashcards.length - 1 ? 0 : prev + 1));
    setIsFlipped(false);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [data, isAnimating]);

  if (loading) return <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-centre text-xl ">Genrating the FlahCards...</div>;
  if (error) return <p>Error: {error}</p>;

  const flashcards = data.flashcards;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white mb-8 animate-[float_4s_ease-in-out_infinite]">
          Flashcards
        </h1>
        {flashcards && flashcards.length > 0 ? (
          <>
            <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
              <button
                onClick={goToPrevious}
                className="p-2 text-white hover:text-gray-300 transition-colors transform hover:scale-110 duration-200"
                aria-label="Previous card"
              >
                <ChevronLeft size={24} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              </button>

              <div 
                className="relative w-full aspect-[3/2] max-w-2xl mx-auto"
                style={{ perspective: "1000px" }}
                onMouseEnter={() => setIsFlipped(true)}
                onMouseLeave={() => setIsFlipped(false)}
                onClick={() => setIsFlipped((prev) => !prev)}
              >
                <div
                  className={`w-full h-full transition-all duration-500 ${isAnimating ? 'scale-95' : 'scale-100'}`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    boxShadow: '0 0 15px 2px rgba(255,255,255,0.3)'
                  }}
                >
                  {/* Front of card */}
                  <div
                    className="absolute w-full h-full bg-black/80 rounded-xl p-4 sm:p-6 md:p-8 border border-black/30 flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <h2 className="text-xs sm:text-2xl md:text-3xl text-white text-center font-semibold leading-relaxed px-2">
                      {flashcards[currentIndex].front}
                    </h2>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute w-full h-full bg-black/80 rounded-xl p-4 sm:p-6 md:p-8 border border-black/30 flex items-center justify-center"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <p className="text-xs sm:text-xl md:text-2xl text-white text-center leading-relaxed px-2">
                      {flashcards[currentIndex].back}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={goToNext}
                className="p-2 text-white hover:text-gray-300 transition-colors transform hover:scale-110 duration-200"
                aria-label="Next card"
              >
                <ChevronRight size={24} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              </button>
            </div>

            {/* Progress indicator */}
            <div className="mt-8 flex justify-center gap-2">
              {flashcards.map((_, index) => (
                <div
                  key={index}
                  className={`w-0.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-125'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-white text-center">No flashcards available.</p>
        )}
        <div className="flex justify-center mt-8">
          <button
            onClick={goToCoursePage}
            className="px-6 py-3 bg-black text-white rounded-md border border-white/50 
                       shadow-[0_0_10px_rgba(255,255,255,0.3)] 
                       hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]
                       transition-shadow duration-300"
          >
            Go to Course Page
          </button>
        </div>
      </div>
    </div>
  );
}
