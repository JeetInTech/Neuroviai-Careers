/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom': {
          lightest: '#250902',  // Dark burgundy
          light: '#38040E',     // Deep wine
          medium: '#640D14',    // Rich red
          dark: '#800E13',      // Dark red
          darkest: '#AD2831',   // Bright red
        }
      }
    },
  },
  plugins: [],
}