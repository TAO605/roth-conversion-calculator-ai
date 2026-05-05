import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./tests/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        systemBlue: "#007AFF",
        systemGreen: "#34C759",
        systemRed: "#FF3B30",
        systemOrange: "#FF9500",
      },
      boxShadow: {
        material: "0 18px 60px rgba(0, 0, 0, 0.08)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
