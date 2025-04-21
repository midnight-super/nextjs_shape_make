import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

import Link from "next/link";
import client from "../feathers";

import {
  Button,
  Menu,
  MenuButton,
  Avatar,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { GrNotification } from "react-icons/gr";
import { useAtom } from "jotai";
import { notificationsAtom } from "@/atoms/notificationsAtom";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  // const [notifications, setNotifications] = useState([]);
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const signOut = async () => {
    try {
      await client.logout();
      setUser(null);
      router.push("/");
      console.log("logged out");
    } catch (error) {
      console.log("error during logging out");
      console.log(error);
    }
  };

  useEffect(() => {
    async function getNotifications() {
      try {
        console.log("getting notifications");

        let res = await client.service("notifications").find();
        let allNotifications = res.data;
        setNotifications(allNotifications.filter((n) => n.to._id === user._id));
      } catch (e) {
        console.log(e);
      }
    }

    if (user) getNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    client.service("notifications").on("created", (n) => {
      if (n.to._id === user._id) {
        setNotifications((oldNotifications) => {
          const newNotifications = [...oldNotifications, n];
          const fixedNotifications = [...new Set(newNotifications)];
          return fixedNotifications;
        });
        // setNotifications((oldNotifications) => [...oldNotifications, n]);
      }
    });
  }, [user]);

  const goToNotifications = async () => {
    router.push("/dashboard?notifications=true");
  };

  const goToNotification = async (notification) => {
    let updatedNotification = await client
      .service("notifications")
      .patch(notification._id, {
        read: true,
      });

    let updatedNotifications = notifications.map((n) => {
      if (n._id === notification._id) return updatedNotification;
      return n;
    });

    setNotifications(updatedNotifications);
    router.push(notification.link);
  };

  return (
    <div className="p-4 px-12 shadow-md flex items-center justify-between bg-white">
      <h1 className="font-bold text-2xl">
        {/* <Link href="/">XZIST</Link> */}
      </h1>
      <ul className="flex items-center gap-4">
        {!user && (
          <>
            <li className="">
              <Link href="/signin">Sign In</Link>
            </li>
            <li className="">
              <Link href="/signup">Sign Up</Link>
            </li>
          </>
        )}
        {user && (
          <>
            {/* <div
              className="relative flex items-center gap-1 cursor-pointer"
              onClick={goToNotifications}
            >
              <GrNotification className="" size={25} />
              {notifications.filter((n) => !n.read).length > 0 && (
                <div className="px-2 rounded-full bg-red-500 text-white">
                  {notifications.filter((n) => !n.read).length}
                </div>
              )}
            </div> */}

            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <div className="flex items-center gap-2">
                  <GrNotification className="" size={25} />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <div className="px-2 rounded-full bg-red-500 text-white">
                      {notifications.filter((n) => !n.read).length}
                    </div>
                  )}
                </div>
              </MenuButton>
              <MenuList shadow={"lg"}>
                {notifications &&
                  notifications.map((n) => {
                    // if (n.read) return null;

                    const read = n.read;

                    return (
                      <MenuItem onClick={() => goToNotification(n)}>
                        <div className="flex items-center gap-2">
                          {read ? null : (
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          )}
                          {n.text}
                        </div>
                      </MenuItem>
                    );
                  })}
              </MenuList>
            </Menu>

            <li>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"md"}
                    // name={"Rakib Khan"}
                    name={user.email}
                    bg={"#ABC502"}
                    // src={
                    //   "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                    // }
                  />
                </MenuButton>
                <MenuList shadow={"lg"}>
                  {!user.isSuspended && (
                    <>
                      <Link href={"profile"}>
                        <MenuItem>
                          <div className="">Profile</div>
                        </MenuItem>
                      </Link>
                      <Link href={"account"}>
                        <MenuItem>
                          <div className="">Account</div>
                        </MenuItem>
                      </Link>
                      <Link href={"settings"}>
                        <MenuItem>
                          <div className="">Settings</div>
                        </MenuItem>
                      </Link>
                    </>
                  )}
                  <MenuItem onClick={signOut}>
                    <div className="">Sign Out</div>
                  </MenuItem>
                  {/* <MenuItem>Link 2</MenuItem> */}
                  {/* <MenuItem>Link 3</MenuItem> */}
                </MenuList>
              </Menu>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
