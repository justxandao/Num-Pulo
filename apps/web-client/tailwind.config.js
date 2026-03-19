/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed', // orange-50
          100: '#ffedd5',
          500: '#f97316', // orange-500
          600: '#ea580c', // orange-600
          900: '#7c2d12',
        },
        secondary: {
          500: '#10b981', // green
        }
      }
    },
  },
  plugins: [],
}
