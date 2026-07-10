import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090909",
        card: "#151515",
        border: "#2B2B2B",
        accent: "#DC2626",
      },
    },
  },
  plugins: [],
} satisfies Config;
