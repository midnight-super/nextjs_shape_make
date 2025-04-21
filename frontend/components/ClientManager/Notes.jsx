import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { Alert, AlertDescription, AlertIcon, Textarea } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useState } from "react";

export default function Notes({ opportunity, setOpportunity }) {
  const [note, setNote] = useState("");
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");

  const addNote = async () => {
    setError("");
    if (!note) return setError("Please enter a note");

    try {
      const newNote = {
        created: new Date(),
        content: note,
        type: "note",
      };

      let res = await client.service("opportunities").patch(opportunity._id, {
        $push: {
          timeline: newNote,
        },
      });

      setNote("");
      setOpportunity(res);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* add note button */}
      <div className="flex flex-col mt-4">
        <Textarea
          placeholder="Write your note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-end">
          <button
            onClick={addNote}
            className="btn bg-[#ABC502] mt-2 outline-none border-none"
          >
            Add Note
          </button>
        </div>
        {error && (
          <Alert mt={2} status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

// {/* notes */}
// <div className="flex-1 flex flex-col  max-h-[250px] overflow-y-auto">
// {/* {Array.from(Array(10).keys()).map((item, i) => { */}
// {notes &&
//   notes.map((note, i) => {
//     return (
//       <div
//         className={`flex items-center justify-between border border-gray-700 py-2 px-8 ${
//           i === 0 ? "border-b-0" : ""
//         }`}
//       >
//         {/* note text */}
//         <div className="font-semibold text-gray-700">{note.note}</div>
//         {/* name date info */}
//         <div className="flex flex-col">
//           <h1 className="text-[#ABC502] font-bold text-lg">
//             Sam Jones
//           </h1>
//           <div className="flex items-center">
//             <span className="">23/02/23</span>
//             <span className="">15:32</span>
//           </div>
//         </div>
//       </div>
//     );
//   })}
// {/* note */}
// </div>
