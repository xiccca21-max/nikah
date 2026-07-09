import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F7F3EE",
        secondary: "#EFE8DE",
        paper: "#FFFDF9",
        gold: "#C8A86B",
        ink: "#2E2B28",
        accent: "rgba(255,255,255,0.35)"
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"]
      },
      boxShadow: {
        luxury: "0 34px 90px rgba(46, 43, 40, 0.12)",
        soft: "0 18px 55px rgba(46, 43, 40, 0.08)",
        gold: "0 22px 70px rgba(200, 168, 107, 0.22)"
      },
      letterSpacing: {
        invitation: "0.32em"
      }
    }
  },
  plugins: []
};

export default config;
