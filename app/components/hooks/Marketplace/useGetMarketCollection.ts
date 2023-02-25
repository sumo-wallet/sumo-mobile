import {
  ModelCollection,
  V1MarketplaceCollectionTrendingListParams,
} from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface TrendingCollection {
  isLoading: boolean;
  nfts: ModelCollection[];
  hasMore: boolean;
}

export function useGetMarketCollection(): TrendingCollection {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<
    ModelCollection[]
  >([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const errorHandler = useErrorHandler();

  const getTrendingCollection = useCallback(
    async (pageNumber = '1', pageSize = '10') => {
      try {
        setLoading(true);
        const params: V1MarketplaceCollectionTrendingListParams = {
          pageNumber,
          pageSize,
        };
        const res = await client.getMarketplaceTrendingCollection(params);
        if (res.data && res.data?.length > 0) {
          setNfts(res.data);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        await errorHandler(error);
      } finally {
        setLoading(false);
      }
    },
    [errorHandler],
  );

  useEffect(() => {
    getTrendingCollection().then();
  }, [getTrendingCollection]);

  return { isLoading, nfts, hasMore };
}
