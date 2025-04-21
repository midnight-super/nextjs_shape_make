import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { formatDate } from "@/utils/helperFunctions";
import {
  Alert,
  AlertDescription,
  AlertIcon,
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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const ticketService = client.service("support-tickets");

export default function Support() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [tickets, setTickets] = useState("");
  const [isOpenTickets, setIsOpenTickets] = useState(true);

  useEffect(() => {
    async function getTickets() {
      try {
        // todo: query for tickets by user
        let res = await ticketService.find({});
        setTickets(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (user) getTickets();
  }, [user]);

  return (
    <div className="flex-1 p-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-main">Support Tickets</h1>
        <div className="flex gap-2">
          <Button
            bg={"#ABC502"}
            color={"white"}
            w={"fit-content"}
            onClick={() => setIsOpenTickets(!isOpenTickets)}
          >
            {isOpenTickets ? "View closed tickets" : "View open tickets"}
          </Button>
          <CreateIssueModal setTickets={setTickets} />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-10">
        {tickets &&
          tickets.map((ticket) => {
            const haveNotRead = ticket.notificationTo === user._id;

            if (
              (isOpenTickets && !ticket.closed) ||
              (!isOpenTickets && ticket.closed)
            )
              return (
                <div
                  className="p-4 shadow-md cursor-pointer flex items-center gap-4"
                  key={ticket._id}
                  onClick={() => goToTicket(ticket)}
                >
                  <div className="flex items-center gap-4">
                    {haveNotRead && (
                      <div className="bg-red-500 w-2 h-2 rounded-full"></div>
                    )}
                    <span>{ticket.title}</span>
                  </div>
                  <div className="flex-1 flex justify-end">
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>
              );
          })}
      </div>
    </div>
  );
}

function CreateIssueModal({ setTickets }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // useEffect(() => {
  //   const checkModalOpen = async () => {
  //     try {
  //       console.log(router.query);
  //       const { modalOpen } = router.query;

  //       console.log(modalOpen);
  //       if (modalOpen) setIsOpen(true);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (router.isReady) checkModalOpen();
  // }, [router.isReady]);

  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [error, setError] = useState(null);

  const goToTicket = async (ticket) => {
    try {
      router.push(`/support/${ticket._id}`);

      await ticketService.patch(ticket._id, { notificationTo: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const createTicket = async () => {
    setError(null);
    if (!issue || !title) return setError("Please fill in all the fields");

    try {
      const newTicket = {
        from: {
          _id: user._id,
          email: user.email,
        },
        createdAt: new Date(),
        closed: false,
        title,
        issue,
        messages: [
          {
            from: user.email,
            text: issue,
            time: new Date(),
          },
        ],
      };

      let createdTicket = await client
        .service("support-tickets")
        .create(newTicket);

      setTickets((oldTickets) => [...oldTickets, createdTicket]);
      console.log("created a new ticket...");

      goToTicket(createdTicket);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button bg={"#ABC502"} color="white" onClick={openModal}>
        Create New
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} size={"3xl"}>
        <ModalOverlay />
        <ModalContent>
          <div className="px-8 py-12 relative">
            <div className="absolute top-0 left-0 bg-[#666666] h-[100px] w-full z-[-10]"></div>
            <div className="bg-white shadow-lg">
              <ModalHeader>
                <div className="flex items-center justify-between">
                  <span>Create New Issue</span>
                  {/* <ModalCloseButton /> */}
                  <span className="cursor-pointer" onClick={closeModal}>
                    X
                  </span>
                </div>
              </ModalHeader>

              <ModalBody className="flex flex-col">
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>What is your issue?</FormLabel>
                  <Input
                    type="tel"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                  />
                </FormControl>
                {error && (
                  <Alert mt={6} status="error" w={"fit-content"}>
                    <AlertIcon />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  bg={"#ABC502"}
                  color="white"
                  mr={3}
                  onClick={createTicket}
                >
                  Create New
                </Button>
              </ModalFooter>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
