/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#090979",
        secondary: "#1B3FAF",
        accent: "#4D7CFE",
        background: "#F5F7FB",
        surface: "#FFFFFF",
        text: "#1E293B",
      },

      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },

      borderRadius: {
        xl2: "1.3rem",
      },
    },
  },

  plugins: [],
}