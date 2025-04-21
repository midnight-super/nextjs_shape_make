import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { Button, Select } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { BsChevronRight } from "react-icons/bs";

export default function TasksSection({ setSectionOnDisplay }) {
  const [categoriesShow, setCategoriesShow] = useState(false);
  const [measurementShow, setMeasurementShow] = useState(false);

  const { user, setUser } = useContext(AuthContext);

  const [categoryInput, setCategoryInput] = useState("");

  const addCategory = async () => {
    try {
      if (!categoryInput) return;

      const newCategory = {
        name: categoryInput,
        color: "#ABC502",
      };

      let res = await client.service("users").patch(user._id, {
        $push: {
          customCategories: newCategory,
        },
      });

      setCategoryInput("");
      console.log(res);
      setUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (category) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  console.log(user);

  return (
    <div className="flex-1 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-700">Tasks Settings</h1>

      <button
        type="button"
        className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
        onClick={() => setSectionOnDisplay("all-sections")}
      >
        Go Back
      </button>

      <div
        className="flex items-center justify-between p-4 bg-white shadow-md cursor-pointer"
        onClick={() => setCategoriesShow(!categoriesShow)}
      >
        <h1 className="font-bold text-2xl w-4/12">Categories</h1>
        {/* <h1 className="font-normal text-lg flex-1">5 Categories</h1> */}
        <BsChevronRight className="font-bold text-xl" />
      </div>
      {/* Select*/}
      {categoriesShow && (
        <>
          <div className="flex flex-col">
            {user &&
              user.customCategories?.map((category) => {
                return (
                  <div className="flex items-center gap-4">
                    {/* <span
                      className="text-red-500 text-xl cursor-pointer"
                      onClick={deleteCategory}
                    >
                      X
                    </span> */}
                    <h3 className="text-lg font-medium">{category.name}</h3>
                  </div>
                );
              })}
          </div>

          <input
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            type="text"
            className="w-fit p-3 border border-gray-200 outline-gray-200"
            placeholder="Enter New Category"
          />

          <button
            type="button"
            className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
            onClick={addCategory}
          >
            Create Custom Category
          </button>
        </>
      )}
    </div>
  );
}
