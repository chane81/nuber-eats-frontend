# 개발 이슈

## react-helmet warning 이슈

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

## route 이동시(history.push()) waining 이슈

- graphql 의 mutation 비동기 호출과 함께 route 이동(history.push('/)) 사용시 아래와 같은 warning 이 발생한다.
- 컴포넌트가 언마운트가 되었기 때문에 더이상 상태값 업데이트를 할 수 없기 때문인데
- 아래와 같이 useEffect의 clean up 을 사용하여 warning 을 제거 할 수 있다.

- warning 메시지

  ```text
  index.js:1 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    at ConfirmEmail (http://localhost:3000/static/js/main.chunk.js:2224:95)
    at Route (http://localhost:3000/static/js/vendors~main.chunk.js:78656:29)
  ```

- 해결

  ```javascript
  const [setIsUnmounted] = useState(false);

  useEffect(() => {
    const code = urlQuery.get('code');

    (async () => {
      await verifyEmail({
        variables: {
          input: {
            code,
          },
        },
      });
    })();

    // 아래 부분에서 clean up
    return () => setIsUnmounted(true);
  }, []);
  ```