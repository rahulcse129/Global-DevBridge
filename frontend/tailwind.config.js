/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#161413',
        surface: '#F3F2EE',
        surfaceDark: '#302E2D',
        primary: '#D5C3F5',
        secondary: '#D5C3F5',
        textMain: '#FFFFFF',
        textDark: '#161413',
        textMuted: '#AFAEA9',
        border: '#302E2D'
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
