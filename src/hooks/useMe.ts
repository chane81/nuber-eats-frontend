import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { meQuery } from '../__generated__/meQuery';

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

// query
export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
};

// lazy query
export const useMeLazy = () => {
  return useLazyQuery<meQuery>(ME_QUERY);
};
