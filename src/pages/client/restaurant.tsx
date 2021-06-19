import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Dish } from '../../components/dish';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }

  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
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

  console.log(data);

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
      <div className='container grid mt-16 px-3 md:grid-cols-3 gap-x-5 gap-y-10'>
        {data?.restaurant.restaurant?.menu.map((dish) => (
          <Dish
            key={dish.id}
            name={dish.name}
            description={dish.description}
            price={dish.price}
            isCustomer
            options={dish.options}
          />
        ))}
      </div>
    </div>
  );
};
