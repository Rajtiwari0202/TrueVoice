/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cadmium: {
          500: '#FF5500',
          600: '#E64A00',
        },
        tungsten: {
          500: '#FFD000',
        },
        radar: {
          500: '#00E599',
        },
        alarm: {
          500: '#FF3B30',
        }
      }
    },
  },
  plugins: [],
}
