import React, { memo, useCallback, useMemo } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../../styles/common';
import BalanceFrame from '../components/BalanceFrame';
import { SearchBar } from '../../Dapps/SearchBar';
import { icons } from '../../../../assets';
import { Colors, Style } from '../../../../styles';
import { TokenDataInterface } from '../types';
import TokenItem from '../components/TokenItem';
import navigation from '../../../../reducers/navigation';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray3,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
  containerSetting: {
    backgroundColor: colors.gray3,
    justifyContent: 'center',
    marginRight: 16,
  },
  containerSearchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerIcon: {
    padding: 12,
    backgroundColor: Colors.divider[1],
    borderRadius: 40,
  },
  containerFooter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconSetting: {
    width: 14,
    height: 14,
    marginRight: 8,
    tintColor: colors.gray5,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray5,
  },
});

export const TokenList = memo(() => {
  const navigation = useNavigation();

  const dataToken = useMemo((): TokenDataInterface[] => {
    return [
      {
        name: 'BTC',
        icon: icons.iconBitcoin,
        amount: '19,186.9',
        userAmount: 0,
        userDollar: 0,
        percent: '0.48%',
      },
      {
        name: 'BTC',
        icon: icons.iconBitcoin,
        amount: '19,186.9',
        userAmount: 0,
        userDollar: 0,
        percent: '0.48%',
      },
      {
        name: 'BTC',
        icon: icons.iconBitcoin,
        amount: '19,186.9',
        userAmount: 0,
        userDollar: 0,
        percent: '0.48%',
      },
      {
        name: 'BTC',
        icon: icons.iconBitcoin,
        amount: '19,186.9',
        userAmount: 0,
        userDollar: 0,
        percent: '0.48%',
      },
      {
        name: 'BTC',
        icon: icons.iconBitcoin,
        amount: '19,186.9',
        userAmount: 0,
        userDollar: 0,
        percent: '0.48%',
      },
      {
        name: 'BTC',
        icon: icons.iconBitcoin,
        amount: '19,186.9',
        userAmount: 0,
        userDollar: 0,
        percent: '0.48%',
      },
    ];
  }, []);

  const renderItem = useCallback(({ item }: { item: TokenDataInterface }) => {
    return <TokenItem token={item} />;
  }, []);

  const onNavigate = useCallback(() => {
    navigation.navigate('ManagerCoinModal');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BalanceFrame />
      <View style={styles.containerSearchBar}>
        <SearchBar style={{ width: 220 }} placeholder={'Search...'} />
        <View style={styles.containerSetting}>
          <TouchableOpacity style={styles.containerIcon}>
            <Image source={icons.iconSetting} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={dataToken}
        renderItem={renderItem}
        style={Style.s({ mt: 20, mx: 16 })}
      />
      <TouchableOpacity style={styles.containerFooter} onPress={onNavigate}>
        <Image source={icons.iconSetting} style={styles.iconSetting} />
        <Text style={styles.title}>{'Manager Token'}</Text>
      </TouchableOpacity>
    </View>
  );
});

export default TokenList;
