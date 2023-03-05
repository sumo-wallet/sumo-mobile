import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { useTheme } from '../../../util/theme';
import PagerView from 'react-native-pager-view';
import { Style } from '../../../styles';
import { CoinMarketList } from './tabs/CoinMarketList';
import { CoinFavouriteList } from './tabs/CoinFavouriteList';
import { CoinMarketHeader } from './components/CoinMarketHeader';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
  });

export const CoinMarketsScreen = memo(() => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const pagerViewRef = React.useRef<PagerView>();
  const [pageIndex, setPageIndex] = React.useState(0);

  const onTabChanged = (newIndex: number) => {
    setPageIndex(newIndex);
    if (pagerViewRef) {
      pagerViewRef.current?.setPage(newIndex);
    }
  };

  return (
    <View style={styles.wrapper}>
      <DynamicHeader title={'Market'} hideGoBack />
      <CoinMarketHeader page={pageIndex} onSelected={onTabChanged} />
      <PagerView
        ref={pagerViewRef as any}
        onPageSelected={(event) => {
          setPageIndex(event.nativeEvent.position);
        }}
        style={Style.s({ flex: 1 })}
      >
        <CoinMarketList />
        <CoinFavouriteList />
      </PagerView>
    </View>
  );
});
