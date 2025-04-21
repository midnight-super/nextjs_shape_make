import client from "@/feathers";
import { formatDate } from "@/utils/helperFunctions";
import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export default function TimelineNote({ note, opportunity, setOpportunity }) {
  const [noteContent, setNoteContent] = useState(note.content);
  const [changesExist, setChangesExist] = useState(false);

  const [deleteCheck, setDeleteCheck] = useState(false);

  useEffect(() => {
    if (noteContent !== note.content) {
      return setChangesExist(true);
    } else {
      return setChangesExist(false);
    }
  }, [noteContent, note]);

  const deleteNote = async () => {
    // if (!deleteCheck) {
    //   return setDeleteCheck(true);
    // }

    try {
      let newTimeline = opportunity.timeline.filter(
        (item) => item.content !== note.content
      );

      let updatedOpportunity = await client
        .service("opportunities")
        .patch(opportunity._id, {
          timeline: newTimeline,
        });

      setOpportunity(updatedOpportunity);
      //   setDeleteCheck(false);
    } catch (error) {
      //   setDeleteCheck(false);
      console.log(error);
    }
  };

  const saveChanges = async () => {
    try {
      let newTimeline = opportunity.timeline.map((item) => {
        if (item.type == "note" && item.content == note.content) {
          return {
            ...item,
            content: noteContent,
          };
        } else {
          return item;
        }
      });

      let updatedOpportunity = await client
        .service("opportunities")
        .patch(opportunity._id, {
          timeline: newTimeline,
        });

      setOpportunity(updatedOpportunity);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 border-l-4 border-main">
      <h2 className="font-semibold text-xl text-gray-500">Note</h2>
      <hr className="my-4" />

      {/* <p className="">{note.content}</p> */}
      <input
        className="p-2 border"
        type="text"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
      />
      {changesExist && (
        <Button
          bg={"#ABC502"}
          color={"white"}
          onClick={saveChanges}
          display={"block"}
          mt={4}
        >
          Save changes
        </Button>
      )}
      <Button display={"block"} mt={4} onClick={deleteNote}>
        {/* {deleteCheck ? "Yes" : "Delete"} */}
        Delete
      </Button>
      <hr className="my-4" />
      <h2 className="font-semibold text-lg text-gray-500">
        Created:{" "}
        <span className="text-main">{formatDate(new Date(note.created))}</span>
      </h2>
    </div>
  );
}
