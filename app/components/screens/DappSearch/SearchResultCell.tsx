import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Style, Fonts } from './../../../styles';
import { ModelDApp } from './../../../types';
import { useTheme } from './../../../util/theme';

interface SearchResultCellProps {
  item: ModelDApp;
  onPress: (item: ModelDApp) => void;
}

export const SearchResultCell = React.memo(
  ({ item, onPress }: SearchResultCellProps) => {
    const { colors } = useTheme();

    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={Style.s({ direc: 'row', items: 'center' })}
      >
        <FastImage
          style={Style.s({ size: 40, bor: 10 })}
          source={{ uri: item?.logo }}
        />
        <View style={Style.s({ ml: 12 })}>
          <Text style={Fonts.t({ s: 14, c: colors.text.default })}>
            {item?.name}
          </Text>
          {item?.description ? (
            <Text style={Fonts.t({ s: 14, c: colors.text.muted })}>
              {item?.description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  },
);
