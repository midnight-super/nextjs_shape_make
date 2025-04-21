import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import { PaymentElement } from "@stripe/react-stripe-js";

import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import axios from "axios";
import client from "../feathers";
import { BACKEND_URL } from "@/extra_config";
import { useAtom } from "jotai";
import { refreshAtom } from "@/atoms/refreshAtom";
import { Alert, AlertDescription, AlertIcon, Button } from "@chakra-ui/react";

const monthlyPriceId = "price_1McAupFspVtjhCfbfmyyPKzk";
const annualPriceId = "price_1MdM5bFspVtjhCfbIHdtspd3";

const organisationsService = client.service("organisations");
const usersService = client.service("users");

const CreateSubscription = ({ priceId }) => {
  const { user, setUser } = useContext(AuthContext);
  const [refreshNeeded, setRefreshNeeded] = useAtom(refreshAtom);

  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [organisationName, setOrganisationName] = useState("");

  const [error, setError] = useState("");

  const startSubscription = async () => {
    setError("");
    setProcessing(true);

    if (!organisationName) {
      // todo: throw error
      setProcessing(false);
      return setError("You must fill in all fields");
    }

    if (!stripe || !elements) return;

    try {
      // todo: create customer
      let res = await axios.post(`${BACKEND_URL}/create-stripe-customer`, {
        name: organisationName,
      });

      console.log(res.data);
      const customerId = res.data.customer.id;

      // todo: attach payment method

      const result = await stripe.confirmSetup({
        // `Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "https://example.com/account/payments/setup-complete",
        },
        redirect: "if_required",
      });

      const { error, setupIntent } = result;

      if (error) {
        console.log(error.message);
      }
      if (setupIntent) {
        const { payment_method } = setupIntent;

        console.log("succeeded!");
        console.log(result);

        let res = await axios.post(`${BACKEND_URL}/attach-paymentmethod`, {
          customerId,
          payment_method,
        });

        console.log("attatched");
        console.log(res);

        // todo: create subscription
        let subRes = await axios.post(`${BACKEND_URL}/create-subscription`, {
          customerId,
          payment_method,
          price: priceId,
        });

        console.log(subRes);
      }

      // todo: create org

      const org = await organisationsService.create({
        name: organisationName,
        stripeCustomerId: customerId,
        users: [user._id],
        userObjects: [user],
      });

      // todo: add org to users orgs
      const usersOrganisations = user.organisations || [];
      let updatedUser = await usersService.patch(user._id, {
        paymentSetup: true,
        $push: {
          organisationObjects: org,
          organisations: org._id,
        },
        monthlyOrAnnual: priceId === monthlyPriceId ? "monthly" : "annual",
        datePlanStarted: new Date(),
      });

      // todo: change local user
      setUser(updatedUser);
      // setUser({ ...user, paymentSetup: true });
      setRefreshNeeded(true);

      setProcessing(false);
    } catch (error) {
      console.log(error);
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm text-gray-700">Organisation Name</label>
        {/* <input type="text" className="p-2 border border-gray-200 rounded-md" /> */}
        <input
          value={organisationName}
          onChange={(e) => setOrganisationName(e.target.value)}
          type="text"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Organisation Name"
        />
      </div>
      <PaymentElement />
      <Button
        bg={"#ABC502"}
        color={"white"}
        w={"full"}
        mt={4}
        onClick={startSubscription}
        disabled={processing}
      >
        {processing ? "Creating subscription..." : "Start"}
      </Button>
      {error && (
        <Alert mt={4} status="error">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default CreateSubscription;
