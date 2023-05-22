import React, { memo, useCallback, useMemo } from 'react';
import { useCoinMarkets } from '../../../../reducers/coinmarkets/slice';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';
import { useTheme } from '../../../../util/theme';
import FastImage from 'react-native-fast-image';
import { scale } from '../../../../util/scale';
import { icons } from '../../../../assets';
import { MarketsListParams } from '../../../../types/coingecko/schema';
import { navigateToDetailCoinScreen } from '../../../Base/navigation';
import { useFavouriteMarketsByQuery } from '../../../../reducers/favouritemarkets/slice';

export interface CoinItemInterface {
  id: string;
  paramsMarket: MarketsListParams;
  isFavourite?: boolean;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.muted,
      padding: 16,
      paddingVertical: 8,
      justifyContent: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 23,
      height: 23,
      marginBottom: 2,
    },
    textRank: {
      fontSize: 12,
      color: colors.text.muted,
    },

    title: {
      fontSize: 13,
      color: colors.text.default,
      fontWeight: '600',
    },
    containerSymbol: {
      alignItems: 'center',
      width: scale(42),
    },
    subContainerSymbol: {
      alignItems: 'center',
    },
    wrapView: {
      width: 20,
      justifyContent: 'center',
    },
    containerContent: {
      justifyContent: 'flex-end',
      width: scale(90),
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerChange: {
      justifyContent: 'flex-end',
      width: scale(80),
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerMarket: {
      alignItems: 'flex-end',
      width: scale(120),
    },
    iconArrow: {
      width: 20,
      height: 12,
    },
    iconBitcoin: {
      width: 14,
      height: 14,
    },
    iconFavourite: {
      width: 14,
      height: 14,
      position: 'absolute',
      top: -5,
      left: -20,
      zIndex: 1,
    },
  });

export const CoinItem = memo(
  ({ id, paramsMarket, isFavourite }: CoinItemInterface) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const coin = useCoinMarkets(id);
    const favouriteIds = useFavouriteMarketsByQuery('all');

    const isFavouriteIds = useMemo(() => {
      return favouriteIds.includes(id);
    }, [favouriteIds, id]);

    const globalPercent = useMemo(() => {
      if (
        !coin ||
        !coin[
          `price_change_percentage_${paramsMarket.price_change_percentage}_in_currency`
        ]
      )
        return '0.0';
      if (
        coin[
          `price_change_percentage_${paramsMarket.price_change_percentage}_in_currency`
        ] < 0
      ) {
        return coin[
          `price_change_percentage_${paramsMarket.price_change_percentage}_in_currency`
        ]
          .toLocaleString(undefined, {
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          })
          .substring(1);
      }

      return coin[
        `price_change_percentage_${paramsMarket.price_change_percentage}_in_currency`
      ].toLocaleString(undefined, {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      });
    }, [coin, paramsMarket.price_change_percentage]);

    const colorPercent = useMemo(() => {
      if (
        !coin ||
        !coin[
          `price_change_percentage_${paramsMarket.price_change_percentage}_in_currency`
        ]
      )
        return colors.error.default;
      if (
        coin[
          `price_change_percentage_${paramsMarket.price_change_percentage}_in_currency`
        ] < 0
      ) {
        return colors.error.default;
      }

      return colors.primary.default;
    }, [
      coin,
      colors.error.default,
      colors.primary.default,
      paramsMarket.price_change_percentage,
    ]);

    const totalMarketCap = useMemo(() => {
      if (coin?.market_cap) {
        return coin.market_cap.toLocaleString('en', {
          maximumFractionDigits: 8,
          minimumFractionDigits: 0,
        });
      }
      return 0;
    }, [coin]);

    const price = useMemo(() => {
      if (coin?.current_price) {
        return paramsMarket.vs_currency === 'usd'
          ? coin.current_price.toLocaleString('en', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            })
          : coin.current_price.toLocaleString('en', {
              minimumFractionDigits: 6,
              maximumFractionDigits: 8,
            });
      }
    }, [coin]);

    const rotate = useMemo((): ViewPropTypes => {
      if (
        !coin ||
        !coin[
          `price_change_percentage_${paramsMarket.price_change_percentage}_in_currency`
        ]
      )
        return {};
      if (
        coin[
          `price_change_percentage_${paramsMarket.price_change_percentage}_in_currency`
        ] < 0
      ) {
        return {};
      }

      return { transform: [{ rotate: '180deg' }] };
    }, [coin, paramsMarket.price_change_percentage]);

    const fontSizeRank = useMemo(() => {
      if (!coin) return 12;
      if ((coin.market_cap_rank || '').toString().length === 1) return 12;
      if ((coin.market_cap_rank || '').toString().length === 3) return 10;
      if ((coin.market_cap_rank || '').toString().length >= 4) return 8;
    }, [coin]);

    const fontCoin = useMemo(() => {
      if (!coin) return 12;
      if ((coin.symbol || '').toString().length >= 6) return 8;
      return 12;
    }, [coin]);

    const onNavigate = useCallback(() => {
      navigateToDetailCoinScreen({
        id: coin?.id || '0',
        currency: paramsMarket.vs_currency,
      });
    }, [coin?.id, paramsMarket.vs_currency]);

    const urlCoin = useMemo(() => {
      if (coin) {
        if (typeof coin.image === 'string') return coin.image;
        if (typeof coin.image === 'object') return coin.image.thumb;
      }
      return '';
    }, [coin]);

    if (!coin) return null;

    return (
      <TouchableOpacity style={styles.wrapper} onPress={onNavigate}>
        <View style={styles.wrapView}>
          <Text
            style={[styles.textRank, { fontSize: fontSizeRank }]}
            numberOfLines={1}
          >
            {coin.market_cap_rank || '-'}
          </Text>
        </View>
        <View style={styles.containerSymbol}>
          <View style={styles.subContainerSymbol}>
            {!isFavourite && isFavouriteIds && (
              <Image
                source={icons.iconFavouritedFill}
                style={styles.iconFavourite}
              />
            )}
            <FastImage source={{ uri: urlCoin }} style={styles.icon} />
            <Text
              style={[styles.title, { fontSize: fontCoin }]}
              numberOfLines={1}
            >
              {coin.symbol.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.containerContent}>
          <Text style={[styles.title]}>
            {paramsMarket.vs_currency === 'usd' ? '$' : '₿'}
            {price}
          </Text>
        </View>
        <View style={styles.containerChange}>
          <Image
            source={icons.iconSelectorArrow}
            style={[styles.iconArrow, { tintColor: colorPercent }, rotate]}
          />
          <Text style={[styles.title, { color: colorPercent }]}>
            {globalPercent + '%'}
          </Text>
        </View>
        <View style={styles.containerMarket}>
          <Text style={styles.title}>
            {paramsMarket.vs_currency === 'usd' ? '$' : '₿'}
            {totalMarketCap}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
