import React from 'react';
import { View, SafeAreaView, Text, StatusBar, StyleSheet, Image } from 'react-native';
import { SHeader } from './../../common/SHeader';
import { Colors, Fonts, Style } from './../../../styles';
import { fontStyles, baseStyles, colors } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
const notification = require('../../../images/notification.png'); // eslint-disable-line import/no-commonjs

const createStyles = () =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.black1,
    },
    tabUnderlineStyle: {
      height: 2,
      backgroundColor: colors.green1,
    },
    tabStyle: {
      paddingBottom: 0,
    },
    tabBar: {
      backgroundColor: colors.black1,
    },
    textStyle: {
      fontSize: 16,
      ...(fontStyles.normal as any),
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    },
    iconQR: {
      width: 24,
      height: 24,
      tintColor: colors.white,
      marginLeft: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.gray5,
      ...(fontStyles.normal as any),
    },
    subTitle: {
      fontSize: 14,
      fontWeight: '100',
      color: colors.gray5,
      marginTop: 10,
      ...(fontStyles.small as any),
    },
    viewEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    frame: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginTop: 60,
    },
  });

export const NotificationsScreen = () => {
  
  const styles = createStyles();
  
  return (
    <SafeAreaView style={styles.wrapper}>
      <SHeader title={strings('notifications.notifications')} />
      <StatusBar barStyle="light-content" />
      <View />
      <View style={styles.viewEmpty}>
        <Image source={notification} style={styles.frame} />
        <Text style={styles.title}>{strings('notifications.empty')}</Text>
        <Text style={styles.subTitle}>
          {strings('notifications.description')}
        </Text>
      </View>
    </SafeAreaView>
  );
};
