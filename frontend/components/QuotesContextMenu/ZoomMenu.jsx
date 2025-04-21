import { Button, Select } from "@chakra-ui/react";
import React from "react";

import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";

export default function ZoomMenu() {
  const zoomIn = () => {};
  const zoomOut = () => {};
  const resetZoom = () => {};

  return (
    <div className="p-4 flex flex-col shadow-md w-fit">
      {/* Zoom and reset buttons */}
      <div className="flex items-center gap-2">
        <Button bg={"#666666"} onClick={zoomIn}>
          <AiOutlineZoomIn size={26} color={"white"} />
        </Button>
        <Button bg={"#666666"} onClick={zoomOut}>
          <AiOutlineZoomOut size={26} color={"white"} />
        </Button>
        <Button bg={"#666666"} color={"white"} onClick={resetZoom}>
          Reset Zoom
        </Button>
      </div>

      <hr className="my-4 border-2" />

      {/* Select material dropdowns... */}
      <div className="flex flex-col gap-3">
        <Select placeholder="Select Material"></Select>
        <Select placeholder="Select Brand"></Select>
        <Select placeholder="Select Colour"></Select>
        <Select placeholder="Select Edging"></Select>
        <Button bg={"#ABC502"} color={"white"}>
          + Additional Material
        </Button>
      </div>

      <hr className="my-4 border-2" />
      {/* Selected Options */}

      <div className="flex flex-col gap-2">
        <div className="">
          <h2 className="font-bold text-lg">
            <span className="text-[#666666]">Total Sqm: </span>
            <span className="text-main">5.52</span>
          </h2>
          <hr className="my-2 border" />
        </div>
        <div className="">
          <h2 className="font-bold text-lg">
            <span className="text-[#666666]">Material: </span>
            <span className="text-main">N/A</span>
          </h2>
          <hr className="my-2 border" />
        </div>
        <div className="">
          <h2 className="font-bold text-lg">
            <span className="text-[#666666]">Brand: </span>
            <span className="text-main">N/A</span>
          </h2>
          <hr className="my-2 border" />
        </div>
        <div className="">
          <h2 className="font-bold text-lg">
            <span className="text-[#666666]">Colour: </span>
            <span className="text-main">N/A</span>
          </h2>
          <hr className="my-2 border" />
        </div>
        <div className="">
          <h2 className="font-bold text-lg">
            <span className="text-[#666666]">Edging: </span>
            <span className="text-main"></span>
          </h2>
          <hr className="my-2 border" />
        </div>
      </div>
    </div>
  );
}
