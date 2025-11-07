import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Luxuosa Completa - Neutrals (Beges/Marrons)
        white: '#FFFFFF',
        'off-white': '#FAFAF8',
        'beige-lightest': '#F8F6F3',
        'beige-light': '#F5F1E8',
        'beige-medium': '#E0DED9',
        'beige-dark': '#C4B5A0',
        'taupe': '#A1887F',
        'brown-light': '#8D6E63',
        'brown-medium': '#6D4C41',
        'brown-dark': '#4E342E',
        'brown-darkest': '#3E2723',
        'brown-black': '#2C1810',
        
        // Acentos (Dourados)
        'gold-light': '#D4AF37',
        'gold': '#B8860B',
        'gold-dark': '#8B6914',
        'gold-warm': '#C9A961', // Dourado quente natalino
        
        // Cores Natalinas
        'sage': '#8B9D83', // Verde sálvia
        'forest': '#2D5016', // Verde floresta profundo
        'forest-dark': '#234011', // Verde floresta escuro
        'wine': '#6B2C2C', // Vermelho vinho sofisticado
        'wine-dark': '#5A2424', // Vinho escuro
        'snow': '#FFFEF9', // Branco neve
        
        // Aliases para compatibilidade
        background: '#F8F6F3',
        cream: '#FAFAF8',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'], // Títulos elegantes
        body: ['Lato', 'sans-serif'], // Corpo de texto e UI
      },
      letterSpacing: {
        'luxury': '-0.02em',
        'wide-luxury': '0.15em',
      },
      borderRadius: {
        'card': '10px',
      },
      boxShadow: {
        'card': '0 4px 16px rgba(139, 69, 19, 0.08)', // Sombra quente
        'card-hover': '0 8px 24px rgba(139, 69, 19, 0.12)',
        'warm': '0 2px 8px rgba(139, 69, 19, 0.06)',
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
