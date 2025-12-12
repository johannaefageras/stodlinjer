/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{njk,md,html,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Recursive SC"',
          '"Recursive SL"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        display: ['"Recursive SL"', '"Recursive SC"', 'system-ui', 'sans-serif'],
        body: ['"Recursive SC"', '"Recursive SL"', 'system-ui', 'sans-serif'],
        mono: ['"Recursive MC"', 'ui-monospace', '"SFMono-Regular"', 'Menlo', 'monospace']
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900'
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
        normal: '-0.01',
        wide: '0.01em',
        wider: '0.02em'
      },
      lineHeight: {
        tight: '1.25',
        snug: '1.38',
        normal: '1.52',
        relaxed: '1.56',
        loose: '1.7'
      },
      boxShadow: {
        // Softer purple glow for hotline cards
        glow: '0 12px 30px rgba(79,70,229,0.16)'
      }
    }
  },
  plugins: []
};
