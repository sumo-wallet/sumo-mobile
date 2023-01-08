import { ModelChain, ModelNotification } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface BridgeChain {
  isGetList: boolean;
  bridgeChains: ModelChain[];
  hasMore: boolean;

  getDestinationChain: () => void;
  isGetDestinationChain: boolean;
  destinationChain: ModelChain[];
}

export function useGetBridgeChain(): BridgeChain {
  const [isGetList, setGetList] = useState<boolean>(false);
  const [bridgeChains, setBridgeChains] = useState<ModelNotification[]>([]);
  const [destinationChain, setDestinationChain] = useState<ModelNotification[]>(
    [],
  );
  const [isGetDestinationChain, setGetDestinationChain] =
    useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getAllChain = useCallback(async () => {
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

  const getDestinationChain = useCallback(
    async (token: string, sourceChain: string) => {
      try {
        setGetDestinationChain(true);
        const res = await client.getNotification();
        if (res.data && res.data?.length > 0) {
          setDestinationChain(res.data);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        await errorHandler(error);
      } finally {
        setGetDestinationChain(false);
      }
    },
    [errorHandler],
  );

  useEffect(() => {
    getAllChain().then();
  }, [getAllChain]);

  return {
    isGetList,
    bridgeChains,
    hasMore,
    getDestinationChain,
    isGetDestinationChain,
    destinationChain,
  };
}
