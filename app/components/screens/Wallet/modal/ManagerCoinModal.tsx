import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { DynamicHeader } from '../../../Base/DynamicHeader';
import { baseStyles, colors } from '../../../../styles/common';
import { SearchBar } from '../../Dapps/SearchBar';
import {
  ManagerCoinItem,
  ManagerCoinItemInterface,
} from '../components/ManagerCoinItem';
import { icons } from '../../../../assets';
import { EmptyView } from '../../../Base/EmptyView';
import { SButton } from '../../../common/SButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  wrapper: {
    backgroundColor: colors.black1,
    flex: 1,
  },
  containerEmpty: {
    marginTop: 100,
  },
  containerBtn: {
    backgroundColor: colors.gray5,
    marginBottom: 32,
  },
});

export const ManagerCoinModal = memo(() => {
  const dataCoin = useMemo((): ManagerCoinItemInterface[] => {
    return [
      {
        name: 'Bitcoin BTC',
        isSelected: true,
        icon: icons.iconBitcoin,
      },
      {
        name: 'Bitcoin Wrapped BTC',
        isSelected: true,
        icon: icons.iconBitcoin,
      },
      {
        name: 'Bitcoin BTC',
        isSelected: true,
        icon: icons.iconBitcoin,
      },
      {
        name: 'Bitcoin BTC',
        isSelected: false,
        icon: icons.iconBitcoin,
      },
      {
        name: 'Bitcoin BTC',
        isSelected: false,
        icon: icons.iconBitcoin,
      },
      {
        name: 'Bitcoin BTC',
        isSelected: false,
        icon: icons.iconBitcoin,
      },
      {
        name: 'Bitcoin BTC',
        isSelected: false,
        icon: icons.iconBitcoin,
      },
    ];
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ManagerCoinItemInterface }) => {
      return <ManagerCoinItem coin={item} />;
    },
    [],
  );

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.containerEmpty}>
        <EmptyView />
      </View>
    );
  }, []);

  return (
    <View style={styles.wrapper}>
      <DynamicHeader title={'Manager Coin'} />
      <SearchBar placeholder={'Enter token name, address, symbol'} />
      <View style={styles.container}>
        <FlatList
          data={dataCoin}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          style={baseStyles.flexGrow}
        />
        <SButton
          style={styles.containerBtn}
          type={'primary'}
          title={'Add custom token'}
        />
      </View>
    </View>
  );
});

export default ManagerCoinModal;
