import CreateTaskModal from "@/components/CreateTaskModal";
import TaskModal from "@/components/TaskModal";
import { AuthContext } from "@/context/AuthContext";
import { quickViewCategories, taskCategories } from "@/extra_config";
import client from "@/feathers";
import {
  isDateInPast,
  isInCurrentMonth,
  isInCurrentWeek,
  isToday,
} from "@/utils/helperFunctions";
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

const tasksService = client.service("tasks");

export default function CompletedTasks() {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTimeCategory, setSelectedTimeCategory] = useState("");

  async function getTasks() {
    try {
      const organisationId = user.organisations[0];
      const query = { organisation: organisationId };

      let res = await tasksService.find({ query });
      let tasks = res.data;
      console.log(tasks);
      setTasks(tasks);
      setFilteredTasks(tasks.filter((t) => t.completed));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  //   useEffect(() => {
  //     tasksService.on("created", (newTask) => {
  //       const { organisation } = newTask;
  //       if (organisation === user.organisations[0]) {
  //         setTasks((oldTasks) => {
  //           let newTasks = [...oldTasks, newTask];
  //           // remove buggy duplicates
  //           let fixedTasks = [...new Set(newTasks)];
  //           console.log(fixedTasks);
  //           return fixedTasks;
  //         });
  //       }
  //     });
  //   }, []);

  //   useEffect(() => {
  //     if (tasks.length > 0) {
  //       if (selectedCategory == "") {
  //         setFilteredTasks(tasks);
  //       }
  //     }
  //   }, [tasks]);

  //   useEffect(() => {
  //     let newFilteredTasks = tasks;
  //     if (selectedCategory !== "") {
  //       newFilteredTasks = newFilteredTasks.filter(
  //         (t) => t.category === selectedCategory
  //       );
  //     }

  //     switch (selectedTimeCategory) {
  //       case "Today":
  //         newFilteredTasks = newFilteredTasks.filter((t) =>
  //           isToday(new Date(t.completionDate))
  //         );
  //         break;

  //       case "This Week":
  //         newFilteredTasks = newFilteredTasks.filter((t) =>
  //           isInCurrentWeek(new Date(t.completionDate))
  //         );
  //         break;
  //       case "This Month":
  //         newFilteredTasks = newFilteredTasks.filter((t) =>
  //           isInCurrentMonth(new Date(t.completionDate))
  //         );
  //         break;
  //       case "Overdue":
  //         newFilteredTasks = newFilteredTasks.filter(
  //           (t) => isDateInPast(new Date(t.completionDate)) && !t.complete
  //         );
  //         break;
  //       default:
  //         break;
  //     }

  //     setFilteredTasks(newFilteredTasks);

  //     return;
  //   }, [selectedCategory, selectedTimeCategory]);

  return (
    <div className="flex-1 p-4">
      {/* Search bar aswell */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-main">Completed Tasks</h1>
        <Link href={"/tasks"}>
          <button
            type="button"
            className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
          >
            Go Back
          </button>
        </Link>
      </div>

      <div className="flex gap-4 mt-8">
        {/* <div className="p-4 px-12 flex flex-col shadow-md">
          <h2 className="font-semibold text-xl mb-4">Quick View</h2>
          <div className="flex flex-col gap-2">
            {quickViewCategories.map((c) => (
              <h3
                style={{ color: selectedTimeCategory === c ? "#ABC502" : "" }}
                className={`text-xl text-gray-500 cursor-pointer`}
                onClick={() => {
                  if (selectedTimeCategory === c) {
                    setSelectedTimeCategory("");
                  } else {
                    setSelectedTimeCategory(c);
                  }
                }}
              >
                {c}
              </h3>
            ))}
          </div>
          <hr className="my-6" />
          <h2 className="font-semibold text-xl mb-4">Categories</h2>
          <div className="flex flex-col gap-2">
            {taskCategories.map((c) => (
              <h3
                className={`text-xl text-gray-500 cursor-pointer ${
                  selectedCategory === c ? "text-main" : ""
                }`}
                onClick={() => {
                  if (selectedCategory === c) {
                    setSelectedCategory("");
                  } else {
                    setSelectedCategory(c);
                  }
                }}
              >
                {c}
              </h3>
            ))}
          </div>
        </div> */}
        <div className="flex-1 flex flex-col gap-4">
          {filteredTasks &&
            filteredTasks.map((task, i) => {
              return <Task task={task} key={i} />;
            })}
        </div>
      </div>
    </div>
  );
}

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
        <input type="checkbox" checked={task.completed} disabled />
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
        </div>
      </div>
      <TaskModal isOpen={isOpen} setIsOpen={setIsOpen} task={task} />
    </div>
  );
}
