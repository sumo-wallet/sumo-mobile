/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React from 'react';
import { FlatList } from 'react-native';
import { useDispatch } from 'react-redux';

import { useNavigator } from './../../hooks';
import { Style } from './../../../styles';
import { NowTrending } from './NowTrending';
import { SearchRecent } from './SearchRecent';
import { ModelDApp, ModelDApps } from './../../../types';
import { ROUTES } from './../../../navigation/routes';
import { createNewTab, openDapp } from './../../../actions/browser';
import { AppGroupCard } from './AppGroupCard';

interface AllDappListProps {
  dappByCate?: ModelDApps[];
  hotDapp?: ModelDApp[];
  recent?: ModelDApp[];
  onSelect?: (dapp: ModelDApp) => void;
}

export const AllDappList = React.memo(
  ({
    dappByCate = [],
    hotDapp = [],
    recent = [],
    onSelect,
  }: AllDappListProps) => {
    const nav = useNavigator();
    const dispatch = useDispatch();

    const handleOpenTrending = React.useCallback(
      (dapp: ModelDApp) => {
        if (dapp.website) {
          dispatch(createNewTab(dapp?.website));
          dispatch(openDapp({ dapp }));
          nav.navigate(ROUTES.BrowserTabHome, { dapp });
        }
      },
      [nav, dispatch],
    );

    return (
      <FlatList
        data={dappByCate}
        style={Style.s({ flex: 1 })}
        contentContainerStyle={Style.s({ px: 0 })}
        ListHeaderComponent={() => {
          return (
            <>
              <SearchRecent
                title="Recent"
                data={recent}
                style={Style.s({ mx: 16 })}
                onSelect={onSelect}
              />
              <NowTrending
                style={Style.s({ mx: 16, mb: 24 })}
                onSelect={handleOpenTrending}
                hotDapps={hotDapp}
              />
            </>
          );
        }}
        renderItem={({ item, index }: { item: ModelDApps; index: number }) => {
          return (
            <AppGroupCard
              title={item?.category?.name}
              dapps={item?.app}
              key={`AppGroupCard.${item?.category?.id}.${index}`}
            />
          );
        }}
      />
    );
  },
);
