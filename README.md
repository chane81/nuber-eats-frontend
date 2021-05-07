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
  - yarn add react-hook-form

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

## React-hook-form

- <https://react-hook-form.com/get-started>
- <https://react-hook-form.com/kr/get-started/>

## Module Declare

- 설치한 모듈이 @types 를 지원하지 않을 경우 아래와 같은 방법으로 해결할 수 있다.
- 1번째 방법 > 아래 처럼 `declare module '모듈명'`을 입력해 타입 에러가 나지 않게 할 수 있다.

  - react-app-env.d.ts

  ```js
  /// <reference types="react-scripts" />

  declare module 'react-router-dom';
  ```

- 2번째 방법 > 특정 모듈에 대해 타입 정의가 없을 경우 아래 github 주소의 DefinitelyTyped 으로 가보면 많은 라이브러리에 대한 type 정의를 해놓은것이 있다.

  - Definitely Types GitHub 주소
    <https://github.com/DefinitelyTyped/DefinitelyTyped>

  - 타입정의된 파일을 가져와서 프로젝트폴더의 "/types/모듈명/index.d.ts" 에 해당 모듈의 타입파일을 복사해 넣고,
  - tsconfig.json 의 "typeRoot" 속성 값에 아래와 같이 해당 타입 경로를 설정해 준다.

    ```json
    {
      "compilerOptions": {
        ...
        "typeRoots": ["node_modules/@types", "src/types"]
      },
    }
    ```

  - 커스텀 타입 정의 파일들이 있는 폴더에서 해당 모듈의 폴더를 생성한다.

    - src/types/bcrypt/index.d.ts

  - 타입정의 내용을 복붙하여 넣고 아래와 같이 `declare module "모듈명"`으로 감싸 준다.

    ```js
    declare module 'bcrypt' {
      export declare function genSaltSync(rounds?: number, minor?: string): string;
      ...
    }
    ```
