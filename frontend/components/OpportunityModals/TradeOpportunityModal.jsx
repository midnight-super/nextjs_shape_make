import { useState, useContext } from "react";

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
} from "@chakra-ui/react";

import client from "../../feathers";

import { useRouter } from "next/router";
import { ModalLayout } from "../HeadlessUI";

const opportunitiesService = client.service("opportunities");

export default function TradeOpportunityModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [accountManager, setAccountManager] = useState("");
  const [website, setWebsite] = useState("");
  const [mainContact, setMainContact] = useState("");

  const createTradeCustomer = async () => {
    try {
      const newOpportunity = {
        email,
        companyName,
        telephone,
        accountManager,
        website,
        mainContact,
        opportunityType: "trade",
        creator: user._id,
        // todo: replace with active organisation
        organisation: user.organisations[0],
        createdAt: new Date(),
      };

      let res = await opportunitiesService.create(newOpportunity);
      console.log(res);

      // router.reload();
      closeModal();
    } catch (error) {
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
        panelClassName="sm:max-w-3xl"
        isStatic
        placement="justify-center items-start"
      >
        <div className="duration-500  ease-out transition-[opacity] sm:w-full sm:mx-auto  flex-col bg-white border shadow-sm rounded-md dark:bg-slate-800 dark:border-gray-700">
          <div className="flex justify-between items-center py-2.5 px-4 border-b dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-white text-lg">
              Create New Trade Customer
            </h3>
            <button className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 dark:text-gray-200">
              <span className="material-symbols-rounded" onClick={closeModal}>
                close
              </span>
            </button>
          </div>
          <div className="px-8 py-12 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                {/* Left */}
                <div className="flex-1 flex flex-col">
                  <FormControl>
                    <FormLabel>Company Name</FormLabel>
                    <Input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Telephone Number</FormLabel>
                    <Input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Website</FormLabel>
                    <Input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </FormControl>
                </div>
                {/* Right */}
                <div className="flex-1 flex flex-col">
                  <FormControl>
                    <FormLabel>Main Contact</FormLabel>
                    <Input
                      type="text"
                      value={mainContact}
                      onChange={(e) => setMainContact(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Account Manager</FormLabel>
                    <Input
                      type="text"
                      value={accountManager}
                      onChange={(e) => setAccountManager(e.target.value)}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4 p-4 border-t dark:border-slate-700">
            <div className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white">
              <button onClick={createTradeCustomer}>Create New</button>
            </div>
          </div>
        </div>
      </ModalLayout>
    </>
  );
}
