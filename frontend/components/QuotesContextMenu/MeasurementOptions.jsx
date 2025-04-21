import React from "react";

export default function MeasurementOptions({ onOptionSelect }) {
  return (
    <div className="p-4 shadow-md w-fit border relative">
      <div className="absolute top-0 left-0 bg-[#666666] h-[30%] w-full"></div>
      <div className="relative p-10 flex flex-col bg-white">
        <div className="mx-auto">
          <h1 className="text-main text-2xl font-bold text-center">
            Choose An Action
          </h1>
          <h1 className="text-gray-600 text-lg font-bold">
            Measurement Options
          </h1>
        </div>

        <div className="flex flex-col mt-8">
          <h2 
            className="text-center option-item" 
            onClick={() => onOptionSelect('rotateClockwise')}
          >
            Rotate Clockwise 90
          </h2>
          <hr className="my-4 border-2" />
          <h2 
            className="text-center option-item" 
            onClick={() => onOptionSelect('rotateCounterClockwise')}
          >
            Rotate Counter Clockwise 90
          </h2>
        </div>
      </div>
      <style jsx>{`
        .option-item {
          cursor: pointer;
          transition: background-color 0.3s ease-in-out;
        }
        .option-item:hover {
          background-color: rgba(0, 0, 0, 0.05); // This gives a light gray background on hover
        }
      `}</style>
    </div>
  );
}
