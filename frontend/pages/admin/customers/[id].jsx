import client from "@/feathers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { Button, FormControl, FormLabel } from "@chakra-ui/react";

export default function CustomerPage() {
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [organisation, setOrganisation] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const { id } = router.query;
      console.log(id);
      let user = await client.service("users").get(id);
      setCustomer(user);

      let org = await client
        .service("organisations")
        .get(user.organisations[0]);
      setOrganisation(org);
      console.log(org);
    };

    if (router.isReady) getData();
  }, [router.isReady, router.query]);

  const deleteAccount = async () => {};

  const suspendAccount = async () => {
    let updatedCustomer = await client.service("users").patch(customer._id, {
      isSuspended: customer.isSuspended ? false : true,
    });

    console.log(updatedCustomer);
    setCustomer(updatedCustomer);
  };

  if (customer)
    return (
      <div className="flex-1 p-4 flex flex-col">
        <h1 className="text-3xl font-bold text-main">
          Customer: {customer._id}
        </h1>

        <div className="flex flex-col gap-4">
          {/* Customer Details */}
          <div className="p-8 flex gap-6 shadow-md">
            <div className="flex-1 flex flex-col gap-8">
              <FormControl className="flex flex-col gap-2">
                <FormLabel className="text-main">Customer Name</FormLabel>
                <input
                  type="text"
                  value={customer.name || "Not set"}
                  className="border-none outline-none"
                />
              </FormControl>
              <FormControl>
                <FormLabel className="text-main"> Comapny Name</FormLabel>
                <input
                  type="text"
                  value={organisation?.name}
                  className="border-none outline-none"
                />
              </FormControl>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              <FormControl className="flex flex-col gap-2">
                <FormLabel className="text-main">Email Address</FormLabel>
                <input
                  type="text"
                  value={customer.email}
                  className="border-none outline-none"
                />
              </FormControl>
              <FormControl>
                <FormLabel className="text-main">Postal Address</FormLabel>
                <input
                  type="text"
                  value={customer.address || "Not set"}
                  className="border-none outline-none"
                />
              </FormControl>
            </div>
          </div>

          {/* Other users from same organisation */}
          <div className="p-8 flex flex-col shadow-md">
            <h2 className="text-2xl font-bold text-main">
              Other customers from the same organisation:
            </h2>
            <div className="flex flex-col gap-2 mt-6">
              {organisation &&
                organisation.userObjects.map((u) => {
                  if (u._id == customer._id) return;
                  return (
                    <div
                      key={u._id}
                      className="p-4 border shadow-sm cursor-pointer"
                      onClick={() => router.push(`/admin/customers/${u._id}`)}
                    >
                      {u.email}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Suspend or delete account */}
          <div className="p-8 flex flex-col shadow-md">
            <div className="flex items-center gap-6">
              {/* <Button
                w={"fit-content"}
                bg={"red"}
                color={"white"}
                onClick={deleteAccount}
              >
                Delete Account
              </Button> */}

              <Button
                w={"fit-content"}
                bg={"red"}
                color={"white"}
                onClick={suspendAccount}
              >
                {customer.isSuspended ? "Unsuspend Account" : "Suspend Account"}
              </Button>

              {/* <Button
                w={"fit-content"}
                bg={"darkorange"}
                color={"white"}
                onClick={suspendAccount}
              >
                Suspend
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    );
}
