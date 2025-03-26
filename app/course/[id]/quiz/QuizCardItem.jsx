import React, { useState } from "react";

function QuizCardItem({ quiz, userSelectedOption, disableOptions }) {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div>
      {/* Question */}
      <h2 className="font-bold text-xs sm:text-2xl text-center mb-6 text-white">
        {quiz?.question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quiz?.options?.map((option, index) => (
          <div
            key={index}
            onClick={() => {
              // If already disabled, do nothing
              if (disableOptions) return;

              setSelectedOption(option);
              userSelectedOption(option);
            }}
            className={`flex items-center justify-center p-4 min-h-[60px] rounded-md transition-colors
              ${
                disableOptions
                  ? "cursor-not-allowed" // No pointer if disabled
                  : "cursor-pointer"
              }
              ${
                selectedOption === option
                  ? // Selected style
                    "bg-blue-500 text-white border border-blue-500"
                  : // Unselected style
                    "bg-black text-white border border-white hover:bg-white hover:text-black"
              }`}
          >
            <span className="text-center text-sm sm:text-base">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizCardItem;
