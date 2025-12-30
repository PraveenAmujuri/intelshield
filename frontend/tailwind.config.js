/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'shield-dark': '#0f0f23',
        'shield-primary': '#1e3a8a', 
        'shield-glow': '#3b82f6',
      }
    },
  },
  plugins: [],
}
