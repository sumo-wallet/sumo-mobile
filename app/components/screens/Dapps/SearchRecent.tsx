/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Style, Fonts } from './../../../styles';
import { ModelDApp } from './../../../types';
import { useTheme } from './../../../util/theme';

export interface SearchRecentProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
  data?: ModelDApp[];
  onSelect?: (item: ModelDApp) => void;
}

export const SearchRecent = ({
  style,
  title = 'Recent',
  data,
  onSelect,
}: SearchRecentProps) => {
  const { colors } = useTheme();
  const renderItem = React.useCallback(
    ({ item }: { item: ModelDApp }) => {
      return (
        <TouchableOpacity onPress={() => onSelect && onSelect(item)}>
          <FastImage
            style={Style.s({ size: 40 })}
            source={{ uri: item?.logo }}
          />
        </TouchableOpacity>
      );
    },
    [onSelect],
  );
  return (
    <View style={[style]}>
      <Text style={Fonts.t({ s: 12, c: colors.text.default })}>{title}</Text>
      <FlatList
        style={Style.s({ mt: 8 })}
        horizontal
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={Style.s({ w: 16 })} />}
      />
    </View>
  );
};
