import React from "react";

export default function SupportTicket() {
  return (
    <div className="flex-1 p-4">
      <div className="flex flex-col">
        {/* Top Header */}
        <h1 className="text-3xl font-bold">
          Website showing a critical error{" "}
          <span className="font-normal text-lg text-gray-400">
            Token Id: #993837
          </span>
        </h1>
        <hr className="my-4" />

        {/* Ticket Details Header */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex flex-col">
            <h2 className="font-semibold text-xl">Status</h2>
            <h3 className="font-normal text-lg bg-blue-500 p-1 px-2 text-white rounded-md">
              Awaiting Your Reply
            </h3>
          </div>

          <div className="flex flex-col">
            <h2 className="font-semibold text-xl">Service</h2>
            <h3 className="font-normal text-lg">service@address.com</h3>
          </div>

          <div className="flex flex-col">
            <h2 className="font-semibold text-xl">Created</h2>
            <h3 className="font-normal text-lg">19/03/23 2:03pm</h3>
          </div>

          <div className="flex flex-col">
            <h2 className="font-semibold text-xl">Last Updated</h2>
            <h3 className="font-normal text-lg">19/03/33 3:30am</h3>
          </div>
        </div>

        {/* Ticket Messages  */}
        <div className="flex flex-col gap-8 mt-10 mb-6">
          {Array.from(Array(3).keys()).map((item, i) => (
            <div className="px-8 py-4 shadow-lg flex ">
              <div className="w-[200px] flex relative">
                <div className="absolute top-0 left-0 translate-y-[-50%] bg-blue-400 text-white p-1">
                  You
                </div>
                <div className="py-8">
                  <h3 className="">19/04/2023</h3>
                  <h3 className="">14:49</h3>
                </div>
                <div className="flex-1 border-r-2 border-gray-300 mr-4"></div>
              </div>
              {/* message */}
              <div className="flex-1 leading-loose px-6">
                Hi, my name is .... Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Velit reiciendis mollitia suscipit nihil quia
                recusandae perferendis ut. Architecto praesentium aperiam
                corporis modi harum eligendi eos, accusantium ex, minus
                doloremque, incidunt aut consequuntur accusamus repudiandae
                pariatur enim dolores eaque repellendus est.
              </div>
            </div>
          ))}
        </div>

        {/* Update Ticket Text box and Submit Buttons */}
        <div className="p-4 shadow-lg flex flex-col gap-4 mt-6">
          <h1 className="text-2xl font-bold">Update Ticket</h1>
          <textarea
            className="p-4 border border-gray-400"
            placeholder="Ticket comments"
            cols="10"
            rows="5"
          ></textarea>
          <div className="flex items-center gap-4">
            <button className="bg-green-700 text-white px-6 py-2">
              Update Ticket
            </button>

            <button className=" text-gray-700 border border-gray-600 px-6 py-2">
              Update & Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
