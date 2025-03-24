import Chapter from "../../components/Chapter";
import StudyMaterial from "../../components/study-material";
import courseData from "@/course.json";

export default function Course() {
    return (
        <div className="max-w-5xl mx-auto px-8 py-20">
            <div className="flex items-center justify-center gap-2 max-w-5xl mx-auto mt-4 rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700">
                <p className="text-5xl w-[10%]">📚</p>
                <div className="flex flex-col w-[90%]">
                    <h1 className="text-3xl font-bold">{courseData.courseTitle}</h1>
                    <p className="text-zinc-400">{courseData.courseSummary}</p>
                </div>
            </div>
            <StudyMaterial />
            <Chapter />
        </div>
    );
}