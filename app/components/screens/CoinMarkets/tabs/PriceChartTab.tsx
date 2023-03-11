import React, { memo, useMemo } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';
import { useTheme } from '../../../../util/theme';
import { scale } from '../../../../util/scale';
import { useCoinMarkets } from '../../../../reducers/coinmarkets/slice';
import { DetailCoinInterface } from '../DetailCoinScreen';
import { icons } from '../../../../assets';
import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import { CoinsDetailParams } from '../../../../types/coingecko/schema';
import { getCoinDetails } from '../../../../reducers/coinmarkets/functions';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.border.default + '30',
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

    titlePrompt: {
      fontSize: 14,
      color: colors.text.muted,
      fontWeight: '500',
    },
    titlePrice: {
      fontSize: 32,
      color: colors.text.default,
      fontWeight: '700',
      paddingLeft: 20,
    },
    titleValue: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
      textAlign: 'right',
    },
    titlePercent: {
      fontSize: 12,
      color: colors.error.default,
      fontWeight: '600',
    },
    titleTime: {
      fontSize: 12,
      color: colors.text.default,
      fontWeight: '600',
    },
    iconArrow: {
      width: 20,
      height: 12,
      tintColor: colors.error.default,
    },
    containerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 4,
    },
    containerMarket: {
      alignItems: 'flex-end',
      width: scale(120),
    },
    containerSymbol: {
      alignItems: 'center',
      width: scale(50),
    },
    containerScroll: {
      paddingVertical: 10,
    },
    btnScroll: {
      marginHorizontal: 10,
    },
    wrapTable: {
      backgroundColor: colors.background.default,
      margin: 20,
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: colors.border.muted,
    },
    containerTable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      marginHorizontal: 20,
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border.muted,
      marginHorizontal: 20,
    },
    row: {
      flexDirection: 'row',
    },
    wrapView: {
      flexDirection: 'row',
      paddingVertical: 10,
      marginHorizontal: 12,
      justifyContent: 'space-around',
    },
  });

const PriceChangePercentage = [
  'price_change_percentage_24h_in_currency',
  'price_change_percentage_7d_in_currency',
  'price_change_percentage_14d_in_currency',
  'price_change_percentage_30d_in_currency',
  'price_change_percentage_60d_in_currency',
  'price_change_percentage_1y_in_currency',
];

