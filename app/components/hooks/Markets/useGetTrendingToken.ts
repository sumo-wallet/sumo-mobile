import { SearchToken } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface DappHomeConfig {
  isLoading: boolean;
  tokens?: SearchToken[];
  hashMore: boolean;
  getTrendingTokens: () => void;
}

export function useGetTrendingToken(): DappHomeConfig {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hashMore, setHashMore] = useState<boolean>(true);
  const [tokens, setTokens] = useState<SearchToken[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10);

  const errorHandler = useErrorHandler();

  const getTrendingTokens = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.getSearchTokenTrending();
      if (res?.coins) {
        const data: SearchToken[] = [];
        res?.coins.forEach((item) => {
          data.push(item.item);
        });
        setTokens(data);
        if (data.length >= pageSize) {
          setHashMore(true);
          setPageNumber(pageNumber + 1);
        }
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorHandler]);

  useEffect(() => {
    getTrendingTokens().then();
  }, [getTrendingTokens]);

  return {
    isLoading,
    tokens,
    hashMore,
    getTrendingTokens,
  };
}
