import { RawCoinMarketsInterface } from '../coinmarkets/types';
import { setFavouriteMarketsQueries, syncFavouriteMarkets } from './slice';
import { store } from '../../store';

export const requestSetTokenToFavourite = async (
  token: RawCoinMarketsInterface,
) => {
  const newQuery = store.getState().favouriteMarkets.query.all || [];
  if (newQuery.includes(token.id)) {
    const result = newQuery.filter((item: string) => item !== token.id) || [];
    setFavouriteMarketsQueries({
      [`all`]: [...new Set([...result])],
    });
    return;
  }
  syncFavouriteMarkets([token]);
  setFavouriteMarketsQueries({
    [`all`]: [...new Set([...newQuery, ...[token.id]])],
  });
  return;
};
