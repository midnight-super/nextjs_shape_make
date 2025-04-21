import { FRONTEND_URL } from "@/extra_config";
import client from "@/feathers";
import { generateSimplePassword } from "@/utils/helperFunctions";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import AuthLayout from "@/components/AuthLayout";

const BottomLink = () => {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-center">
      Back to
      <Link to="auth/login" className="text-primary ms-1">
        <b>Log In</b>
      </Link>
    </p>
  );
};
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const sendResetEmail = async () => {
    setSuccess(false);
    setError("");

    try {
      let resp = await client.service("users").find({ query: { email } });
      let users = resp.data;

      if (!users || users.length === 0) {
        return setError("User with email does not exist");
      }

      let user = users[0];

      const newPassword = generateSimplePassword();
      await client.service("users").patch(user._id, { password: newPassword });

      const emailText = `Your password has been reset to ${newPassword}. Please login and change your password.`;

      const API_URL = `${FRONTEND_URL}/api/sendEmail`;

      let res = await axios.post(API_URL, {
        subject: "Xzist Password Reset",
        text: emailText,
        toAddress: email,
      });

      console.log(res.data);

      setEmail("");
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  return (
    <>
      <PageBreadcrumb title="Recover Password" />

      <AuthLayout
        authTitle="Recover Password"
        helpText="Enter your email address and we'll send you an email with instructions to reset your password."
        bottomLinks={<BottomLink />}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendResetEmail();
          }}
        >
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert status="success">
              <AlertIcon />
              <AlertDescription>
                Password reset email sent successfully.
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-4">
            <h1 className="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2 text-center">
              Email Address
            </h1>
            <Input
              className="w-full"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="button"
            className="btn bg-secondary text-white hover:bg-secondary hover:text-white w-full"
            type="submit"
          >
            Send Reset Email
          </button>
        </form>
      </AuthLayout>
    </>
  );
}
