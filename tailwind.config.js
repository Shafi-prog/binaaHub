/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        tajawal: ["Tajawal", "Arial Unicode MS", "Tahoma", "sans-serif"],
        cairo: ["Cairo", "Arial Unicode MS", "Tahoma", "sans-serif"],
      }
    }
  },
  plugins: [
    require('tailwindcss-animate')
  ]
};
