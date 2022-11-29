/* eslint-disable @typescript-eslint/no-empty-function */
import { useNavigation } from '@react-navigation/native';
import { strings } from '../../../../locales/i18n';
import React from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { Style } from './../../../styles';
import { SHeader } from './../../common/SHeader';
import Networks from './Networks';
import { useTheme } from '../../../util/theme';

export const ChangeNetwork = React.memo(() => {
  const nav = useNavigation();
  const onNetworksModalClose = () => { };
  const onNetworkSelected = () => { };
  const showInvalidCustomNetworkAlert = () => { };
  const switchModalContent = () => { };
  const { colors } = useTheme();

  return (
    <SafeAreaView style={Style.s({ flex: 1, bg: colors.background.default })}>
      <StatusBar barStyle="light-content" />
      <SHeader title={strings('app_settings.networks_title')} />
      <Networks
        navigation={nav}
        onClose={onNetworksModalClose}
        onNetworkSelected={onNetworkSelected}
        showInvalidCustomNetworkAlert={showInvalidCustomNetworkAlert}
        switchModalContent={switchModalContent}
      />
      <View />
    </SafeAreaView>
  );
});
