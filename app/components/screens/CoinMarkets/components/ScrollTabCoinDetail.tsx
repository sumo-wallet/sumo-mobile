import React, { memo, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import TabColor from './TabColor';
import { useTheme } from '../../../../util/theme';

export enum TYPE_TAB {
  PRICE_CHART = 'Price Chart',
  INFO = 'Info',
}

interface ScrollTabCoinDetailInterface {
  onChangeTab?: (value: TYPE_TAB) => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingBottom: 12,
      paddingLeft: 16,
      width: '100%',
      backgroundColor: colors.border.default + '30',
    },
    btnTouch: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
    },
    row: {
      flexDirection: 'row',
    },
    title: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
      marginRight: 4,
    },
    image: {
      width: 9,
      height: 5,
    },
  });

export const ScrollTabCoinDetail = memo(
  ({ onChangeTab }: ScrollTabCoinDetailInterface) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const [selected, setSelected] = useState<TYPE_TAB>(TYPE_TAB.PRICE_CHART);

    const onChange = useCallback(
      (value: TYPE_TAB) => {
        onChangeTab?.(value);
        setSelected(value);
      },
      [onChangeTab],
    );

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnTouch}
          onPress={() => onChange(TYPE_TAB.PRICE_CHART)}
        >
          <TabColor
            isSelected={selected === TYPE_TAB.PRICE_CHART}
            typeTab={TYPE_TAB.PRICE_CHART}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnTouch}
          onPress={() => onChange(TYPE_TAB.INFO)}
        >
          <TabColor
            isSelected={selected === TYPE_TAB.INFO}
            typeTab={TYPE_TAB.INFO}
          />
        </TouchableOpacity>
      </View>
    );
  },
);

export default ScrollTabCoinDetail;
