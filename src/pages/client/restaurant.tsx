import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }

  ${RESTAURANT_FRAGMENT}
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const params = useParams<IRestaurantParams>();
  const { data, loading } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +params.id,
        },
      },
    },
  );

  return (
    <div>
      <div
        className='bg-gray-800 bg-center bg-cover py-32 md:py-44'
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className='bg-white w-96 md:w-128 py-8 pl-10'>
          <h4 className='text-4xl mb-3'>{data?.restaurant.restaurant?.name}</h4>
          <h5 className='text-sm font-light mb-2'>
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className='text-sm font-light'>
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
    </div>
  );
};
