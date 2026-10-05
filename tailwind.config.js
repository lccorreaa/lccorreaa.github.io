/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#080d17", paper: "#eaf0fa", muted: "#8996ad", panel: "#111a2a", accent: "#6f9cff" },
    },
  },
  plugins: [],
};
