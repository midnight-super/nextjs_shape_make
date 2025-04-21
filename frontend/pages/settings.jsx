import CalendarSection from "@/components/SettingsSections/CalendarSection";
import GeneralSection from "@/components/SettingsSections/GeneralSection";
import InvoicesSection from "@/components/SettingsSections/InvoicesSection";
import JobsSection from "@/components/SettingsSections/JobsSection";
import QuotesSection from "@/components/SettingsSections/QuotesSection";
import TasksSection from "@/components/SettingsSections/TasksSection";
import TeamMembersSection from "@/components/SettingsSections/TeamMembersSection";
import AccountSettingsSection from "@/components/SettingsSections/AccountSettingsSection";
import { settingSections } from "@/extra_config";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const Settings = () => {
  const router = useRouter();
  const [sectionOnDisplay, setSectionOnDisplay] = useState("all-sections");

  useEffect(() => {
    if (router.isReady) {
      if (router.query.section === "Team Members") {
        setSectionOnDisplay("Team Members");
      }

      if (router.query.section === "Account Settings") {
        setSectionOnDisplay("Account Settings");
      }
    }
  }, [router.isReady]);

  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        name="Calendar"
        breadCrumbItems={["XZIST", "Settings"]}
      />
      <div className="card">
        <div className="flex-1 p-4 flex flex-col">
          {/* Title and  search bar to be made... */}
          <div className="mb-10">
            <h1 className="font-bold text-3xl text-[#ABC502]">Settings</h1>
          </div>

          {/* Two sections */}
          <div className="flex-1 flex justify-between gap-4 max-h-screen overflow-hidden">
            <div className="flex flex-col w-8/12">
              {sectionOnDisplay === "all-sections" && (
                <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-4">
                  {settingSections.map((section, i) => {
                    if (
                      section.name != "Quotes" &&
                      section.name != "Jobs" &&
                      section.name != "Invoices"
                    )
                      return (
                        <div
                          className="flex items-center justify-between p-4border-2 border-gray-300 cursor-pointer"
                          onClick={() => setSectionOnDisplay(section.name)}
                        >
                          <h1 className={`font-bold text-2xl w-4/12`}>
                            {section.name}
                          </h1>
                          <h1 className="font-normal text-lg flex-1">
                            {section.description}
                          </h1>
                          <BsChevronRight className="font-bold text-xl" />
                        </div>
                      );
                  })}
                </div>
              )}
              {sectionOnDisplay === "General" && (
                <GeneralSection setSectionOnDisplay={setSectionOnDisplay} />
              )}
              {sectionOnDisplay === "Tasks" && (
                <TasksSection setSectionOnDisplay={setSectionOnDisplay} />
              )}
              {sectionOnDisplay === "Quotes" && (
                <QuotesSection setSectionOnDisplay={setSectionOnDisplay} />
              )}
              {sectionOnDisplay === "Team Members" && (
                <TeamMembersSection setSectionOnDisplay={setSectionOnDisplay} />
              )}
              {sectionOnDisplay === "Calendar" && (
                <CalendarSection setSectionOnDisplay={setSectionOnDisplay} />
              )}
              {sectionOnDisplay === "Jobs" && (
                <JobsSection setSectionOnDisplay={setSectionOnDisplay} />
              )}
              {sectionOnDisplay === "Invoices" && (
                <InvoicesSection setSectionOnDisplay={setSectionOnDisplay} />
              )}
              {sectionOnDisplay === "Account Settings" && (
                <AccountSettingsSection
                  setSectionOnDisplay={setSectionOnDisplay}
                />
              )}
            </div>

            {/* Contact Details */}
            <div className="card flex-col justify-between items-center">
              {/* <div className="flex flex-col w-4/12 shadow-md p-8 gap-8 bg-white h-fit"> */}

              <h1 className="text-2xl font-bold text-center mb-5">
                Need Assistance?
              </h1>
              <h1 className="text-xl font-medium text-center mb-5">
                Our support teams are available{" "}
                <span className="text-[#abc502]">24/7</span>
              </h1>

              <h1 className="text-2xl font-bold text-center mb-5">
                Call us on 0112 33 4455
              </h1>

              <h1 className="text-xl font-bold text-center mb-5">
                Email us at support@xzist.com
              </h1>

              <h1 className="text-xl font-bold text-center mb-5">
                Whatsapp us at +441234 5678
              </h1>

              <h1 className="text-xl font-bold text-center text-[#abc502]">
                Knowledge Base
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
