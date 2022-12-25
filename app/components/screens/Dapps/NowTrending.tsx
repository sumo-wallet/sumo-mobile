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
  StyleSheet,
} from 'react-native';
import { Style, Colors, Fonts } from '../../../styles';
import { ModelDApp } from './../../../types';
import { useTheme } from '../../../util/theme';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      marginTop: 24,
      paddingBottom: 16,
      borderRadius: 10,
      backgroundColor: colors.box.default,
    },
    mainTitle: {
      fontSize: 24,
      marginTop: 4,
      fontWeight: '800',
      color: colors.text.default,
    },
    title: {
      fontSize: 12,
      marginTop: 4,
      color: colors.text.default,
    },
    titleContainer: {
      paddingHorizontal: 16,
      paddingTop: 12,
    },
  });

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
  const styles = createStyles(colors);

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
    <View style={[styles.wrapper, style]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{'NOW TRENDING'}</Text>
        <Text style={styles.mainTitle}>{'Top Dapps all \nover the world'}</Text>
      </View>
      <View style={Style.s({ mt: 18, pb: 16 })}>
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
      </View>
    </View>
  );
};
