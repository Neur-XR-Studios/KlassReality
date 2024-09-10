/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  important: true,

  theme: {
    backdropFilter: {
      none: "none",
      blur: "blur(20px)",
    },
  },
  plugins: [require('tailwindcss-filters')],
};
