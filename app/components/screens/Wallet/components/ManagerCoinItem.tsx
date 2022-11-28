import React, { memo, useCallback, useLayoutEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../../styles/common';
import { Colors } from '../../../../styles';

export interface ManagerCoinItemInterface {
  name: string;
  isSelected: boolean;
  icon: ImageSourcePropType;
}

interface ManagerCoin {
  coin: ManagerCoinItemInterface;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray5,
    marginLeft: 16,
  },
});

export const ManagerCoinItem = memo(({ coin }: ManagerCoin) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(coin.isSelected);

  useLayoutEffect(() => {
    setIsEnabled(coin.isSelected);
  }, [coin.isSelected]);

  const onChangeValue = useCallback(() => {
    setIsEnabled(!isEnabled);
  }, [isEnabled]);

  return (
    <View style={styles.container}>
      <View style={styles.containerTitle}>
        <Image source={coin.icon} style={styles.icon} />
        <Text style={styles.title}>{coin.name}</Text>
      </View>
      <Switch
        trackColor={{ false: Colors.gray[5], true: colors.green1 }}
        value={isEnabled}
        onChange={onChangeValue}
      />
    </View>
  );
});

export default ManagerCoinItem;
