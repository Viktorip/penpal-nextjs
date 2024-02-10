/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'bounce-x': 'bouncex 1s 8',
        'bounce-x-slow': 'bouncex 1s 8 8s',
        'fade-in': 'fadeIn 2s 1',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        bouncex: {
          '0%, 100%': {
            transform: 'translateX(-25%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateX(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },
        fadeIn: {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
    },
  },
  plugins: [],
}
