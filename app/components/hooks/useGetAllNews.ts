import { DataNewsInterface } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface UseSessionHistoryValues {
  isGetList: boolean;
  news: DataNewsInterface[];
  hasMore: boolean;
}

export function useGetAllNews(): UseSessionHistoryValues {
  const [isGetList, setGetList] = useState<boolean>(false);
  const [news, setNews] = useState<DataNewsInterface[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getListNews = useCallback(async () => {
    try {
      setGetList(true);
      const res = await client.getCoindeskAllNews();
      const newsData:
        | ((prevState: DataNewsInterface[]) => DataNewsInterface[])
        | { description: any; hours: number; thumbnail: any; url: string }[] =
        [];
      if (res.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        res.forEach((element: any) => {
          newsData.push({
            description: element.title,
            hours: element.date,
            thumbnail: element.image.mobile.src,
            url: 'https://www.coindesk.com' + element.url,
          });
        });
        setNews(newsData);
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

  return { isGetList, news, hasMore };
}
