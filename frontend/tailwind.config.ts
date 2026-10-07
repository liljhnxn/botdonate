import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        botchain: {
          50: "#eefbf6",
          100: "#d6f7e8",
          200: "#b0eed3",
          300: "#79dfb8",
          400: "#3ec697",
          500: "#16ab7c",
          600: "#0b8a63",
          700: "#0b6e51",
          800: "#0c5741",
          900: "#0c4837",
          950: "#05281f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
