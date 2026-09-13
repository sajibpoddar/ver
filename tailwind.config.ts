import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sign: {
          green: "#16342A",
          greendark: "#0E251E",
          white: "#F4F6F0",
          amber: "#E3A23C",
          asphalt: "#1A1A1A",
          sage: "#7A9A82",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
export default config;
