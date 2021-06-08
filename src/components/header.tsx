import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import nuberLogo from '../images/logo.svg';

export const Header: React.FC = () => {
  const { data } = useMe();

  return (
    <>
      {!data?.me.verified && (
        <div className='bg-red-500 p-3 text-center text-base text-white'>
          <span>Prease verify your email.</span>
        </div>
      )}
      <header className='py-4'>
        <div className='w-full max-w-screen-xl mx-auto flex justify-between items-center'>
          <Link title='home' to='/'>
            <img src={nuberLogo} className='w-36' alt='logo' />
          </Link>
          <span className='text-xs'>
            <Link title='edit-profile' to='/edit-profile'>
              <FontAwesomeIcon icon={faUser} className='text-xl' />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};
