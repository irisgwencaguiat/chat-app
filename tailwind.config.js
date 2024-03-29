/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'messenger-timestamp-color': '#333536',
      },
    },
    fontFamily: {
      Roboto: ['Roboto, san-serif'],
    },
    container: {
      padding: '2rem',
      center: true,
    },
  },
  plugins: [],
};
