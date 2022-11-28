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
import { RawFeatureInterface } from '../types';
import { placeholders } from '../../../../assets';
import { useTheme } from '../../../../util/theme';

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      backgroundColor: colors.background.default,
      padding: 16,
      marginVertical: 16,
      marginHorizontal: -16,
    },
    titleHeader: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.text.default,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text.default,
      width: 250,
      marginTop: 4,
    },
    icon: {
      width: 40,
      height: 40,
      marginRight: 8,
    },
    containerItem: {
      flexDirection: 'row',
      marginVertical: 22,
      width: 160,
    },
    containerFlatList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    nameDapp: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.default,
    },
    subNameDapp: {
      fontSize: 10,
      fontWeight: '400',
      color: colors.text.default,
    },
  });

export interface RawDappInterface extends RawFeatureInterface {
  subTitle: string;
}

export const FavouriteComponent = function FavouriteComponent() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const dataDapp = useMemo((): RawDappInterface[] => {
    return [
      {
        title: 'Compound',
        subTitle: 'AMM DEX',
        icon: placeholders.dapp6,
      },
      {
        title: 'Uniswap',
        subTitle: 'AMM DEX',
        icon: placeholders.dapp4,
      },
      {
        title: 'Biswap',
        subTitle: 'AMM DEX',
        icon: placeholders.dapp5,
      },
      {
        title: 'Aave(ETH)',
        subTitle: 'AMM DEX',
        icon: placeholders.dapp3,
      },
      {
        title: 'PancakeSwap',
        subTitle: 'AMM DEX',
        icon: placeholders.dapp7,
      },
    ];
  }, []);

  return (
    <View style={styles.screenWrapper}>
      <Text style={styles.titleHeader}>{'FAVOURITE'}</Text>
      <Text style={styles.title}>{'Fast transaction convenient earning.'}</Text>
      <View style={styles.containerFlatList}>
        {dataDapp.map((item, index) => {
          return (
            <TouchableOpacity key={index} style={styles.containerItem}>
              <Image source={item.icon} style={styles.icon} />
              <View style={{ justifyContent: 'center' }}>
                <Text style={styles.nameDapp}>{item.title}</Text>
                <Text style={styles.subNameDapp}>{item.subTitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default memo(FavouriteComponent);
