import { MarketplaceCollectionCategory } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface SystemNotification {
  isGetCategory: boolean;
  categories: MarketplaceCollectionCategory[];
  hasMore: boolean;
}

export function useGetCollectionCategory(): SystemNotification {
  const [isGetCategory, setGetCategory] = useState<boolean>(false);
  const [categories, setCategories] = useState<MarketplaceCollectionCategory[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getListCategory = useCallback(async () => {
    try {
      setGetCategory(true);
      const res = await client.getCollectionCategory();
      if (res.data && res.data?.length > 0) {
        setCategories(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setGetCategory(false);
    }
  }, [errorHandler]);

  useEffect(() => {
    getListCategory().then();
  }, [getListCategory]);

  return { isGetCategory, categories, hasMore };
}
