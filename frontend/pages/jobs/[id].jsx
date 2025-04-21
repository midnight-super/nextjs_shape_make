import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import client from "@/feathers";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { jobSteps } from "@/extra_config";

import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { formatDate } from "@/utils/helperFunctions";

const Job = () => {
  const router = useRouter();
  const [jobId, setJobId] = useState();

  const [job, setJob] = useState(null);

  const [noteInput, setNoteInput] = useState("");
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [contactOnSite, setContactOnSite] = useState("");
  const [jobAddress, setJobAddress] = useState("");

  const [changesExist, setChangesExist] = useState(false);

  useEffect(() => {
    if (!job) return;

    if (
      customer !== job.customer ||
      email !== job.email ||
      contactOnSite !== job.contactOnSite ||
      jobAddress !== job.jobAddress
    ) {
      setChangesExist(true);
    } else {
      setChangesExist(false);
    }
  }, [job, customer, email, contactOnSite, jobAddress]);

  const saveChanges = async () => {
    try {
      let updatedJob = await client.service("jobs").patch(job._id, {
        customer,
        email,
        contactOnSite,
        jobAddress,
      });

      setJob(updatedJob);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const { id } = router.query;
        setJobId(id);
        const job = await client.service("jobs").get(id);
        setJob(job);

        setCustomer(job.customer);
        setEmail(job.email);
        setContactOnSite(job.contactOnSite);
        setJobAddress(job.jobAddress);
      } catch (error) {
        console.log(error);
      }
    };

    if (router.isReady) getData();
  }, [router.isReady]);

  const addNote = async () => {
    setError("");
    if (!noteInput) return setError("Please enter a note");

    try {
      const newNote = {
        created: new Date(),
        content: noteInput,
        type: "note",
      };

      let res = await client.service("jobs").patch(job._id, {
        $push: {
          timeline: newNote,
        },
      });

      console.log(res);
      setNoteInput("");
      setJob(res);
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    }
  };

  if (job)
    return (
      <div className="p-4 flex flex-col gap-8">
        {/* <Button onClick={() => console.log()}>test</Button> */}
        {/* COMPANY DETAILS */}
        <div className="flex gap-6 bg-white p-8 px-40 shadow-md justify-center">
          <div className="flex-1 flex flex-col gap-8">
            <FormControl className="flex flex-col gap-2">
              <FormLabel className="text-main">Customer Name</FormLabel>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
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
              <FormLabel className="text-main">Contact on Site</FormLabel>
              <input
                type="text"
                value={contactOnSite}
                onChange={(e) => setContactOnSite(e.target.value)}
                className="border-none outline-none"
              />
            </FormControl>
            <FormControl>
              <FormLabel className="text-main">Job Address</FormLabel>
              <input
                type="text"
                value={jobAddress}
                onChange={(e) => setJobAddress(e.target.value)}
                className="border-none outline-none"
              />
            </FormControl>
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
        </div>
        <div className="flex gap-6">
          {/* JOB OVERVIEW */}
          <div className="flex p-4 shadow-md">
            <div className="flex-1 min-w-[400px]">
              <h2 className="font-bold text-xl text-main">
                Job Overview: <span className="text-gray-500">Active</span>
              </h2>
            </div>
            <div className="h-full w-[1px] bg-gray-200 mx-6"></div>
            <div className="flex flex-col gap-2">
              {jobSteps.map((step) => {
                return (
                  <div key={step} className="flex gap-2 items-center">
                    <h3 className="font-semibold">{step}</h3>
                    <div className="flex-1 flex justify-end">
                      <div className="w-[50px] h-[50px] bg-gray-200"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* JOB OUTLINE */}
          <div className="flex-1 flex flex-col p-4 gap-8  bg-white shadow-md min-w-[300px] min-h-[300px]">
            <h2 className="font-bold text-xl text-main">Project Outline</h2>
            <img
              src="https://thumb.cadbull.com/img/product_img/original/simple_kitchen_top_view_layout_plan_cad_drawing_details_dwg_file_04062019125001.png"
              alt=""
              className="h-[350px]"
            />
          </div>
        </div>

        {/* JOB STATUS */}
        <div className="flex flex-col gap-4 shadow-md p-4">
          <h2 className="font-bold text-xl text-main">Job Status:</h2>
          <TableContainer>
            <Table variant="simple">
              {/* <TableCaption>Opportunities Information</TableCaption> */}
              <Thead>
                <Tr>
                  <Th>Project Phase</Th>
                  <Th>Current Status</Th>
                  <Th>Start Date</Th>
                  <Th>Project Duration</Th>
                  <Th>Assigned To</Th>
                </Tr>
              </Thead>
              <Tbody>
                {jobSteps.map((step, i) => (
                  <Tr key={i}>
                    <Td>{step}</Td>
                    <Td>Not Scheduled</Td>
                    <Td>Not Scheduled</Td>
                    <Td>Not Scheduled</Td>
                    <Td>Not Scheduled</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>

        <div className="flex gap-6">
          {/* NOTES */}
          <div className="flex-1 p-4 flex flex-col gap-2 shadow-md">
            <h2 className="font-bold text-xl text-main">Notes</h2>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full border border-gray-200 my-4"
              rows="5"
            ></textarea>
            <div className="flex-1 flex justify-end items-end">
              <Button
                onClick={addNote}
                bg={"#ABC502"}
                color="white"
                w={"fit-content"}
              >
                Add Note
              </Button>
            </div>
            {error && (
              <Alert mt={2} status="error">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* FILE UPLOADS */}
          <div className="flex-1 p-4 flex flex-col gap-2 shadow-md">
            <h2 className="font-bold text-xl text-main">File Uploads</h2>
            <TableContainer>
              <Table variant="simple">
                {/* <TableCaption>Opportunities Information</TableCaption> */}
                <Thead>
                  <Tr>
                    <Th>File Name</Th>
                    <Th>File Type</Th>
                    <Th>File Size</Th>
                    <Th>Upload Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Customer plans</Td>
                    <Td>.pdf</Td>
                    <Td>3mb</Td>
                    <Td>10/03/2023</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
            <div className="flex-1 flex justify-end items-end">
              <Button bg={"#ABC502"} color="white" w={"fit-content"}>
                Upload File
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4 gap-4 shadow-md">
          <h2 className="font-bold text-xl text-main">Job Timeline</h2>

          <div className="flex flex-col gap-2">
            {job &&
              job.timeline &&
              job.timeline.map((item, i) => {
                return (
                  <div className="p-4 border-l-4 border-main" key={i}>
                    <h2 className="font-semibold text-xl text-gray-500">
                      {item.type}
                    </h2>
                    <hr className="my-4" />
                    <p className="">{item.content}</p>
                    <hr className="my-4" />
                    <h2 className="font-semibold text-lg text-gray-500">
                      Created:{" "}
                      <span className="text-main">
                        {formatDate(new Date(item.created))}
                      </span>
                    </h2>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
};

export default Job;
