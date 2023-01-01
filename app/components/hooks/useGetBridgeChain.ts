import { ModelChain, ModelNotification } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface BridgeChain {
  isGetList: boolean;
  bridgeChains: ModelChain[];
  hasMore: boolean;
}

export function useGetBridgeChain(): BridgeChain {
  const [isGetList, setGetList] = useState<boolean>(false);
  const [bridgeChains, setBridgeChains] = useState<ModelNotification[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getListNews = useCallback(async () => {
    try {
      setGetList(true);
      const res = await client.getNotification();
      if (res.data && res.data?.length > 0) {
        setBridgeChains(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setGetList(false);
    }
  }, [errorHandler]);

  useEffect(() => {
    getListNews().then();
  }, [getListNews]);

  return { isGetList, bridgeChains, hasMore };
}
