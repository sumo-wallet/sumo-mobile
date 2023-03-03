import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollTabCoin } from '../components/ScrollTabCoin';
import { MarketsListParams } from '../../../../types/coingecko/schema';
import { CoinItem } from '../components/CoinItem';
import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import {
  getCoinMarkets,
  getGlobalMarkets,
} from '../../../../reducers/coinmarkets/functions';
import {
  getCoinMarketsByQuery,
  useCoinMarketsByQuery,
} from '../../../../reducers/coinmarkets/slice';
import { useTheme } from '../../../../util/theme';
import { scale } from '../../../../util/scale';
import { icons } from '../../../../assets';

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
    titleGlobal: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text.muted,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    wrapperGlobal: {
      flexDirection: 'row',
      marginVertical: 12,
    },
    containerGlobal: {
      paddingVertical: 8,
      paddingLeft: 12,
      paddingRight: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border.muted,
      marginRight: 20,
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

export const CoinMarketList = memo(() => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const coinIds = getCoinMarketsByQuery('all');
  const globalMarket = useCoinMarketsByQuery('global_market');
  const [params, setParams] = useState<MarketsListParams>({
    page: 1,
    per_page: 20,
    vs_currency: 'btc',
    price_change_percentage: '24h',
    order: 'market_cap_desc',
  });
  const { value, call, error, loading } = useAsyncEffect(async () => {
    await getGlobalMarkets();
    return await getCoinMarkets(params);
  }, [params]);

  const onReload = useCallback(async () => {
    setParams((state) => ({ ...state, page: 1 }));
    await call();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const paramsCustom = useCallback((value: MarketsListParams) => {
    setParams((state) => Object.assign({ ...state }, value));
  }, []);

  const updateParams = useCallback(async () => {
    const data = await call();
    if (data && data.length >= 20) {
      setParams((state) => ({ ...state, page: (params?.page || 0) + 1 }));
    }
  }, [call, params.page]);

  const renderItem = useCallback(
    ({ item }: { item: string }) => {
      return <CoinItem id={item} paramsMarket={params} />;
    },
    [params],
  );

  const globalPercent = useMemo(() => {
    if (
      !globalMarket ||
      globalMarket.length === 0 ||
      !globalMarket.data.market_cap_change_percentage_24h_usd
    )
      return 0;
    if (
      parseFloat(globalMarket.data.market_cap_change_percentage_24h_usd) < 0
    ) {
      return globalMarket.data.market_cap_change_percentage_24h_usd
        .toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })
        .substring(1);
    }

    return globalMarket.data.market_cap_change_percentage_24h_usd.toLocaleString(
      undefined,
      {
        maximumFractionDigits: 1,
      },
    );
  }, [globalMarket]);

  const totalVolume = useMemo(() => {
    if (!globalMarket || globalMarket.length === 0) return 0;
    return globalMarket.data.total_volume.btc.toLocaleString('en', {
      maximumFractionDigits: 0,
    });
  }, [globalMarket]);

  const totalMarketCap = useMemo(() => {
    if (!globalMarket || globalMarket.length === 0) return 0;
    return globalMarket.data.total_market_cap.btc.toLocaleString('en', {
      maximumFractionDigits: 0,
    });
  }, [globalMarket]);
  return (
    <View>
      <FlatList
        ListHeaderComponent={
          <View style={styles.wrapperHeader}>
            <View style={styles.wrapperGlobal}>
              <View style={styles.containerGlobal}>
                <Text style={styles.titleGlobal}>{'Global market cap'}</Text>
                <View style={styles.row}>
                  <View style={styles.row}>
                    <Image source={icons.iconBitcoin} style={styles.icon} />
                    <Text style={styles.title}>{totalMarketCap}</Text>
                  </View>
                  <View style={styles.row}>
                    <Image
                      source={icons.iconSelectorArrow}
                      style={styles.iconArrow}
                    />
                    <Text style={styles.titlePercent}>
                      {globalPercent + '%'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.containerGlobal}>
                <Text style={styles.titleGlobal}>{'24H Volume'}</Text>
                <View style={styles.row}>
                  <Image source={icons.iconBitcoin} style={styles.icon} />
                  <Text style={styles.title}>{totalVolume}</Text>
                </View>
              </View>
            </View>
            <ScrollTabCoin paramsMarket={params} onSelect={paramsCustom} />
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
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onReload} />
        }
        keyboardDismissMode={'on-drag'}
        data={coinIds}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={updateParams}
        onEndReachedThreshold={0.4}
      />
    </View>
  );
});
