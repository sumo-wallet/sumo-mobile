import { ModelMarketItemData } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface SystemNotification {
  isLoadingAuction: boolean;
  auctions: ModelMarketItemData[];
  hasMore: boolean;
}

export function useGetHotAuction(): SystemNotification {
  const [isLoadingAuction, setLoadingAuction] = useState<boolean>(false);
  const [auctions, setCategories] = useState<ModelMarketItemData[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getListCategory = useCallback(async () => {
    try {
      setLoadingAuction(true);
      const res = await client.getHotAuction();
      if (res.data && res.data?.length > 0) {
        setCategories(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoadingAuction(false);
    }
  }, [errorHandler]);

  useEffect(() => {
    getListCategory().then();
  }, [getListCategory]);

  return { isLoadingAuction, auctions, hasMore };
}
