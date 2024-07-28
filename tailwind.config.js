/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'myBg': 'linear-gradient(to bottom right, #8A70E0, #1EAE98)',
      },
    },
  },
  plugins: [],
}