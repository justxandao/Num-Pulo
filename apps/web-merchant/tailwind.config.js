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
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316', // Laranja do Num Pulo
          600: '#ea580c',
          900: '#7c2d12',
        },
        merchant: {
          900: '#0f172a', // Slate escuro para Dashboard
          800: '#1e293b',
          700: '#334155',
          100: '#f1f5f9'
        }
      }
    },
  },
  plugins: [],
}
