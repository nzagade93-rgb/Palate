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
        background: '#07090C',
        onyx: '#07090C',
        paper: {
          DEFAULT: '#0E1116',
          elevated: '#141720',
          border: 'rgba(255, 255, 255, 0.07)',
        },
        surface: {
          50: '#181C26',
          100: '#12151E',
          200: '#0E1116',
          300: '#07090C',
          card: '#0E1116',
          cardBorder: '#1E2330',
          muted: '#8E95A5',
        },
        brand: {
          orange: '#FF5C1F',
          amber: '#F59E0B',
          flame: '#FF5C1F',
        },
        verdict: {
          godtier: '#10B981',
          worthit: '#3B82F6',
          skip: '#EF4444',
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
