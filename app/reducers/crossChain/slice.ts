import { createDynamicReducer } from '../../services/createDynamicReducer';
import { RawCrossChainInterface } from './types';
import { RootState } from '@reduxjs/toolkit/dist/query/core/apiState';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

export const {
  setStore: setCrossChainStore,
  actions: crossChainActions,
  useByKey: useCrossChain,
  useKeysByQuery: useCrossChainByQuery,
  getByKey: getCrossChainByKey,
  reducer: crossChainReducer,
  getKeysByQuery: getCrossChainByQuery,
  sync: syncCrossChain,
  setQueries: setCrossChainQueries,
} = createDynamicReducer<RawCrossChainInterface>('crossChain', 'id');

const allCrossChainByIds = (state: RootState) =>
  state.crossChain.query.all || [];

const allCrossChainByKey = (state: RootState) => state.crossChain.byKey;

const crossChainSelectorFactory = createSelector(
  allCrossChainByIds,
  allCrossChainByKey,
  (byIds, byKey) => {
    return byIds
      .map((item: string | number) => {
        return {
          value: byKey[item].id,
          label: byKey[item].name + ' mainnet',
          icon: byKey[item].logoUrl,
        };
      })
      .filter(Boolean);
  },
);

export const getAllCrossChain = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSelector(crossChainSelectorFactory) || [];
};
