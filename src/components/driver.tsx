import React from 'react';

interface IProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IProps> = () => {
  return <div className='text-lg'>🚗</div>;
};

export { Driver };
