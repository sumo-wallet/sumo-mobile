import { ModelBridgeToken, V1BridgeTokenListParams } from 'app/types';
import { useCallback, useEffect, useState } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface BridgeChain {
  isGetList: boolean;
  multiChainTokens: any[];
  hasMore: boolean;
  getTokenByChain: (chainId: number, tokenAddress: string[]) => void;
}

export function useGetMultichainToken(): BridgeChain {
  const [isGetList, setGetList] = useState<boolean>(false);
  const [multiChainTokens, setMultiChainTokens] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getTokenByChain = useCallback(
    async (chainId: number, tokenAddress: string[]) => {
      try {
        setGetList(true);
        const res = await client.getMultichainChain(chainId);
        const tokens: any[] = [];

        if (res) {
          tokenAddress.map((item) => {
            const anyToken = res['evm' + item];
            if (anyToken) {
              tokens.push(anyToken);
            }
            return anyToken;
          });
          setMultiChainTokens(tokens);
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
  useEffect(() => {
    getTokenByChain(1, []).then();
  }, [getTokenByChain]);
  return {
    isGetList,
    multiChainTokens,
    hasMore,
    getTokenByChain,
  };
}
