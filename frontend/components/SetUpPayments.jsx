import { ReactNode, useContext } from "react";

import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

import PlanPaymentModal from "./PlanPaymentModal";

import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { useAtom } from "jotai";
import { refreshAtom } from "@/atoms/refreshAtom";

const stripePromise = loadStripe(
  "pk_test_51J2aAWFspVtjhCfbQ5tfsxd7bvZWXNjeGRJAPxE3jIpcYssobPXOvk38L5MtnLvJExXwUI4pFYc4De3r7QloR8RO00R09zb3YI"
);

const monthlyPriceId = "price_1McAupFspVtjhCfbfmyyPKzk";
const annualPriceId = "price_1MdM5bFspVtjhCfbIHdtspd3";

function PriceWrapper({ children }) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
}

export default function SetUpPayments() {
  const { user, setUser } = useContext(AuthContext);
  const [refreshNeeded, setRefreshNeeded] = useAtom(refreshAtom);

  const options = {
    // passing the client secret obtained in step 3
    clientSecret:
      "seti_1McXIyFspVtjhCfbV5qHYgMN_secret_NNHsWZoDO2IZyYZ4h1OfEaTXcv9D7rc",
    // "pi_3McXZbFspVtjhCfb08gwGOZw_secret_q7KM6rFdyLgtNBm0b1ma4iOoF",
    // Fully customizable with appearance API.
  };

  const acceptInvite = async (invite) => {
    try {
      const invitedOrg = invite.organisation;

      // add user to orgs users

      let res = await client.service("organisations").patch(invitedOrg._id, {
        $push: {
          users: user._id,
          userObjects: user,
        },
      });

      // add org to users orgs and set invite as accepted

      let updatedInvites = user.invites.map((inv) => {
        if (inv.organisation._id === invite.organisation._id) {
          return {
            ...inv,
            accepted: true,
          };
        }

        return inv;
      });

      res = await client.service("users").patch(user._id, {
        $push: {
          organisationObjects: invitedOrg,
          organisations: invitedOrg._id,
        },
        invites: updatedInvites,
        paymentSetup: true,
      });

      setUser(res);
      setRefreshNeeded(true);

      console.log("all done!");
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    const numberOfInvites = user.invites?.length || 0;

    return (
      <Elements stripe={stripePromise}>
        <Box py={12}>
          <VStack spacing={2} textAlign="center">
            <Heading as="h1" fontSize="4xl">
              Create an organisation
            </Heading>
            {/* <Text fontSize="lg" color={"gray.500"}>
          Start with 14-day free trial. No credit card needed. Cancel at
          anytime.
        </Text>  */}
          </VStack>
          <Stack
            direction={{ base: "column", md: "row" }}
            textAlign="center"
            justify="center"
            spacing={{ base: 4, lg: 10 }}
            py={10}
          >
            <PriceWrapper>
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="2xl">
                  Monthly
                </Text>
                <HStack justifyContent="center">
                  <Text fontSize="3xl" fontWeight="600">
                    $
                  </Text>
                  <Text fontSize="5xl" fontWeight="900">
                    100
                  </Text>
                  <Text fontSize="3xl" color="gray.500">
                    /month
                  </Text>
                </HStack>
              </Box>
              <VStack
                bg={useColorModeValue("gray.50", "gray.700")}
                py={4}
                borderBottomRadius={"xl"}
              >
                <List spacing={3} textAlign="start" px={12}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    unlimited build minutes
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Lorem, ipsum dolor.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    5TB Lorem, ipsum dolor.
                  </ListItem>
                </List>
                <Box w="80%" pt={7}>
                  {/* <Button w="full" colorScheme="red" variant="outline">
                Start trial
              </Button> */}

                  <PlanPaymentModal priceId={monthlyPriceId} />
                </Box>
              </VStack>
            </PriceWrapper>

            <PriceWrapper>
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="2xl">
                  Annually
                </Text>
                <HStack justifyContent="center">
                  <Text fontSize="3xl" fontWeight="600">
                    $
                  </Text>
                  <Text fontSize="5xl" fontWeight="900">
                    1000
                  </Text>
                  <Text fontSize="3xl" color="gray.500">
                    /year
                  </Text>
                </HStack>
              </Box>
              <VStack
                bg={useColorModeValue("gray.50", "gray.700")}
                py={4}
                borderBottomRadius={"xl"}
              >
                <List spacing={3} textAlign="start" px={12}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    unlimited build minutes
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Lorem, ipsum dolor.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    5TB Lorem, ipsum dolor.
                  </ListItem>
                </List>
                <Box w="80%" pt={7}>
                  {/* <Button w="full" colorScheme="red" variant="outline">
                Start trial
              </Button> */}
                  <PlanPaymentModal priceId={annualPriceId} />
                </Box>
              </VStack>
            </PriceWrapper>
          </Stack>
        </Box>
        <div className="flex flex-col gap-4 mb-20">
          <h1 className="text-4xl font-bold text-center">Invites</h1>
          {numberOfInvites === 0 && (
            <h1 className="text-xl font-bold text-center">
              You have no invites yet.
            </h1>
          )}

          {user.invites &&
            user.invites.map((invite) => {
              if (!invite.accepted)
                return (
                  <div className="p-8 rounded-md shadow-md border flex flex-col gap-4 w-fit mx-auto text-xl">
                    <span className="">From: {invite.from.email}</span>
                    <span className="">
                      Organisation: {invite.organisation.name}
                    </span>
                    <Button
                      bg={"#ABC502"}
                      color={"white"}
                      className="mt-4"
                      onClick={() => acceptInvite(invite)}
                    >
                      Join Organisation
                    </Button>
                  </div>
                );
            })}
        </div>
      </Elements>
    );
  }
}

// const SetUpPayments = () => {
//   return (
//     <div className="bg-gray-100 flex-1">
//       <h1 className="text-3xl font-bold">Set Up Payments..</h1>
//     </div>
//   );
// };

// export default SetUpPayments;
