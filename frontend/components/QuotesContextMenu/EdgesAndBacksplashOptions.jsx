import { edgesAndBacksplashOptions } from "@/extra_config";
import { Button } from "@chakra-ui/react";
import React, { useState } from "react";

export default function EdgesAndBacksplashOptions({}) {
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
          <h1 className="text-gray-600 text-lg font-bold">
            Edges & Backsplash Options
          </h1>
        </div>

        <div className="flex flex-col mt-8">
          {edgesAndBacksplashOptions.map((option, i, arr) => {
            const isLastItem = i === arr.length - 1;

            if (isLastItem) {
              if (showCustomInput) {
                return (
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
                    <Button
                      bg={"#ABC502"}
                      color={"white"}
                      onClick={useCustomValue}
                    >
                      Use custom value
                    </Button>
                  </div>
                );
              } else if (!showCustomInput) {
                return (
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowCustomInput(true)}
                  >
                    <h2 className="text-center">{option}</h2>
                    {!isLastItem && <hr className="my-4 border-2" />}
                  </div>
                );
              }
            } else {
              return (
                <div>
                  <h2 className="text-center">{option}</h2>
                  {!isLastItem && <hr className="my-4 border-2" />}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
