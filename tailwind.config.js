/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins"],

        libre: ["Libre Baskerville", "serif"],
      },
        screens: {
        'xs': '400px',
      },
      width: {
        '1/7': '14.2857143%', // custom width for 1/7
      },
      
    },
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};
