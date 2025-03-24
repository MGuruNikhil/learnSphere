import { HoverEffect } from "@/app/components/ui/card-hover-effect";
import courseData from "@/course.json";

export default function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <h1 className="text-3xl font-bold mt-8 mb-4">Chapters</h1>
      <HoverEffect items={transformedChapters} />
    </div>
  );
}
export const transformedChapters = courseData.chapters.map((chapter, index) => {
  return {
    icon: chapter.emoji || "📚",
    chapterTitle: chapter.chapterTitle,
    chapterSummary: chapter.chapterSummary,
    link: `/chapters/${index + 1}`,
  };
});