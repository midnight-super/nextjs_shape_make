import React from "react";

export default function ShapingOptions({ onShapeSelect }) {
  // Define the shaping options with their respective descriptions
  const shapingOptions = [
    {
      name: "Full Radius",
      description: "Add a full radius to a single edge",
      value: 50,
    },
    { name: "Bump Out", description: "Add a section beyond the worktop width" },
    {
      name: "Bump In",
      description: "Take a section out of a standard worktop",
    },
    {
      name: "Curved Bump Out",
      description: "Add a curved section beyond the worktop width",
    },
    {
      name: "Curved Bump In",
      description: "Take a curved section out of a standard worktop",
    },
  ];

  return (
    <div className="p-4 shadow-md w-fit border relative">
      <div className="absolute top-0 left-0 bg-[#666666] h-[30%] w-full"></div>
      <div className="relative p-5 flex flex-col bg-white">
        <div className="mx-auto">
          <h1 className="text-main text-2xl font-bold">Choose An Action</h1>
          <h1 className="text-gray-600 text-lg font-bold">Shaping Options</h1>
        </div>

        <div className="flex flex-col mt-8">
          {shapingOptions.map((option, i, arr) => (
            <div
              key={i}
              onClick={() => onShapeSelect(option)}
              className="shape-option"
            >
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col">
                  <h2 className="font-bold">{option.name}</h2>
                  <h2 className="">{option.description}</h2>
                </div>
                <div className="flex-1">
                  {/* You can add a condition here to load different images based on the option name if needed */}
                  <img src="/images/shape1.svg" alt={option.name} />
                </div>
              </div>
              {i !== arr.length - 1 && <hr className="my-4 border-2" />}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .shape-option {
          cursor: pointer;
          transition: background-color 0.3s ease-in-out;
        }
        .shape-option:hover {
          background-color: rgba(
            0,
            0,
            0,
            0.05
          ); // This gives a light gray background on hover
        }
      `}</style>
    </div>
  );
}
