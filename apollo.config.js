module.exports = {
  client: {
    // tsx 가 확장자인 파일에서 query 를 검색
    includes: ['./src/**/*.tsx'],
    // tag 명
    tagName: 'gql',
    // graphql backend setting
    service: {
      name: 'nuber-eats-backend',
      url: 'http://localhost:4000/graphql',
    },
  },
};
