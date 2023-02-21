import { ModelsChain } from 'app/types/icrosschain/schema';
import { useCallback, useState, useEffect } from 'react';
import { iClient } from '../../../services/icrosschainApis';
import useErrorHandler from '../useErrorHandler.hook';

interface Chain {
  isLoading: boolean;
  chains: ModelsChain[];
  hasMore: boolean;
}

export function useGetChain(): Chain {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [chains, setChains] = useState<ModelsChain[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getChains = useCallback(async () => {
    try {
      setLoading(true);
      const res = await iClient.getICrosschainChains();
      if (res?.chains) {
        setChains(res.chains);
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
