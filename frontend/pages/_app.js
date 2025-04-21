import "../assets/scss/app.scss";
import "../assets/scss/icons.scss";
import { useEffect } from "react";

import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

import { StepsTheme as Steps } from "chakra-ui-steps";
import Layout from "../components/Layout";
import { Provider } from "jotai";
import { changeHTMLAttribute } from "@/utils/layout";
import { ThemeProvider } from "@/context/ThemeContext";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    changeHTMLAttribute("data-mode", "light");
  }, []);

  useEffect(() => {
    changeHTMLAttribute("dir", "ltr");
  }, []);

  useEffect(() => {
    changeHTMLAttribute("data-layout-width", "default");
  }, []);

  useEffect(() => {
    changeHTMLAttribute("data-topbar-color", "light");
  }, []);

  useEffect(() => {
    changeHTMLAttribute("data-menu-color", "light");
  }, []);

  useEffect(() => {
    changeHTMLAttribute("data-sidenav-view", "default");
  }, []);

  useEffect(() => {
    changeHTMLAttribute("data-layout-position", "fixed");
  }, []);
  return (
    <ThemeProvider>
      <AuthProvider>
        <Provider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}
