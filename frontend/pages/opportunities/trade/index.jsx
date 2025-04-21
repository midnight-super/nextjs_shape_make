import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Grid } from "gridjs-react";
import TradeOpportunityModal from "@/components/OpportunityModals/TradeOpportunityModal";
import client from "@/feathers";
import Link from "next/link";
import { useRouter } from "next/router";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const opportunitiesService = client.service("opportunities");

const TradeOpportunities = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [opportunities, setOpportunities] = useState([]);

  async function getOpportunities() {
    try {
      const organisationId = user.organisations[0];
      const query = {
        organisation: organisationId,
        opportunityType: "trade",
      };
      let res = await opportunitiesService.find({ query });
      let opportunities = res.data;
      setOpportunities(opportunities);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    opportunitiesService.on("created", (opportunity) => {
      const { organisation, opportunityType } = opportunity;
      if (
        organisation === user.organisations[0] &&
        opportunityType === "trade"
      ) {
        setOpportunities((o) => {
          let newOpportunities = [...o, opportunity];
          let fixedOpportunities = [...new Set(newOpportunities)];
          return fixedOpportunities;
        });
      }
    });

    getOpportunities();
  }, []);

  const data = opportunities.map((opportunity) => {
    const {
      email,
      companyName,
      telephone,
      accountManager,
      website,
      mainContact,
      _id,
    } = opportunity;
    return [
      email,
      companyName,
      telephone,
      accountManager,
      website,
      mainContact,
      // Link to the details page
      `<button onclick="window.location.href='/opportunities/${_id}'" class="btn btn-primary">View</button>`,
    ];
  });

  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        name="Calendar"
        breadCrumbItems={["XZIST", "Opportunities"]}
      />
      <div className="flex-1 p-4">
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-main">
                Trade Opportunities
              </h1>
              <TradeOpportunityModal />
            </div>
          </div>
          <div className="p-6">
            <Grid
              data={data}
              columns={[
                "Email",
                "Company Name",
                "Telephone",
                "Account Manager",
                "Website",
                "Main Contact",
              ]}
              pagination={{ enabled: true, limit: 5 }}
              search={true}
              sort={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeOpportunities;
