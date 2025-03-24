import Image from "next/image";
import React, { useState } from "react";

interface SelectOptionProps {
  selectedStudyType: (studyType: string) => void;
}

const SelectOption: React.FC<SelectOptionProps> = ({ selectedStudyType }) => {
  const options = [
    { name: "Exam", icon: "/exam.jpg" },
    { name: "Job Interview", icon: "/job.webp" },
    { name: "Practice", icon: "/practice.webp" },
    { name: "Coding Prep", icon: "/code.webp" },
    { name: "Other", icon: "/knowledge.webp" },
  ];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-center mb-2 text-lg">
        For which purpose do you want to generate study material?
      </h2>
      <div className="grid grid-cols-2 mt-5 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {options.map((option) => (
          <button
            key={option.name}
            className={`p-4 flex flex-col items-center justify-center border rounded-xl hover:border-primary cursor-pointer transition ${
              option.name === selectedOption ? "border-primary bg-gray-100" : ""
            }`}
            onClick={() => {
              setSelectedOption(option.name);
              selectedStudyType(option.name);
            }}
            aria-pressed={option.name === selectedOption}
          >
            <Image src={option.icon} alt={option.name} width={50} height={50} />
            <h2 className="text-pink-500 text-sm mt-2">{option.name}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectOption;
