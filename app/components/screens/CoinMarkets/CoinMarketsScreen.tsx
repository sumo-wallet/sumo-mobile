import React, { memo, useCallback, useState } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { useTheme } from '../../../util/theme';
import PagerView from 'react-native-pager-view';
import { Style } from '../../../styles';
import { CoinMarketList } from './tabs/CoinMarketList';
import { CoinFavouriteList } from './tabs/CoinFavouriteList';
import { CoinMarketHeader } from './components/CoinMarketHeader';
import { icons } from '../../../assets';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../constants/navigation/Routes';
import { MarketsListParams } from '../../../types/coingecko/schema';
import { useAsyncEffect } from '../../hooks/useAsyncEffect';
import {
  getCoinMarkets,
  getGlobalMarkets,
} from '../../../reducers/coinmarkets/functions';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: colors.text.default,
      marginRight: 10,
    },
    containerRight: {
      flexDirection: 'row',
    },
  });

export const CoinMarketsScreen = memo(() => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const [params, setParams] = useState<MarketsListParams>({
    page: 1,
    per_page: 20,
    vs_currency: 'btc',
    price_change_percentage: '24h',
    order: 'market_cap_desc',
  });

  const { call, loading } = useAsyncEffect(async () => {
    await getGlobalMarkets();
    return await getCoinMarkets(params);
  }, [params]);

  const pagerViewRef = React.useRef<PagerView>();
  const [pageIndex, setPageIndex] = React.useState(0);

  const onViewSearch = useCallback(() => {
    navigation.navigate(Routes.MARKET_SEARCH);
  }, [navigation]);

  const onTabChanged = (newIndex: number) => {
    setPageIndex(newIndex);
    if (pagerViewRef) {
      pagerViewRef.current?.setPage(newIndex);
    }
  };

  return (
    <View style={styles.wrapper}>
      <DynamicHeader title={'Market'} hideGoBack>
        <View style={styles.containerRight}>
          <TouchableOpacity onPress={onViewSearch}>
            <Image source={icons.iconSearch} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </DynamicHeader>
      <CoinMarketHeader page={pageIndex} onSelected={onTabChanged} />
      <PagerView
        ref={pagerViewRef as any}
        onPageSelected={(event) => {
          setPageIndex(event.nativeEvent.position);
        }}
        style={Style.s({ flex: 1 })}
      >
        <CoinMarketList
          params={params}
          onUpdateParams={setParams}
          loading={loading}
          call={call}
        />
        <CoinFavouriteList params={params} />
      </PagerView>
    </View>
  );
});
