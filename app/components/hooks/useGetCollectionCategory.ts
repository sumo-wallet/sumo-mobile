import { ModelCategory } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface SystemNotification {
  isGetCategory: boolean;
  categories: ModelCategory[];
  hasMore: boolean;
}

export function useGetCollectionCategory(): SystemNotification {
  const [isGetCategory, setGetCategory] = useState<boolean>(false);
  const [categories, setCategories] = useState<ModelCategory[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getListNews = useCallback(async () => {
    try {
      setGetCategory(true);
      const res = await client.getNotification();
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
    getListNews().then();
  }, [getListNews]);

  return { isGetCategory, categories, hasMore };
}
