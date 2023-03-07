import {
  CoingeckoNews,
  CoingeckoNewsRequest,
  DataNewsInterface,
} from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface UseSessionHistoryValues {
  isLoading: boolean;
  news: DataNewsInterface[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  reload: () => void;
}
//https://mobile.api.coingecko.com/api/v3/news?page=2&locale=en
export function useGetNews(): UseSessionHistoryValues {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingMore, setLoadingMore] = useState<boolean>(false);
  const [isReload, setReload] = useState<boolean>(false);
  const [news, setNews] = useState<DataNewsInterface[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const errorHandler = useErrorHandler();

  const getDefault = useCallback(async () => {
    try {
      setReload(false);
      const request: CoingeckoNewsRequest = {
        locale: 'en',
        page,
      };
      const res = await client.getCoinGeckoNews(request);
      const newsData:
        | ((prevState: DataNewsInterface[]) => DataNewsInterface[])
        | {
          description: any;
          hours: string;
          thumbnail: any;
          url: string;
          author: string;
        }[] = [];
      if (res?.data?.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        res?.data.forEach((element: CoingeckoNews) => {
          newsData.push({
            description: element.title,
            hours: element.updated_at.toString(),
            thumbnail: element.thumb_2x,
            url: element.url,
            author: element.author,
          });
        });
        if (page <= 1) {
          setNews(newsData);
        } else {
          const newsItems: DataNewsInterface[] = [];
          news.forEach((newElement: DataNewsInterface) => {
            newsItems.push(newElement);
          });
          newsData.forEach((newElement: DataNewsInterface) => {
            newsItems.push(newElement);
          });
          setNews(newsItems);
        }

        if (res?.data.length >= 10) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
      setReload(false);
      setLoadingMore(false);
    }
    // do not trigger news
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, errorHandler]);

  const loadMore = async () => {
    if (hasMore) {
      setPage(page + 1);
      setLoadingMore(true);
    }
  };

  const reload = async () => {
    setPage(1);
    setReload(true);
  };

  useEffect(() => {
    getDefault().then();
  }, [getDefault]);

  return { isLoading, news, hasMore, isLoadingMore, loadMore, reload };
}
