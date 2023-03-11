import { SearchToken } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface DappHomeConfig {
  isLoading: boolean;
  tokens?: SearchToken[];
  hashMore: boolean;
  search: (text: string) => void;
  searchToken: () => void;
}

export function useSearchToken(): DappHomeConfig {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hashMore, setHashMore] = useState<boolean>(true);
  const [tokens, setTokens] = useState<SearchToken[]>([]);
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const errorHandler = useErrorHandler();

  const searchToken = useCallback(async () => {
    if (!searchText) return;
    try {
      setLoading(true);
      const res = await client.getSearchCoingeckoToken({
        query: searchText,
      });
      if (res?.coins) {
        setTokens(res.coins);
        if (res.coins?.length >= pageSize) {
          setHashMore(true);
          setPageNumber(pageNumber + 1);
        }
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorHandler, pageNumber, pageSize, searchText]);

  const search = (text: string) => {
    if (text !== searchText) {
      setPageNumber(0);
      setSearchText(text);
      setHashMore(true);
      searchToken().then();
    }
    if (text === '') {
      setTokens([]);
    }
  };
  // useEffect(() => {
  //   searchToken().then();
  // }, [searchToken]);

  return {
    isLoading,
    tokens,
    hashMore,
    search,
    searchToken,
  };
}
