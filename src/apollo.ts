import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { LOCALSTORAGE_TOKEN } from './constants';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

/**
 * 강의의 소스만으로는 로그인 후 restaurant 페이지로 와서
 * pub/sub 기능이 작동하지 않았다. 페이지를 refresh 해야만
 * 제대로 작동 하였는데, 로그인시 websocket 이 연결시도후
 * x-jwt: '' << 가지고 있지 않은상태에서 세팅되어 있기 때문이다.
 * 이는 서버단(app.module.ts)에서 subscriptions > onConnect 에서 x-jwt 가
 * 없을 경우 websocket.close() 를 수행하게 하고, websocket 을 끊어서
 * reconnect를 하게 하여 해결 하였다.
 */

// pub/sub 을 위한 세팅
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    /**
     * 아래 connectionParams는 함수형태여야 한다.
     * 그래야지 로그인 이후 token 값을 호출시 마다 가져올 수 있다.
     */
    connectionParams() {
      return { 'x-jwt': authTokenVar() || '' };
    },
  },
});

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authTokenVar() || '',
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  ApolloLink.from([authLink, httpLink]),
);

export const client = new ApolloClient({
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
  },
  link: ApolloLink.from([splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
