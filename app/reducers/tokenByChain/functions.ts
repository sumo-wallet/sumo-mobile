import { client } from '../../services';
import { setTokenByChainQueries, syncTokenByChain } from './slice';

export const getTokenByChain = async (chainId: string) => {
  const res = await client.getTokenByChain(chainId);
  const data = Object.keys(res).map((key) => {
    return Object.assign({}, res[key], { id: key });
  });
  const newData = data.map((item: { id: any }) => item.id) || [];
  syncTokenByChain(data);
  setTokenByChainQueries({
    [`all`]: newData,
  });
};
