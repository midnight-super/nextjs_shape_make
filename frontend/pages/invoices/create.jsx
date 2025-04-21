import TradeOpportunityModal from "@/components/OpportunityModals/TradeOpportunityModal";
import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateInvoice() {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const [issueDate, setIssueDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const organisationId = user.organisations[0];

        const query = {
          organisation: organisationId,
          opportunityType: "individual",
        };

        let res = await client.service("opportunities").find({ query });
        let opportunities = res.data;
        setCustomers(opportunities);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) getCustomers();
  }, [user]);

  const save = async () => {
    try {
      const customer = customers.find((c) => c._id === customerId);
      console.log(customer, issueDate, dueDate);

      const newInvoice = {
        issueDate,
        dueDate,
        customer,
        amount: 1200,
        from: user,
      };

      let res = await client.service("invoices").create(newInvoice);

      await router.push("/invoices");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold text-main">New Invoice</h1>
        <div className="flex flex-col gap-4">
          <div className="flex-1 flex gap-10 mx-auto">
            <div className="flex-1 flex flex-col gap-2">
              <FormLabel>Select Customer</FormLabel>
              <Select
                placeholder="Select customer"
                onChange={(e) => setCustomerId(e.target.value)}
                // w={"fit"}
                className="p-2 rounded-md border border-gray-500 w-fit"
              >
                {customers &&
                  customers.map((customer, i) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.customerName}
                    </option>
                  ))}
              </Select>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <FormLabel>Issue Date</FormLabel>
              <ReactDatePicker
                selected={issueDate}
                onChange={(date) => setIssueDate(date)}
                className="text-lg w-full mb-4 p-1 border border-gray-200 rounded-md"
                dayClassName={() => ""}
                calendarClassName={""}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <FormLabel>Due Date</FormLabel>
              <ReactDatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                className="text-lg w-full mb-4 p-1 border border-gray-200 rounded-md"
                dayClassName={() => ""}
                calendarClassName={""}
              />
            </div>
          </div>
          <div className="flex mt-2 justify-end items-end">
            <button
              type="button"
              className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
              onClick={save}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
