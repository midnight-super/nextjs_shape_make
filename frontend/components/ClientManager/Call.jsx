import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Call({ opportunity, setOpportunity }) {
  const { user } = useContext(AuthContext);

  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const organisationId = user.organisations[0];
        // console.log({ organisationId });

        const query = {
          organisation: organisationId,
          opportunityType: "individual",
        };

        let res = await client.service("organisations").find({ query });

        let opportunities = res.data;
        console.log(opportunities);
        setCustomers(opportunities);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) getCustomers();
  }, [user]);

  const scheduleCall = async () => {
    try {
      console.log(date);
      const call = {
        created: new Date(),
        type: "call",
        date,
      };

      let res = await client.service("opportunities").patch(opportunity._id, {
        $push: {
          timeline: call,
        },
      });

      setOpportunity(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      <div class="grid grid-cols-2 gap-2">
        <FormControl>
          <FormLabel>Date</FormLabel>
          <div className="">
            <ReactDatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              showTimeSelect
              className="p-2 border"
              value={new Date(date)}
            />
          </div>
        </FormControl>
        <div className="flex items-end justify-end">
          {/* <button className="btn bg-[#ABC502] mt-2 outline-none border-none w-1/2">
            Schedule Call
          </button> */}
          <Button bg={"#ABC502"} color={"white"} onClick={scheduleCall}>
            Schedule Call
          </Button>
        </div>
      </div>
    </div>
  );
}
