import { ModelBridgeToken, V1BridgeTokenListParams } from 'app/types';
import { useCallback, useEffect, useState } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface BridgeChain {
  isGetList: boolean;
  bridgeTokens: ModelBridgeToken[];
  hasMore: boolean;
  getBridgeTokenByChain: (fromChainId: number, toChainId: number) => void;
}

export function useGetBridgeToken(): BridgeChain {
  const [isGetList, setGetList] = useState<boolean>(false);
  const [bridgeTokens, setBridgeTokens] = useState<ModelBridgeToken[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getBridgeTokenByChain = useCallback(
    async (fromChainId: number, toChainId: number) => {
      try {
        const param: V1BridgeTokenListParams = {
          fromChainId,
          toChainId,
        };

        setGetList(true);
        const res = await client.getBridgeToken(param);
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
  // useEffect(() => {
  //   getBridgeTokenByChain(1, 1).then();
  // }, [getBridgeTokenByChain]);
  return {
    isGetList,
    bridgeTokens,
    hasMore,
    getBridgeTokenByChain,
  };
}
