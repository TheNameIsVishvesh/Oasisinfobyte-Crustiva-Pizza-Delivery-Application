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
          primary: '#FF6B35',      // Premium orange
          secondary: '#FF4D4D',    // Tomato red
          dark: '#0F0B0A',         // Deep warm black
          espresso: '#1A120F',     // Rich espresso brown
          charcoal: '#241816',     // Soft charcoal
          gold: '#FFB627',         // Melted cheese gold
          basil: '#35C26B',        // Basil green
          light: '#F8F5F2',        // Soft white
          gray: '#B8ACA3',         // Warm gray
          subtle: '#7A6E67',       // Muted subtle
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(0, 0, 0, 0.5)',
        'premium-hover': '0 25px 50px rgba(0, 0, 0, 0.7)',
        'glow': '0 0 25px rgba(255, 107, 53, 0.35)',
        'gold-glow': '0 0 25px rgba(255, 182, 39, 0.25)',
      },
    },
  },
  plugins: [],
}
