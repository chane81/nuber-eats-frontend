import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { UserRole } from '../__generated__/globalTypes';
import { Restaurants } from '../pages/client/restaurant';
import { NotFound } from '../pages/404';
import { LOCALSTORAGE_TOKEN } from '../constant';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { ConfirmEmail } from '../pages/user/confirm-email';

const ClientRoutes = () => [
  <Route key='/' path='/' exact>
    <Restaurants />
  </Route>,
  <Route key='/confirm' path='/confirm' exact>
    <ConfirmEmail />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

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
        <Header />
        <Switch>
          {data.me.role === UserRole.Client && ClientRoutes()}
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
      <button onClick={handleClick}>Log Out</button>
    </div>
  );
};
