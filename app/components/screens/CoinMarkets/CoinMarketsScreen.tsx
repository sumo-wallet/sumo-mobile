import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { useTheme } from '../../../util/theme';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
  });

export const MarketTokenScreen = memo(() => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // const {value}=useAsyncEffect(async ()=>{},[]);

  return (
    <View style={styles.wrapper}>
      <DynamicHeader title={'Market'} hideGoBack />
    </View>
  );
});
