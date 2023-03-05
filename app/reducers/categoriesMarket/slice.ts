import { createDynamicReducer } from '../../services/createDynamicReducer';
import { RawCategoriesMarketInterface } from './types';

export const {
  setStore: setCategoriesMarketStore,
  actions: categoriesMarketActions,
  useByKey: useCategoriesMarket,
  useKeysByQuery: useCategoriesMarketByQuery,
  getByKey: getCategoriesMarketByKey,
  reducer: categoriesMarketReducer,
  getKeysByQuery: getCategoriesMarketByQuery,
  sync: syncCategoriesMarket,
  setQueries: setCategoriesMarketQueries,
} = createDynamicReducer<RawCategoriesMarketInterface>(
  'categoriesMarket',
  'id',
);
