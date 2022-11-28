import React, { memo, useCallback } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { baseStyles } from '../../../../styles/common';
import { icons } from '../../../../assets';
import { useTheme } from '../../../..//util/theme';
import { Ticker } from 'app/types';

export interface RawHot24hInterface {
  data: Ticker[];
  onSelected?: (item: Ticker) => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text.default,
    },
    iconHot: {
      width: 16,
      height: 16,
      marginLeft: 4,
      color: colors.error.default,
    },
    containerItem: {
      backgroundColor: colors.box.default,
      paddingTop: 16,
      paddingLeft: 16,
      paddingRight: 32,
      paddingBottom: 12,
      marginRight: 12,
      borderRadius: 8,
      minHeight: 126,
      justifyContent: 'space-around',
    },
    containerFlatList: {
      marginTop: 16,
      marginBottom: 24,
    },
    icon: {
      width: 24,
      height: 24,
      marginBottom: 8,
    },
    nameCoin: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.default,
    },
    subNameCoin: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.text.default,
    },
    titlePercent: {
      fontSize: 18,
      fontWeight: '500',
    },
    titleAmount: {
      fontSize: 12,
      fontWeight: '500',
      opacity: 0.7,
      marginTop: 2,
      color: colors.text.alternative,
    },
    containerPercent: {
      marginTop: 22,
    },
  });

export const Hot24hComponent = function Hot24hComponent({
  data,
  onSelected,
}: RawHot24hInterface) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderItem = useCallback(
    ({ item }: { item: Ticker; index: number }) => {
      return (
        <TouchableOpacity
          style={styles.containerItem}
          onPress={() => {
            onSelected(item);
          }}
        >
          {/* <Image source={item.icon} style={styles.icon} /> */}
          <Text style={styles.nameCoin}>
            {item.iso}
            <Text style={styles.subNameCoin}>{' / USD'}</Text>
          </Text>
          <View style={styles.containerPercent}>
            <Text
              style={[
                styles.titlePercent,
                {
                  color:
                    item.changeValue < 0
                      ? colors.error.default
                      : colors.primary.default,
                },
              ]}
            >{`${item.changePercent.toFixed(2)}%`}</Text>
            <Text style={styles.titleAmount}>{`$${Intl.NumberFormat().format(item.priceC)}`}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [],
  );
  return (
    <View style={styles.container}>
      <View style={baseStyles.flexDirection}>
        <Text style={styles.title}>{'Hot 24h'}</Text>
        <Image source={icons.iconHot} style={styles.iconHot} />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        style={styles.containerFlatList}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default memo(Hot24hComponent);
