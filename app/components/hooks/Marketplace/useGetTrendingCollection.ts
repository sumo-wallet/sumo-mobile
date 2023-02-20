import {
  ModelCollection,
  V1MarketplaceCollectionTrendingListParams,
} from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface TrendingCollection {
  isLoadingTrendingCollection: boolean;
  trendingCollections: ModelCollection[];
  hasMore: boolean;
}

export function useGetTrendingCollection(): TrendingCollection {
  const [isLoadingTrendingCollection, setLoadingTrendingCollection] =
    useState<boolean>(false);
  const [trendingCollections, setTrendingCollections] = useState<
    ModelCollection[]
  >([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const errorHandler = useErrorHandler();

  const getTrendingCollection = useCallback(
    async (pageNumber = '1', pageSize = '10') => {
      try {
        setLoadingTrendingCollection(true);
        const params: V1MarketplaceCollectionTrendingListParams = {
          pageNumber,
          pageSize,
        };
        const res = await client.getMarketplaceTrendingCollection(params);
        if (res.data && res.data?.length > 0) {
          setTrendingCollections(res.data);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        await errorHandler(error);
      } finally {
        setLoadingTrendingCollection(false);
      }
    },
    [errorHandler],
  );

  useEffect(() => {
    getTrendingCollection().then();
  }, [getTrendingCollection]);

  return { isLoadingTrendingCollection, trendingCollections, hasMore };
}
