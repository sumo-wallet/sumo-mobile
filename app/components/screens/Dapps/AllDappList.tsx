/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { useDispatch } from 'react-redux';

import { useNavigator } from './../../hooks';
import { Style } from './../../../styles';
import { NowTrending } from './NowTrending';
import { SearchRecent } from './SearchRecent';
import { ModelDApp, ModelDApps, ModelCategory } from './../../../types';
import { ROUTES } from './../../../navigation/routes';
import { createNewTab, openDapp } from './../../../actions/browser';
import { AppGroupCard } from './AppGroupCard';
import { NowTrendingModal } from './NowTrendingModal';
import { strings } from '../../../../locales/i18n';

interface AllDappListProps {
  dappByCate?: ModelDApps[];
  hotDapp?: ModelDApp[];
  recent?: ModelDApp[];
  onSelect?: (dapp: ModelDApp) => void;
  onSeeMoreCategory?: (item: ModelCategory) => void;
}

export const AllDappList = React.memo(
  ({
    dappByCate = [],
    hotDapp = [],
    recent = [],
    onSelect,
    onSeeMoreCategory,
  }: AllDappListProps) => {
    const nav = useNavigator();
    const dispatch = useDispatch();
    const [isNowTrendingModelVisible, setNowTrendingModelVisible] = useState(false);

    const handleOpenTrending = React.useCallback(
      (dapp: ModelDApp) => {
        // if (dapp.website) {
        //   dispatch(createNewTab(dapp?.website));
        //   dispatch(openDapp({ dapp }));
        //   nav.navigate(ROUTES.BrowserTabHome, { dapp });
        // }
        setNowTrendingModelVisible(true);
      },
      [nav, dispatch],
    );

    const toggleSourceModal = () => {
      setNowTrendingModelVisible(!isNowTrendingModelVisible);
    };

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
              <NowTrendingModal
                isVisible={isNowTrendingModelVisible}
                dismiss={toggleSourceModal}
                title={'NOW TRENDING'}
                dapps={hotDapp}
                onItemPress={toggleSourceModal}
                onToggleModal={toggleSourceModal}
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
              onMore={() => {
                if (onSeeMoreCategory && item.category) {
                  onSeeMoreCategory(item.category);
                }
              }}
            />
          );
        }}
      />
    );
  },
);
