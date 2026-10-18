/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas, #08090C)',
        background: 'var(--canvas, #08090C)',
        onyx: '#08090C',
        surface: {
          1: 'var(--surface-1, #101319)',
          2: 'var(--surface-2, #181D26)',
          3: 'var(--surface-3, #212733)',
          DEFAULT: 'var(--surface-1, #101319)',
          card: 'var(--surface-1, #101319)',
          cardBorder: 'var(--border-subtle, #252B37)',
          muted: 'var(--text-muted, #94A3B8)',
        },
        hairline: 'var(--border-hairline, rgba(255, 255, 255, 0.08))',
        border: {
          hairline: 'var(--border-hairline, rgba(255, 255, 255, 0.08))',
          DEFAULT: 'var(--border-subtle, #252B37)',
          gold: 'var(--border-gold, rgba(212, 175, 55, 0.28))',
          subtle: 'var(--border-subtle, #252B37)',
        },
        paper: {
          DEFAULT: 'var(--surface-1, #101319)',
          elevated: 'var(--surface-2, #181D26)',
          border: 'var(--border-subtle, #252B37)',
        },
        themeText: {
          primary: 'var(--text-primary, #F8FAFC)',
          secondary: 'var(--text-secondary, #CBD5E1)',
          muted: 'var(--text-muted, #94A3B8)',
        },
        gold: {
          100: '#FDF8EC',
          200: '#F7E7BA',
          300: '#F3E5AB',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#B8860B',
          700: '#8C6710',
          800: '#5F460B',
          DEFAULT: '#D4AF37',
        },
        brand: {
          DEFAULT: '#FF5C1F',
          orange: '#FF5C1F',
          amber: '#F59E0B',
          flame: '#FF5C1F',
        },
        verdict: {
          approved: '#10B981',
          approvedGlow: 'rgba(16, 185, 129, 0.12)',
          godtier: '#10B981',
          worthit: '#3B82F6',
          skip: '#EF4444',
          skipTint: 'rgba(239, 68, 68, 0.12)',
          skipBg: '#2D1418',
          godtierBg: '#0D281E',
          worthitBg: '#0F253E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
        'luxury': '0.18em',
        'widest': '0.1em',
        'wide': '0.025em',
      },
      boxShadow: {
        'glow-green': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'glow-orange': '0 0 25px -4px rgba(255, 87, 34, 0.4)',
        'glow-gold': '0 0 25px -4px rgba(212, 175, 55, 0.45)',
        'card-elevated': 'var(--card-shadow, 0 12px 32px -8px rgba(0, 0, 0, 0.65))',
        'card-elite': 'var(--card-shadow)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
