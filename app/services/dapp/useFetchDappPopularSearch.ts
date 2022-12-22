import { client } from '../apis';
import { useFetchWithCache } from '../useFetchWithCache';

const KEY = 'SWR_KEYS_DAPP_POPULAR_SEARCH';

export const useFetchDappPopularSearch = () => {
  const { data, ...rest } = useFetchWithCache([KEY], () =>
    client.getDappSearchPopular(),
  );

  return {
    data: data?.data,
    ...rest,
  };
};
