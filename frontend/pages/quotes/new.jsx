import { Step, Steps, useSteps } from "chakra-ui-steps";
import React, { useState, useEffect, useContext, useRef } from "react";

import { Flex, button } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import client from "@/feathers";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";

const DesignTool = dynamic(() => import("@/components/DesignTool"), {
  ssr: false,
});

const DrawKitchen = dynamic(() => import("@/components/DrawKitchen"), {
  ssr: false,
});

const TestDesignTool = dynamic(
  () => import("@/components/DesignToolMeasurement"),
  {
    ssr: false,
  }
);

const CurvesDesignTool = dynamic(
  () => import("@/components/DesignToolCurves"),
  {
    ssr: false,
  }
);
const EdgesDesignTool = dynamic(() => import("@/components/DesignToolEdges"), {
  ssr: false,
});
const CutoutsDesignTool = dynamic(
  () => import("@/components/DesignToolCutouts"),
  {
    ssr: false,
  }
);
const MaterialsDesignTool = dynamic(
  () => import("@/components/DesignToolMaterials"),
  {
    ssr: false,
  }
);
// const TestDesignTool = dynamic(() => import("@/components/CadTool"), {
//   ssr: false,
// });

// const NewQuote = () => {
//   return (
//     <div className="flex-1 flex flex-col bg-red-100 m-2">
//       {/* hello */}
//       <DesignTool />
//     </div>
//   );
// };

const content = <Flex py={4}>hello</Flex>;

const steps = [
  { label: "Counter Measurements", content },
  { label: "Curves & Bumpouts", content },
  { label: "Splash & Edge", content },
  { label: "Cutouts", content },
  { label: "Material", content },
  { label: "Price Details", content },
];

