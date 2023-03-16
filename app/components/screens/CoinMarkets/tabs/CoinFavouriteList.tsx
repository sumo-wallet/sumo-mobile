import React, { memo, useCallback } from 'react';
import { useTheme } from '../../../../util/theme';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getFavouriteMarketsByQuery } from '../../../../reducers/favouritemarkets/slice';
import { scale } from '../../../../util/scale';
import { MarketsListParams } from '../../../../types/coingecko/schema';
import { CoinItem } from '../components/CoinItem';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    wrapperHeader: {
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.muted,
      paddingVertical: 12,
    },
    wrapperItem: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    titleItem: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text.muted,
      textTransform: 'uppercase',
    },

    title: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
    },
    titlePercent: {
      fontSize: 14,
      color: colors.error.default,
      fontWeight: '600',
    },
    icon: {
      width: 14,
      height: 14,
      marginRight: 4,
    },
    row: {
      flexDirection: 'row',
    },
    iconArrow: {
      width: 20,
      height: 12,
      tintColor: colors.error.default,
    },
    wrapView: {
      flex: 1,
    },
    containerContent: {
      alignItems: 'flex-end',
      width: scale(80),
    },
    containerMarket: {
      alignItems: 'flex-end',
      width: scale(120),
    },
    containerSymbol: {
      alignItems: 'center',
      width: scale(50),
    },
  });

export interface CoinFavouriteListInterface {
  params: MarketsListParams;
}

export const CoinFavouriteList = memo(
  ({ params }: CoinFavouriteListInterface) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const coinIds = getFavouriteMarketsByQuery('all');

    const renderItem = useCallback(
      ({ item }: { item: string }) => {
        return <CoinItem id={item} paramsMarket={params} />;
      },
      [params],
    );

    return (
      <View>
        <FlatList
          ListHeaderComponent={
            <View style={styles.wrapperHeader}>
              <View style={styles.wrapperItem}>
                <View style={styles.wrapView}>
                  <Text style={styles.titleItem}>{'#'}</Text>
                </View>
                <View style={styles.containerSymbol}>
                  <Text style={styles.titleItem}>{'Coin'}</Text>
                </View>
                <View style={styles.containerContent}>
                  <Text style={styles.titleItem}>{'Price'}</Text>
                </View>
                <View style={styles.containerContent}>
                  <Text style={styles.titleItem}>
                    {params.price_change_percentage}
                  </Text>
                </View>
                <View style={styles.containerMarket}>
                  <Text style={styles.titleItem}>{'Market cap'}</Text>
                </View>
              </View>
            </View>
          }
          keyboardDismissMode={'on-drag'}
          data={coinIds}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.4}
        />
      </View>
    );
  },
);
