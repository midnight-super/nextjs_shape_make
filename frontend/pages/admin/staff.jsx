import client from "@/feathers";
import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export default function Staff() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    async function getStaff() {
      try {
        let res = await client.service("users").find();
        console.log(res);
        console.log("got the stuff");
        let users = res.data;
        setStaff(users.filter((user) => user.isSuperAdmin));
      } catch (error) {
        console.log(error);
      }
    }

    getStaff();
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postCode, setPostCode] = useState("");

  const addStaff = async () => {
    try {
      console.log("adding staff...");

      const newUser = {
        name,
        email,
        phoneNumber,
        postCode,
        isSuperAdmin: true,
        password: "staff",
      };

      let newStaff = await client.service("users").create(newUser);

      setStaff((oldStaff) => [...oldStaff, newStaff]);

      console.log(newStaff);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col">
      <h1 className="text-3xl font-bold text-main">Staff</h1>

      {/* All Staff */}
      <div className="flex flex-col gap-4 my-10">
        {staff &&
          staff.map((s) => (
            <div className="p-2 border shadow-md" key={s._id}>
              {s.email}
            </div>
          ))}
      </div>

      {/* Add Staff */}
      <div className="flex flex-col gap-4 my-4 ">
        <div className="flex items-center gap-2">
          <h2 className="">Name: </h2>
          <input
            type="text"
            className="border p-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <h2 className="">Email: </h2>
          <input
            type="text"
            className="border p-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <h2 className="">Phone Number: </h2>
          <input
            type="text"
            className="border p-1"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <h2 className="">Postal Address: </h2>
          <input
            type="text"
            className="border p-1"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
          />
        </div>
      </div>

      <Button bg={"#ABC502"} color={"white"} onClick={addStaff}>
        Add staff
      </Button>
    </div>
  );
}
