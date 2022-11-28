/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Style, Colors, Fonts } from './../../../styles';
import { placeholders } from './../../../assets';
import { Dapp } from './../../../types';

export const dummyDataRecent: Dapp[] = [
  {
    id: 0,
    name: 'PancakeSwap',
    image: placeholders.dapp7,
    website: 'https://pancakeswap.finance/',
  },
  {
    id: 1,
    name: 'Uniswap',
    image: placeholders.dapp4,
    website: 'https://app.uniswap.org/#/swap',
  },
];

export interface SearchRecentProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
  data?: Dapp[];
  onSelect?: (item: Dapp) => void;
}

export const SearchRecent = ({
  style,
  title = 'Recent',
  data,
  onSelect,
}: SearchRecentProps) => {
  const renderItem = React.useCallback(
    ({ item }: { item: Dapp }) => {
      return (
        <TouchableOpacity onPress={() => onSelect && onSelect(item)}>
          <Image style={Style.s({ size: 40 })} source={item.image} />
        </TouchableOpacity>
      );
    },
    [onSelect],
  );
  return (
    <View style={[style]}>
      <Text style={Fonts.t({ s: 12, c: Colors.grayscale[60] })}>{title}</Text>
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
