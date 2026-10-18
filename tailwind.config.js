/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F4EC',
        card: '#FFFDF8',
        espresso: '#1E1712',
        muted: '#7A6F62',
        gold: '#A98443',
        'gold-light': '#D8BC7E',
        'god-tier': '#1F6B52',
        oxblood: '#8C2F2B',
        hairline: 'rgba(30, 23, 18, 0.12)',
        'hairline-light': 'rgba(30, 23, 18, 0.06)',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-manrope)', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        overline: '0.18em',
        luxury: '0.15em',
        tight: '-0.02em',
      },
      borderRadius: {
        arch: '999px 999px 22px 22px',
        'arch-inner': '999px 999px 16px 16px',
        'arch-thumb': '999px 999px 12px 12px',
        'arch-thumb-inner': '999px 999px 8px 8px',
      },
      boxShadow: {
        arch: '0 12px 30px -10px rgba(30, 23, 18, 0.08)',
        card: '0 8px 24px -6px rgba(30, 23, 18, 0.06)',
        sheet: '0 -16px 40px -12px rgba(30, 23, 18, 0.18)',
        subtle: '0 2px 8px rgba(30, 23, 18, 0.04)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
