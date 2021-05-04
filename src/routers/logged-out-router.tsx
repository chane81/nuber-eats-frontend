import React from 'react';
import { isLoggedInVar } from '../apollo';

export const LoggedOutRouter = () => {
  const handleClick = () => {
    isLoggedInVar(true);
  };

  return (
    <div>
      <h1>Logged Out</h1>
      <button onClick={handleClick}>Click to login</button>
    </div>
  );
};
