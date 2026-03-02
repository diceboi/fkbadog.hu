/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent:        "#d6df27",
        "accent-dark": "#b8c61a",
        cream:         "#f4f4ed",
        "black-dark":  "#101111",
        "black-mid":   "#1d1d1e",
        "gray-dark":   "#27282b",
        "gray-mid":    "#37373a",
        "bg-dark":     "#0a0a0a",
        "bg-mid":      "#1a1a1a",
        "bg-light":    "#f5f4ef",
      },
    },
  },
  plugins: [],
};
