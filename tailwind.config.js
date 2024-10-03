/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        draw: {
          '0%': { strokeDasharray: '0 1500' },
          '100%': { strokeDasharray: '1500 1500' }
        }
      },
      animation: {
        draw: 'draw 3s linear forwards'
      }
    },
  },
  plugins: [],
};
