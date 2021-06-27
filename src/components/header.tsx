import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useHistory } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';
import { useMe } from '../hooks/useMe';
import nuberLogo from '../images/logo.svg';

export const Header: React.FC = () => {
  const { data } = useMe();
  const history = useHistory();

  const handleLogout = () => {
    localStorage.setItem(LOCALSTORAGE_TOKEN, '');
    authTokenVar('');
    isLoggedInVar(false);
    history.replace('/');
  };

  return (
    <>
      {!data?.me.verified && (
        <div className='bg-red-500 p-3 text-center text-base text-white'>
          <span>Prease verify your email.</span>
        </div>
      )}
      <header className='py-4 mb-2 fixed top-0 bg-white w-full z-10'>
        <div className='container mx-auto flex justify-between items-center'>
          <Link title='home' to='/'>
            <img src={nuberLogo} className='w-36' alt='logo' />
          </Link>
          <div className='flex w-52 justify-between'>
            <div className='text-xs flex items-center'>
              <Link className='mr-2' title='edit-profile' to='/edit-profile'>
                <FontAwesomeIcon
                  icon={faUser}
                  className='text-xl mr-2 text-gray-600'
                />
                <span className='font-medium text-gray-500'>Edit Profile</span>
              </Link>
            </div>
            <div
              onClick={handleLogout}
              className='text-xs cursor-pointer flex items-center'
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className='text-xl text-gray-600 mr-2'
              />
              <span className='font-medium text-gray-500'>Sign Out</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