const NewQuote = () => {
  const [cadData, setCadData] = useState({});
  const [quotes, setQuotes] = useState([]);
  const { user, setUser } = useContext(AuthContext);
  const [template, setTemplate] = useState(null);

  const [svg, setSvg] = useState("");
  const ref = useRef(null);

  const router = useRouter();
  const [customerId, setCustomerId] = useState("");

  const [quoteId, setQuoteId] = useState("");
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    client
      .service("quotes")
      .find({
        query: {
          type: "template",
        },
      })
      .then(async (result) => {
        console.log("result", result);
        setQuotes(result.data);
      });
  }, []);

  useEffect(() => {
    // todo: check if there is a design for the current

    async function initDesign() {
      const { quoteId } = router.query;
      if (!quoteId) {
        return console.log("Error, no such quote has been found");
      }

      setQuoteId(quoteId);

      let quote = await client.service("quotes").get(quoteId);
      setQuote(quote);
      setCadData(quote.cadData || {});
    }

    if (user && router.isReady) initDesign();
  }, [user, router.isReady]);

  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const changeTemplate = (info) => {
    setCadData(info.cadData);
    setTemplate(info);
  };

  const showValue = async (newData) => {
    setCadData(newData);
    if (quoteId) {
      let updatedQuote = await client.service("quotes").patch(quote._id, {
        cadData,
      });

      setQuote(updatedQuote);
    }
  };

  const save = async () => {
    console.log("logging cad data______________________________________");
    console.log(cadData);
    // await client.service("users").patch(user._id, { currentDesign: cadData });
    let updatedQuote = await client
      .service("quotes")
      .patch(quote._id, { cadData });

    setQuote(updatedQuote);

    console.log("saved!");
  };

  const saveTemplate = async () => {
    let updatedQuote = await client
      .service("quotes")
      .patch(quote._id, { cadData, type: "template", svg });
    window.location.href = "/quotes";
  };
  const deleteTemplate = async () => {
    let updatedQuote = await client
      .service("quotes")
      .patch(quote._id, { cadData, type: "template", svg });
    window.location.href = "/quotes";
  };
  const clearDesign = async () => {
    // await client.service("users").patch(user._id, { currentDesign: {} });
    let updatedQuote = await client.service("quotes").patch(quote._id, {
      cadData: {},
    });
    setQuote(updatedQuote);

    setCadData({});
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Quote Name and Save button */}
      <div className="flex gap-5 items-center p-4">
        <div className="text-2xl font-bold">Quotation for ...</div>

        {/* buttons */}
        <button
          type="button"
          className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
          onClick={save}
        >
          Save
        </button>

        <button
          type="button"
          className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
          onClick={saveTemplate}
        >
          Save Template
        </button>
        <button
          type="button"
          className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
          onClick={deleteTemplate}
        >
          Delete Template
        </button>
        <button
          type="button"
          className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
          onClick={clearDesign}
        >
          Clear Design
        </button>
        <button
          type="button"
          className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
          mx="auto"
          size="sm"
          onClick={reset}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
          mx="auto"
          size="sm"
          onClick={reset}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
          isDisabled={activeStep === 0}
          mr={4}
          onClick={prevStep}
          size="sm"
          variant="ghost"
        >
          Back
        </button>
        <button
          type="button"
          className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
          size="sm"
          onClick={nextStep}
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
      {/* Stepper */}
      <Flex flexDir="column" width="100%" className="flex-1 flex flex-col">
        {/* stepper buttons */}
        {activeStep === steps.length ? (
          <Flex p={4}>
            {/* <button
              type="button"
              className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
              mx="auto"
              size="sm"
              onClick={reset}
            >
              Reset
            </button> */}
          </Flex>
        ) : (
          <Flex width="100%" justify="flex-center">
            {/* <button
              type="button"
              className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
              isDisabled={activeStep === 0}
              mr={4}
              onClick={prevStep}
              size="sm"
              variant="ghost"
            >
              Prev
            </button>
            <button
              type="button"
              className="btn bg-primary/25 text-primary hover:bg-primary hover:text-white"
              size="sm"
              onClick={nextStep}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </button> */}
          </Flex>
        )}

        {/* steps */}
        <div className="flex gap-2 mx-4">
          <div
            className={`p-2 font-bold border border-black
             ${activeStep === 0 ? "bg-[#ABC502] text-white" : ""}
            
            `}
          >
            {steps[0].label}
          </div>
          <div
            className={`p-2 font-bold border border-black  ${
              activeStep === 1 ? "bg-[#ABC502] text-white" : ""
            }
            `}
          >
            {steps[1].label}
          </div>
          <div
            className={`p-2 font-bold border border-black  ${
              activeStep === 2 ? "bg-[#ABC502] text-white" : ""
            }
            `}
          >
            {steps[2].label}
          </div>
          <div
            className={`p-2 font-bold border border-black  ${
              activeStep === 3 ? "bg-[#ABC502] text-white" : ""
            }
            `}
          >
            {steps[3].label}
          </div>
          <div
            className={`p-2 font-bold border border-black  ${
              activeStep === 4 ? "bg-[#ABC502] text-white" : ""
            }
            `}
          >
            {steps[4].label}
          </div>
          <div
            className={`p-2 font-bold border border-black  ${
              activeStep === 5 ? "bg-[#ABC502] text-white" : ""
            }
            `}
          >
            {steps[5].label}
          </div>
        </div>

        <Steps
          hidden={true}
          activeStep={activeStep}
          className="flex-1 flex flex-col"
        >
          {/* Step 1: Counter dimensions */}
          <Step label={"Measurements"} className="flex-1 flex flex-col">
            <div>
              <div className="template flex my-4">
                {quotes.map((quote) => (
                  <div
                    className={
                      template && template._id == quote._id
                        ? "item selected mx-4 border border-teal-800 "
                        : "item mx-4"
                    }
                    onClick={() => changeTemplate(quote)}
                  >
                    <img src={quote.svg} style={{ width: "150px" }} />
                  </div>
                ))}
              </div>
              <div className="flex-1 flex flex-col">
                {/* <DesignTool /> */}
                <TestDesignTool
                  cadState={steps[activeStep].label}
                  cadData={cadData}
                  updateParent={showValue}
                  updateSvg={setSvg}
                />
                {/* <DrawKitchen /> */}
              </div>
            </div>
          </Step>

          <Step label={"Shaping"} className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              {/* <DesignTool /> */}
              <CurvesDesignTool
                cadState={steps[activeStep].label}
                cadData={cadData}
                updateParent={showValue}
              />
            </div>
          </Step>

          <Step
            label={"Edges and Backsplaches"}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 flex flex-col">
              {/* <DesignTool /> */}
              <EdgesDesignTool
                cadState={steps[activeStep].label}
                cadData={cadData}
                updateParent={showValue}
              />
            </div>
          </Step>

          <Step label={"Cutouts"} className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              {/* <DesignTool /> */}
              <CutoutsDesignTool
                cadState={steps[activeStep].label}
                cadData={cadData}
                updateParent={showValue}
              />
            </div>
          </Step>

          <Step label={"Material and Edging"} className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              {/* <DesignTool /> */}
              <MaterialsDesignTool
                cadState={steps[activeStep].label}
                cadData={cadData}
                updateParent={showValue}
              />
            </div>
          </Step>

          <Step label={"Pricing"} className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              {/* <DesignTool /> */}
              {/* <TestDesignTool
                cadState={steps[activeStep].label}
                cadData={cadData}
                updateParent={showValue}
                updateSvg={setSvg}
              /> */}
            </div>
          </Step>
        </Steps>
      </Flex>
    </div>
  );
};

export default NewQuote;

{
  /* {steps.map(({ label, content }, i) => (
            <Step label={label} key={label} className="flex-1 flex flex-col">
              <div className="flex-1">
                {content}, {i}
              </div>
            </Step>
          ))} */
}
