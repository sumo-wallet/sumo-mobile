import React, { memo, useCallback, useState } from 'react';
import { useTheme } from '../../../../util/theme';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { icons } from '../../../../assets';
import { BottomMenuSelector } from '../../../common/BottomMenu';
import { Types24hSelector } from '../types';
import { MarketsListParams } from '../../../../types/coingecko/schema';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      marginBottom: 12,
    },
    touch: {
      paddingVertical: 6,
      paddingHorizontal: 8,
      backgroundColor: colors.background.alternative,
      borderRadius: 12,
      marginRight: 16,
      flexDirection: 'row',
      alignItems: 'center',
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

interface ScrollTabCoinInterface {
  paramsMarket: MarketsListParams;
  onSelect?: (value: MarketsListParams) => void;
}

export const ScrollTabCoin = memo(
  ({ paramsMarket, onSelect }: ScrollTabCoinInterface) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const [isCurrency, setIsCurrency] = useState<boolean>(
      paramsMarket.vs_currency === 'usd',
    );
    const onSelectedOption = useCallback(
      (keyName: string, value: string | number) => {
        onSelect?.(
          Object.assign({ ...paramsMarket, [keyName]: value }, { page: 1 }),
        );
      },
      [onSelect, paramsMarket],
    );

    const onChangeCurrency = useCallback(() => {
      onSelectedOption('vs_currency', isCurrency ? 'usd' : 'btc');
      setIsCurrency(!isCurrency);
    }, [isCurrency, onSelectedOption]);

    return (
      <ScrollView
        style={styles.wrapper}
        contentContainerStyle={styles.row}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.touch} onPress={onChangeCurrency}>
          <Text style={styles.title}>{isCurrency ? 'BTC/USD' : 'USD/BTC'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}>
          <Text style={styles.title}>{'All Coins'}</Text>
          <FastImage
            style={styles.image}
            source={icons.iconArrowDown}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </TouchableOpacity>

        <BottomMenuSelector
          label={'Price % Change Timeframe'}
          options={Types24hSelector}
          inputName={'price_change_percentage'}
          placeholder={'24H'}
          onSelectOption={onSelectedOption}
          selectedValue={paramsMarket.price_change_percentage}
        />

        <TouchableOpacity style={styles.touch}>
          <Text style={styles.title}>{'Sort By Market Cap'}</Text>
          <FastImage
            style={styles.image}
            source={icons.iconArrowDown}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </TouchableOpacity>
      </ScrollView>
    );
  },
);
