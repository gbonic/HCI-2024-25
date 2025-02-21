/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        italianno: ['Roboto'],
        scintilla: ['Scintilla', 'sans-serif'],
      },
    },
  },
  images: {
    domains: ['img.spoonacular.com'], // Dodajte domenu s koje želite učitavati slike
  },
  plugins: [],
}
