import React from "react";

export default function SinkCutoutOptions() {
  return (
    <div className="p-4 shadow-md w-fit border relative">
      <div className="absolute top-0 left-0 bg-[#666666] h-[30%] w-full"></div>
      <div className="relative p-10 flex flex-col bg-white">
        <div className="mx-auto">
          <h1 className="text-main text-2xl font-bold text-center">
            Choose An Action
          </h1>
          <h1 className="text-gray-600 text-lg font-medium text-center">
            Sink Cutout Options
          </h1>
        </div>

        <div className="flex flex-col mt-8">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <h2 className="font-bold">Full Radius</h2>
              <h2 className="">Add a full radius to a single edge</h2>
            </div>
            <div className="flex-1">
              <img src="/images/shape1.svg" alt="" />
            </div>
          </div>
          <hr className="my-4 border-2" />
        </div>
      </div>
    </div>
  );
}
