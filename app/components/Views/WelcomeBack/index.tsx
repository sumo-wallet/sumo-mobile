/* eslint-disable arrow-body-style */
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface WelcomeBackProps {
  style: any;
}

export const WelcomeBack = () => {
  return (
    <SafeAreaView>
      <View />
    </SafeAreaView>
  );
};

export default WelcomeBack;
