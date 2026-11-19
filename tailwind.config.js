/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#fbeea4',
          DEFAULT: '#d4af37',
          dark: '#b8860b',
        },
      },
    },
  },
  plugins: [],
}
