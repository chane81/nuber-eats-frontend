import { gql, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import useUrlQuery from '../../hooks/useUrlQuery';
import {
  searchRestaurant,
  searchRestaurantVariables,
} from '../../__generated__/searchRestaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IQueryState {
  term: string;
}

export const Search = () => {
  const urlQuery = useUrlQuery<IQueryState>();
  const history = useHistory();
  const [callQuery, { loading, data, called }] =
    useLazyQuery<searchRestaurant, searchRestaurantVariables>(SEARCH_RESTAURANT);

  useEffect(() => {
    const query = urlQuery.get('term');

    if (!query) {
      return history.push('/');
    }

    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, []);

  console.log(loading, data, called);

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <div>search</div>
    </div>
  );
};
