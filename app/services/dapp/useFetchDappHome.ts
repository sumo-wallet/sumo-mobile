import { client } from './../apis';
import { useFetchWithCache } from '../useFetchWithCache';

const KEY = 'SWR_KEYS_DAPP_HOME';

export const useFetchDappHome = () => {
  return useFetchWithCache([KEY], () => client.getDappHome());
};
