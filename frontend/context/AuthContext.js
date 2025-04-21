import { createContext, useState, useEffect } from "react";
import client from "../feathers";
import { useRouter } from "next/router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setUserLoading(true);

      try {
        let res = await client.reAuthenticate();
        setUser(res.user);
        setUserLoading(false);
        // console.log("here is the user found at start up");
        // console.log(res.user);
      } catch (error) {
        // console.log(error);
        // console.log("no user was found at start up");
        setUser(null);
        setUserLoading(false);
      }
    }

    init();
  }, []);

  const userExistsRedirect = () => {
    if (!userLoading && user) router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, userLoading, userExistsRedirect }}
    >
      {children}
    </AuthContext.Provider>
  );
};
