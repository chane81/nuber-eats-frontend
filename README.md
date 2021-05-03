# Nuber Eats Frontend project

## 스택

- Typescript
- React.js
- Graphql
- Tailwindcss

## 셋업 및 프로젝트 create

- create

  - npx create-react-app ./ --template=typescript

- module setup

  - yarn add tailwindcss postcss autoprefixer
  - npx tailwindcss init

    - tailwind.config.js 자동 생성

    ```js
    module.exports = {
      purge: [],
      darkMode: false, // or 'media' or 'class'
      theme: {
        extend: {}
      },
      variants: {
        extend: {}
      },
      plugins: []
    };
    ```

  - yarn add @apollo/client graphql

- vs-code extends

  - Tailwind CSS IntelliSense (Brad Cornes) 설치

- config 파일 생성 및 setup

  - postcss.config.js 생성

  ```js
  // postcss.config.js
  module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  };
  ```

## Tailwindcss

- 참고 URL
  <https://tailwindcss.com>
  <https://tailwindcss.com/docs>

  - install 참고
    <https://tailwindcss.com/docs/installation>

- node.js 버전 12이상에서 작동을 제대로 함

## PostCSS

- <https://github.com/chane81/nuber-eats-frontend/blob/main/PostCSS.md>
