import { useLocation } from 'react-router-dom';

/**
 * url query param 가져오기
 * ex:
 *  const query = useUrlQuery();
 *  const code = query('code');
 */
const useUrlQuery = <T>() => {
  const location = useLocation<T>();
  const searchParams = new URLSearchParams(location.search);

  return {
    location,
    state: location.state,
    searchParams,
    get: (paramName: string) => searchParams.get(paramName) || '',
  };
};

export default useUrlQuery;
