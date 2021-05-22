import { gql, useQuery } from '@apollo/client';
import { Category } from '../../components/category';
import { Restaurant } from '../../components/restaurant';
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from '../../__generated__/restaurantsPageQuery';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }

    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants = () => {
  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <div>
      <form className='bg-gray-800 w-full py-32 flex items-center justify-center w-'>
        <input
          type='Search'
          className='input rounded-md border-0 w-3/12'
          placeholder='Search restaurants...'
        />
      </form>
      {!loading && (
        <div className='max-w-screen-2xl mx-auto mt-8'>
          <div className='flex justify-around max-w-lg mx-auto'>
            {data?.allCategories.categories?.map((category) => (
              <Category
                key={category.id}
                coverImg={category.coverImg || ''}
                name={category.name}
              />
            ))}
          </div>
          <div className='grid mt-16 grid-cols-3 gap-x-5 gap-y-10'>
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={`${restaurant.id}`}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
