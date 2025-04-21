import { useState, useContext, useEffect } from "react";

import { AuthContext } from "@/context/AuthContext";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  Select,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import client from "@/feathers";

const ticketService = client.service("support-tickets");

export default function SupportTicketModal({ isOpen, setIsOpen, ticket }) {
  const router = useRouter();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { user } = useContext(AuthContext);

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
                  <span>Support Ticket: {ticket._id}</span>
                  {/* <ModalCloseButton /> */}
                  <span className="cursor-pointer" onClick={closeModal}>
                    X
                  </span>
                </div>
              </ModalHeader>

              <ModalBody className="flex">
                <div className="flex-1 flex flex-col gap-4"></div>
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
