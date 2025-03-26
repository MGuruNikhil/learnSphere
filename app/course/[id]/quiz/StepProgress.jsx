import React from "react";

function StepProgress({ data, stepCount, answersStatus, setStepCount }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
      {data.map((_, index) => {
        // Default gray for unanswered
        let bgColor = "bg-gray-400";

        // If the user has answered this question, color it green or red
        if (index < answersStatus.length) {
          bgColor = answersStatus[index] ? "bg-green-500" : "bg-red-500";
        }
        // If it's the current question and not answered yet
        else if (index === stepCount) {
          bgColor = "bg-blue-500";
        }

        return (
          <div
            key={index}
            onClick={() => setStepCount(index)}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer text-white text-sm sm:text-base ${bgColor}`}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
}

export default StepProgress;
