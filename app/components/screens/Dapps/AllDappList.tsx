/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useDispatch } from 'react-redux';

import { useNavigator } from './../../hooks';
import { Style } from './../../../styles';
import { NowTrending } from './NowTrending';
import { SearchRecent } from './SearchRecent';
import { ModelDApp, ModelDApps, ModelCategory } from './../../../types';
import { AppGroupCard } from './AppGroupCard';
import { NowTrendingModal } from './NowTrendingModal';
import { useTheme } from '../../../util/theme';
import { useGetDappHome } from '../../hooks/DApp/useGetDappHome';

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
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const [isNowTrendingModelVisible, setNowTrendingModelVisible] =
      useState(false);

    const { isLoading, getDAppHome } = useGetDappHome();

    const handleOpenTrending = React.useCallback(
      (_: ModelDApp) => {
        setNowTrendingModelVisible(true);
      },
      [],
    );

    const toggleSourceModal = () => {
      setNowTrendingModelVisible(!isNowTrendingModelVisible);
    };

    const onRefresh = () => {
      getDAppHome();
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
        refreshControl={
          <RefreshControl
            colors={[colors.primary.default]}
            tintColor={colors.primary.default}
            refreshing={isLoading}
            onRefresh={onRefresh}
          />
        }
      />
    );
  },
);
