import { ModelBanner, ModelCategory, ModelDApp, ModelDApps } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface DappHomeConfig {
  isLoading: boolean;
  dapps?: ModelDApps[];
  hashMore: boolean;
  search: (text: string) => void;
  searchDApp: () => void;
}

export function usePopularSearchDapp(): DappHomeConfig {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hashMore, setHashMore] = useState<boolean>(false);
  const [dapps, setDapps] = useState<ModelDApp[]>([]);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const errorHandler = useErrorHandler();

  const search = (text: string) => {
    if (text !== searchText) {
      setPageNumber(0);
      setSearchText(text);
      setHashMore(true);
    }
    if (text === '') {
      setDapps([]);
    }
  };

  const searchDApp = useCallback(async () => {
    if (!searchText || !hashMore) return;
    try {
      setLoading(true);
      const res = await client.getDappSearch({
        text: searchText,
        pageNumber,
        pageSize,
      });
      if (res?.d_app) {
        setDapps(res.d_app);
        if (res.d_app?.length >= pageSize) {
          setHashMore(true);
          setPageNumber(pageNumber + 1);
        }
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [errorHandler, hashMore, pageNumber, pageSize, searchText]);

  useEffect(() => {
    searchDApp().then();
  }, [searchDApp]);

  return {
    isLoading,
    dapps,
    hashMore,
    search,
    searchDApp,
  };
}
