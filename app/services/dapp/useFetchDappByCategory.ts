import { client } from '../apis';
import { useFetchWithCache } from '../useFetchWithCache';

const KEY = 'SWR_KEYS_DAPP_HOME';

export const useFetchDappByCategory = ({
  categoryId,
}: {
  categoryId: string | number;
}) => {
  const { data, ...rest } = useFetchWithCache([KEY, categoryId], () =>
    client.getDappByCategory(categoryId),
  );

  return {
    dapps: data?.d_app,
    ...rest,
  };
};
