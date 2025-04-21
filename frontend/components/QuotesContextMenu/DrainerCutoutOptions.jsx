import React from "react";

export default function DrainerCutoutOptions() {
  return (
    <div className="p-4 shadow-md w-fit border relative">
      <div className="absolute top-0 left-0 bg-[#666666] h-[30%] w-full"></div>
      <div className="relative p-10 flex flex-col bg-white">
        <div className="mx-auto">
          <h1 className="text-main text-2xl font-bold text-center">
            Choose An Action
          </h1>
          <h1 className="text-gray-600 text-lg font-medium text-center">
            Drainer Cutout Options
          </h1>
        </div>

        <div className="flex flex-col mt-8">
          <h2 className="text-center">5 Drainer Groves</h2>
          <hr className="my-4 border-2" />
          <h2 className="text-center">4 Burner Hob</h2>
          <hr className="my-4 border-2" />
          <h2 className="text-center">+ Add A Custom Drainer</h2>
        </div>
      </div>
    </div>
  );
}
