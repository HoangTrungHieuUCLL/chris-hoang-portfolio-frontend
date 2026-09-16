import type { Config } from "tailwindcss";

const config: Config = {
  // lib/ is scanned too: the role colour classes live in lib/roles.ts, and
  // leaving it out silently drops them from the build - the tags still render,
  // just with no colour at all.
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        paper: "#ffffff",
        mist: "#f5f5f7",
        line: "#d2d2d7",
        subtle: "#6e6e73",
        // One hue per lane in lib/roles.ts, so a project card's colour says
        // what kind of work it is. Each ships as a pair because the cards are
        // `bg-ink` in both themes: DEFAULT is for paper, `dark` for the cards.
        // Both halves clear 4.5:1 against the ground they sit on.
        role: {
          analyst: { DEFAULT: "#8a5a00", dark: "#e2a84f" },
          engineer: { DEFAULT: "#1a63b8", dark: "#7fb4ee" },
          ai: { DEFAULT: "#5b46c4", dark: "#ae9df2" },
        },
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
