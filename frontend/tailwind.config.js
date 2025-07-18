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
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        beige: {
          50: '#FAF6EF',
          100: '#F5EFDD',
          200: '#EBE0C4',
          300: '#E0D1AB',
        },
        navy: {
          900: '#001C3F',
          800: '#002850',
          700: '#003566',
        },
        accent: {
          orange: '#fb923c',
          green: '#22c55e',
          blue: '#3b82f6',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
} 