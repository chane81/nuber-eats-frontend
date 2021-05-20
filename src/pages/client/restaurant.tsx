import { gql, useQuery } from '@apollo/client';
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

  console.log('data', data);

  return (
    <div>
      <form className='bg-gray-800 w-full py-40 flex items-center justify-center w-'>
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
              <div
                key={category.id}
                className='flex flex-col items-center cursor-pointer'
              >
                <div
                  className='w-14 h-14 bg-cover hover:bg-gray-200 rounded-full'
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                />
                <span className='mt-1 text-sm font-medium'>{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
