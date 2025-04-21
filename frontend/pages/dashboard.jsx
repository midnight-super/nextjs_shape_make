import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { faker } from "@faker-js/faker";
import React, { useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { GoLinkExternal } from "react-icons/go";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { isDateInPast, isToday } from "@/utils/helperFunctions";

import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { notificationsAtom } from "@/atoms/notificationsAtom";
import TaskModal from "@/components/TaskModal";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { lineChartOpts_quotes, lineChartOpts_sales } from "../utils/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Data",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: "#ABC502",
      backgroundColor: "#ABC502",
    },
  ],
};

// Dynamically import ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Dashboard = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  useEffect(() => {
    async function getTasks() {
      try {
        const organisationId = user.organisations[0];
        const query = { organisation: organisationId };
        let res = await client.service("tasks").find({ query });
        let tasks = res.data;
        console.log(tasks);
        // todo: filter the tasks to only todays tasks
        setTasks(
          tasks.filter((t) => {
            let taskComplete = t.completed;
            if (taskComplete) return false;
            let taskDate = new Date(t.completionDate);
            if (isToday(taskDate) || isDateInPast(taskDate)) return true;
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
    getTasks();
  }, [user]);

  // check for notifications

  useEffect(() => {
    async function getNotifications() {
      try {
        // console.log("getting notifications");
        let res = await client.service("notifications").find();
        let allNotifications = res.data;
        setNotifications(allNotifications.filter((n) => n.to._id === user._id));
      } catch (e) {
        console.log(e);
      }
    }

    if (user) getNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    client.service("notifications").on("created", (n) => {
      if (n.to._id === user._id) {
        // setNotifications((oldNotifications) => [...oldNotifications, n]);
        setNotifications((oldNotifications) => {
          const newNotifications = [...oldNotifications, n];
          const fixedNotifications = [...new Set(newNotifications)];
          return fixedNotifications;
        });
      }
    });
  }, [user]);

  const notificationsRef = useRef(null);

  // scroll to notifications if clicked on from navbar
  useEffect(() => {
    async function scrollToNotifications() {
      if (router.query.notifications && notificationsRef.current) {
        notificationsRef.current.scrollIntoView();
      }
    }

    if (router.isReady) scrollToNotifications();
  }, [router.isReady, notificationsRef]);

  const markNotificationAsDone = async (notification) => {
    try {
      await client.service("notifications").patch(notification._id, {
        read: true,
      });

      let newNotifications = notifications.map((n) => {
        if (n._id === notification._id) {
          return {
            ...n,
            read: true,
          };
        } else {
          return n;
        }
      });

      setNotifications(newNotifications);
    } catch (error) {
      console.log(error);
    }
  };

  const goToNotificationLink = async (notification) => {
    if (notification.link) {
      router.push(notification.link);
    } else {
      // todo: redirect to link of notification
      router.push("/tasks");
    }
  };

  return (
    <>
      <PageBreadcrumb
        name="Dashbaord"
        title="Dashbaord"
        breadCrumbItems={["XZIST", "Dashbaord"]}
      />
      <div className="grid lg:grid-cols-1 gap-6">
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
        <div className="card">
          <div className="p-6">
            <ReactApexChart
              className="apex-charts"
              options={lineChartOpts_sales}
              height={300}
              series={lineChartOpts_sales.series}
              type="line"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

function Task({ task }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`flex items-center w-full shadow-md p-4 border-l-8 border-l-[#ABC502] cursor-pointer`}
      onClick={() => {
        setIsOpen(true);
      }}
    >
      <div className="mr-8">
        {/* <input type="checkbox" checked={task.completed} disabled /> */}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="text-lg font-semibold">Task Name: {task.name}</div>
        <div>Task Desc: {task.description}</div>
      </div>
      <div className="flex flex-col gap-1 w-2/12">
        <div className="text-lg font-semibold">Assigned To: </div>
        <div>{task.customerAssignedTo?.customerName}</div>
      </div>
      <div className="flex flex-col gap-1 w-2/12">
        <div className="text-lg font-semibold">Complete By: </div>
        <div className="">
          {new Date(task.completionDate).toLocaleDateString("en-UK", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {isDateInPast(new Date(task.completionDate)) &&
            !isToday(new Date(task.completionDate)) && (
              <span className="text-red-500 block font-medium">OVERDUE</span>
            )}
        </div>
      </div>
      <TaskModal isOpen={isOpen} setIsOpen={setIsOpen} task={task} />
    </div>
  );
}
