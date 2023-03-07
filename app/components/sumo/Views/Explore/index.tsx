import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { DynamicHeader } from '../../../Base/DynamicHeader';
import { useTheme } from '../../../../util/theme';
import PagerView from 'react-native-pager-view';
import { Style } from '../../../../styles';
import { LearnScreen } from '../../UI/ExploreLearn';
import { TabHeader } from './TabHeader';
import { ExploreNewsScreen } from '../../UI/ExploreNews';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
  });

export const ExploreScreen = memo(() => {
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
      <DynamicHeader title={'Explore'} />
      <TabHeader page={pageIndex} onSelected={onTabChanged} />
      <PagerView
        ref={pagerViewRef as any}
        onPageSelected={(event) => {
          setPageIndex(event.nativeEvent.position);
        }}
        style={Style.s({ flex: 1 })}
      >
        <ExploreNewsScreen />
        <LearnScreen />
      </PagerView>
    </View>
  );
});
