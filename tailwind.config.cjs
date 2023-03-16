/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tealgreen': '#2A9D8F',
        'darkblue': '#264653',
      }
    },
  },
  plugins: [],
}
