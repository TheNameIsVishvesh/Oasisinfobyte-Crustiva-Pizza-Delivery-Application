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
          primary: '#FF7A18',      // Premium orange
          secondary: '#FFB347',    // Warm secondary
          dark: '#0F0B0A',         // Background
          surface: '#16100D',      // Surface
          card: '#1E1512',         // Card
          highlight: '#FFD27F',    // Highlight
          light: '#FFFFFF',        // Text white
          muted: '#B8B8B8',        // Muted
          
          // Alias mappings to preserve compatibility with existing classes
          espresso: '#16100D',     // Maps to Surface
          charcoal: '#1E1512',     // Maps to Card
          gold: '#FFD27F',         // Maps to Highlight
          gray: '#B8B8B8',         // Maps to Muted
          subtle: '#8C8C8C',       
          basil: '#35C26B',        // Basil green
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
