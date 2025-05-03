/** @type {import('tailwindcss').Config} */
module.exports = {
  // غطّي كل ملفاتك تحت src، بما في ذلك pages وcomponents وapp
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],

  theme: {
    extend: {},
    container: {
      center: true,     // يضيف margin-auto أفقياً
      padding: '1rem',  // 16px حشوة أفقية افتراضية
    },
  },
  plugins: [],
};
