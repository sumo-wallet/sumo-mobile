import {
  ModelBridgeChain,
  ModelBridgeToken,
  V1BridgeTokenListParams,
} from 'app/types';
import { useCallback, useState } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface BridgeChain {
  isGetList: boolean;
  bridgeTokens: ModelBridgeToken[];
  hasMore: boolean;
  getBridgeTokenByChain: (chainId: number) => void;
}

export function useGetBridgeToken(): BridgeChain {
  const [isGetList, setGetList] = useState<boolean>(false);
  const [bridgeTokens, setBridgeTokens] = useState<ModelBridgeChain[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getBridgeTokenByChain = useCallback(
    async (chainId: number) => {
      try {
        const param: V1BridgeTokenListParams = {
          chainId,
        };

        setGetList(true);
        const res = await client.getBridgeChain(param);
        if (res.data && res.data?.length > 0) {
          setBridgeTokens(res.data);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        await errorHandler(error);
      } finally {
        setGetList(false);
      }
    },
    [errorHandler],
  );

  return {
    isGetList,
    bridgeTokens,
    hasMore,
    getBridgeTokenByChain,
  };
}
