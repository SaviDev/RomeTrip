/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sun-gold': '#FFD700',
        'sun-orange': '#FF8C00',
        'deep-blue': '#003366',
      }
    },
  },
  plugins: [],
}
