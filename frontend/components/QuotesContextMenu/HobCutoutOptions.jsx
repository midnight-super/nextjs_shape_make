import { Button } from "@chakra-ui/react";
import React, { useState } from "react";

export default function HobCutoutOptions() {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [customInput, setCustomInput] = useState(0);

  const useCustomValue = () => {
    // todo: set custom value
  };

  return (
    <div className="p-4 shadow-md w-fit border relative">
      <div className="absolute top-0 left-0 bg-[#666666] h-[30%] w-full"></div>
      <div className="relative p-10 flex flex-col bg-white">
        <div className="mx-auto">
          <h1 className="text-main text-2xl font-bold text-center">
            Choose An Action
          </h1>
          <h1 className="text-gray-600 text-lg font-medium text-center">
            Hob Cutout Options
          </h1>
        </div>

        <div className="flex flex-col mt-8">
          {Array.from(Array(8).keys()).map((item, i, arr) => {
            return (
              <>
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
              </>
            );
          })}

          {showCustomInput && (
            <>
              <div className="cursor-pointer flex flex-col gap-2">
                <div className="flex items-center">
                  <input
                    type="number"
                    className="border-2 p-2 w-3/4 mx-auto"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                  />
                  <span>cm</span>
                </div>
                <Button bg={"#ABC502"} color={"white"} onClick={useCustomValue}>
                  Use custom value
                </Button>
              </div>
            </>
          )}

          {!showCustomInput && (
            <>
              <h2
                className="cursor-pointer"
                onClick={() => setShowCustomInput(true)}
              >
                + Add A Custom Sink Size
              </h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
