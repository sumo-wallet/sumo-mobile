import { ModelChain } from 'app/types';
import {
  ChainBalanceRequest,
  TokenTx,
  TokenTxRequest,
} from 'app/types/safepal/schema';
import { useCallback, useState, useEffect } from 'react';
import { safepalClient } from '../../../services/safepalApis';
import useErrorHandler from './../useErrorHandler.hook';

interface Chain {
  isLoading: boolean;
  tokenTxs: TokenTx[];
  hasMore: boolean;
  setWalletAddress: (walletAddress: string) => void;
}

const CHAINS = [
  {
    symbol: 'eth',
  },
  {
    symbol: 'bsc',
  },
];

export function useGetChainBalances(): Chain {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tokenTxs, setTokenTxs] = useState<TokenTx[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const errorHandler = useErrorHandler();

  //https://ap.isafepal.com/wallet/v1/eth/balances
  const getBalance = useCallback(
    async (chainName: string) => {
      const request: ChainBalanceRequest = {
        address: walletAddress,
      };
      const res = await safepalClient.getChainBalance(chainName, request);
      if (res?.data) {
        // setTokenTxs(res.result);
      } else {
        setHasMore(true);
      }
    },
    [walletAddress],
  );

  const getChainBalances = useCallback(async () => {
    try {
      setLoading(true);
      const promises = CHAINS.map((chain) => getBalance(chain.symbol));
      Promise.all(promises);
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [errorHandler, getBalance]);

  useEffect(() => {
    getChainBalances().then();
  }, [getChainBalances]);

  return { isLoading, tokenTxs, hasMore, setWalletAddress };
}
