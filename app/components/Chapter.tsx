import React from "react";
import { HoverEffect } from "../components/ui/card-hover-effect";

type Chapter = {
  emoji?: string;
  chapterTitle: string;
  chapterSummary: string;
  topics?: string[];
};

export default function CardHoverEffectDemo({ chapters }: { chapters: Chapter[] }) {
  const transformedChapters = chapters?.map((chapter, index) => {
    return {
      icon: chapter.emoji || "📚",
      chapterTitle: chapter.chapterTitle,
      chapterSummary: chapter.chapterSummary,
      link: `/chapters/${index + 1}`,
    };
  }) || [];


  if (transformedChapters.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-8">
        <h1 className="text-3xl font-bold mt-8 mb-4">No Chapters Available</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-8">
      <h1 className="text-3xl font-bold mt-8 mb-4">Chapters</h1>
      <HoverEffect items={transformedChapters} />
    </div>
  );
}