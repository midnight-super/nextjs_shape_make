import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { Button } from "@chakra-ui/react";
import React, { useContext, useState } from "react";

export default function SuperSecretAdminPage() {
  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState("");

  const [serviceName, setServiceName] = useState("");

  const grantPermissions = async () => {
    try {
      let res = await client.service("users").find({ query: { email } });
      if (!res.data || res.data.length === 0) {
        return console.log("no users found");
      }
      let userToBePatched = res.data[0];
      await client.service("users").patch(userToBePatched._id, {
        isSuperAdmin: true,
      });
      console.log("made a super admin...");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEntries = async () => {
    try {
      // const serviceName = "users";
      let res = await client.service(serviceName).find();
      console.log(res);

      for (const entry of res.data) {
        if (entry.email !== "rakib@think-engineer.com")
          await client.service(serviceName).remove(entry._id);
      }
      console.log("deleted all...");
    } catch (error) {
      console.log(error);
    }
  };

  const getEntries = async () => {
    // const serviceName = "users";
    let res = await client.service(serviceName).find();
    console.log(res);
    console.log(res.data);
  };

  if (user?.email !== "rakib@think-engineer.com") {
    return <div className="">This is not for you...</div>;
  }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-black p-2 rounded-md"
      />
      <Button onClick={grantPermissions}>Give user super powers</Button>

      <div className="mt-16 flex flex-col gap-4">
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="p-2 border rounded-md"
        />

        <Button onClick={deleteEntries}>Delete entries</Button>
        <Button onClick={getEntries}>Get entries</Button>
      </div>
    </div>
  );
}
