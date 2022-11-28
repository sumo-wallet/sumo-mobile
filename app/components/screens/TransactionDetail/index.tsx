import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { Style } from './../../../styles';

export const TransactionDetailScreen = () => {
  return (
    <SafeAreaView style={Style.s({ flex: 1, bg: 'lightblue', cen: true })}>
      <View />
      <Text>{'TransactionDetail'}</Text>
    </SafeAreaView>
  );
};
