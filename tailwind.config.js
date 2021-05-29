const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
      width: {
        '112': '28rem/* 448px */',
        '128': '32rem/* 512px */',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
