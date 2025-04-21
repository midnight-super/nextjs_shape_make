import React, { ReactNode, useState, Suspense } from "react";
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
import SimpleBar from "simplebar-react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";

import {
  FaTachometerAlt,
  FaTasks,
  FaAddressCard,
  FaPoundSign,
  FaWrench,
  FaCalendar,
  FaFileInvoice,
  FaEnvelope,
  FaRegSun,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MenuItem } from "./Menu";
// import {} from 'react-icons/fa6'

import { IconType } from "react-icons";
import { ReactText } from "react";

import Link from "next/link";
import Navbar from "../Navbar";
import Image from "next/image";
import TopBar from "./TopBar";
import Preloader from "../Preloader";

const LinkItems = [
  { name: "Dashboard", icon: FaTachometerAlt, href: "/dashboard" },
  { name: "Tasks", icon: FaTasks, href: "/tasks" },
  { name: "Opportunities", icon: FaAddressCard, href: "/opportunities/trade" },

  { name: "Quotes", icon: FaPoundSign, href: "/quotes" },
  { name: "Jobs", icon: FaWrench, href: "/jobs" },
  { name: "Calendar", icon: FaCalendar, href: "/calendar" },
  { name: "Invoices", icon: FaFileInvoice, href: "/invoices" },
  // { name: "Reporting", icon: FiSettings, href: "reporting" },
  { name: "Emails", icon: FaEnvelope, href: "/emails" },
  { name: "Settings", icon: FaRegSun, href: "/settings" },
  //
  // { name: "Settings", icon: FiSettings, href: "settings" },
  // { name: "Settings", icon: FiSettings, href: "settings" },
  // { name: "Settings", icon: FiSettings, href: "settings" },
  // { name: "Settings", icon: FiSettings, href: "settings" },
  // { name: "Settings", icon: FiSettings, href: "settings" },
  // { name: "Settings", icon: FiSettings, href: "settings" },
];
const loading = () => <div />;
export default function Dashboard({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="flex wrapper">
      <SidebarContent />
      <div className="page-content">
        <Suspense fallback={loading()}>
          <TopBar />
        </Suspense>
        <main className="flex-grow p-6  bg-white shadow-2xl transition-all dark:bg-slate-800">
          <Suspense fallback={<Preloader />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <div className="app-menu">
      <Link href="/" className="logo-box">
        {/* XZIST */}
        <div className="logo-right">
          <img
            src={"xzistLogo.svg"}
            className="logo-lg h-6"
            alt="XZist"
            style={{ width: "120px", height: "120px" }}
          />
        </div>
      </Link>
      <SimpleBar className="srcollbar" id="leftside-menu-container">
        <ul className="menu" id="main-side-menu">
          {(LinkItems || []).map((item, idx) => {
            return (
              <React.Fragment key={idx}>
                <MenuItem item={item} linkClassName={`menu-link`} />
              </React.Fragment>
            );
          })}
        </ul>
      </SimpleBar>
    </div>
  );
};

const NavItem = ({ icon, children, href, ...rest }) => {
  const [hidden, setHidden] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div
      onMouseOver={() => setHidden(false)}
      onMouseOut={() => setHidden(true)}
    >
      {href !== "opportunities/trade" && (
        <Link href={`/${href}`}>
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
                  color={"gray.600"}
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
      )}

      {href == "opportunities/trade" && (
        <Text
          //   href={href}
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          // bg={"red"}
          onClick={() => setShowDropdown(!showDropdown)}
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
                color={"gray.600"}
                fontSize="16"
                _groupHover={{
                  color: "white",
                }}
                as={icon}
              />
            )}
            <span>{children}</span>
          </Flex>
        </Text>
      )}

      {href == "opportunities/trade" && showDropdown && (
        <Flex
          // display={hidden ? "none" : ""}
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
