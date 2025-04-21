// TODO: Add error handling for wrong sign up

import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

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

import client from "../feathers";

export default function SignUp() {
  const { user, userLoading, setUser, userExistsRedirect } =
    useContext(AuthContext);

  userExistsRedirect();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const usersService = client.service("users");

  const signup = async () => {
    setError(false);

    try {
      let userDetails = {
        email,
        password,
        paymentSetup: false,
        createdAt: new Date(),
      };

      await client.service("users").create(userDetails);

      let res = await client.authenticate({
        strategy: "local",
        email,
        password,
      });

      setUser(res.user);
    } catch (error) {
      console.log("error signing up");
      console.log(error);
      setError(true);
    }
  };

  if (!user && !userLoading)
    return (
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        //   bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create an Account</Heading>
            {/* <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text> */}
            {error && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mx={"auto"}>Error signing up</AlertTitle>
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
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
                <button
                  type="button"
                  className="btn bg-secondary text-white hover:bg-secondary hover:text-white w-full"
                  onClick={signup}
                >
                  Sign Up
                </button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
}
