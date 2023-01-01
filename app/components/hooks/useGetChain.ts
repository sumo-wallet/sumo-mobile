import { ModelChain } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface Chain {
  isLoading: boolean;
  chains: ModelChain[];
  hasMore: boolean;
}

export function useGetChain(): Chain {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [chains, setChains] = useState<ModelChain[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getChains = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.getChain();
      if (res.data && res.data?.length > 0) {
        setChains(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [errorHandler]);

  useEffect(() => {
    getChains().then();
  }, [getChains]);

  return { isLoading, chains, hasMore };
}
