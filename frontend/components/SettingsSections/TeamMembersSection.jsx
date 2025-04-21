import { AuthContext } from "@/context/AuthContext";
import { FRONTEND_URL } from "@/extra_config";
import client from "@/feathers";
import {
  Button,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";

export default function TeamMembersSection({ setSectionOnDisplay }) {
  const [timezoneShow, setTimezoneShow] = useState(false);
  const [measurementShow, setMeasurementShow] = useState(false);

  const { user } = useContext(AuthContext);
  const [organisation, setOrganisation] = useState(null);
  const [email, setEmail] = useState("");

  const [findUserError, setFindUserError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const inviteMember = async () => {
    setSuccess(false);
    setError(false);

    try {
      // todo: check user doesnt already exist

      // todo: check if other invites already exist

      const invite = {
        from: {
          _id: user._id,
          email: user.email,
        },
        to: email,
        organisation,
        accepted: false,
        createdAt: new Date(),
      };

      let createdInvite = await client.service("invites").create(invite);

      const invitationLink = `${FRONTEND_URL}/invitation?invite_id=${createdInvite._id}`;

      // send email to user
      let res = await axios.post(`/api/sendEmail`, {
        subject: "Xzist Invitation",
        text: `Click the following link to join. ${invitationLink}`,
        toAddress: email,
      });

      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    async function getOrganisation() {
      try {
        let orgId = user.organisations[0];
        let org = await client.service("organisations").get(orgId);
        console.log(org);
        setOrganisation(org);
      } catch (error) {
        console.log(error);
      }
    }

    if (user) getOrganisation();
  }, [user]);

  return (
    <div className="flex-1 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-700">
        Team Members Settings
      </h1>

      <button
        type="button"
        className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
        onClick={() => setSectionOnDisplay("all-sections")}
      >
        Go Back
      </button>
      {organisation &&
        organisation.userObjects &&
        organisation.userObjects.map((user, i) => {
          return (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 bg-white shadow-md cursor-pointer"
            >
              <h1 className="font-medium text-xl w-4/12">{user.email}</h1>
              {/* <h1 className="font-normal text-lg flex-1">London, GMT</h1> */}
              <BsChevronRight className="font-bold text-xl" />
            </div>
          );
        })}
      {/* <div className="flex items-center justify-between p-4 bg-white shadow-md cursor-pointer">

        <h1 className="font-medium text-xl w-4/12">{user.email}</h1>
        <BsChevronRight className="font-bold text-xl" />
      </div> */}
      <div className="mt-10 flex flex-col gap-2 w-1/2">
        <h2 className="font-medium text-lg text-gray-500">
          User's email address
        </h2>
        <input
          type="text"
          className="p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="button"
          className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
          onClick={inviteMember}
        >
          Send Invite
        </button>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert status="success">
            <AlertIcon />
            <AlertDescription>Invitation sent</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
