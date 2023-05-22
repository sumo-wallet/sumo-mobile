import { createDynamicReducer } from '../../services/createDynamicReducer';
import { RawTokenByChainInterface } from './types';
import { RootState } from '@reduxjs/toolkit/dist/query/core/apiState';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

export const {
  setStore: setTokenByChainStore,
  actions: tokenByChainActions,
  useByKey: useTokenByChain,
  useKeysByQuery: useTokenByChainByQuery,
  getByKey: getTokenByChainByKey,
  reducer: tokenByChainReducer,
  getKeysByQuery: getTokenByChainByQuery,
  sync: syncTokenByChain,
  setQueries: setTokenByChainQueries,
} = createDynamicReducer<RawTokenByChainInterface>('tokenByChain', 'id');

const allTokenByChainByIds = (state: RootState) =>
  state.tokenByChain.query.all || [];

const allTokenByChainByKey = (state: RootState) => state.tokenByChain.byKey;

const crossChainSelectorFactory = createSelector(
  allTokenByChainByIds,
  allTokenByChainByKey,
  (byIds, byKey) => {
    return byIds
      .map((item: string | number) => {
        return {
          value: byKey[item].id,
          label: byKey[item].name,
          icon: byKey[item].logoUrl,
          symbol: byKey[item].symbol,
        };
      })
      .filter(Boolean);
  },
);

export const getAllTokenByChain = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSelector(crossChainSelectorFactory) || [];
};
