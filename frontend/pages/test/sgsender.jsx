import { BACKEND_URL, FRONTEND_URL } from "@/extra_config";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Sgsender() {
  const [email, setEmail] = useState("");
  const [senders, setSenders] = useState([]);

  const verifyEmail = async () => {
    try {
      console.log(email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getSenders() {
      try {
        let res = await axios.get(`${FRONTEND_URL}/api/getVerifiedSenders`);
        // console.log(res.data);
        setSenders(res.data.senders);
      } catch (error) {
        console.log(error);
      }
    }

    getSenders();
  }, []);

  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold">Add SG Verified Sender</h1>

      <div className="flex flex-col gap-4 w-fit">
        <input
          className="p-3"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button bg={"#ABC502"} color={"white"} onClick={verifyEmail}>
          Verify Email
        </Button>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {senders && senders.map((s) => <div className="">{s.from_email}</div>)}
      </div>
    </div>
  );
}
