/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      base: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#3073F1",
        secondary: "#68625D",
        success: "#1CB454",
        warning: "#E2A907",
        info: "#0895D8",
        danger: "#E63535",
        light: "#eef2f7",
        dark: "#313a46",
      },
      keyframes: {
        load: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
    },
  },
  plugins: [
    require("@frostui/tailwindcss/plugin"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
