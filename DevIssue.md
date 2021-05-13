# 개발 이슈

## react-helmet

- react-helmet 사용시 아래와 같이 warning 이 발생한다.
- 해당 이슈 링크
  - <https://github.com/nfl/react-helmet/issues/548>

- warning 메시지

  ```text
    index.js:1 Warning: Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

    * Move code with side effects to componentDidMount, and set initial state in the constructor.

    Please update the following components: SideEffect(NullComponent)
  ```

- 해결
  - react-helmet-async 설치
  - index.tsx 에 Helmet Provider 적용

    ```javascript
    import { HelmetProvider } from 'react-helmet-async';

    ReactDOM.render(
      <React.StrictMode>
        <ApolloProvider client={client}>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ApolloProvider>
      </React.StrictMode>,
      document.getElementById('root'),
    );
    ```

  - Helmet 사용하는 컴포넌트에 아래와 같이 적용

    ```javascript
    import { Helmet } from 'react-helmet-async';

    <Helmet>
      <title>Login | Nuber Eats</title>
    </Helmet>
    ```
