import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };

  const onError = (position: GeolocationPositionError) => {
    console.log(position);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  return (
    <div>
      <div className='' style={{ width: window.innerWidth, height: '95vh' }}>
        <GoogleMapReact
          defaultZoom={15}
          defaultCenter={{
            lat: 37.63758368597268,
            lng: 126.78774824975517,
          }}
          bootstrapURLKeys={{ key: 'AIzaSyDsK3fRWCi19RvDRYKAqY-haTqridS0jOw' }}
        />
      </div>
    </div>
  );
};
