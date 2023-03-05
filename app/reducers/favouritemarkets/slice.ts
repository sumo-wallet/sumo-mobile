import { createDynamicReducer } from '../../services/createDynamicReducer';
import { RawCoinMarketsInterface } from '../coinmarkets/types';

export const {
  setStore: setFavouriteMarketsStore,
  actions: favouriteMarketsActions,
  useByKey: useFavouriteMarkets,
  useKeysByQuery: useFavouriteMarketsByQuery,
  getByKey: getFavouriteMarketsByKey,
  reducer: favouriteMarketsReducer,
  getKeysByQuery: getFavouriteMarketsByQuery,
  sync: syncFavouriteMarkets,
  setQueries: setFavouriteMarketsQueries,
} = createDynamicReducer<RawCoinMarketsInterface>('favouriteMarkets', 'id');
