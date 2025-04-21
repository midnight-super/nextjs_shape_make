import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { differenceInMinutes, formatDate } from "@/utils/helperFunctions";
import { Button, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const ticketService = client.service("support-tickets");

export default function SupportTicket() {
  const { user } = useContext(AuthContext);

  const router = useRouter();
  const [ticket, setTicket] = useState(null);

  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    async function init() {
      let { id } = router.query;
      let res = await ticketService.get(id);
      setTicket(res);
    }

    if (router.isReady) init();
  }, [router.isReady]);

  // todo: get live messages
  useEffect(() => {
    if (!ticket) return;
    ticketService.on("patched", (updatedTicket) => {
      if (updatedTicket._id === ticket?._id) setTicket(updatedTicket);
    });
  }, [ticket]);

  const closeTicket = async () => {
    let updatedTicket = await ticketService.patch(ticket._id, { closed: true });
    setTicket(updatedTicket);
    router.push("/admin/support");
  };

  const reopenTicket = async () => {
    let updatedTicket = await ticketService.patch(ticket._id, {
      closed: false,
    });

    setTicket(updatedTicket);
  };

  const sendReply = async () => {
    if (!replyText) return;

    try {
      const newMessage = {
        from: user.email,
        text: replyText,
        time: new Date(),
      };

      // create last read

      let updatedTicket = await ticketService.patch(ticket._id, {
        $push: {
          messages: newMessage,
        },
        notificationTo: ticket.from._id,
      });

      // create notification

      async function createNotification() {
        const newNotification = {
          to: {
            _id: ticket.from._id,
            email: ticket.from.email,
          },
          from: {
            _id: user._id,
            email: user.email,
          },
          text: "You have a new reply to your support ticket",
          read: false,
          link: `/support/${ticket._id}`,
        };
        await client.service("notifications").create(newNotification);
      }

      if (!ticket.userLastSeen) {
        createNotification();
      }

      if (ticket.userLastSeen) {
        const minutesBetweenNowAndUserLastSeen = differenceInMinutes(
          new Date(),
          ticket.userLastSeen
        );

        if (minutesBetweenNowAndUserLastSeen > 2) {
          createNotification();
        }
      }

      setTicket(updatedTicket);
    } catch (error) {
      console.log(error);
    }
  };

  if (ticket)
    return (
      <div className="flex-1 p-4 flex flex-col">
        <h1 className="text-3xl font-bold text-main">
          Support Ticket: {ticket._id}
        </h1>

        <div className="mt-10">
          {/* Ticket Info  */}
          <div className="flex items-center gap-10 mb-5">
            <div className="">Status: {ticket.closed ? "Closed" : "Open"}</div>
            <div className="">Title: {ticket.title} </div>
          </div>

          {/* Ticket messages */}
          <div className="">Replies:</div>
          <div className="flex flex-col gap-4 my-10 mb-16">
            {ticket.messages &&
              ticket.messages.map((message) => {
                // return <div className="p-2 shadow-md">{message.text}</div>;
                return <Message message={message} user={user} />;
              })}
          </div>

          {/* Create Reply */}
          {!ticket.closed && (
            <>
              <div className="w-4/12 mb-4">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className=""
                  placeholder="Type your reply here"
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={sendReply}>Send Reply</Button>
                {/* Close ticket  */}
                <Button onClick={closeTicket}>Mark as closed</Button>
              </div>
            </>
          )}

          {/* Reopen ticket */}
          {ticket.closed && (
            <Button onClick={reopenTicket}>Reopen Ticket</Button>
          )}
        </div>
      </div>
    );
}

const Message = ({ ticket, message, user }) => {
  // const isAdminMessage = user?.isSuperAdmin && user._id !== from._id;
  // const isUserMessage = !user?.isSuperAdmin && user._id == from._id;

  const isFromMe = message.from === user.email;

  return (
    <div className="p-4 border-b flex items-center gap-2">
      {isFromMe && <div className="w-1/12 text-teal-500 font-bold">ME</div>}
      {!isFromMe && user.isSuperAdmin && (
        <div className="w-1/12 text-red-400 font-bold">USER</div>
      )}
      <div className="">{message.text}</div>
      <div className="flex-1 flex justify-end">{formatDate(message.time)}</div>
    </div>
  );
};
