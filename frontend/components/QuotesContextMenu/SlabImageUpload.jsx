import { Button } from "@chakra-ui/react";
import React from "react";

export default function SlabImageUpload() {
  return (
    <div className="p-4 shadow-md w-fit border relative">
      <div className="absolute top-0 left-0 bg-[#666666] h-[30%] w-full"></div>
      <div className="relative p-10 flex flex-col bg-white">
        <div className="mx-auto">
          <h1 className="text-main text-2xl font-bold text-center">
            Upload a Slab Image
          </h1>
          {/* <h1 className="text-gray-600 text-lg font-bold">
            Measurement Options
          </h1> */}
        </div>

        <div className="flex flex-col justify-center gap-4 mt-8">
          <img src="/images/ImageUpload.png" className="h-1/2 w-1/2 mx-auto" />
          <Button
            bg={"#ABC502"}
            color={"white"}
            w={"fit-content"}
            className="mx-auto"
          >
            Confirm Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
