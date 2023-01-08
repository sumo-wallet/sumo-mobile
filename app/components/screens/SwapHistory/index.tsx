import React, { useCallback } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { SHeader } from './../../common/SHeader';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import { useGetNotification } from '../../../components/hooks/useGetNotification';
import { useTheme } from '../../../util/theme';
import { FlatList } from 'react-native-gesture-handler';
import { ModelNotification } from 'app/types';
const notificationIcon = require('../../../images/notification.png'); // eslint-disable-line import/no-commonjs

const createStyles = (colors: any) =>
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
      tintColor: colors.text.default,
      marginLeft: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.default,
      ...(fontStyles.normal as any),
    },
    subTitle: {
      fontSize: 14,
      fontWeight: '100',
      color: colors.text.muted,
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
    viewItem: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    viewContentItem: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'column',
    },
  });

export const SwapHistoryScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { notifications, isGetList, hasMore } = useGetNotification();

  const onRefresh = useCallback(async () => { }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <SHeader title={strings('notifications.notifications')} />
      <StatusBar barStyle="light-content" />
      <View />
      <FlatList
        data={notifications}
        renderItem={({ item }: { item: ModelNotification }) => {
          return (
            <View>
              <View style={styles.viewItem}>
                <Image source={notificationIcon} style={styles.icon} />
                <View style={styles.viewContentItem}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subTitle}>{item.created_at}</Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View style={styles.viewEmpty}>
              <Image source={notificationIcon} style={styles.frame} />
              <Text style={styles.title}>{strings('notifications.empty')}</Text>
              <Text style={styles.subTitle}>
                {strings('notifications.description')}
              </Text>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary.default]}
            tintColor={colors.primary.default}
            refreshing={isGetList}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
};
