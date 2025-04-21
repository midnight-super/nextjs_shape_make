import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { PaymentElement } from "@stripe/react-stripe-js";

import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CreateSubscription from "./CreateSubscription";
import { BACKEND_URL } from "@/extra_config";

const stripePromise = loadStripe(
  "pk_test_51J2aAWFspVtjhCfbQ5tfsxd7bvZWXNjeGRJAPxE3jIpcYssobPXOvk38L5MtnLvJExXwUI4pFYc4De3r7QloR8RO00R09zb3YI"
);

export default function PlanPaymentModal({ priceId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [clientSecret, setClientSecret] = useState("");

  async function getClientSecret() {
    try {
      const server = `${BACKEND_URL}/create-setupintent`;

      let res = await axios.post(server);
      const setupIntent = res.data;

      console.log(setupIntent);
      console.log(setupIntent.client_secret);
      setClientSecret(setupIntent.client_secret);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getClientSecret();
  }, []);

  const options = {
    // passing the client secret obtained in step 3
    clientSecret,
    // "seti_1McXIyFspVtjhCfbV5qHYgMN_secret_NNHsWZoDO2IZyYZ4h1OfEaTXcv9D7rc",
    // Fully customizable with appearance API.
    // appearance: {/*...*/},
  };

  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}
      <Button onClick={onOpen} w="full" colorScheme="red" variant="outline">
        Start trial
      </Button>

      {/* <Modal isOpen={isOpen} onClose={onClose}> */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Organisation</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="">
            {clientSecret && (
              <Elements stripe={stripePromise} options={options}>
                <CreateSubscription priceId={priceId} />{" "}
              </Elements>
            )}
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}
