import { client } from '../../services';
import { setCategoriesMarketQueries, syncCategoriesMarket } from './slice';

export const getCategoriesMarket = async () => {
  const res = await client.getCategoriesMarket();
  const newData = res.map((item: { id: any }) => item.id) || [];
  syncCategoriesMarket(res);
  setCategoriesMarketQueries({
    [`all`]: newData,
  });
  return res;
};
