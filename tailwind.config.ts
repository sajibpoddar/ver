import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          bluedark: "#1D4ED8",
          bluelight: "#EFF4FF",
          ink: "#111827",
          muted: "#6B7280",
          border: "#E5E7EB",
          bg: "#F7F8FA",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px rgba(16, 24, 40, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
