import { FormControl, FormLabel, Select, Textarea } from "@chakra-ui/react";
import Link from "next/link";
import React, { useRef } from "react";

export default function Email({ opportunity, router }) {
  return (
    <div className="flex-1 flex flex-col p-4 h-full">
      {/* Email */}
      {/* add email button */}
      <div className="flex-1 flex justify-end items-end">
        <Link href={`/emails?modalOpen=true&prefillEmail=${opportunity.email}`}>
          <button className="btn bg-[#ABC502] mt-2 outline-none border-none">
            Email customer
          </button>
        </Link>
      </div>
    </div>
  );
}

// <div className="flex-1 flex flex-col">
// {/*  subject and stuff */}
// <div className="flex gap-2">
//   <div className="flex flex-col gap-2 w-8/12">
//     {/* to:  */}
//     <div className="border border-black p-2 flex items-center gap-4">
//       <span className="">To:</span>
//       <input
//         type="text"
//         className="outline-none border-none bg-transparent w-full"
//       />
//     </div>
//     {/* subject */}
//     <div className="border border-black p-2 flex items-center gap-4">
//       <span className="">Cc:</span>
//       <input
//         type="text"
//         className="outline-none border-none bg-transparent w-full"
//       />
//     </div>
//   </div>
//   {/* preset */}
//   <div className="w-4/12 flex items-end">
//     <FormControl>
//       <FormLabel textAlign={"center"}>Select Preset</FormLabel>
//       <Select className="w-full focus:border-black border-black border focus:outline-none">
//         <option>preset 1</option>
//         <option>preset 2</option>
//       </Select>
//     </FormControl>
//   </div>
// </div>
// {/* Email Editor */}
// <div className="mt-4">
//   <Textarea placeholder="Placeholder for email text editor" />
// </div>
// </div>
