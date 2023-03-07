import {
  CoingeckoLearnRequest,
  CoingeckoLearns,
  DataNewsInterface,
} from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface UseSessionHistoryValues {
  isLoading: boolean;
  learns: DataNewsInterface[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  reload: () => void;
}
// https://mobile.api.coingecko.com/api/v3/posts/learn?page=2
export function useGetLearn(): UseSessionHistoryValues {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingMore, setLoadingMore] = useState<boolean>(false);
  const [learns, setLearns] = useState<DataNewsInterface[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const errorHandler = useErrorHandler();

  const getDefault = useCallback(async () => {
    try {
      const request: CoingeckoLearnRequest = {
        page,
      };
      const res = await client.getCoinGeckoLearns(request);
      const newsData:
        | ((prevState: DataNewsInterface[]) => DataNewsInterface[])
        | {
          description: any;
          hours: string;
          thumbnail: any;
          url: string;
          author: string;
        }[] = [];
      if (res?.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        res.forEach((element: CoingeckoLearns) => {
          newsData.push({
            description: element.title,
            hours: '',
            thumbnail: element.image,
            url: element.link,
            author: element.author,
          });
        });
        if (page <= 1) {
          setLearns(newsData);
        } else {
          const newLearns: DataNewsInterface[] = [];
          learns.forEach((newElement: DataNewsInterface) => {
            newLearns.push(newElement);
          });
          newsData.forEach((newElement: DataNewsInterface) => {
            newLearns.push(newElement);
          });
          setLearns(newLearns);
        }

        if (res?.length >= 10) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, errorHandler]);

  const loadMore = useCallback(async () => {
    if (hasMore) {
      setPage(page + 1);
      setLoadingMore(true);
    }
  }, [hasMore, page]);

  const reload = async () => {
    setLoading(true);
    setPage(1);
  };

  useEffect(() => {
    getDefault().then();
  }, [getDefault]);

  return { isLoading, learns, hasMore, isLoadingMore, loadMore, reload };
}
