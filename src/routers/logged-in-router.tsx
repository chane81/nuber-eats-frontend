import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { UserRole } from '../__generated__/globalTypes';
import { Restaurants } from '../pages/client/restaurants';
import { NotFound } from '../pages/404';
import { LOCALSTORAGE_TOKEN } from '../constant';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';
import { Restaurant } from '../pages/client/restaurant';

const ClientRoutes = () => [
  <Route key={1} path='/' exact>
    <Restaurants />
  </Route>,
  <Route key={2} path='/confirm'>
    <ConfirmEmail />
  </Route>,
  <Route key={3} path='/edit-profile'>
    <EditProfile />
  </Route>,
  <Route key={4} path='/search'>
    <Search />
  </Route>,
  <Route key={5} path='/category/:slug'>
    <Category />
  </Route>,
  <Route key={6} path='/restaurant/:id'>
    <Restaurant />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  const handleLogoutClick = () => {
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
      <button onClick={handleLogoutClick}>Log Out</button>
    </div>
  );
};
