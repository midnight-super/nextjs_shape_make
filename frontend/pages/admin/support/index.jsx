import SupportTicketModal from "@/components/SupportTicketModal";
import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { formatDate } from "@/utils/helperFunctions";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const ticketService = client.service("support-tickets");

export default function Support() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [issue, setIssue] = useState("");
  const [tickets, setTickets] = useState("");
  const [isOpenTickets, setIsOpenTickets] = useState(true);

  useEffect(() => {
    async function getTickets() {
      try {
        // todo: query for tickets by user
        let res = await ticketService.find({});
        setTickets(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (user) getTickets();
  }, [user]);

  // todo: get new live tickets

  const goToTicket = async (ticket) => {
    try {
      router.push(`/admin/support/${ticket._id}`);
      await ticketService.patch(ticket._id, { notificationTo: "" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-main">Support Tickets</h1>
        <Button
          bg={"#ABC502"}
          color={"white"}
          w={"fit-content"}
          onClick={() => setIsOpenTickets(!isOpenTickets)}
        >
          {isOpenTickets ? "View closed tickets" : "View open tickets"}
        </Button>
      </div>
      <div className="flex flex-col gap-2 mt-10">
        {tickets &&
          tickets.map((ticket) => {
            const haveNotRead = ticket.notificationTo === "admin";

            if (
              (isOpenTickets && !ticket.closed) ||
              (!isOpenTickets && ticket.closed)
            )
              return (
                <div
                  className="p-4 shadow-md cursor-pointer flex items-center gap-4"
                  key={ticket._id}
                  onClick={() => goToTicket(ticket)}
                >
                  <div className="flex items-center gap-4">
                    {haveNotRead && (
                      <div className="bg-red-500 w-2 h-2 rounded-full"></div>
                    )}
                    <span>{ticket.title}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-4 justify-end">
                    <span>{ticket.from.email}</span>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
              );
          })}
      </div>
    </div>
  );
}
