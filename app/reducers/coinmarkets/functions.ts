import { MarketsListParams } from '../../types/coingecko/schema';
import { client } from '../../services';
import { store } from '../../store';
import { setCoinMarketsQueries, syncCoinMarkets } from './slice';

export const getCoinMarkets = async (params: MarketsListParams) => {
  const res = await client.getCoinsMarket(params);
  const newData = res.map((item: { id: any }) => item.id) || [];
  const newQuery = store.getState().coinMarkets.query.all || [];
  syncCoinMarkets(res);
  setCoinMarketsQueries({
    [`all`]:
      params.page && params.page > 1
        ? [...new Set([...newQuery, ...newData])]
        : newData,
  });
  return res;
};

export const getGlobalMarkets = async () => {
  const res = await client.getCoingeckoGlobal();
  setCoinMarketsQueries({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    [`global_market`]: res,
  });
};
