import GoogleMapReact from 'google-map-react';

export const Dashboard = () => {
  return (
    <div>
      <div className='' style={{ width: window.innerWidth, height: '95vh' }}>
        <GoogleMapReact
          defaultZoom={20}
          defaultCenter={{
            lat: 59.95,
            lng: 30.33,
          }}
          bootstrapURLKeys={{ key: 'AIzaSyDsK3fRWCi19RvDRYKAqY-haTqridS0jOw' }}
        >
          <h1>Hello</h1>
        </GoogleMapReact>
      </div>
    </div>
  );
};
