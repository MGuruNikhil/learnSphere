import React from "react";

function StepProgress({ data, stepCount, setStepCount }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {data.map((_, index) => {
        const isActive = index === stepCount;
        const isCompleted = index < stepCount;
        return (
          <div
            key={index}
            onClick={() => setStepCount(index)}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
              ${
                isCompleted
                  ? "bg-[#4CAF50] text-[#FFFFFF]" // Green for completed
                  : isActive
                  ? "bg-[#2196F3] text-[#FFFFFF]" // Blue for active
                  : "bg-[#E0E0E0] text-[#757575]" // Gray for default
              }`}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
}

export default StepProgress;
