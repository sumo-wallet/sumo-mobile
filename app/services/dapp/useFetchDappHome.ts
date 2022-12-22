import { client } from './../apis';
import { useFetchWithCache } from '../useFetchWithCache';

const KEY = 'SWR_KEYS_DAPP_HOME';

export const useFetchDappHome = () => {
  const { data, isLoading } = useFetchWithCache([KEY], () =>
    client.getDappHome(),
  );

  return {
    banner: data?.banner,
    category: data?.category,
    homeList: data?.home_list,
    hotDapp: data?.hot_dapp,
    isLoading,
  };
};
