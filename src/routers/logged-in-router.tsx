import { useQuery, gql } from '@apollo/client';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { meQuery } from '../__generated__/meQuery';
import { UserRole } from '../__generated__/globalTypes';
import { Restaurants } from '../pages/client/restaurant';
import { NotFound } from '../pages/404';
import { LOCALSTORAGE_TOKEN } from '../constant';

const ClientRoutes = () => [
  <Route key='/' path='/' exact>
    <Restaurants />
  </Route>,
];

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY, {
    fetchPolicy: 'no-cache',
  });

  const handleClick = () => {
    localStorage.setItem(LOCALSTORAGE_TOKEN, '');
    authTokenVar('');
    isLoggedInVar(false);
  };

  if (!data || loading || error) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <span className='font-medium text-xl tracking-wide'>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Router>
        <Switch>
          {data.me.role === UserRole.Client && ClientRoutes()}
          <Redirect from='/potato' to='/' />
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
      <button onClick={handleClick}>Log Out</button>
    </div>
  );
};
