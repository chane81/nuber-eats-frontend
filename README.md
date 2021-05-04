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
  - yarn add react-router-dom

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

## Graphql

- Localonly Only Fields

  - 로컬 상태관리를 위한 환경 제공
  - <https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/#gatsby-focus-wrapper>
  - query 방식 / reactive variable 방식으로 사용할 수 있다.
  - reactive variable 방식이 훨씬 간단하다.

  - apollo client 세팅

  ```javascript
  import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

  export const isLoggedInVar = makeVar(false);

  export const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            isLoggedIn: {
              read() {
                return isLoggedInVar();
              }
            }
          }
        }
      }
    })
  });
  ```

  - query 방식

    ```javascript
    import { useQuery } from '@apollo/client';
    import gql from 'graphql-tag';

    const IS_LOGGED_IN = gql`
      query isLoggedIn {
        isLoggedIn @client
      }
    `;

    function App() {
      const {
        data: { isLoggedIn }
      } = useQuery(IS_LOGGED_IN);

      return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
    }
    ```

  - reactive variable 방식

  ```javascript
  // App component
  import { useReactiveVar } from '@apollo/client';
  import { isLoggedInVar } from './apollo';

  function App() {
    const isLoggedIn = useReactiveVar(isLoggedInVar);

    return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
  }

  // LoggedOutRouter component
  import { isLoggedInVar } from '../apollo';

  export const LoggedOutRouter = () => {
    const handleClick = () => {
      isLoggedInVar(true);
    };

    return (
      <div>
        <h1>Logged Out</h1>
        <button onClick={handleClick}>Click to login</button>
      </div>
    );
  };
  ```
