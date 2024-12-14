/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        draw: {
          '0%': { strokeDasharray: '0 1500' },
          '100%': { strokeDasharray: '1500 1500' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
      animation: {
        draw: 'draw 3s linear forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
      }
    },
  },
  plugins: [],
};