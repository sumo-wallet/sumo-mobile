import { ModelChain } from 'app/types';
import { TokenTx, TokenTxRequest } from 'app/types/safepal/schema';
import { useCallback, useState, useEffect } from 'react';
import { safepalClient } from '../../../services/safepalApis';
import useErrorHandler from './../useErrorHandler.hook';

interface Chain {
  isLoading: boolean;
  tokenTxs: TokenTx[];
  hasMore: boolean;
}

export function useGetTransactionHistory(): Chain {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tokenTxs, setTokenTxs] = useState<TokenTx[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [chain, setChain] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const errorHandler = useErrorHandler();

  ////https://ap.isafepal.com/wallet/v1/fantom/tokentx?address=0xd6ea62e0c8b29478717bbedeaeb27e2541636359&sort=desc&startblock=0&page=1&offset=50&contractaddress=0x049d68029688eabf473097a2fc38ef61633a3c7a&symbol=fUSDT
  //https://ap.isafepal.com/wallet/v1/fantom/txlist?address=0xd6ea62e0c8b29478717bbedeaeb27e2541636359&sort=desc&startblock=0&page=1&offset=50&contractaddress=28:FTM&native_token_id=fantom&symbol=FTM'
  const getChains = useCallback(async () => {
    try {
      setLoading(true);
      const request: TokenTxRequest = {
        address: walletAddress,
        contractaddress: contractAddress,
        offset: 50,
        page: 1,
        sort: 'desc',
        startblock: 0,
        symbol: tokenSymbol,
      };
      const res = await safepalClient.getTokenTx(chain, request);
      if (res?.result) {
        setTokenTxs(res.result);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [chain, contractAddress, errorHandler, tokenSymbol, walletAddress]);

  useEffect(() => {
    getChains().then();
  }, [getChains]);

  return { isLoading, tokenTxs, hasMore };
}
