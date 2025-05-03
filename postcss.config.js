// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ البديل الجديد الإجباري لـ Tailwind 4
    autoprefixer: {}
  }
}
