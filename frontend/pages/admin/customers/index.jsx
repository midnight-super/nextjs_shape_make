import client from "@/feathers";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/router";
import { formatDate } from "@/utils/helperFunctions";

export default function Customers() {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function getCustomers() {
      try {
        let res = await client.service("users").find();
        console.log(res);
        let users = res.data;
        setCustomers(
          users.filter((user) => !user.isSuperAdmin && user.paymentSetup)
        );
      } catch (error) {
        console.log(error);
      }
    }

    getCustomers();
  }, []);

  return (
    <div className="flex-1 p-4 flex flex-col">
      <h1 className="text-3xl font-bold text-main">Customers</h1>
      {/* <div className="flex flex-col gap-4 my-10">
        {customers &&
          customers.map((customer) => (
            <div className="p-2 shadow-md" key={customer._id}>
              {customer.email}
            </div>
          ))}
      </div> */}

      <TableContainer mt={16}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Company Name</Th>
              <Th>Customer Name</Th>
              <Th>Account Creation Date</Th>
              <Th>Monthly/Annual</Th>
              <Th>Renewal Date </Th>
              <Th>Email</Th>
              <Th>Phone Number</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers &&
              customers.map((customer) => {
                const orgName = customer.organisationObjects[0].name;

                let renewalDate;

                const { monthlyOrAnnual, datePlanStarted } = customer;

                if (monthlyOrAnnual === "monthly") {
                  renewalDate = new Date(datePlanStarted);
                  renewalDate.setMonth(renewalDate.getMonth() + 1);
                }
                if (monthlyOrAnnual === "yearly") {
                  renewalDate = new Date(datePlanStarted);
                  renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                }

                return (
                  <Tr
                    className="cursor-pointer"
                    key={customer._id}
                    onClick={() =>
                      router.push(`/admin/customers/${customer._id}`)
                    }
                  >
                    <Td>{orgName}</Td>
                    <Td>{customer.name || "Not Set"}</Td>
                    <Td>{formatDate(new Date(customer.createdAt))}</Td>
                    <Td>{customer.monthlyOrAnnual || "N/A"}</Td>
                    <Td>{renewalDate ? formatDate(renewalDate) : "N/A"}</Td>
                    <Td>{customer.email}</Td>
                    <Td>{customer.phoneNumer || "Not Set"}</Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}
