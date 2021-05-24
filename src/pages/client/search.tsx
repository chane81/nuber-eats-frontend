import { useEffect } from 'react';
import useUrlQuery from '../../hooks/useUrlQuery';

interface IQueryState {
  term: string;
}

export const Search = () => {
  const urlQuery = useUrlQuery<IQueryState>();

  useEffect(() => {}, []);
  console.log('urlquery', urlQuery.state, urlQuery.get('term'));

  return <h1>Search Page</h1>;
};
