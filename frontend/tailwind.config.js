/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        primary: '#ffffff', // Main text color
        secondary: '#94a3b8', // Secondary text color
        accent: '#60a5fa', // Accent text color
      },
    },
  },
  plugins: [],
} 