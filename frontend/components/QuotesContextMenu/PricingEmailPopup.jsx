import React, { useState } from "react";

import { EditorState } from "draft-js";
import dynamic from "next/dynamic";
import { Button } from "@chakra-ui/react";

const RichTextEditor = dynamic(() => import("../RichTextEditor"), {
  ssr: false,
});

export default function PricingEmailPopup() {
  const [text, setText] = useState(EditorState.createEmpty());

  return (
    <div className="p-4 shadow-md w-fit border relative">
      <div className="absolute top-0 left-0 bg-[#666666] h-[30%] w-full"></div>

      <div className="relative p-4 bg-white">
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col gap-2">
            {/* to:  */}
            <div className="border border-black p-2 flex items-center gap-4">
              <span className="">To:</span>
              <input
                // value={toAddress}
                // onChange={(e) => setToAddress(e.target.value)}
                placeholder=""
                type="text"
                className="outline-none border-none bg-transparent w-full"
              />
              {/* <Select className="w-full focus:border-black border-black border focus:outline-none outline-none border-none">
                    <option>preset 1</option>
                    <option>preset 2</option>
                  </Select> */}
            </div>
            {/* subject */}
            <div className="border border-black p-2 flex items-center gap-4">
              <span className="">Cc:</span>
              <input
                // value={subject}
                // onChange={(e) => setSubject(e.target.value)}
                type="text"
                className="outline-none border-none bg-transparent w-full"
              />
            </div>
            {/* <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-10"
                  placeholder="Write your note"
                  //   value={note}
                  //   onChange={(e) => setNote(e.target.value)}
                /> */}
            <RichTextEditor text={text} setText={setText} />
            <Button
              bg={"#ABC502"}
              color={"white"}
              w={"fit-content"}
              alignSelf={"end"}
              className="mt-2"
            >
              Send Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  //   return (
  //     <div className="p-4 shadow-md w-fit border relative">
  //       <div className="absolute top-0 left-0 bg-[#666666] h-[30%] w-full"></div>
  //       <div className="relative p-10 flex flex-col bg-white">
  //         <div className="mx-auto">
  //           <h1 className="text-main text-2xl font-bold text-center">
  //             Choose An Action
  //           </h1>
  //           <h1 className="text-gray-600 text-lg font-bold">
  //             Measurement Options
  //           </h1>
  //         </div>

  //         <div className="flex flex-col mt-8">
  //           <h2 className="text-center">Rotate Clockwise 90</h2>
  //           <hr className="my-4 border-2" />
  //           <h2 className="text-center">Rotate Counter Clockwise 90</h2>
  //         </div>
  //       </div>
  //     </div>
  //   );
}
