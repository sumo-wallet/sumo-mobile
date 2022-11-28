import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../../styles';
import { colors } from '../../../../styles/common';

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.gray5,
    marginBottom: 6,
  },
  divider: {
    height: 2,
    width: 32,
    backgroundColor: Colors.green[1],
  },
  containerTab: {
    alignItems: 'center',
    flex: 1,
  },
});

export interface ScrollTabInterface {
  onChangeTab?: (value: number) => void;
}

export const ScrollTab = memo(({ onChangeTab }: ScrollTabInterface) => {
  const [selected, setSelected] = useState<number>(0);

  const onChange = useCallback(
    (value: number) => {
      setSelected(value);
      onChangeTab?.(value);
    },
    [onChangeTab],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.containerTab]}
        onPress={() => onChange(0)}
      >
        <Text style={styles.title}>{'Token'}</Text>
        <View
          style={[
            styles.divider,
            {
              backgroundColor: selected === 0 ? Colors.green[1] : 'transparent',
            },
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.containerTab} onPress={() => onChange(1)}>
        <Text style={styles.title}>{'NFT'}</Text>
        <View
          style={[
            styles.divider,
            {
              backgroundColor: selected === 1 ? Colors.green[1] : 'transparent',
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
});

export default ScrollTab;
