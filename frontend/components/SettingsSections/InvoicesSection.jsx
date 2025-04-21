import { Button, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsChevronRight } from "react-icons/bs";

export default function InvoicesSection({ setSectionOnDisplay }) {
  return (
    <div className="flex-1 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-700">Invoices Settings</h1>
      <button
        type="button"
        className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
        onClick={() => setSectionOnDisplay("all-sections")}
      >
        Go Back
      </button>
    </div>
  );
}
