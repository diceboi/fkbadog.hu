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
        accent: "var(--color-accent)",
        cream: "var(--color-cream)",
        "black-dark": "var(--color-black-dark)",
        "black-mid": "var(--color-black-mid)",
        "gray-dark": "var(--color-gray-dark)",
        "gray-mid": "var(--color-gray-mid)",
      },
    },
  },
  plugins: [],
};
