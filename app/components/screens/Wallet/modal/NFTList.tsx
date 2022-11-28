import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../../../styles/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: colors.gray3,
  },
});

export const NFTList = memo(() => {
  return <View style={styles.container} />;
});

export default NFTList;
