import { useState, useContext, useEffect } from "react";

import { AuthContext } from "@/context/AuthContext";

import {
  Checkbox,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  Select,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";

import client from "../feathers";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useRouter } from "next/router";
import { taskCategories } from "@/extra_config";
import { generateRandomID } from "@/utils/helperFunctions";
import Link from "next/link";
import { ModalLayout } from "./HeadlessUI";

const tasksService = client.service("tasks");

export default function CreateTaskModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [startDate, setStartDate] = useState(new Date());

  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [customerAssignedTo, setCustomerAssignedTo] = useState("");
  const [teamMemberAssignedTo, setTeamMemberAssignedTo] = useState("");
  const [category, setCategory] = useState("");
  const [completionDate, setCompletionDate] = useState(
    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
  );
  const [selectedDay, setSelectedDay] = useState("");

  const [customers, setCustomers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [shouldReschedule, setShouldReschedule] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkModalOpen = async () => {
      try {
        console.log(router.query);
        const { modalOpen } = router.query;

        console.log(modalOpen);
        if (modalOpen) setIsOpen(true);
      } catch (error) {
        console.log(error);
      }
    };

    if (router.isReady) checkModalOpen();
  }, [router.isReady]);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const organisationId = user.organisations[0];

        const query = {
          organisation: organisationId,
          opportunityType: "individual",
        };

        let res = await client.service("opportunities").find({ query });
        let opportunities = res.data;
        setCustomers(opportunities);

        let org = await client.service("organisations").get(organisationId);
        console.log({ org });
        setTeamMembers(org.userObjects);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) getCustomers();
  }, [user]);

  const createTask = async () => {
    setError("");

    if (
      !user ||
      !name ||
      !customerAssignedTo ||
      !teamMemberAssignedTo ||
      !category ||
      (!completionDate && !selectedDay)
    ) {
      return setError("Please fill in all necessary information");
    }

    try {
      const customer = customers.find((c) => c._id === customerAssignedTo);
      const teamMember = teamMembers.find(
        (t) => t._id === teamMemberAssignedTo
      );

      const newTask = {
        creator: user._id,
        organisation: user.organisations[0],
        name,
        description,
        customerAssignedTo: customer,
        teamMemberAssignedTo: teamMember,
        category,
        ...(!shouldReschedule && { completionDate }),
        // todo: reschedule date
        ...(shouldReschedule && { rescheduleDay: selectedDay }),
        completed: false,
      };

      let res = await tasksService.create(newTask);
      console.log(res);

      if (teamMember._id !== user._id) {
        // const notification = {
        //   text: "You have a new task assigned to you",
        //   assignedBy: user.email,
        //   read: false,
        //   _id: generateRandomID(),
        // };

        // await client.service("users").patch(teamMember._id, {
        //   $push: {
        //     notifications: notification,
        //   },
        // });

        const notification = {
          text: "You have a new task assigned to you",
          to: {
            _id: teamMember._id,
            email: teamMember.email,
          },
          from: {
            _id: user._id,
            email: user.email,
          },
          read: false,
          _id: generateRandomID(),
          link: `/tasks`,
        };

        await client.service("notifications").create(notification);

        console.log("created notification");
      }

      closeModal();
    } catch (error) {
      setError("Something went wrong, please try again.");
      console.log("error in creating task...");
      console.log(error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
        onClick={openModal}
      >
        Create New
      </button>
      <ModalLayout
        showModal={isOpen}
        toggleModal={closeModal}
        panelClassName="sm:max-w-7xl w-[900px]"
        isStatic
        placement="justify-center items-start"
      >
        <div className="duration-500 ease-out transition-all sm:w-full m-3 sm:mx-auto flex flex-col bg-white border shadow-sm rounded-md dark:bg-slate-800 dark:border-gray-700">
          <div className="flex justify-between items-center py-2.5 px-4 border-b dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-white text-lg">
              Create New Task
            </h3>
            <button className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 dark:text-gray-200">
              <span className="material-symbols-rounded" onClick={closeModal}>
                close
              </span>
            </button>
          </div>
          <div className="px-8 py-12 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {/* Task Name */}
              <div className="flex flex-col gap-2">
                <h2 className="font-medium text-lg text-gray-500">Task Name</h2>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="p-2 rounded-md border border-gray-500"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <h2 className="font-medium text-lg text-gray-500">
                  Description
                </h2>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className=""
                  placeholder="Task Description"
                />
              </div>

              {/* Assign to customer */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <h2 className="font-medium text-lg text-gray-500">
                    Customer
                  </h2>
                  <span>
                    <Link
                      href={{
                        pathname: "/opportunities/individual",
                        query: { modalOpen: true },
                      }}
                      className="underline text-main text-lg"
                    >
                      Create New Customer
                    </Link>
                  </span>
                </div>

                <Select
                  placeholder="Select customer"
                  onChange={(e) => setCustomerAssignedTo(e.target.value)}
                  className="p-2 rounded-md border border-gray-500"
                >
                  {customers &&
                    customers.map((customer, i) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.customerName}
                      </option>
                    ))}
                </Select>
              </div>

              {/* Assign to Team */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <h2 className="font-medium text-lg text-gray-500">
                    Assign To Team Member
                  </h2>
                  <span>
                    <Link
                      href={{
                        pathname: "/settings",
                        query: { section: "Team Members" },
                      }}
                      className="underline text-main text-lg"
                    >
                      Invite Team Member
                    </Link>
                  </span>
                </div>

                <Select
                  placeholder="Select Team Member"
                  onChange={(e) => setTeamMemberAssignedTo(e.target.value)}
                  className="p-2 rounded-md border border-gray-500"
                >
                  {teamMembers &&
                    teamMembers.map((teamMember, i) => (
                      <option key={teamMember._id} value={teamMember._id}>
                        {teamMember.email}
                      </option>
                    ))}
                </Select>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <h2 className="font-medium text-lg text-gray-500">Category</h2>
                <Select
                  placeholder="Select option"
                  className="p-2 rounded-md border border-gray-500"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {taskCategories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  {user &&
                    user.customCategories?.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                </Select>
              </div>

              {/* Reschedule Checkbox */}
              <Checkbox
                onChange={(e) => setShouldReschedule(e.target.checked)}
                isChecked={shouldReschedule}
              >
                Reschedule
              </Checkbox>

              {shouldReschedule ? (
                <div className="flex flex-col gap-2">
                  <h2 className="font-medium text-lg text-gray-500">
                    Reschedule
                  </h2>
                  <Select
                    placeholder="Select day"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                  </Select>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <h2 className="font-medium text-lg text-gray-500">
                    Completion Date
                  </h2>
                  <DatePicker
                    selected={completionDate}
                    onChange={(date) => setCompletionDate(date)}
                    className="text-lg w-full mb-4 p-2 border border-gray-500 rounded-md"
                    dayClassName={() => ""}
                    calendarClassName={""}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end items-center gap-4 p-4 border-t dark:border-slate-700">
            <button
              type="button"
              className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
              onClick={createTask}
            >
              Create New
            </button>

            {error && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </ModalLayout>
    </>
  );
}
