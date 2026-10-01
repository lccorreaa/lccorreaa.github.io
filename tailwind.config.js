/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#10110f", paper: "#f1f2ed", muted: "#8e918a", panel: "#171916", acid: "#c6ff56" },
    },
  },
  plugins: [],
};
