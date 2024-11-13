import React from "react";

interface ProgressBarProps {
  progress: number;
  isMax: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isMax,
  className = "",
}) => {
  return (
    <div
      className={`w-full h-full flex flex-col flex-end transparent h-4 ${className}`}
    >
      <div className="flex-grow"></div>
      <div
        className={`${isMax ? "bg-red-500" : "bg-gray-200/10"} h-full w-full`}
        style={{ height: `${isMax ? 100 : progress}%` }}
      ></div>
    </div>
  );
};
