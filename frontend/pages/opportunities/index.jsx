import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

import {
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
import OpportunityModal from "@/components/OpportunityModals/IndividualOpportunityModal";

import client from "../../feathers";
import PageBreadcrumb from "@/components/PageBreadcrumb";
const opportunitiesService = client.service("opportunities");

const Opportunities = () => {
  const { user } = useContext(AuthContext);

  const [opportunities, setOpportunities] = useState([]);

  async function getOpportunities() {
    try {
      const organisationId = user.organisations[0];
      console.log({ organisationId });
      let res = await opportunitiesService.find({});
      let opportunities = res.data;
      console.log(opportunities);
      const usersOpportunitiies = opportunities.filter(
        (o) => o.organisation == organisationId
      );
      console.log(usersOpportunitiies);
      setOpportunities(usersOpportunitiies);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    opportunitiesService.on("created", (data) => {
      console.log("Got created event", data);
    });

    getOpportunities();
  }, []);

  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        name="Calendar"
        breadCrumbItems={["XZIST", "Opportunities"]}
      />
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Opportunities</h1>
          {/* <button className="btn btn-accent">Create Opportunity</button> */}
          {/* <OpportunityModal /> */}
        </div>

        {/* table */}
        <TableContainer mt={16}>
          <Table variant="simple">
            {/* <TableCaption>Opportunities Information</TableCaption> */}
            <Thead>
              <Tr>
                <Th>Customer Name</Th>
                <Th>Telephone Number</Th>
                <Th>Email Address</Th>
                <Th>Post Code</Th>
                <Th>Main Contact</Th>
                <Th>Account Manager</Th>
              </Tr>
            </Thead>
            <Tbody>
              {opportunities &&
                opportunities.map((opportunity) => {
                  const {
                    email,
                    customerName,
                    telephone,
                    accountManager,
                    postCode,
                    mainContact,
                    _id,
                  } = opportunity;

                  return (
                    <Tr key={_id}>
                      <Td>{customerName}</Td>
                      <Td>{telephone}</Td>
                      <Td>{email}</Td>
                      <Td>{postCode}</Td>
                      <Td>{mainContact}</Td>
                      <Td>{accountManager}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
            {/* <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot> */}
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default Opportunities;
