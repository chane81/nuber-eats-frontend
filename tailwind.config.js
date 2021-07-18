const colors = require('tailwindcss/colors');

module.exports = {
  // NODE_ENV=production 모드에서
  // tsx 파일에서 쓰인 클래스만 build
  purge: ['./src/**/*.tsx'],
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
