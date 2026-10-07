/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#050507',
        'bg-darker': '#08080d',
        'primary': '#00f0ff',
        'secondary': '#b000ff',
        'accent': '#ff00ff',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(180deg, rgba(5,5,7,0.2) 0%, rgba(5,5,7,0.9) 100%)',
      }
    },
  },
  plugins: [],
}
