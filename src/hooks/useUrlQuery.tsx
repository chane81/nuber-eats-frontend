import { useLocation } from 'react-router-dom';

/**
 * url query param 가져오기
 * ex:
 *  const query = useUrlQuery();
 *  const code = query('code');
 */
export default () => {
  const searchParams = new URLSearchParams(useLocation().search);

  return {
    searchParams,
    get: (paramName: string) => searchParams.get(paramName) || '',
  };
};
