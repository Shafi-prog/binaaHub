/** @type {import('tailwindcss').Config} */
module.exports = {
<<<<<<< HEAD
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        tajawal: ["Tajawal", "Arial Unicode MS", "Tahoma", "sans-serif"]
      }
    }
  },
  plugins: [
    require('tailwindcss-animate')
  ]
=======
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {},
  },
  plugins: [],
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
};
