import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import OpportunityModal from "@/components/OpportunityModals/IndividualOpportunityModal";
import client from "@/feathers";
import { useRouter } from "next/router";
import { Grid } from "gridjs-react";

const opportunitiesService = client.service("opportunities");

const IndividualOpportunities = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [opportunities, setOpportunities] = useState([]);

  async function getOpportunities() {
    try {
      const organisationId = user?.organisations[0];

      const query = {
        organisation: organisationId,
        opportunityType: "individual",
      };

      let res = await opportunitiesService.find({ query });
      let opportunities = res.data;
      setOpportunities(opportunities);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getOpportunities();
  }, []);

  useEffect(() => {
    if (!user) return;

    client.service("opportunities").on("created", (opp) => {
      if (
        opp.organisation === user.organisations[0] &&
        opp.opportunityType === "individual"
      ) {
        setOpportunities((oldOpps) => [...oldOpps, opp]);
      }
    });
  }, [user]);

  const data = opportunities.map((opportunity) => {
    const {
      email,
      customerName,
      telephone,
      accountManager,
      postCode,
      mainContact,
      _id,
    } = opportunity;
    return [
      customerName,
      telephone,
      email,
      postCode,
      mainContact,
      accountManager,
      `<button onclick="window.location.href='/opportunities/individual/${_id}'" class="btn btn-primary">View</button>`,
    ];
  });

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-main">
          Individual Opportunities
        </h1>
        <OpportunityModal />
      </div>

      <div className="p-6">
        <Grid
          data={data}
          columns={[
            "Customer Name",
            "Telephone Number",
            "Email Address",
            "Post Code",
            "Main Contact",
            "Account Manager",
          ]}
          pagination={{ enabled: true, limit: 5 }}
          search={true}
          sort={true}
        />
      </div>
    </div>
  );
};

export default IndividualOpportunities;
