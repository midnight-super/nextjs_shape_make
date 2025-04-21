import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Select,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";

import TimezoneSelect from "react-timezone-select";

export default function GeneralSection({ setSectionOnDisplay }) {
  const { user, setUser } = useContext(AuthContext);

  const [timezoneShow, setTimezoneShow] = useState(false);
  const [measurementShow, setMeasurementShow] = useState(false);

  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
    // "Europe/Athens"
  );

  const [measurementValue, setMeasurementValue] = useState("Inches");

  useEffect(() => {
    if (user) {
      if (user.timezone) setSelectedTimezone(user.timezone);
      if (user.measurementValue) setMeasurementValue(user.measurementValue);
    }
  }, [user]);

  const updateTimezone = async () => {
    console.log("Updating timezone");

    try {
      let updatedUser = await client.service("users").patch(user._id, {
        timezone: selectedTimezone.value,
      });

      setUser(updatedUser);

      console.log("updated");
    } catch (error) {
      console.log(error);
    }
  };

  const updateMeasurement = async () => {
    try {
      let updatedUser = await client.service("users").patch(user._id, {
        measurementValue,
      });

      setUser(updatedUser);

      console.log("updated");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card">
      <div className="flex-1 flex flex-col gap-8">
        <h1 className="text-3xl font-bold">General Settings</h1>
        <button
          type="button"
          className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
          onClick={() => setSectionOnDisplay("all-sections")}
        >
          Go Back
        </button>
        {}
        <div
          className="flex items-center justify-between p-4 shadow-md cursor-pointer"
          onClick={() => setTimezoneShow(!timezoneShow)}
        >
          <h1 className="font-bold text-2xl w-4/12">Time Zone</h1>
          {/* <h1 className="font-normal text-lg flex-1">London, GMT</h1> */}
          <BsChevronRight className="font-bold text-xl" />
        </div>
        {/* Select*/}
        {timezoneShow && (
          <>
            <div className="select-wrapper">
              <TimezoneSelect
                value={selectedTimezone}
                onChange={setSelectedTimezone}
              />
            </div>

            <button
              type="button"
              className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
              onClick={updateTimezone}
            >
              Save
            </button>
            {/* // TODO: Add success alert */}
            {/* {success && (
            <Alert status="success">
              <AlertIcon />
              <AlertDescription>Saved</AlertDescription>
            </Alert>
          )} */}
          </>
        )}

        <div
          className="flex items-center justify-between p-4 shadow-md cursor-pointer"
          onClick={() => setMeasurementShow(!measurementShow)}
        >
          <h1 className="font-bold text-2xl w-4/12">Measurements</h1>
          {/* <h1 className="font-normal text-lg flex-1"></h1> */}
          <BsChevronRight className="font-bold text-xl" />
        </div>
        {measurementShow && (
          <>
            <Select
              value={measurementValue}
              onChange={(e) => setMeasurementValue(e.target.value)}
            >
              <option>Centimeters</option>
              <option>Inches</option>
            </Select>

            <button
              type="button"
              className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
              onClick={updateMeasurement}
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}
