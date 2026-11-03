/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7c3aed",
        secondary: "#22d3ee",
        dark: "#0f172a",
        panel: "#111827",
        soft: "#e2e8f0",
      },
      boxShadow: {
        glow: "0 0 30px rgba(124,58,237,0.3)",
      },
    },
  },
  plugins: [],
};
