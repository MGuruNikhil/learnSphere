interface MaterialProps {
    status: string;
    icon: string;
    title: string;
    description: string;
}

function Material({ status, icon, title, description }: MaterialProps) {
    return (
        <div className=" border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 shadow-sm rounded-md p-5 flex flex-col items-center hover:border-gray-300 transition-colors">
            <h1 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">{status}</h1>
            <p className="text-5xl">{icon}</p>
            <h2 className="font-medium mt-3">{title}</h2>
            <p className="text-gray-500 text-sm text-center">{description}</p>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 mt-3 w-full">
                View
            </button>
        </div>
    );
}

export default function StudyMaterial() {
    const materials = [
        {
            status: "Ready",
            icon: "📚",
            title: "Notes/Chapters",
            description: "Read notes to prepare"
        },
        {
            status: "Ready",
            icon: "🗃️",
            title: "Flashcard",
            description: "Flashcards help to remember the concepts"
        },
        {
            status: "Ready",
            icon: "📝",
            title: "Quiz",
            description: "Great way to test your knowledge"
        },
        {
            status: "Ready",
            icon: "❓",
            title: "Question/Answer",
            description: "Help to practice your learning"
        }
    ];

    return (
        <div className="max-w-5xl mx-auto px-8">
            <h1 className="text-3xl font-bold mt-8 mb-4">Study Material</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {materials.map((material, index) => (
                    <Material
                        key={index}
                        status={material.status}
                        icon={material.icon}
                        title={material.title}
                        description={material.description}
                    />
                ))}
            </div>
        </div>
    );
}