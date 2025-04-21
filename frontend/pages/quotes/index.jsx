import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import CreateQuoteModal from "@/components/CreateQuoteModal";
import client from "@/feathers";
import { useRouter } from "next/router";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const quotesService = client.service("quotes");

const Quotes = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [quotes, setQuotes] = useState([]);

  async function getQuotes() {
    try {
      const organisationId = user.organisations[0];
      const query = { organisation: organisationId };

      let res = await quotesService.find({ query });
      let quotes = res.data;
      console.log(quotes);
      setQuotes(quotes);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getQuotes();
  }, []);

  useEffect(() => {
    quotesService.on("created", (newQuote) => {
      const { organisation } = newQuote;
      if (organisation === user.organisations[0]) {
        setQuotes((oldQuotes) => {
          let newQuotes = [...oldQuotes, newQuote];
          let fixedQuotes = [...new Set(newQuotes)];
          console.log(fixedQuotes);
          return fixedQuotes;
        });
      }
    });
  }, [user]);

  const data = quotes.map((quote) => {
    return [
      `Edit`,
      quote._id,
      new Date(quote.date).toLocaleDateString("en-UK", {
        day: "numeric",
        month: "long",
      }),
      quote.customer.customerName,
      quote.customer.telephone,
      quote.customer.email,
      `$${quote.value}`,
      quote.customer.accountManager,
    ];
  });

  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        name="Calendar"
        breadCrumbItems={["XZIST", "Quotes"]}
      />
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-main">Quotes</h1>
          <CreateQuoteModal />
        </div>

        <div className="p-6">
          <Grid
            data={data}
            columns={[
              "Edit",
              "Quote Id",
              "Date Added",
              "Customer Name",
              "Telephone Number",
              "Email Address",
              "Value",
              "Account Manager",
            ]}
            pagination={{ enabled: true, limit: 5 }}
            search={true}
            sort={true}
          />
        </div>
      </div>
    </>
  );
};

export default Quotes;
