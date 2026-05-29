/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fams-dark': '#001529',
        'fams-card': '#0a2540',
        'fams-blue': '#3B82F6',
      },
    },
  },
  plugins: [],
}