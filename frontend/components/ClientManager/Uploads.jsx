import React, { useRef } from "react";

export default function Uploads() {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile.name);
    // do something with the selected file
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* uploads */}
      <div className="flex-1 flex flex-col">
        {Array.from(Array(2).keys()).map((item, i, arr) => {
          return (
            <div
              className={`flex items-center justify-between border border-gray-700 py-2 px-8 ${
                i === 0 && arr.length !== 1 ? "border-b-0" : ""
              }`}
            >
              {/* note text */}
              <div className="font-semibold text-gray-700">Document Name</div>
              {/* name date info */}
              <div className="flex flex-col">
                <h1 className="text-gray-700 font-semibold text-base">PDF</h1>
                <div className="flex items-center">
                  <span className="">23/02/23</span>
                  <span className="">15:32</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* add upload button */}
      <div className="flex justify-end">
        <button
          onClick={handleClick}
          className="btn bg-[#ABC502] mt-2 outline-none border-none"
        >
          Add
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
