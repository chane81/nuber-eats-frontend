module.exports = {
  client: {
    // tsx | ts 인 확장자인 파일에서 query 를 검색
    includes: ['./src/**/*.{ts,tsx}'],
    excludes: [
      './**/*.spec.ts',
      './node_modules',
      './src/__generated__',
      './cypress',
      './coverage',
      './public',
    ],
    // tag 명
    tagName: 'gql',
    // graphql backend setting
    service: {
      name: 'nuber-eats-backend',
      url: 'http://localhost:4000/graphql',
    },
  },
};
