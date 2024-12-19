/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily :{
        myfont1 : ["Ubuntu", "sans-serif"],
        myfont2 : ["Roboto", "sans-serif"],
      }
    },
  },
  plugins: [],
}

