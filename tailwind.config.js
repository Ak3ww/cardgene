/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'irys': '#67FFD4',
      },
      fontFamily: {
        'irys1': ['Irys1', 'sans-serif'],
        'irys2': ['Irys2', 'sans-serif'],
        'irysitalic': ['IrysItalic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
