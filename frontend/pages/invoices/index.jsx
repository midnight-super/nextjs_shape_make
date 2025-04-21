import React, { useContext, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import { formatDate } from "@/utils/helperFunctions";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// Dynamically import ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Invoices = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    async function getInvoices() {
      try {
        let res = await client.service("invoices").find({
          query: {
            "from._id": user._id,
          },
        });

        let invoices = res.data;
        setInvoices(invoices);
      } catch (error) {
        console.log(error);
      }
    }

    if (user) getInvoices();
  }, [user]);

  const data = invoices.map((invoice) => {
    return [
      `Edit`,
      invoice._id,
      formatDate(new Date(invoice.issueDate)),
      formatDate(new Date(invoice.dueDate)),
      `$${invoice.amount}`,
      invoice.customer.customerName,
      invoice.customer.email,
      invoice.customer.telephone,
      invoice.customer.accountManager,
    ];
  });

  // Function to handle the edit button click
  const editInvoice = (id) => {
    router.push(`/invoices/edit/${id}`);
  };

  // Chart options
  const lineChartOpts_quotes = {
    series: [
      {
        name: "Sales",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: 7,
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2021-01-01",
        "2021-02-01",
        "2021-03-01",
        "2021-04-01",
        "2021-05-01",
        "2021-06-01",
        "2021-07-01",
      ],
    },
    title: {
      text: "Sales Trends",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#FDD835"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    markers: {
      size: 4,
      colors: ["#FFA41B"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    yaxis: {
      min: 0,
      max: 150,
      title: {
        text: "Sales",
      },
    },
  };

  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        name="Calendar"
        breadCrumbItems={["XZIST", "Invoices"]}
      />
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="card">
          <div className="p-6">
            <ReactApexChart
              className="apex-charts"
              options={lineChartOpts_quotes}
              height={300}
              series={lineChartOpts_quotes.series}
              type="line"
            />
          </div>
        </div>

        {/* Invoices table and button */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-main">Invoices</h1>

            <button
              type="button"
              className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
              onClick={() => router.push("/invoices/create")}
            >
              Create New
            </button>
          </div>

          <div className="p-6">
            <Grid
              data={data}
              columns={[
                "Edit",
                "Invoice Id",
                "Issue Date",
                "Due Date",
                "Amount",
                "Customer Name",
                "Email",
                "Tel",
                "Account Manager",
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

export default Invoices;
