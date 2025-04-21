import client from "@/feathers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export default function CreateQuote() {
  const router = useRouter();

  const [opportunity, setOpportunity] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const { customerId } = router.query;

        const opportunity = await client
          .service("opportunities")
          .get(customerId);
        setOpportunity(opportunity);
      } catch (error) {
        console.log(error);
      }
    };

    if (router.isReady) getData();
  }, [router.isReady]);

  return (
    <div className="flex-1 p-4">
      <h1 className="text-3xl font-bold">Create Quote</h1>
      <button onClick={() => console.log(opportunity)}>See customer</button>

      <TableContainer mt={4}>
        <Table variant="simple">
          {/* <TableCaption>Opportunities Information</TableCaption> */}
          <Thead>
            <Tr>
              <Th>Item</Th>
              <Th>Description</Th>
              <Th>Quantity</Th>
              <Th>Tax</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from(Array(3).keys()).map((item, i) => (
              <Tr>
                <Td>
                  <Input />
                </Td>
                <Td>
                  <Input minWidth={"400px"} />
                </Td>
                <Td>
                  <Input />
                </Td>
                <Td>
                  <Input />
                </Td>
                <Td>
                  <Input minWidth={"100px"} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}
