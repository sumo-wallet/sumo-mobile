import React from 'react';
import { ModelDApp } from './../../types';
import { getDappRecent } from './../../util';

export const useFetchDappRecent = () => {
  const [recent, setRecent] = React.useState<ModelDApp[]>([]);

  const getRecent = React.useCallback(async () => {
    const data = await getDappRecent();
    setRecent(data);
  }, []);

  React.useEffect(() => {
    getRecent().then();
  }, [getRecent]);

  return {
    recent,
    mutate: getRecent,
  };
};
