import React, { useEffect } from 'react';
import { View, StyleProp, ViewStyle, FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import { Style, Fonts } from './../../../styles';
import { ModelCategory, ModelDApp } from './../../../types';
import { useFetchDappByCategory } from './../../../services/dapp/useFetchDappByCategory';
import { useTheme } from './../../../util/theme';
import { SearchResultCell } from './../DappSearch/SearchResultCell';
import { openDapp } from './../../../actions/browser';
import { images } from './../../../assets';
import { useTrackingDAppUsage } from '../../../components/hooks/useTrackingDAppUsage';
import Routes from '../../../constants/navigation/Routes';

export interface DappListByCategoryProps {
  style?: StyleProp<ViewStyle>;
  category: ModelCategory;
}

export const DappListByCategory = React.memo(
  ({ style, category }: DappListByCategoryProps) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const nav = useNavigation();
    const { trackingUsage } = useTrackingDAppUsage();

    const {
      dapps = [],
      isValidating,
      mutate,
    } = useFetchDappByCategory({
      categoryId: category?.id !== 1000000 ? category?.id ?? '0' : '0',
    });

    const favorites: ModelDApp[] = useSelector(
      (state: any) => state.dapp.favorites,
    );

    const handlePressDapp = React.useCallback(
      (dapp: ModelDApp) => {
        if (dapp.website) {
          dispatch(openDapp({ dapp }));
          nav.navigate(Routes.BROWSER_TAB_HOME, {
            screen: Routes.BROWSER_VIEW,
            params: {
              newTabUrl: dapp.website,
              timestamp: Date.now(),
              dapp,
            },
          });
          trackingUsage(dapp.id || 0, 'dapp');
        }
      },
      [dispatch, nav, trackingUsage],
    );

    const renderItemResult = React.useCallback(
      ({ item }: { item: ModelDApp }) => {
        return <SearchResultCell item={item} onPress={handlePressDapp} />;
      },
      [handlePressDapp],
    );

    const renderItemSeparator = React.useCallback(() => {
      return (
        <View
          style={Style.s({ my: 13, ml: 52, h: 1, bg: colors.border.muted })}
        />
      );
    }, [colors.border.muted]);

    const keyEx = React.useCallback((i: ModelDApp) => `${i}`, []);

    const renderEmptyComponent = React.useCallback(() => {
      return (
        <View style={Style.s({ items: 'center', mt: 180 })}>
          <FastImage
            style={Style.s({ w: 140, h: 120 })}
            source={images.emptyBox}
          />
          <View style={Style.s({ mt: 20, items: 'center' })}>
            <Text style={Fonts.t({ s: 18, w: '500', c: colors.text.default })}>
              {'No result found!'}
            </Text>
            <Text style={Fonts.t({ s: 14, c: colors.text.alternative, t: 8 })}>
              {'All Dapps include the keyword will appear here'}
            </Text>
          </View>
        </View>
      );
    }, [colors.text.alternative, colors.text.default]);

    return (
      <View style={[Style.s({ flex: 1 }), style]}>
        <FlatList
          data={category.id === 1000000 ? favorites : dapps}
          contentContainerStyle={Style.s({ px: 16, py: 12 })}
          renderItem={renderItemResult}
          ItemSeparatorComponent={renderItemSeparator}
          keyExtractor={keyEx}
          ListEmptyComponent={renderEmptyComponent}
          refreshing={isValidating}
          onRefresh={mutate}
        />
      </View>
    );
  },
);
