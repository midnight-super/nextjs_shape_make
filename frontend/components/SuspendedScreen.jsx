import React from "react";

export default function SuspendedScreen() {
  return (
    <div className="flex-1 p-4 flex flex-col gap-8 items-center pt-36">
      <h1 className="text-5xl font-bold text-gray-600">
        Your account has been suspended
      </h1>
      <h2 className="text-2xl font-medium text-gray-600">
        Please contact support for any enquirires
      </h2>
    </div>
  );
}
