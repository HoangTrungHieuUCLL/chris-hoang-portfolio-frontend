import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        paper: "#ffffff",
        mist: "#f5f5f7",
        line: "#d2d2d7",
        subtle: "#6e6e73",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1120px",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      keyframes: {
        // Starts at opacity 0/scale(0.95), never scale(0) - an element
        // should always have some visible shape (web-animation-design skill).
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        // Same duration/easing on both - the "Paired Elements Rule": things
        // that enter together (a modal and its backdrop) should move as one.
        "fade-in": "fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
