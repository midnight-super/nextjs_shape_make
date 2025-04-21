import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export default function SupportTicket() {
  return (
    <div className="flex-1 p-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <h3 className="text-lg text-gray-400 font-medium">
            View your past and active tickets
          </h3>
          <div className="flex items-center gap-8">
            <div className="flex w-[400px] border">
              <div className="text-gray-400 p-2 flex-1">Bulk Actions</div>
              <button className="bg-green-700 text-white p-2">Apply</button>
            </div>
            <div className="flex text-gray-400 w-[300px] border p-2">
              Search tickets
            </div>
          </div>
        </div>
        <button className="text-white bg-green-700 px-4 py-2 rounded-lg">
          Contact Customer Services
        </button>
      </div>

      <div className="">
        <TableContainer mt={16}>
          <Table variant="simple">
            {/* <TableCaption>Opportunities Information</TableCaption> */}
            <Thead>
              <Tr>
                <Th>
                  <input type="checkbox" />
                </Th>
                <Th>Ticket Number</Th>
                <Th>Summary</Th>
                <Th>Last Updated</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.from(Array(3).keys()).map((item, i) => (
                <Tr>
                  <Td>
                    <input type="checkbox" />
                  </Td>
                  <Td>
                    <Link
                      className="cursor-pointer"
                      href={"/support-tickets/46727474848"}
                    >
                      #46727474848
                    </Link>
                  </Td>
                  <Td>
                    <div className="text-blue-400">
                      Website showing a critical error
                    </div>
                  </Td>
                  <Td>19/04/2023 4:24pm</Td>
                  <Td>Awaiting Reply</Td>
                  <Td>
                    <div className="text-blue-400">View Ticket</div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <div className="w-fit mx-auto mt-4 border-gray-400 border-2 rounded-3xl px-8 py-4 font-semibold text-gray-400 cursor-pointer">
          View 14 closed tickets
        </div>
      </div>
    </div>
  );
}
