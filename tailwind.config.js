/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  future: {
    // Only apply `hover:` styles on devices that can actually hover,
    // so the image swap doesn't get "stuck" after a tap on touch screens.
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'Arial Narrow', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        ink: '#1d1d1d',
        link: '#5b4a22',
        save: '#4a6b4e',
        track: '#d8d4d4',
      },
    },
  },
  plugins: [],
};
