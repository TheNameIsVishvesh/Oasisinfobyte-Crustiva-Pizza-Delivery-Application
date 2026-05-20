/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pizza: {
          primary: '#ff5a36',      // Warm orange-red
          secondary: '#d32f2f',    // Premium red
          dark: '#1e1b18',         // Elegant warm dark background
          light: '#fffaf5',        // Soft cream white
          accent: '#ffb300',       // Golden yellow for cheese/highlight
          charcoal: '#2c2520',     // Dark warm gray
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 30px rgb(0, 0, 0, 0.12)',
        'premium-hover': '0 20px 40px rgb(0, 0, 0, 0.18)',
        'glow': '0 0 20px rgba(255, 90, 54, 0.25)',
      },
    },
  },
  plugins: [],
}
