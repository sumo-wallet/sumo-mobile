import React from 'react';
import { client } from '../apis';
import useSWRInfinite from 'swr/infinite';
import { ModelDApp } from './../../types';

const KEY = 'SWR_KEYS_DAPP_SEARCH';
const PAGE_SIZE = 10;

export const useFetchDappSearch = ({ text }: { text: string }) => {
  const { data, ...rest } = useSWRInfinite(
    (index) => [KEY, index, text],
    (_: any, index: number) =>
      client.getDappSearch({
        text,
        pageNumber: (index ?? 0) + 1,
        pageSize: PAGE_SIZE,
      }),
  );

  const dataList = React.useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data?.reduce((sum: ModelDApp[], item) => {
      if (!item || !item?.d_app || !Array.isArray(item?.d_app)) {
        return sum;
      }
      const { d_app: newData = [] } = item as any;
      if (Array.isArray(newData)) {
        return [...sum, ...newData];
      }
      return sum;
    }, []);
  }, [data]);

  return {
    dapps: dataList,
    ...rest,
  };
};
