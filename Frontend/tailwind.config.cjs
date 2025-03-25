/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: true, // This ensures Tailwind classes take precedence over MUI styles
  theme: {
    extend: {},
  },
  plugins: [],
} 