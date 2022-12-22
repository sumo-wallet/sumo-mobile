/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Style, Colors, Fonts } from '../../../styles';
import { ModelDApp } from './../../../types';
import { useTheme } from '../../../util/theme';

export interface NowTrendingProps {
  style?: StyleProp<ViewStyle>;
  onSelect?: (dapp: ModelDApp) => void;
  hotDapps?: ModelDApp[];
}

export const parseLogoUrl = (logo?: string): string => {
  return `${logo}`.replace(/\\/g, '');
};

export const sliceArrHotApps = (data: ModelDApp[]) => {
  const size = Math.round(data.length / 2);
  return [data.slice(0, size), data.slice(size, data.length - 1)];
};

export const NowTrending = ({
  style,
  onSelect,
  hotDapps = [],
}: NowTrendingProps) => {
  const { colors } = useTheme();

  const dappByRow = sliceArrHotApps(hotDapps);

  const renderItem = React.useCallback(
    ({ item }: { item: ModelDApp; index: number }) => {
      return (
        <TouchableOpacity onPress={() => onSelect && onSelect(item)}>
          <Image
            style={Style.s({ size: 64, bor: 8 })}
            source={{ uri: parseLogoUrl(item?.logo) }}
          />
        </TouchableOpacity>
      );
    },
    [onSelect],
  );

  return (
    <View
      style={[
        Style.s({ bg: colors.background.default, mt: 24, pb: 16 }),
        Style.shadow(Colors.shadow[1], 2, 4, 16),
        style,
      ]}
    >
      <View
        style={Style.s({
          px: 16,
          pt: 12,
        })}
      >
        <Text style={Fonts.t({ s: 12, c: colors.text.default })}>
          {'NOW TRENDING'}
        </Text>
        <Text
          style={Fonts.t({ s: 24, w: '700', c: colors.text.default, t: 4 })}
        >
          {'Top Dapps all \nover the world'}
        </Text>
      </View>
      <View style={Style.s({ mt: 18 })}>
        {dappByRow.map((row, index) => {
          return (
            <FlatList
              key={`NowTrending.FlatList.${index}`}
              data={row}
              style={Style.s({ mt: 8 })}
              contentContainerStyle={Style.s({ l: -20 })}
              horizontal
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={Style.s({ w: 8 })} />}
            />
          );
        })}

        {/* <FlatList
          style={Style.s({ mt: 8 })}
          contentContainerStyle={Style.s({ l: -26 })}
          data={dummyDataNowTrending}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={Style.s({ w: 8 })} />}
        /> */}
      </View>
    </View>
  );
};
