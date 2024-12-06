/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./main.js","./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        'very-dark-gray': 'hsl(0, 0%, 17%)',
        'dark-gray': 'hsl(0, 0%, 59%)',
      },
    },
  },
  plugins: [],
}