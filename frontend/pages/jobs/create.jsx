import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

import client from "@/feathers";
import { useRouter } from "next/router";

const jobsService = client.service("jobs");

const CreateJob = () => {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const [customers, setCustomers] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const getCustomersAndQuotes = async () => {
      try {
        const organisationId = user.organisations[0];

        const query = {
          organisation: organisationId,
          opportunityType: "individual",
        };

        let res = await client.service("opportunities").find({ query });
        let opportunities = res.data;

        setCustomers(opportunities);

        res = await client
          .service("quotes")
          .find({ query: { organisation: organisationId } });
        let quotes = res.data;

        setQuotes(quotes);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) getCustomersAndQuotes();
  }, [user]);

  const [customer, setCustomer] = useState("");
  const [contactOnSite, setContactOnSite] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("");
  const [jobAddress, setJobAddress] = useState("");

  const [quoteName, setQuoteName] = useState("");

  const createJob = async () => {
    try {
      let quote = quotes.find((q) => q.name === quoteName);

      const newJob = {
        creator: user._id,
        organisation: user.organisations[0],
        customer,
        contactOnSite,
        email,
        quote,
        jobAddress,

        initialInvoice: false,
        templating: false,
        fabrication: false,
        qualityCheck: false,
        installation: false,
        finalInvoice: false,
        afterSalesCall: false,
        reviewRequest: false,
      };

      let res = await jobsService.create(newJob);
      console.log(res);
      console.log("made job!");

      router.push("/jobs");
    } catch (error) {
      console.log("error creating job...");
      console.log(error);
    }
  };

  return (
    <div className="flex-1 p-4">
      <h1 className="text-3xl font-bold">Create New Job</h1>

      <div className="flex gap-4 p-4 mt-8 shadow-md bg-white">
        {/* <Lorem count={2} /> */}
        {/* left */}
        <div className="flex-1 flex flex-col gap-4">
          <FormControl>
            <FormLabel>Select Customer</FormLabel>
            <Select
              placeholder="Select customer"
              onChange={(e) => setCustomer(e.target.value)}
            >
              {customers &&
                customers.map((customer, i) => (
                  <option key={customer._id}>{customer.customerName}</option>
                ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Contact on Site</FormLabel>
            <Input
              type="tel"
              value={contactOnSite}
              onChange={(e) => setContactOnSite(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormControl>
              <FormLabel>Contact Number</FormLabel>
              <Input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
        </div>
        {/* right */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <FormControl>
              <FormLabel>Quote Id</FormLabel>
              <Select
                placeholder="Select Quote"
                onChange={(e) => setQuoteName(e.target.value)}
                className="p-2 rounded-md border border-gray-500 mb-5"
              >
                {quotes &&
                  quotes.map((q, i) => <option key={q.name}>{q.name}</option>)}
              </Select>
              {/* <Input
                type="text"
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
              ></Input> */}
            </FormControl>
            <FormControl>
              <FormLabel>Job Address</FormLabel>
              <Input
                type="text"
                value={jobAddress}
                placeholder="Type Postcode"
                onChange={(e) => setJobAddress(e.target.value)}
              />
            </FormControl>
          </div>

          <Button
            bg={"#ABC502"}
            color="white"
            width="fit-content"
            onClick={createJob}
          >
            Create Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
