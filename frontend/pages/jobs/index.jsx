import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/helperFunctions";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import { Button } from "@chakra-ui/react";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const jobsService = client.service("jobs");

const Jobs = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);

  async function getJobs() {
    try {
      const organisationId = user.organisations[0];
      const query = { organisation: organisationId };
      let res = await jobsService.find({ query });
      let jobs = res.data;
      setJobs(jobs);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    jobsService.on("created", (newJob) => {
      const { organisation } = newJob;
      if (organisation === user.organisations[0]) {
        setJobs((oldJobs) => {
          let newJobs = [...oldJobs, newJob];
          let fixedJobs = [...new Set(newJobs)];
          return fixedJobs;
        });
      }
    });

    getJobs();
  }, []);

  const data = jobs.map((job) => {
    return [
      job._id,
      job.customer,
      job.initialInvoice ? formatDate(job.initialInvoice) : "Not Scheduled",
      job.templating ? formatDate(job.templating) : "Not Scheduled",
      job.fabrication ? formatDate(job.fabrication) : "Not Scheduled",
      job.qualityCheck ? formatDate(job.qualityCheck) : "Not Scheduled",
      job.installation ? formatDate(job.installation) : "Not Scheduled",
      job.finalInvoice ? formatDate(job.finalInvoice) : "Not Scheduled",
      job.afterSalesCall ? formatDate(job.afterSalesCall) : "Not Scheduled",
      job.reviewRequest ? formatDate(job.reviewRequest) : "Not Scheduled",
      `<button onclick="window.location.href='/jobs/${job._id}'" class="btn btn-primary">View</button>`,
    ];
  });

  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        name="Calendar"
        breadCrumbItems={["XZIST", "Jobs"]}
      />
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-main">Jobs</h1>
          <Link href={"jobs/create"}>
            <button
              type="button"
              className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
            >
              Create New
            </button>
          </Link>
        </div>

        <div className="p-6">
          <Grid
            data={data}
            columns={[
              "Job Id",
              "Customer Name",
              "Initial Invoice",
              "Templating",
              "Fabrication",
              "Quality Check",
              "Installation",
              "Final Invoice",
              "After Sales Call",
              "Review Request",
              "Actions",
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

export default Jobs;
