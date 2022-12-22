import React, { memo, useCallback } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';

import { baseStyles, colors } from '../../../styles/common';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { icons } from '../../../assets';
import TokenList from './modal/TokenList';
import NFTList from './modal/NFTList';
import ScrollTab from './components/ScrollTab';
import Routes from './../../../constants/navigation/Routes';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.black1,
  },
  containerLeft: {
    flexDirection: 'row',
  },
  containerRight: {
    flexDirection: 'row',
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
  container: {
    flex: 1,
  },
  contentScroll: { paddingHorizontal: 16 },
});

export const WalletScreen = () => {
  const pagerViewRef = React.useRef<PagerView>();
  const navigation = useNavigation();

  const onChangeTab = useCallback((value: number) => {
    if (value === 0) {
      pagerViewRef.current?.setPage(0);
      return;
    }
    pagerViewRef.current?.setPage(1);
    return;
  }, []);

  return (
    <View style={styles.wrapper}>
      <DynamicHeader title={'Wallet name'} hideGoBack>
        <View style={styles.containerLeft}>
          <Image source={icons.iconBitcoin} style={styles.icon} />
        </View>
        <View style={styles.containerRight}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(Routes.NOTIFICATIONS.NOTIFICATIONS);
            }}
          >
            <Image source={icons.iconBell} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(Routes.QR_SCANNER);
            }}
          >
            <Image source={icons.iconScanQR} style={styles.iconQR} />
          </TouchableOpacity>
        </View>
      </DynamicHeader>
      <View style={styles.container}>
        <ScrollTab onChangeTab={onChangeTab} />
        <PagerView
          ref={pagerViewRef as any}
          initialPage={0}
          style={baseStyles.flexGrow}
        >
          <TokenList />
          <NFTList />
        </PagerView>
      </View>
    </View>
  );
};

export default memo(WalletScreen);
