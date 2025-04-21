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
  Select,
} from "@chakra-ui/react";

import client from "@/feathers";

import { useRouter } from "next/router";

import Link from "next/link";
import { generateQuoteName } from "@/utils/helperFunctions";
import { ModalLayout } from "./HeadlessUI";

const opportunitiesService = client.service("opportunities");

export default function CreateQuoteModal() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { user } = useContext(AuthContext);

  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
        // console.log({ organisationId });

        const query = {
          organisation: organisationId,
          opportunityType: "individual",
        };

        let res = await opportunitiesService.find({ query });

        let opportunities = res.data;
        setCustomers(opportunities);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) getCustomers();
  }, [user]);

  const launchConfigurator = async () => {
    const customer = customers.find((c) => c._id === selectedCustomer);
    if (!customer) return console.log("you need to select a customer!");

    const quoteName = generateQuoteName(customer.email);

    let newQuote = await client.service("quotes").create({
      name: quoteName,
      date: new Date(),
      customer,
      value: 800,
      organisation: user.organisations[0],
      cadData: {},
    });

    router.push({
      pathname: "/quotes/new",
      // query: { customerId: customer._id },
      query: { quoteId: newQuote._id },
    });
  };

  const createQuote = async () => {
    // get selected customer

    const customer = customers.find((c) => c._id === selectedCustomer);

    // create quote

    let res = await client.service("quotes").create({
      date: new Date(),
      customer,
      value: 800,
      organisation: user.organisations[0],
    });

    console.log(res);
    closeModal();
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
        panelClassName="sm:max-w-lg"
      >
        <div className="duration-500  ease-out transition-[opacity] sm:w-full sm:mx-auto  flex-col bg-white border shadow-sm rounded-md dark:bg-slate-800 dark:border-gray-700">
          <div className="flex items-center justify-between py-2.5 px-4 border-b dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-white text-lg">
              Create New Quote
            </h3>
            <button className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 dark:text-gray-200">
              <span className="material-symbols-rounded" onClick={closeModal}>
                close
              </span>
            </button>
          </div>
          <div className="px-8 py-12 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <FormControl>
                <FormLabel>Select Customer</FormLabel>
                <Select
                  placeholder="Select option"
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  {customers &&
                    customers.map((customer, i) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.customerName}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <div className="text-center">Or</div>
              <Link
                href={{
                  pathname: "/opportunities/individual",
                  query: { modalOpen: true },
                }}
              >
                <Button
                  textAlign={"center"}
                  variant="outline"
                  borderRadius={"none"}
                  width={"full"}
                >
                  Create New Customer
                </Button>
              </Link>
              <div className="h-[1px] bg-[#555555] w-[100px] mx-auto mt-4"></div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 p-4 border-t dark:border-slate-700">
            <div className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white">
              <button onClick={launchConfigurator}>Create New</button>
            </div>
          </div>
        </div>
      </ModalLayout>
    </>
  );
}
