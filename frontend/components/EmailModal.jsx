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
import axios from "axios";

import dynamic from "next/dynamic";

import { EditorState, convertToRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { BACKEND_URL, FRONTEND_URL } from "@/extra_config";
import { ModalLayout } from "./HeadlessUI";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
});

export default function EmailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [errorOpen, setErrorOpen] = useState(false);
  const closeErrorModal = () => setErrorOpen(false);

  const { user, setUser } = useContext(AuthContext);

  const router = useRouter();

  const [toAddress, setToAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState(EditorState.createEmpty());

  useEffect(() => {
    const checkModalOpenAndPrefillEmail = async () => {
      const { modalOpen, prefillEmail } = router.query;
      if (modalOpen) setIsOpen(true);
      if (prefillEmail) setToAddress(prefillEmail);
    };

    if (router.isReady) checkModalOpenAndPrefillEmail();
  }, [router.isReady]);

  const sendEmail = async () => {
    try {
      // !FIX AFTER

      let contentState = text.getCurrentContent();
      const content = convertToRaw(contentState);
      // console.log();
      const htmlContent = stateToHTML(contentState);
      // console.log()
      console.log(htmlContent);

      console.log(toAddress);
      console.log(subject);

      // return;

      const API_URL = `${FRONTEND_URL}/api/sendEmail`;

      // return console.log({ toAddress, subject, text });

      let res = await axios.post(API_URL, {
        fromAddress: user.email,
        subject,
        text: htmlContent,
        toAddress,
      });

      console.log(res.data);

      // save email to database

      const sentEmail = {
        sentBy: user,
        toAddress,
        email: {
          subject,
          text: contentState.getPlainText(),
        },
        sentAt: new Date(),
      };

      res = await client.service("emails").create(sentEmail);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const openEmailModal = () => {
    if (!user.emailSettings?.senderEmailSetup) return setErrorOpen(true);

    return openModal();
  };

  useEffect(() => {
    async function checkIfEmailVerified() {
      if (user.emailSettings?.senderEmailSetup) return;

      if (user.emailSettings?.verficationEmailSentButNotVerified) {
        // check if email has been verified
        let res = await axios.get(`/api/getVerifiedSenders`);
        const { senders } = res.data;

        for (const sender of senders) {
          if (sender.from_email === user.email && sender.verified) {
            let updatedUser = await client.service("users").patch(user._id, {
              emailSettings: {
                verficationEmailSentButNotVerified: false,
                senderEmailSetup: true,
              },
            });
            setUser(updatedUser);
          }
        }
      }
    }

    checkIfEmailVerified();
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn bg-secondary text-white hover:bg-secondary hover:text-white"
        onClick={openEmailModal}
      >
        Create New
      </button>

      <EmailNotSetUpModal
        closeErrorModal={closeErrorModal}
        errorOpen={errorOpen}
        router={router}
      />
    </>
  );
}

const EmailNotSetUpModal = ({ errorOpen, closeErrorModal, router }) => (
  <ModalLayout
    showModal={errorOpen}
    toggleModal={closeErrorModal}
    panelClassName="sm:max-w-lg"
    isStatic
    placement="justify-center items-start"
  >
    <div className="duration-500 ease-out transition-all sm:w-full m-3 sm:mx-auto flex flex-col bg-white border shadow-sm rounded-md dark:bg-slate-800 dark:border-gray-700">
      <div className="flex justify-between items-center py-2.5 px-4 border-b dark:border-gray-700">
        <h3 className="font-medium text-gray-800 dark:text-white text-lg">
          Error
        </h3>
        <button className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 dark:text-gray-200">
          <span className="material-symbols-rounded" onClick={closeErrorModal}>
            close
          </span>
        </button>
      </div>
      <div className="px-4 py-8 overflow-y-auto">
        <p className="text-gray-800 dark:text-gray-200">
          Email sending not set up. Please check your inbox or go to settings.
        </p>
      </div>
      <div className="flex justify-end items-center gap-4 p-4 border-t dark:border-slate-700">
        <button
          className="py-2 px-5 inline-flex justify-center items-center gap-2 rounded dark:text-gray-200 border dark:border-slate-700 font-medium hover:bg-slate-100 hover:dark:bg-slate-700 transition-all"
          onClick={() => router.push(`/settings?section=Account Settings`)}
          type="button"
        >
          Set up
        </button>
      </div>
    </div>
  </ModalLayout>
);
