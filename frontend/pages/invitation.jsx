import client from "@/feathers";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { AuthContext } from "@/context/AuthContext";

export default function Invitation() {
  const { user, setUser } = useContext(AuthContext);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const [settingUpAccount, setSettingUpAccount] = useState(false);
  const [invite, setInvite] = useState(null);

  useEffect(() => {
    const getInvite = async () => {
      const { invite_id } = router.query;
      let res = await client.service("invites").get(invite_id);
      setInvite(res);
    };

    if (router.isReady) getInvite();
  }, [router.isReady]);

  const signup = async () => {
    setError(false);

    let userDetails = {
      email: invite.to,
      password,
      paymentSetup: true,
      createdAt: new Date(),
      organisationObjects: [invite.organisation],
      organisations: [invite.organisation._id],
      invitedBy: invite.from,
    };

    try {
      // create new user
      let newUser = await client.service("users").create(userDetails);

      // update org
      let updatedOrg = await client
        .service("organisations")
        .patch(invite.organisation._id, {
          $push: {
            users: newUser._id,
            userObjects: newUser,
          },
        });

      // update invite
      let updatedInvite = await client.service("invites").patch(invite._id, {
        accepted: true,
      });

      setInvite(updatedInvite);

      // auth
      let res = await client.authenticate({
        strategy: "local",
        email: newUser.email,
        password,
      });

      setUser(res.user);

      router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  if (invite) {
    return (
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        //   bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <h1 className={`text-2xl text-center`}>
              You have been invited by {invite.from.email} to join{" "}
              {invite.organisation.name}
            </h1>
            {error && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mx={"auto"}>{error}</AlertTitle>
              </Alert>
            )}
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" value={invite.to} disabled />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={"#ABC502"}
                  color={"white"}
                  // _hover={{
                  //   bg: "blue.500",
                  // }}
                  mt={6}
                  onClick={signup}
                >
                  Set password
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }
}
