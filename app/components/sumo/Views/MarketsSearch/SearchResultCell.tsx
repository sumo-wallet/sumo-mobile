import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Style, Fonts } from './../../../../styles';
import { SearchToken } from './../../../../types';
import { useTheme } from './../../../../util/theme';

interface SearchResultCellProps {
  item: SearchToken;
  onPress: (item: SearchToken) => void;
}

export const SearchResultCell = React.memo(
  ({ item, onPress }: SearchResultCellProps) => {
    const { colors } = useTheme();

    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={Style.s({
          direc: 'row',
          items: 'center',
          justify: 'space-between',
        })}
      >
        <FastImage
          style={Style.s({ size: 20, bor: 10 })}
          source={{ uri: item?.thumb }}
        />
        <View style={Style.s({ ml: 12, items: 'flex-start', flex: 1 })}>
          <Text style={Fonts.t({ s: 14, c: colors.text.default })}>
            {item?.symbol}
          </Text>
          {item?.name ? (
            <Text
              style={[
                Fonts.t({ s: 14, c: colors.text.muted }),
                Style.s({ t: 4 }),
              ]}
            >
              {item?.name}
            </Text>
          ) : null}
        </View>
        <View style={Style.s({ ml: 12 })}>
          {item?.market_cap_rank && (
            <Text style={Fonts.t({ s: 14, c: colors.text.default })}>
              {`# ${item?.market_cap_rank}`}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);
