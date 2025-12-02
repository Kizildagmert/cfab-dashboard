// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // Bu satır projendeki tüm React dosyalarını taraması için şart!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}