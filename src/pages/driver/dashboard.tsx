import { gql, useMutation, useSubscription } from '@apollo/client';
import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Driver } from '../../components/driver';
import { envVars } from '../../config/env.config';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { cookedOrders } from '../../__generated__/cookedOrders';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      error
      ok
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<typeof google.maps>();

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

  useEffect(() => {
    if (map && maps) {
      const driverLatLng = new maps.LatLng(driverCoords.lat, driverCoords.lng);
      map.panTo(driverLatLng);

      // geocode (좌표 => 주소로 변환)
      // const geocoder = new maps.Geocoder();

      // geocoder.geocode(
      //   {
      //     location: driverLatLng,
      //   },
      //   (results, status) => {
      //     console.log(status, results);
      //   },
      // );
    }
  }, [maps, driverCoords.lat, driverCoords.lng]);

  const onGoogleApiLoaded = (mapInfo: {
    map: google.maps.Map;
    maps: typeof google.maps;
  }) => {
    const { map, maps } = mapInfo;

    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  const makeRoute = () => {
    if (maps && map) {
      const directionService = new maps.DirectionsService();
      const directionsRenderer = new maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: '#fa5252',
          strokeOpacity: 0.5,
          strokeWeight: 7,
        },
      });

      directionsRenderer.setMap(map);
      directionService.route(
        {
          origin: {
            location: new maps.LatLng(driverCoords.lat, driverCoords.lng),
          },
          destination: {
            location: new maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05,
            ),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        },
      );
    }
  };

  const { data: cookedOrdersData } = useSubscription<cookedOrders>(
    COOKED_ORDERS_SUBSCRIPTION,
  );

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrdersData]);

  const history = useHistory();

  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  };

  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    {
      onCompleted,
    },
  );

  const handleAccept = async () => {
    if (cookedOrdersData) {
      const { id } = cookedOrdersData?.cookedOrders;

      await takeOrderMutation({
        variables: {
          input: {
            id,
          },
        },
      });
    }
  };

  return (
    <div>
      <div className='' style={{ width: window.innerWidth, height: '50vh' }}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onGoogleApiLoaded}
          defaultZoom={16}
          defaultCenter={{
            lat: 37.63758368597268,
            lng: 126.78774824975517,
          }}
          bootstrapURLKeys={{ key: envVars.GOOGLE_MAP_KEY }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className='max-w-screen-sm mx-auto bg-white relative top-10 shadow-lg py-8 px-5'>
        {cookedOrdersData?.cookedOrders ? (
          <>
            <h1 className='text-center text-3xl font-medium'>New Cooked Order</h1>
            <h4 className='text-center my-3 text-2xl font-medium'>
              Pick it up soon @ {cookedOrdersData.cookedOrders.restaurant?.name}
            </h4>
            <button
              onClick={handleAccept}
              className='btn w-full block text-center mt-5'
            >
              Accept Challange &rarr;
            </button>
          </>
        ) : (
          <h1 className='text-center text-3xl font-medium'>No Orders Yet...</h1>
        )}
      </div>
    </div>
  );
};
