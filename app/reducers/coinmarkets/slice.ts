import { createDynamicReducer } from '../../services/createDynamicReducer';
import { RawCoinMarketsInterface } from './types';

export const {
  setStore: setCoinMarketsStore,
  actions: coinMarketsActions,
  useByKey: useCoinMarkets,
  useKeysByQuery: useCoinMarketsByQuery,
  getByKey: getCoinMarketsByKey,
  reducer: coinMarketsReducer,
  getKeysByQuery: getCoinMarketsByQuery,
  sync: syncCoinMarkets,
  setQueries: setCoinMarketsQueries,
} = createDynamicReducer<RawCoinMarketsInterface>('coinMarkets', 'id');
