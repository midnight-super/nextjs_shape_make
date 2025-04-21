import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Dashboard from "./SignedIn/Dashboard";
import SetUpPayments from "./SetUpPayments";
import { useAtom } from "jotai";
import { refreshAtom } from "@/atoms/refreshAtom";
import { useRouter } from "next/router";
import SuperAdminLayout from "./SignedIn/SuperAdminLayout";
import SuspendedScreen from "./SuspendedScreen";

const Layout = ({ children }) => {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();
  const [refreshNeeded, setRefreshNeeded] = useAtom(refreshAtom);

  useEffect(() => {
    if (refreshNeeded) {
      setRefreshNeeded(false);
      router.reload();
    }
  }, []);

  return (
    <>
      {/* No user */}
      {!userLoading && !user && (
        <div className="min-h-screen max-h-screen overflow-hidden flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      )}

      {/* User with payments set up  */}
      {!userLoading && user && user.paymentSetup && !user.isSuspended && (
        <div className="min-h-screen max-h-screen overflow-hidden flex flex-col">
          {/* <Navbar /> */}
          {/* <button className="btn btn-primary" onClick={() => console.log(user)}>
            Show user
          </button> */}
          <div className="flex-1 overflow-y-auto">
            <Dashboard>{children}</Dashboard>
          </div>
        </div>
      )}

      {/* User with no payments set up  */}
      {!userLoading && user && !user.paymentSetup && !user.isSuperAdmin && (
        <div className="min-h-screen max-h-screen overflow-hidden flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-y-auto flex flex-col">
            <SetUpPayments />
          </div>
        </div>
      )}

      {/* Suspened Account */}
      {!userLoading && user && user.isSuspended && (
        <div className="min-h-screen max-h-screen overflow-hidden flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-y-auto flex flex-col">
            <SuspendedScreen />
          </div>
        </div>
      )}

      {/* Super admin options */}
      {!userLoading && user && user.isSuperAdmin && (
        <div className="min-h-screen max-h-screen overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <SuperAdminLayout>{children}</SuperAdminLayout>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
