import { formatDate } from "@/utils/helperFunctions";
import React from "react";

export default function TimelineCall({ call }) {
  return (
    <div className="p-4 border-l-4 border-main">
      <h2 className="font-semibold text-xl text-gray-500">Call</h2>
      <hr className="my-4" />
      <p className="">{formatDate(call.date)}</p>
      <hr className="my-4" />
      <h2 className="font-semibold text-lg text-gray-500">
        Created:{" "}
        <span className="text-main">{formatDate(new Date(call.created))}</span>
      </h2>
    </div>
  );
}
