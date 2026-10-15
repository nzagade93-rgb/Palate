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
        canvas: '#07090C',
        background: '#07090C',
        onyx: '#07090C',
        surface: {
          1: '#0E1116',
          2: '#161B22',
          DEFAULT: '#0E1116',
          card: '#0E1116',
          cardBorder: '#262C36',
          muted: '#8E95A5',
        },
        hairline: '#262C36',
        border: {
          hairline: '#262C36',
          DEFAULT: '#262C36',
        },
        paper: {
          DEFAULT: '#0E1116',
          elevated: '#161B22',
          border: '#262C36',
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
        'card-elevated': '0 12px 32px -8px rgba(0, 0, 0, 0.65)',
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
