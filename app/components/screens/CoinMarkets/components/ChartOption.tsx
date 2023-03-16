import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  InteractionManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../../util/theme';
import {
  CoinsDetailParams,
  MarketChartDetailParams,
} from '../../../../types/coingecko/schema';
import { TypeChart } from '../types';
import { BottomMenuSelector } from '../../../common/BottomMenu';
import {
  CandlestickChart,
  LineChart,
  TData,
  TLineChartDataProp,
} from 'react-native-wagmi-charts';
import { scale } from '../../../../util/scale';
import { EmptyView } from '../../../Base/EmptyView';
import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import {
  getCandlestickChart,
  getCoinDetails,
  getMarketChart,
} from '../../../../reducers/coinmarkets/functions';

const createStyles = (colors: any) =>
  StyleSheet.create({
    titleTime: {
      fontSize: 14,
      fontWeight: '600',
    },

    wrapTabChart: {
      flexDirection: 'row',
      marginHorizontal: 16,
      justifyContent: 'space-between',
    },
    touchTimeChart: {
      backgroundColor: colors.primary.default,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 40,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    divider: {
      height: '100%',
      width: 1,
      backgroundColor: colors.border.default,
    },
    row: {
      flexDirection: 'row',
    },
    touch: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    image: {
      width: 20,
      height: 20,
    },
    containerEmpty: {
      paddingVertical: 32,
    },
  });

export interface ChartOptionInterface {
  id: string;
  currency: string;
}

export const ChartOption = memo(({ id, currency }: ChartOptionInterface) => {
  const [paramsType, setParamsType] = useState<string>('market_cap');
  const [paramsChart, setParamsChart] = useState<MarketChartDetailParams>({
    id,
    vs_currency: currency,
    days: '1',
  });
  const { call, error, value, loading } = useAsyncEffect(async () => {
    if (paramsType === 'candlestick_chart') {
      return await getCandlestickChart(paramsChart);
    }
    return await getMarketChart(paramsChart);
  }, [id, paramsChart, paramsType]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onChangeParams = useCallback((value: string) => {
    setParamsChart((state) => ({ ...state, days: value }));
  }, []);

  const dataCharts = useMemo((): TLineChartDataProp => {
    if (paramsType === 'market_cap')
      return (
        (value?.market_caps || []).map((item: any[]) => ({
          timestamp: item[0],
          value: item[1],
        })) || []
      );

    return (
      (value?.prices || []).map((item: any[]) => ({
        timestamp: item[0],
        value: item[1],
      })) || []
    );
  }, [paramsType, value]);

  const dataCandlestickChart = useMemo(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {}, 500);
    });
    if (paramsType === 'candlestick_chart' && !value?.prices) {
      return (value || []).map((item: any[]) => ({
        timestamp: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
      }));
    }
    return [];
  }, [paramsType, value]);

  const { colors } = useTheme();
  const styles = createStyles(colors);

  const onChangeCustoms = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (inputName: string, value: string | number) => {
      setParamsType(value.toString());
    },
    [],
  );
  return (
    <View>
      {dataCharts.length === 0 && dataCandlestickChart.length === 0 && (
        <View style={styles.containerEmpty}>
          <EmptyView />
        </View>
      )}
      {paramsType !== 'candlestick_chart' && dataCharts.length > 0 && (
        <LineChart.Provider data={dataCharts}>
          <LineChart height={scale(210)}>
            <LineChart.Path width={2} color={colors.info.default}>
              <LineChart.Gradient />
            </LineChart.Path>
            <LineChart.CursorCrosshair />
          </LineChart>
          <LineChart.PriceText />
          <LineChart.DatetimeText />
        </LineChart.Provider>
      )}
      {dataCandlestickChart.length > 0 && paramsType === 'candlestick_chart' && (
        <CandlestickChart.Provider data={dataCandlestickChart}>
          <CandlestickChart height={scale(210)}>
            <CandlestickChart.Candles
              positiveColor={colors.primary.default}
              negativeColor={colors.overlay.default}
            />
            <CandlestickChart.Crosshair color="hotpink" />
          </CandlestickChart>
          <CandlestickChart.PriceText />
          <CandlestickChart.DatetimeText />
        </CandlestickChart.Provider>
      )}
      <View style={styles.wrapTabChart}>
        <TouchableOpacity
          style={[
            styles.touchTimeChart,
            {
              backgroundColor:
                paramsChart.days === '1'
                  ? colors.primary.default
                  : 'transparent',
            },
          ]}
          onPress={() => onChangeParams('1')}
        >
          <Text
            style={[
              styles.titleTime,
              {
                color:
                  paramsChart.days === '1'
                    ? colors.background.default
                    : colors.text.default,
              },
            ]}
          >
            {'24H'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.touchTimeChart,
            {
              backgroundColor:
                paramsChart.days === '7'
                  ? colors.primary.default
                  : 'transparent',
            },
          ]}
          onPress={() => onChangeParams('7')}
        >
          <Text
            style={[
              styles.titleTime,
              {
                color:
                  paramsChart.days === '7'
                    ? colors.background.default
                    : colors.text.default,
              },
            ]}
          >
            {'7D'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.touchTimeChart,
            {
              backgroundColor:
                paramsChart.days === '30'
                  ? colors.primary.default
                  : 'transparent',
            },
          ]}
          onPress={() => onChangeParams('30')}
        >
          <Text
            style={[
              styles.titleTime,
              {
                color:
                  paramsChart.days === '30'
                    ? colors.background.default
                    : colors.text.default,
              },
            ]}
          >
            {'1M'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.touchTimeChart,
            {
              backgroundColor:
                paramsChart.days === '90'
                  ? colors.primary.default
                  : 'transparent',
            },
          ]}
          onPress={() => onChangeParams('90')}
        >
          <Text
            style={[
              styles.titleTime,
              {
                color:
                  paramsChart.days === '90'
                    ? colors.background.default
                    : colors.text.default,
              },
            ]}
          >
            {'30M'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.touchTimeChart,
            {
              backgroundColor:
                paramsChart.days === '365'
                  ? colors.primary.default
                  : 'transparent',
            },
          ]}
          onPress={() => onChangeParams('365')}
        >
          <Text
            style={[
              styles.titleTime,
              {
                color:
                  paramsChart.days === '365'
                    ? colors.background.default
                    : colors.text.default,
              },
            ]}
          >
            {'1Y'}
          </Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.touchTimeChart,
              {
                backgroundColor:
                  paramsChart.days === 'max'
                    ? colors.primary.default
                    : 'transparent',
              },
            ]}
            onPress={() => onChangeParams('max')}
          >
            <Text
              style={[
                styles.titleTime,
                {
                  color:
                    paramsChart.days === 'max'
                      ? colors.background.default
                      : colors.text.default,
                },
              ]}
            >
              {'MAX'}
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <BottomMenuSelector
            label={'Price % Change Timeframe'}
            options={TypeChart}
            inputName={'price_change_percentage'}
            placeholder={'24H'}
            onSelectOption={onChangeCustoms}
            selectedValue={paramsType}
            containerStyle={{ backgroundColor: 'transparent' }}
          />
        </View>
      </View>
    </View>
  );
});
