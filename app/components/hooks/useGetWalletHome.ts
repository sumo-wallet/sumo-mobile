import { HandlerWalletHomeConfigResponse } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface WalletHomeConfig {
  isLoading: boolean;
  homeConfig: HandlerWalletHomeConfigResponse | undefined;
}

export function useGetWalletHome(): WalletHomeConfig {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [homeConfig, setHomeConfig] =
    useState<HandlerWalletHomeConfigResponse>(undefined);
  const errorHandler = useErrorHandler();

  const getListNews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.getWalletHome();
      if (res != null) {
        setHomeConfig(res);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [errorHandler]);

  useEffect(() => {
    getListNews().then();
  }, [getListNews]);

  return { isLoading, homeConfig };
}
