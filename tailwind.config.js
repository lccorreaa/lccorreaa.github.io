/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#05070c", paper: "#eaf0fa", muted: "#8996ad", panel: "#0b101a", accent: "#6f9cff" },
    },
  },
  plugins: [],
};
