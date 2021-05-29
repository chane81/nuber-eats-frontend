import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Category } from '../../components/category';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
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
        ...CategoryParts
      }
    }

    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }

  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className='bg-gray-800 w-full py-32 flex items-center justify-center w-'
      >
        <input
          {...register('searchTerm', {
            required: true,
            min: 3,
          })}
          type='Search'
          className='input rounded-md border-0 w-3/4 md:w-3/12'
          placeholder='Search restaurants...'
        />
      </form>
      {!loading && (
        <div className='max-w-screen-2xl pb-20 mx-auto mt-8'>
          <div className='flex justify-around max-w-lg mx-auto'>
            {data?.allCategories.categories?.map((category) => (
              <Link to={`/category/${category.slug}`} key={category.id}>
                <Category
                  coverImg={category.coverImg || ''}
                  name={category.name}
                />
              </Link>
            ))}
          </div>
          <div className='grid mt-16 md:grid-cols-3 px-3 gap-x-5 gap-y-10'>
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
          <div className='grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10'>
            {page > 1 ? (
              <button
                onClick={onPrevPageClick}
                className='focus:outline-none font-medium text-2xl'
              >
                &larr;
              </button>
            ) : (
              <div />
            )}
            <span className='mx-5'>
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className='focus:outline-none font-medium text-2xl'
              >
                &rarr;
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
