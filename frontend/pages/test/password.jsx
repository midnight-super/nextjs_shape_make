import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { Button } from "@chakra-ui/react";
import React, { useContext } from "react";

export default function Password() {
  const { user } = useContext(AuthContext);

  const doStuff = async () => {
    try {
      console.log("getting user...");
      //   let res = await client.service("users").get(user._id);
      let res = await client.service("users").patch(user._id, {
        password: "password",
      });

      console.log(res);
      console.log("updated...");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col">
      <h1>Password</h1>
      <Button onClick={doStuff}>Check</Button>
    </div>
  );
}
