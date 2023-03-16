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
        'lightorange': '#E9C46A',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
