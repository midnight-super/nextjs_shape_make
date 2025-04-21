import React, { ReactNode, useState } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";

import Link from "next/link";
import Navbar from "../Navbar";
import Image from "next/image";

const LinkItems = [
  //   { name: "Dashboard", icon: FiHome, href: "dashboard" },
  { name: "Staff", icon: FiHome, href: "staff" },
  { name: "Customers", icon: FiHome, href: "customers" },
  { name: "Support", icon: FiTrendingUp, href: "support" },
  //   { name: "Settings", icon: FiSettings, href: "settings" },
];

export default function SuperAdminLayout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      minH="100vh"
      // bg={useColorModeValue("gray.50", "gray.900")}
      bg={useColorModeValue("white", "gray.900")}
      // bg={"transparent"}
      // just to see
      // border={"1px solid black"}
      display={"flex"}
      maxW={"screen"}
      zIndex={"-20"}
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />

      <Box
        // ml={{ base: 0, md: 60 }}
        pl={{ base: 0, md: 60 }}
        // p="4"
        // bg={"green"}
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        maxW={"full"}
        bg={"transparent"}
      >
        <div className="flex-1 p-4 relative flex flex-col">
          <div className="absolute top-0 left-0 bg-[#666666] h-[200px] w-full z-[10]"></div>
          <div className="z-[100]  flex flex-col relative gap-4 flex-1">
            <Navbar />
            <div className="bg-white flex-1 flex flex-col">{children}</div>
          </div>
        </div>
        {/* <div className="h-screen bg-red-500"></div>
        <div className="h-screen bg-blue-500"></div> */}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      pt={5}
      {...rest}
      overflowY={"auto"}
    >
      {/* <Flex h="20" alignItems="center" mx="8" justifyContent="space-between"> */}
      {/* <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text> */}
      <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />

      <div className="w-full flex justify-center my-5">
        <Link className="text-3xl font-bold" href="/">
          {/* XZIST */}
          <img src={"xzistLogo.svg"} width={150} height={100} alt={"XZIST"} />
        </Link>
      </div>

      {/* </Flex> */}
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.href}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, href, ...rest }) => {
  const [hidden, setHidden] = useState(true);

  return (
    <div
      onMouseOver={() => setHidden(false)}
      onMouseOut={() => setHidden(true)}
    >
      <Link href={`/admin/${href}`}>
        <Text
          //   href={href}
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          // bg={"red"}
        >
          <Flex
            // bg={"green"}
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
              // bg: "blue.500",
              bg: "#ABC502",
              color: "white",
            }}
            {...rest}
          >
            {icon && (
              <Icon
                mr="4"
                fontSize="16"
                _groupHover={{
                  color: "white",
                }}
                as={icon}
              />
            )}
            {children}
          </Flex>
        </Text>
      </Link>

      {href == "opportunities/trade" && (
        <Flex
          display={hidden ? "none" : ""}
          // bg={"yellow"}
          flexDir={"column"}
          // gap={2}
          // align="center"
          // p="2"
          ml={20}
          // borderRadius="lg"
          cursor="pointer"
          {...rest}
        >
          <Box
            _hover={{
              bg: "#ABC502",
              color: "white",
            }}
            w={"fit-content"}
            // textAlign="center"
            p={1}
            borderRadius={"lg"}
            // mb={2}
            // bg={"green"}
          >
            <Link href={`/opportunities/trade`}>Trade</Link>
          </Box>
          <Box
            _hover={{
              bg: "#ABC502",
              color: "white",
            }}
            borderRadius={"lg"}
            p={1}
            w={"fit-content"}
            // textAlign="center"
            // bg={"blue"}
          >
            <Link href={`/opportunities/individual`}>Individual</Link>
          </Box>
        </Flex>
      )}
    </div>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};
