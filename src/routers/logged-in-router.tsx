import React from 'react';
import { isLoggedInVar } from '../apollo';

export const LoggedInRouter = () => {
  const handleClick = () => {
    isLoggedInVar(false);
  };

  return (
    <div>
      <h1>Logged In</h1>
      <button onClick={handleClick}>Log Out</button>
    </div>
  );
};
