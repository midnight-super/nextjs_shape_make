import EmailModal from "@/components/EmailModal";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useEffect } from "react";

const modes = ["Inbox", "Sent", "Drafts", "Spam", "Trash"];

export default function Emails() {
  const [emails, setEmails] = useState([]);

  const { user } = useContext(AuthContext);

  const [selectedMode, setSelectedMode] = useState("Sent");

  useEffect(() => {
    async function getEmails() {
      try {
        console.log("getting emails...");

        let res = await client.service("emails").find({
          query: {
            "sentBy._id": user._id,
          },
        });

        // console.log(res.data);
        setEmails(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    getEmails();
  }, []);

  useEffect(() => {
    client.service("emails").on("created", (newEmail) => {
      if (newEmail.sentBy._id === user._id) {
        setEmails((oldEmails) => [...oldEmails, newEmail]);
      }
    });
  }, []);

  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        name="Calendar"
        breadCrumbItems={["XZIST", "Emails"]}
      />
      <div className="flex-1 p-4">
        {/* Search bar aswell */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-main">Emails</h1>
          {/* inbox, sent, draft buttons */}
          <EmailModal />
        </div>

        <div className="flex gap-8 mt-10 ">
          <div className="flex flex-col w-[200px] shadow-md">
            {modes.map((mode) => (
              <div
                className={`p-2 cursor-pointer
            ${selectedMode === mode ? "bg-main text-white" : ""}
            `}
                onClick={() => setSelectedMode(mode)}
              >
                {mode}
              </div>
            ))}
          </div>

          <div className="flex flex-col flex-1 gap-2 shadow-md p-4">
            {emails &&
              emails.map((email) => {
                return (
                  <div
                    key={email._id}
                    className="flex items-center p-2 border-b border-gray-200"
                  >
                    <input type="checkbox" className="mr-4" />
                    <div className="w-2/12">{email.toAddress}</div>
                    <div className="flex-1">
                      <span className="font-semibold">
                        {email.email.subject}
                      </span>{" "}
                      - {email.email.text}
                    </div>
                    <div className="">
                      {new Date(email.sentAt).toLocaleString("en-UK", {
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
