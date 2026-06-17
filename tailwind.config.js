/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        'cream-dark': '#EDE8DC',
        ink: '#0A0A0A',
        charcoal: '#1A1A1A',
        'ink-light': '#2D2D2D',
        smoke: '#6B6B6B',
        mist: '#A8A8A8',
        accent: '#C8A951',
        'accent-light': '#D4BA72',
        'accent-dark': '#0E0B1B',

        saffron: '#0E0B1B',


        'royal-blue': '#1E40AF',
        bollywood: '#C9A227',
        'vintage-red': '#991B1B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-right': 'slideRight 0.4s ease forwards',
        'slide-left': 'slideLeft 0.4s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      aspectRatio: {
        'product': '3 / 4',
      },
      fontSize: {
        'xs': ['10px', { lineHeight: '12px', letterSpacing: '0.08em' }],
        'sm': ['13px', { lineHeight: '16px', letterSpacing: '0.03em' }],
        'base': ['14px', { lineHeight: '20px', letterSpacing: '0.02em' }],
        'lg': ['16px', { lineHeight: '24px', letterSpacing: '0.01em' }],
      },
      boxShadow: {
        'editorial': '0 12px 32px rgba(10, 10, 10, 0.08)',
        'editorial-hover': '0 20px 48px rgba(10, 10, 10, 0.12)',
        'cinematic': 'inset 0 1px 0 rgba(245, 240, 232, 0.1)',
      },
      borderWidth: {
        'hairline': '0.5px',
      },
    },
  },
  plugins: [],
}
