import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
import client from "@/feathers";

import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import Notes from "@/components/ClientManager/Notes";
import Email from "@/components/ClientManager/Email";
import Uploads from "@/components/ClientManager/Uploads";
import Call from "@/components/ClientManager/Call";
import CreateQuoteModal from "@/components/CreateQuoteModal";
import CreateTaskModal from "@/components/CreateTaskModal";
import Link from "next/link";
import { formatDate } from "@/utils/helperFunctions";
import TimelineCall from "@/components/TimelineCall";
import TimelineNote from "@/components/TimelineNote";

export default function IndividualOpportunity() {
  const router = useRouter();

  const [opportunity, setOpportunity] = useState(null);

  const clientManagerPages = ["Notes", "Call", "Email", "Uploads"];
  const [selectedClientManagerPage, setSelectedClientManagerPage] = useState(
    clientManagerPages[0]
  );

  const [tasks, setTasks] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [accountManager, setAccountManager] = useState("");
  const [postCode, setPostCode] = useState("");

  const [changesExist, setChangesExist] = useState(false);

  useEffect(() => {
    if (!opportunity) return;

    if (
      customerName !== opportunity.customerName ||
      email !== opportunity.email ||
      accountManager !== opportunity.accountManager ||
      telephone !== opportunity.telephone ||
      postCode !== opportunity.postCode
    ) {
      setChangesExist(true);
    } else {
      setChangesExist(false);
    }
  }, [opportunity, customerName, telephone, email, accountManager, postCode]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { id } = router.query;
        const opportunity = await client.service("opportunities").get(id);
        setOpportunity(opportunity);

        setCustomerName(opportunity.customerName);
        setTelephone(opportunity.telephone);
        setEmail(opportunity.email);
        setAccountManager(opportunity.accountManager);
        setPostCode(opportunity.postCode);

        let res = await client
          .service("tasks")
          .find({ query: { "customerAssignedTo._id": opportunity._id } });
        setTasks(res.data);

        res = await client
          .service("quotes")
          .find({ query: { "customer._id": opportunity._id } });
        setQuotes(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (router.isReady) getData();
  }, [router.isReady]);

  const saveChanges = async () => {
    try {
      let updatedOpportunity = await client
        .service("opportunities")
        .patch(opportunity._id, {
          customerName,
          email,
          accountManager,
          telephone,
          postCode,
        });

      setOpportunity(updatedOpportunity);
    } catch (error) {
      console.log(error);
    }
  };

  if (opportunity) {
    return (
      <div className="p-4 flex flex-col gap-8">
        {/* <Button onClick={() => console.log()}>test</Button> */}

        {/* <h1 className="text-3xl font-bold">{opportunity.companyName}</h1> */}
        {/* COMPANY DETAILS */}
        <div className="flex gap-6 bg-white p-8 px-40 shadow-md justify-center">
          <div className="flex-1 flex flex-col gap-8">
            <FormControl className="flex flex-col gap-2">
              <FormLabel className="text-main">Customer Name</FormLabel>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border-none outline-none"
              />
            </FormControl>
            <FormControl>
              <FormLabel className="text-main">Account Manager</FormLabel>
              <input
                type="text"
                value={accountManager}
                onChange={(e) => setAccountManager(e.target.value)}
                className="border-none outline-none"
              />
            </FormControl>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <FormControl className="flex flex-col gap-2">
              <FormLabel className="text-main">Telephone Number</FormLabel>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="border-none outline-none"
              />
            </FormControl>
            <FormControl>
              <FormLabel className="text-main">Email Address</FormLabel>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none outline-none"
              />
            </FormControl>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <FormControl className="flex flex-col gap-2">
              <FormLabel className="text-main"> Address</FormLabel>
              <input
                type="text"
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
                className="border-none outline-none"
              />
            </FormControl>
          </div>

          {changesExist && (
            <Button
              onClick={saveChanges}
              bg={"#ABC502"}
              color={"white"}
              alignSelf={"end"}
            >
              Save Changes
            </Button>
          )}
        </div>

        <div className="flex gap-6">
          {/* INTERACTIONS */}
          <div className="flex-1 flex flex-col bg-white shadow-md min-w-[300px] min-h-[300px]">
            <h1 className="font-bold text-main p-4 text-xl">Interactions</h1>
            <div className="flex flex-col flex-1">
              {/* navbar */}
              <div className="flex">
                {clientManagerPages.map((title) => {
                  return (
                    <div
                      className={`flex-1 p-4 cursor-pointer font-bold text-center border border-gray-400 ${
                        selectedClientManagerPage === title
                          ? "bg-[#ABC502] text-white"
                          : ""
                      } `}
                      onClick={() => setSelectedClientManagerPage(title)}
                    >
                      {title}
                    </div>
                  );
                })}
              </div>
              {/* content */}
              <div className="flex-1">
                {selectedClientManagerPage === "Notes" && (
                  <Notes
                    opportunity={opportunity}
                    setOpportunity={setOpportunity}
                  />
                )}
                {selectedClientManagerPage === "Call" && (
                  <Call
                    opportunity={opportunity}
                    setOpportunity={setOpportunity}
                  />
                )}
                {selectedClientManagerPage === "Email" && (
                  <Email opportunity={opportunity} />
                )}
                {selectedClientManagerPage === "Uploads" && <Uploads />}
              </div>
            </div>
          </div>

          {/* QUOTES */}
          <div className="flex flex-col  bg-white shadow-md min-w-[300px] min-h-[300px]">
            <div className="flex items-center justify-between p-4">
              <h1 className="font-bold text-main text-xl">
                Quotes & Revisions
              </h1>
              <Link
                href={{
                  pathname: "/quotes",
                  query: { modalOpen: true },
                }}
              >
                <Button color={"white"} bg={"#ABC502"}>
                  Create New
                </Button>
              </Link>
            </div>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Id</Th>
                    <Th>Created</Th>
                    <Th>Value</Th>
                    <Th>Quoted By</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {quotes &&
                    quotes.map((quote) => {
                      return (
                        <Tr>
                          <Td>{quote._id}</Td>
                          <Td>
                            {new Date(quote.date).toLocaleDateString("en-UK", {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            })}
                          </Td>
                          <Td>${quote.value}</Td>
                          <Td>Chris</Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {/* TASKS */}

          <div className="flex flex-col bg-white shadow-md min-w-[500px] min-h-[300px]">
            <div className="flex items-center justify-between p-4 px-8">
              <h1 className="font-bold text-main text-xl">Tasks</h1>
              <Link
                href={{
                  pathname: "/tasks",
                  query: { modalOpen: true },
                }}
              >
                <Button color={"white"} bg={"#ABC502"}>
                  Create New
                </Button>
              </Link>
            </div>

            <div className="flex-1 flex flex-col gap-4 px-8 mt-4">
              {tasks &&
                tasks.map((task, i) => {
                  return <Task task={task} key={i} />;
                })}
            </div>
          </div>

          {/* TIMELINE */}

          <div className="flex-1 flex flex-col p-4 bg-white shadow-md min-w-[300px] min-h-[300px]">
            <h1 className="font-bold text-main text-xl">Timeline</h1>

            <div className="flex flex-col gap-2">
              {opportunity &&
                opportunity.timeline?.length > 0 &&
                opportunity.timeline.map((item, i) => {
                  const isCall = item.type === "call";
                  const isNote = item.type === "note";

                  if (isCall) return <TimelineCall call={item} />;
                  if (isNote)
                    return (
                      <TimelineNote
                        note={item}
                        opportunity={opportunity}
                        setOpportunity={setOpportunity}
                      />
                    );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Task({ task }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`flex items-center w-full shadow-md p-4 border-l-8 border-l-[#ABC502] cursor-pointer`}
      onClick={() => {
        setIsOpen(true);
      }}
    >
      <div className="mr-8">
        <input type="checkbox" checked={task.completed} disabled />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="text-lg font-semibold">Task Name: {task.name}</div>
        <div>Task Desc: {task.description}</div>
      </div>
      <div className="flex flex-col gap-1 w-2/12">
        <div className="text-lg font-semibold">Assigned To: </div>
        <div>{task.customerAssignedTo.customerName}</div>
      </div>
      <div className="flex flex-col gap-1 w-2/12">
        <div className="text-lg font-semibold">Complete By: </div>
        <div className="">
          {new Date(task.completionDate).toLocaleDateString("en-UK", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
      {/* <TaskModal isOpen={isOpen} setIsOpen={setIsOpen} task={task} /> */}
    </div>
  );
}
