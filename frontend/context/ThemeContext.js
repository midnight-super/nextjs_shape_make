import React, { createContext, useState } from "react";
import { changeHTMLAttribute } from "@/utils/layout";

const ThemeContext = createContext(undefined);
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    changeHTMLAttribute("data-mode", theme === "light" ? "dark" : "light");
  };
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: handleToggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useTheme };
