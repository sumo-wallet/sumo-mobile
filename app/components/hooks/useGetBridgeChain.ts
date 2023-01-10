import { ModelChain, V1BridgeChainListParams } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface BridgeChain {
  isGetList: boolean;
  bridgeChains: ModelChain[];
  hasMore: boolean;
  resp: string;

  getDestinationChain: (tokenAddress: string, chainId: number) => void;
  isGetDestinationChain: boolean;
  destinationChain: ModelChain[];
}

export function useGetBridgeChain(): BridgeChain {
  const [isGetList, setGetList] = useState<boolean>(false);
  const [bridgeChains, setBridgeChains] = useState<ModelChain[]>([]);
  const [destinationChain, setDestinationChain] = useState<ModelChain[]>([]);
  const [isGetDestinationChain, setGetDestinationChain] =
    useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [resp, setResp] = useState<string>('');
  const errorHandler = useErrorHandler();

  const getAllChain = useCallback(async () => {
    try {
      const param: V1BridgeChainListParams = {
        tokenAddress: '',
      };

      setGetList(true);
      const res = await client.getBridgeChain(param);
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
    async (tokenAddress: string, chainId: number) => {
      try {
        const param: V1BridgeChainListParams = {
          tokenAddress,
          chainId,
        };
        setGetDestinationChain(true);
        const res = await client.getBridgeChain(param);
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
    resp,
    getDestinationChain,
    isGetDestinationChain,
    destinationChain,
  };
}
