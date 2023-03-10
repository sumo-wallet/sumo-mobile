import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { useTheme } from '../../../util/theme';
import { useCoinMarkets } from '../../../reducers/coinmarkets/slice';
import ScrollTabCoinDetail, {
  TYPE_TAB,
} from './components/ScrollTabCoinDetail';
import PagerView from 'react-native-pager-view';
import useNavigatorParams from '../../hooks/useNavigatorParams';
import { PriceChartTab } from './tabs/PriceChartTab';
import { InfoCoinTab } from './tabs/InfoCoinTab';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.border.default + '30',
    },
  });

export interface DetailCoinInterface {
  id: string;
  currency: string;
}

export const DetailCoinScreen = memo(() => {
  const { id, currency } = useNavigatorParams<DetailCoinInterface>();
  const pagerViewRef = React.useRef<PagerView>();

  const { colors } = useTheme();
  const styles = createStyles(colors);

  const coin_details = useCoinMarkets(id);

  const onChangeTab = useCallback((value: TYPE_TAB) => {
    if (value === TYPE_TAB.PRICE_CHART) {
      pagerViewRef.current?.setPage(0);
      return;
    } else if (value === TYPE_TAB.INFO) {
      pagerViewRef.current?.setPage(1);

      return;
    }
    return;
  }, []);

  if (!coin_details) return null;

  return (
    <View style={styles.wrapper}>
      <DynamicHeader
        title={`${coin_details?.name || ''} (${(
          coin_details?.symbol || ''
        ).toUpperCase()})`}
        style={{ backgroundColor: colors.border.default + '30' }}
      />
      <ScrollTabCoinDetail onChangeTab={onChangeTab} />
      <PagerView
        ref={pagerViewRef as any}
        initialPage={0}
        scrollEnabled={false}
        style={styles.wrapper}
      >
        <PriceChartTab id={id} currency={currency} />
        <InfoCoinTab id={id} currency={currency} />
      </PagerView>
    </View>
  );
});
