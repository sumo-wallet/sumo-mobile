import { ModelDexRouter } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { iClient } from '../../../services/icrosschainApis';
import useErrorHandler from '../useErrorHandler.hook';

interface Chain {
  isLoading: boolean;
  dexes: ModelDexRouter[];
  hasMore: boolean;
  setChainId: (chainId: number) => void;
}

export function useGetDex(): Chain {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [dexes, setDexes] = useState<ModelDexRouter[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(1);
  const errorHandler = useErrorHandler();

  const getChains = useCallback(async () => {
    try {
      setLoading(true);
      const res = await iClient.getSwapDexByChain({ chainId });
      if (res?.data) {
        setDexes(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [errorHandler, chainId]);

  useEffect(() => {
    getChains().then();
  }, [getChains]);

  return { isLoading, dexes, hasMore, setChainId };
}
