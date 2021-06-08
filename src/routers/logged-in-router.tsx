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
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { AddRestaurant } from '../pages/owner/add-restaurant';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';

interface IRoute {
  path: string;
  component: React.ReactNode;
  exact?: boolean | undefined;
}

const clientRoutes: IRoute[] = [
  {
    path: '/',
    component: <Restaurants />,
    exact: true,
  },
  {
    path: '/search',
    component: <Search />,
  },
  {
    path: '/category/:slug',
    component: <Category />,
  },
  {
    path: '/restaurant/:id',
    component: <Restaurant />,
  },
];

const commonRoutes: IRoute[] = [
  {
    path: '/confirm',
    component: <ConfirmEmail />,
  },
  {
    path: '/edit-profile',
    component: <EditProfile />,
  },
];

const restaurantRoutes: IRoute[] = [
  {
    path: '/',
    component: <MyRestaurants />,
    exact: true,
  },
  {
    path: '/add-restaurant',
    component: <AddRestaurant />,
  },
  {
    path: '/restaurant/:id',
    component: <MyRestaurant />,
    exact: true,
  },
  {
    path: '/restaurant/:id/add-dish',
    component: <AddDish />,
  },
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
          {data.me.role === UserRole.Client &&
            clientRoutes.map((route) => (
              <Route key={route.path} path={route.path} exact={route.exact}>
                {route.component}
              </Route>
            ))}
          {data.me.role === UserRole.Owner &&
            restaurantRoutes.map((route) => (
              <Route key={route.path} path={route.path} exact={route.exact}>
                {route.component}
              </Route>
            ))}

          {commonRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact={route.exact}>
              {route.component}
            </Route>
          ))}
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
      <button onClick={handleLogoutClick}>Log Out</button>
    </div>
  );
};
