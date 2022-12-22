import { ModelNotification } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface SystemNotification {
  isGetList: boolean;
  notifications: ModelNotification[];
  hasMore: boolean;
}

export function useGetNotification(): SystemNotification {
  const [isGetList, setGetList] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<ModelNotification[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getListNews = useCallback(async () => {
    try {
      setGetList(true);
      const res = await client.getNotification();
      if (res.data && res.data?.length > 0) {
        setNotifications(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setGetList(false);
    }
  }, [errorHandler]);

  useEffect(() => {
    getListNews().then();
  }, [getListNews]);

  return { isGetList, notifications, hasMore };
}
