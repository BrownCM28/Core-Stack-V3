import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F2EE",
        surface: "#FFFFFF",
        accent: "#3ECF8E",
        "accent-hover": "#34C47E",
        border: {
          DEFAULT: "#000000",
          muted: "#E2DDD8",
          input: "#1E2128",
        },
        text: {
          primary: "#0D0F12",
          muted: "#6B6560",
        },
        badge: {
          new: "#3ECF8E",
          expired: "#EF4444",
          expiring: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      borderWidth: {
        DEFAULT: "1.5px",
        "1.5": "1.5px",
      },
      boxShadow: {
        "accent-sm": "0 0 0 1px #3ECF8E, 0 0 12px rgba(62,207,142,0.15)",
        "accent-md": "0 0 16px rgba(62,207,142,0.25)",
        "accent-input": "0 0 0 3px rgba(62,207,142,0.15)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [typography],
};

export default config;