export const PriceChartTab = memo(({ id, currency }: DetailCoinInterface) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { call, error, loading } = useAsyncEffect(async () => {
    const params: Omit<CoinsDetailParams, 'id'> = {
      localization: 'false',
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    };
    await getCoinDetails(params, id);
  }, [id]);

  const coin_details = useCoinMarkets(id);

  const price = useMemo(() => {
    if (coin_details) {
      return coin_details?.current_price.toLocaleString('en', {
        minimumFractionDigits: 2,
      });
    }
  }, [coin_details]);

  const totalValuation = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.fully_diluted_valuation)
      return 0;
    return coin_details?.market_data.fully_diluted_valuation[
      currency
    ].toLocaleString('en', {
      maximumFractionDigits: 0,
    });
  }, [coin_details, currency]);

  const totalMarketCap = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.market_cap) return 0;
    return coin_details?.market_data.market_cap[currency].toLocaleString('en', {
      maximumFractionDigits: 0,
    });
  }, [coin_details, currency]);

  const totalVolume = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.total_volume) return 0;
    return coin_details?.market_data.total_volume[currency].toLocaleString(
      'en',
      {
        maximumFractionDigits: 0,
      },
    );
  }, [coin_details, currency]);

  const totalHigh = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.high_24h) return 0;
    return coin_details?.market_data.high_24h[currency].toLocaleString('en', {
      minimumFractionDigits: 2,
    });
  }, [coin_details, currency]);

  const totalLow = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.low_24h) return 0;
    return coin_details?.market_data.low_24h[currency].toLocaleString('en', {
      minimumFractionDigits: 2,
    });
  }, [coin_details, currency]);

  const availableSupply = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.circulating_supply)
      return 0;
    return coin_details?.market_data.circulating_supply / 1000000;
  }, [coin_details]);

  const totalSupply = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.total_supply) return 0;
    return coin_details?.market_data.total_supply / 1000000;
  }, [coin_details]);

  const maxSupply = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.total_supply) return 0;
    return coin_details?.market_data.max_supply / 1000000;
  }, [coin_details]);

  const AllTimeHigh = useMemo(() => {
    if (coin_details) {
      return coin_details?.market_data?.ath_date[currency];
    }
    return '';
  }, [coin_details, currency]);

  const AllTimeLow = useMemo(() => {
    if (coin_details) {
      return coin_details?.market_data?.atl_date[currency];
    }
    return '';
  }, [coin_details, currency]);

  const AllTimeHighPrice = useMemo(() => {
    if (coin_details) {
      return coin_details?.market_data?.ath?.usd.toLocaleString();
    }
    return 0;
  }, [coin_details]);

  const AllTimeLowPrice = useMemo(() => {
    if (coin_details) {
      return coin_details?.market_data?.atl?.usd.toLocaleString();
    }
    return 0;
  }, [coin_details]);

  const AllTimeHighPercent = useMemo(() => {
    if (coin_details) {
      return (
        coin_details?.market_data?.ath_change_percentage?.usd.toLocaleString() ||
        '0'
      );
    }
    return '0';
  }, [coin_details]);

  const AllTimeLowPercent = useMemo(() => {
    if (coin_details) {
      return (
        coin_details?.market_data?.atl_change_percentage?.usd.toLocaleString(
          'en',
          {
            maximumFractionDigits: 0,
          },
        ) || '0'
      );
    }
    return 0;
  }, [coin_details]);

  const colorPercentHigh = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.ath_change_percentage.usd)
      return colors.error.default;
    if (coin_details?.market_data.ath_change_percentage.usd < 0) {
      return colors.error.default;
    }
    return colors.primary.default;
  }, [coin_details, colors.error.default, colors.primary.default]);

  const colorPercentLow = useMemo(() => {
    if (!coin_details || !coin_details?.market_data?.atl_change_percentage.usd)
      return colors.error.default;
    if (coin_details?.market_data.atl_change_percentage.usd < 0) {
      return colors.error.default;
    }
    return colors.primary.default;
  }, [coin_details, colors.error.default, colors.primary.default]);

  const rotateHigh = useMemo((): ViewPropTypes => {
    if (!coin_details || !coin_details?.market_data?.ath_change_percentage.usd)
      return {};
    if (coin_details?.market_data.ath_change_percentage.usd < 0) {
      return {};
    }

    return { transform: [{ rotate: '180deg' }] };
  }, [coin_details]);

  const rotateLow = useMemo((): ViewPropTypes => {
    if (!coin_details || !coin_details?.market_data?.atl_change_percentage.usd)
      return {};
    if (coin_details?.market_data.atl_change_percentage.usd < 0) {
      return {};
    }

    return { transform: [{ rotate: '180deg' }] };
  }, [coin_details]);

  const globalPercent = useMemo(() => {
    if (
      !coin_details ||
      !coin_details?.market_data?.price_change_percentage_24h_in_currency
    )
      return 0;
    if (
      coin_details.market_data.price_change_percentage_24h_in_currency[
        currency
      ] < 0
    ) {
      return coin_details.market_data.price_change_percentage_24h_in_currency[
        currency
      ]
        .toLocaleString(undefined, {
          minimumFractionDigits: 1,
        })
        .substring(1);
    }
    return coin_details.market_data.price_change_percentage_24h_in_currency[
      currency
    ].toLocaleString(undefined, {
      minimumFractionDigits: 1,
    });
  }, [currency, coin_details]);

  const colorPercent = useMemo(() => {
    if (
      !coin_details ||
      !coin_details?.market_data?.price_change_percentage_24h_in_currency?.usd
    )
      return colors.error.default;
    if (
      coin_details.market_data.price_change_percentage_24h_in_currency.usd < 0
    ) {
      return colors.error.default;
    }

    return colors.primary.default;
  }, [coin_details, colors.error.default, colors.primary.default]);

  const rotate = useMemo((): ViewPropTypes => {
    if (
      !coin_details ||
      !coin_details?.market_data?.price_change_percentage_24h_in_currency?.usd
    )
      return {};
    if (
      coin_details.market_data.price_change_percentage_24h_in_currency.usd < 0
    ) {
      return {};
    }

    return { transform: [{ rotate: '180deg' }] };
  }, [coin_details]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={call} />}
    >
      <TouchableOpacity style={styles.row}>
        <Text style={styles.titlePrice}>
          {currency === 'usd' ? '$' : '₿'}
          {price}
        </Text>
        <View style={styles.containerContent}>
          <Image
            source={icons.iconSelectorArrow}
            style={[styles.iconArrow, { tintColor: colorPercent }, rotate]}
          />
          <Text style={[styles.title, { color: colorPercent }]}>
            {globalPercent + '%'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.wrapTable}>
        <View style={[styles.wrapView]}>
          <Text style={styles.titleTime}>{'24H'}</Text>
          <Text style={styles.titleTime}>{'7D'}</Text>
          <Text style={styles.titleTime}>{'14D'}</Text>
          <Text style={styles.titleTime}>{'30D'}</Text>
          <Text style={styles.titleTime}>{'60D'}</Text>
          <Text style={styles.titleTime}>{'1Y'}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.wrapView}>
          {PriceChangePercentage.map((item, index) => {
            return (
              <View style={styles.containerContent} key={index}>
                <Image
                  source={icons.iconSelectorArrow}
                  style={[
                    styles.iconArrow,
                    {
                      tintColor:
                        !coin_details || !coin_details?.market_data
                          ? colors.error.default
                          : coin_details.market_data[item][currency] < 0
                          ? colors.error.default
                          : colors.primary.default,
                    },
                    {
                      transform: [
                        {
                          rotate:
                            !coin_details || !coin_details?.market_data
                              ? '0deg'
                              : coin_details.market_data[item][currency] < 0
                              ? '0deg'
                              : '180deg',
                        },
                      ],
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        !coin_details || !coin_details?.market_data
                          ? colors.error.default
                          : coin_details.market_data[item][currency] < 0
                          ? colors.error.default
                          : colors.primary.default,
                    },
                  ]}
                >
                  {!coin_details || !coin_details?.market_data
                    ? 0
                    : coin_details.market_data[item][currency] < 0
                    ? coin_details.market_data[item][currency]
                        .toLocaleString(undefined, {
                          maximumFractionDigits: 1,
                        })
                        .substring(1)
                    : coin_details.market_data[item][currency].toLocaleString(
                        'en',
                        {
                          maximumFractionDigits: 1,
                        },
                      )}
                  %
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.wrapTable}>
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Market Cap Rank'}</Text>
          <Text style={styles.titleValue}>
            #{coin_details?.market_cap_rank}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Market Cap'}</Text>
          <Text style={styles.titleValue}>
            {currency === 'usd' ? '$' : '₿'}
            {totalMarketCap}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Fully Diluted Valuation'}</Text>
          <Text style={styles.titleValue}>
            {currency === 'usd' ? '$' : '₿'}
            {totalValuation}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Trading Volume'}</Text>
          <Text style={styles.titleValue}>
            {currency === 'usd' ? '$' : '₿'}
            {totalVolume}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'24H High'}</Text>
          <Text style={styles.titleValue}>
            {currency === 'usd' ? '$' : '₿'}
            {totalHigh}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'24H Low'}</Text>
          <Text style={styles.titleValue}>
            {currency === 'usd' ? '$' : '₿'}
            {totalLow}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Available Supply'}</Text>
          <Text style={styles.titleValue}>{`${availableSupply} Million`}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Total Supply'}</Text>
          <Text style={styles.titleValue}>{totalSupply} Million</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Max Supply'}</Text>
          <Text style={styles.titleValue}>
            {!maxSupply ? '?' : `${maxSupply} Million`}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'All - Time High'}</Text>
          <View>
            <View style={styles.row}>
              <Text style={styles.titleValue}>${AllTimeHighPrice}</Text>
              <View style={styles.containerContent}>
                <Image
                  source={icons.iconSelectorArrow}
                  style={[
                    styles.iconArrow,
                    { tintColor: colorPercentHigh },
                    rotateHigh,
                  ]}
                />
                <Text style={[styles.title, { color: colorPercentHigh }]}>
                  {`${AllTimeHighPercent.replace('-', '')}%`}
                </Text>
              </View>
            </View>
            <Text style={styles.titleValue}>{AllTimeHigh}</Text>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'All - Time Low'}</Text>
          <View>
            <View style={styles.row}>
              <Text style={styles.titleValue}>${AllTimeLowPrice}</Text>
              <View style={styles.containerContent}>
                <Image
                  source={icons.iconSelectorArrow}
                  style={[
                    styles.iconArrow,
                    { tintColor: colorPercentLow },
                    rotateLow,
                  ]}
                />
                <Text style={[styles.title, { color: colorPercentLow }]}>
                  {AllTimeLowPercent + '%'}
                </Text>
              </View>
            </View>
            <Text style={styles.titleValue}>{AllTimeLow}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
});
