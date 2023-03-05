import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      flexDirection: 'row',
    },
    touch: {
      flex: 1,
      alignItems: 'center',
      paddingBottom: 12,
      borderBottomColor: colors.primary.alternative,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.default,
    },
  });

export interface CoinMarketHeaderInterface {
  page: number;
  onSelected?: (value: number) => void;
}

export const CoinMarketHeader = memo(
  ({ page, onSelected }: CoinMarketHeaderInterface) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    return (
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={() => onSelected?.(0)}
          style={[
            styles.touch,
            {
              borderBottomWidth: page === 0 ? 8 : 1,
              borderBottomColor:
                page === 0 ? colors.primary.alternative : colors.border.default,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: page === 0 ? colors.text.default : colors.text.muted },
            ]}
          >
            {'Markets'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelected?.(1)}
          style={[
            styles.touch,
            {
              borderBottomWidth: page === 1 ? 8 : 1,
              borderBottomColor:
                page === 1 ? colors.primary.alternative : colors.border.default,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: page === 1 ? colors.text.default : colors.text.muted },
            ]}
          >
            {'Favourites'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);
