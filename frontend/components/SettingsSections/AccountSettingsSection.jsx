import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";
import { BsChevronRight } from "react-icons/bs";

export default function AcountSettingsSection({ setSectionOnDisplay }) {
  const { user, setUser } = useContext(AuthContext);

  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const changePassword = async () => {
    setSuccess(false);
    setError(false);

    if (!newPassword) return setError("Please enter a new password");

    if (newPassword !== repeatPassword) return setError("Passwords must match");

    try {
      let updatedUser = await client
        .service("users")
        .patch(user._id, { password: newPassword });
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Acount Settings</h1>
      <button
        type="button"
        className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
        onClick={() => setSectionOnDisplay("all-sections")}
      >
        Go Back
      </button>
      <div className="flex flex-col gap-2 mt-5">
        <label htmlFor="">Password: </label>
        <input
          type="password"
          placeholder="New password"
          className="p-2 border rounded-md w-fit"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor="">Repeat Password: </label>
        <input
          type="password"
          placeholder="Repeat Password"
          className="p-2 border rounded-md w-fit"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <button
          type="button"
          className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
          onClick={changePassword}
        >
          Change Password
        </button>
        {success && (
          <Alert status="success" w={"fit-content"}>
            <AlertIcon />
            <AlertDescription>Changed password</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert status="error" w={"fit-content"}>
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
      <EmailSettings />
    </div>
  );
}

const EmailSettings = ({}) => {
  const { user, setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendVerificationEmail = async () => {
    setError("");
    setSuccess("");
    console.log("sending verification email");

    // check if email already verified
    let res = await axios.get(`/api/getVerifiedSenders`);
    console.log(res.data);
    let { senders } = res.data;

    let senderExists = false;
    let senderVerified = false;
    let senderId = "";

    if (senders.length > 0) {
      senders.forEach((sender) => {
        if (sender.from_email === email) {
          senderExists = true;
          senderId = sender.id;

          if (sender.verified) {
            senderVerified = true;
            return setError("This email is already verified");
          }
        }
      });
    }

    try {
      // check if verification email has been sent (resend api)
      if (senderExists && !senderVerified) {
        res = await axios.post(`/api/resendVerificationEmail`, { senderId });
        console.log(res.data);
        // set success message
        let updatedUser = await client.service("users").patch(user._id, {
          emailSettings: {
            email,
            verficationEmailSentButNotVerified: true,
          },
        });
        setUser(updatedUser);
        setSuccess(true);
        return;
      }

      // send verification email
      res = await axios.post(`/api/verifySender`, {
        email,
        name,
        address,
        city,
        country,
      });
      let updatedUser = await client.service("users").patch(user._id, {
        emailSettings: {
          email,
          verficationEmailSentButNotVerified: true,
        },
      });
      setUser(updatedUser);
      setSuccess(true);

      console.log("resent it...");
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectEmail = async () => {};

  return (
    <div className="flex flex-col gap-2">
      {user.emailSettings?.senderEmailSetup && (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Email setup</h1>
          <h1 className="text-lg font-medium">{user.email}</h1>
          <Button onClick={disconnectEmail} w={"fit-content"}>
            Disconnect
          </Button>
        </div>
      )}

      {!user.emailSettings?.senderEmailSetup && (
        <>
          <h1 className="text-2xl font-bold">Set up sender</h1>
          <input
            type="text"
            className="p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <input
            type="text"
            className="p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="sender name"
          />
          <input
            type="text"
            className="p-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="address"
          />
          <input
            type="text"
            className="p-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="city"
          />
          <input
            type="text"
            className="p-2"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="country"
          />
          <Button onClick={sendVerificationEmail}>
            send verification email
          </Button>
          {error && (
            <Alert mt={4} status="error">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert mt={4} status="success">
              <AlertIcon />
              <AlertDescription>Please check your inbox</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};
