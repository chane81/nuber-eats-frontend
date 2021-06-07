import { gql, useApolloClient, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurants } from '../../__generated__/myRestaurants';

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }

  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
  const client = useApolloClient();

  useEffect(() => {
    setTimeout(() => {
      // read cache
      const queryResult = client.readQuery<myRestaurants>({
        query: MY_RESTAURANTS_QUERY,
      });

      console.log('result', queryResult);

      client.writeQuery<myRestaurants>({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult?.myRestaurants,
            restaurants: [
              {
                name: 'fake guy',
                id: 123,
                address: 'test addr',
                category: {
                  name: '쌀국수',
                  __typename: 'Category',
                },
                coverImg: '',
                isPromoted: false,
                __typename: 'Restaurant',
              },
            ],
            ok: true,
            error: '',
            __typename: 'MyRestaurantsOutput',
          },
        },
      });
    }, 8000);
  }, []);

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className='container mt-32'>
        <h2 className='text-4xl font-medium mb-10'>My Restaurants</h2>
        {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className='text-xl mb-5'>You have no restaurants.</h4>
            <Link className='link' to='/add-restaurant'>
              Create One &rarr;
            </Link>
          </>
        ) : (
          <div className='grid mt-16 md:grid-cols-3 px-3 gap-x-5 gap-y-10'>
            {data?.myRestaurants.restaurants.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={`${restaurant.id}`}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
