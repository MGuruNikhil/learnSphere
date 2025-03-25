import React, { useState } from "react";

function QuizCardItem({ quiz, userSelectedOption }) {
  const [selectedOption, setSelectedOption] = useState();
  return (
    <div className="mt-10 p-5">
      <h2 className="font-bold text-3xl text-center mb-5 text-[#ffffff]">
        {quiz?.question}
      </h2>

      <div className="grid grid-cols-2 gap-5 mt-8">
        {quiz?.options?.map((option, index) => (
          <h2
            onClick={() => {
              setSelectedOption(option);
              userSelectedOption(option);
            }}
            key={index}
            className={`border rounded-full p-3 px-3 text-center text-lg cursor-pointer transition-colors
              ${
                selectedOption === option
                  ? "bg-[#2196F3] text-[#FFFFFF]" // Blue for selected
                  : "bg-[#F5F5F5] text-[#171717] hover:bg-[#E0E0E0]" // Light gray for default
              }`}
          >
            {option}
          </h2>
        ))}
      </div>
    </div>
  );
}

export default QuizCardItem;