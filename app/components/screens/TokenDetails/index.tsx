import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { Style } from './../../../styles';
import { TransactionsPager } from './TransactionsPager';

export const TokenDetailsScreen = () => {
  return (
    <SafeAreaView style={Style.s({ flex: 1, bg: 'lightblue', cen: true })}>
      <TransactionsPager />
    </SafeAreaView>
  );
};
