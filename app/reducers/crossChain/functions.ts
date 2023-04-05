import { client } from '../../services';
import { setCrossChainQueries, syncCrossChain } from './slice';

export const getMultiChain = async () => {
  const res = await client.getMultiChain();
  const data = Object.keys(res).map((key) => {
    return Object.assign({}, res[key], { id: key });
  });
  const newData = data.map((item: { id: any }) => item.id) || [];
  syncCrossChain(data);
  setCrossChainQueries({
    [`all`]: newData,
  });
};
