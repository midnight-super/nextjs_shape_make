import { AuthContext } from "@/context/AuthContext";
import { colorPickerColors, taskCategories } from "@/extra_config";
import client from "@/feathers";
import { Button } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { CiPickerEmpty } from "react-icons/ci";

export default function CalendarSection({ setSectionOnDisplay }) {
  const [color, setColor] = useState(colorPickerColors[0].value);
  const [show, setShow] = useState(false);

  const [activeCategory, setActiveCategory] = useState("");

  const { user, setUser } = useContext(AuthContext);

  const [categoryColors, setCategoryColors] = useState({
    fabrication: "bg-main",
    installation: "bg-gray-600",
    templating: "bg-blue-800",
  });

  useEffect(() => {
    async function getCategoryColors() {
      if (user.preferences?.categoryColors) {
        const usersColors = user.preferences.categoryColors;

        setCategoryColors({
          ...categoryColors,
          ...usersColors,
        });
      }
    }

    if (user) getCategoryColors();
  }, [user]);

  const saveColor = async () => {
    try {
      let updatedUser = await client.service("users").patch(user._id, {
        [`preferences.categoryColors.${activeCategory.name}`]: color,
      });

      setUser(updatedUser);

      console.log("saved...");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-700">Calendar Settings</h1>
      <button
        type="button"
        className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
        onClick={() => setSectionOnDisplay("all-sections")}
      >
        Go Back
      </button>

      {taskCategories.map((c, i) => {
        const userSavedColor = user?.preferences?.categoryColors?.[c.name];

        return (
          <div className="flex items-center gap-4 w-full">
            <div className="w-2/12">{c.name}</div>
            <div
              className="h-4 w-6 rounded-sm"
              style={{
                backgroundColor: userSavedColor || c.color,
              }}
            ></div>
            <CiPickerEmpty
              className="cursor-pointer"
              size={25}
              onClick={() => setActiveCategory(c)}
            />
            {/* {activeCategory === c && (
              <div className="flex items-center gap-2">
                <HexColorPicker color={color} onChange={setColor} />
                <Button bg={"#ABC502"} color={"white"} onClick={saveColor}>
                  Save
                </Button>
              </div>
            )} */}
            {activeCategory === c && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <label className="block text-xl mb-2" htmlFor="color">
                    Choose a color:
                  </label>
                  <select
                    id="color"
                    className="border rounded p-2 w-64"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    {colorPickerColors.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </select>

                  <Button bg={"#ABC502"} color={"white"} onClick={saveColor}>
                    Save
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-xl">New color</div>
                  <div
                    className="h-4 w-6 rounded-sm"
                    style={{
                      backgroundColor: color,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* <HexColorPicker color={color} onChange={setColor} /> */}
      {/* <Button
        bg={"#ABC502"}
        color="white"
        className="w-fit"
        onClick={() => console.log(color)}
      >
        Pick Color
      </Button> */}
    </div>
  );
}
