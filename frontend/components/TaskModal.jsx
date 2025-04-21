import { useState, useContext, useEffect } from "react";

import { AuthContext } from "@/context/AuthContext";

import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
} from "@chakra-ui/react";

import client from "../feathers";

import { useRouter } from "next/router";
import { taskCategories } from "@/extra_config";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const tasksService = client.service("tasks");

export default function TaskModal({ isOpen, setIsOpen, task }) {
  const router = useRouter();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { user } = useContext(AuthContext);

  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [customerAssignedTo, setCustomerAssignedTo] = useState(
    task.customerAssignedTo
  );
  const [category, setCategory] = useState(task.category);
  const [completionDate, setCompletionDate] = useState(null);
  const [teamMemberAssignedTo, setTeamMemberAssignedTi] = useState("");

  useEffect(() => {
    if (task.completionDate) setCompletionDate(new Date(task.completionDate));
  }, [task]);

  const updateTask = async () => {
    try {
      console.log(task);

      let res = await tasksService.patch(task._id, {
        name,
        description,
        category,
        completionDate,
      });

      console.log(res);
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const markAsComplete = async () => {
    try {
      console.log("marking as complete");
      await tasksService.patch(task._id, { completed: true });
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const markAsIncomplete = async () => {
    try {
      console.log("marking as complete");
      await tasksService.patch(task._id, { completed: false });
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async () => {
    try {
      await tasksService.remove(task._id);
      // await tasksService.patch(task._id, { completed: false });
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <Button bg={"#ABC502"} color="white" onClick={openModal}>
        Create New
      </Button> */}

      <Modal isOpen={isOpen} onClose={closeModal} size={"3xl"}>
        <ModalOverlay />
        <ModalContent>
          <div className="px-8 py-12 relative">
            <div className="absolute top-0 left-0 bg-[#666666] h-[100px] w-full z-[-10]"></div>
            <div className="bg-white shadow-lg">
              <ModalHeader>
                <div className="flex items-center justify-between">
                  <span>Task: {task.name}</span>
                  {/* <ModalCloseButton /> */}
                  <span className="cursor-pointer" onClick={closeModal}>
                    X
                  </span>
                </div>
              </ModalHeader>

              {/* <ModalHeader>Create New Task</ModalHeader>
          <ModalCloseButton /> */}
              <ModalBody className="flex">
                <div className="flex-1 flex flex-col gap-4">
                  {/* Task Name */}
                  <div className="flex flex-col gap-2">
                    <h2 className="font-medium text-lg text-gray-500">
                      Task Name
                    </h2>
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
                  {/* <div className="flex flex-col gap-2">
                    <h2 className="font-medium text-lg text-gray-500">
                      Assign To Customer
                    </h2>
                    <input
                      value={customerAssignedTo}
                      onChange={(e) => setCustomerAssignedTo(e.target.value)}
                      type="text"
                      className="p-2 rounded-md border border-gray-500"
                    />
                  </div> */}

                  {/* Category */}
                  <div className="flex flex-col gap-2">
                    <h2 className="font-medium text-lg text-gray-500">
                      Category
                    </h2>

                    <Select
                      value={category}
                      // disabled
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

                  {/* Completion Date:  */}
                  {task.completionDate && (
                    <div className="flex flex-col gap-2">
                      <h2 className="font-medium text-lg text-gray-500">
                        Completion Date
                      </h2>
                      <ReactDatePicker
                        selected={completionDate}
                        onChange={(date) => setCompletionDate(date)}
                        className="text-lg w-full mb-4 p-2 border border-gray-500 rounded-md"
                        dayClassName={() => ""}
                        calendarClassName={""}
                      />
                    </div>
                  )}

                  {/* Assign To Team Member */}
                  {/* <div className="flex flex-col gap-2">
                    <h2 className="font-medium text-lg text-gray-500">
                      Assign To Team Member
                    </h2>
                    <input
                      // todo: add something
                      type="text"
                      className="p-2 rounded-md border border-gray-500"
                    />
                  </div> */}
                  <Button
                    bg={"#ABC502"}
                    color="white"
                    mr={3}
                    onClick={updateTask}
                  >
                    Update Task
                  </Button>
                  {!task.completed ? (
                    <Button
                      bg={"#ABC502"}
                      color="white"
                      mr={3}
                      onClick={markAsComplete}
                    >
                      Mark as Complete
                    </Button>
                  ) : (
                    <Button
                      bg={"#ABC502"}
                      color="white"
                      mr={3}
                      onClick={markAsIncomplete}
                    >
                      Mark as Incomplete
                    </Button>
                  )}
                  <Button
                    bg={"#ABC502"}
                    color="white"
                    mr={3}
                    onClick={deleteTask}
                  >
                    Delete Task
                  </Button>
                </div>
              </ModalBody>

              {/* <ModalFooter>
            <Button
              bg={"#ABC502"}
              color="white"
              mr={3}
              onClick={() => console.log("...")}
            >
              Create New
            </Button>
          </ModalFooter> */}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
