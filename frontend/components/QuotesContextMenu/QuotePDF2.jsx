import React from "react";

export default function QuotePDF2() {
  return (
    <div className="p-4 shadow-md w-fit border relative">
      <div className="absolute top-0 left-0 bg-[#666666] h-[30%] w-full"></div>
      <div className="relative p-6 flex flex-col bg-white">
        {/* Company Logo and Company Info */}
        <div className="flex justify-between gap-4">
          <div className="bg-gray-200 px-20 py-14 flex justify-center items-center font-bold text-lg text-gray-500">
            Company Logo
          </div>
          <div className="flex flex-col gap-4 items-end">
            <h2 className="text-xl text-gray-500 font-bold">Company Name</h2>
            <h3 className="">
              <span className="text-main">Quote Issued: </span>15/02/2023
            </h3>
            <h3 className="">
              <span className="text-main">Quote Expires: </span>15/02/2023
            </h3>
            <h3 className="">
              <span className="text-main">Sales Person: </span>Chris Hales
            </h3>
            <h3 className="">
              <span className="text-main">Payment Terms: </span>50% Deposite &
              50% Prior To Installation
            </h3>
          </div>
        </div>

        <hr className="my-4 border-2" />

        {/* Customer, Address and Design Image */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            <div className="">
              <div className="text-main font-semibold">Customer: </div>
              <div className="">John Harris</div>
            </div>
            <div className="">
              <div className="text-main font-semibold">Tel: </div>
              <div className="">01234 37829</div>
            </div>
            <div className="">
              <div className="text-main font-semibold">Email: </div>
              <div className="">jharris@gmail.com</div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="">
              <div className="text-main font-semibold">Billing Address: </div>
              <div className="">123 Example Street</div>
              <div className="">Example Town</div>
              <div className="">Example County</div>
              <div className="">Post Code</div>
            </div>
            <div className="">
              <div className="text-main font-semibold">
                Inatallation Address:{" "}
              </div>
              <div className="">123 Example Street</div>
              <div className="">Example Town</div>
              <div className="">Example County</div>
              <div className="">Post Code</div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img src="/images/shape1.svg" alt="" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-main text-2xl font-bold">Terms & Conditions</h2>
            <div className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
              vel libero iure minus nemo error natus nesciunt magnam architecto
              beatae veritatis accusantium facilis, commodi voluptatum, numquam
              expedita eius voluptates porro itaque est quisquam eos maiores
              possimus earum rerum consequatur laudantium. Facilis officia eius
              a illo veritatis itaque. Ea, impedit? Aliquid laborum atque
              dolore, eum rerum corporis recusandae dolorum!
            </div>
            <div className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              natus unde autem soluta ullam dignissimos consequuntur commodi
              beatae a. Tenetur soluta nihil laudantium dolore mollitia enim hic
              expedita?
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-main text-2xl font-bold">Another Heading</h2>
            <div className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
              vel libero iure minus nemo error natus nesciunt magnam architecto
              beatae veritatis accusantium facilis, commodi voluptatum, numquam
              expedita? Lorem ipsum dolor sit amet consectetur adipisicing elit.
              A, nam tenetur officiis blanditiis voluptates ut eos amet sequi
              nostrum molestias!
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-main text-2xl font-bold">Another Heading</h2>
            <div className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
              vel libero iure minus nemo error natus nesciunt magnam architecto
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
