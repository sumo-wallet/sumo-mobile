/* eslint-disable @typescript-eslint/consistent-type-definitions */
import React from 'react';
import {
  View,
  FlatList,
  StyleProp,
  ViewStyle,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Style, Fonts } from '../../../styles';
import { icons } from './../../../assets';
import { DappCell } from './DappCell';
import { DappByPage, ModelDApp } from './../../../types';
import { useTheme } from './../../..//util/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
export { SCREEN_WIDTH, SCREEN_HEIGHT };

export interface AppGroupCardProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
  dapps?: ModelDApp[];
  onMore?: () => void;
}

export const AppGroupCard = ({
  style,
  title,
  dapps,
  onMore,
}: AppGroupCardProps) => {
  const { colors } = useTheme();

  const dappByPageData = React.useMemo(() => {
    const result: DappByPage[] = [];
    if (dapps?.length === 0) {
      return [];
    }
    dapps?.forEach((item: ModelDApp) => {
      if (result[result?.length - 1]?.apps?.length < 3) {
        result[result?.length - 1]?.apps?.push(item);
      } else {
        result.push({ apps: [item] });
      }
    });
    return result;
  }, [dapps]);

  // todo: https://stackoverflow.com/questions/69047058/react-native-flatlist-with-3-cards-paging-layout
  return (
    <View style={[Style.s({ mb: 24 }), style]}>
      <View
        style={Style.s({
          direc: 'row',
          items: 'center',
          justify: 'space-between',
          px: 16,
        })}
      >
        {title ? (
          <Text style={Fonts.t({ s: 18, w: '500', c: colors.text.default })}>
            {title}
          </Text>
        ) : null}
        <TouchableOpacity onPress={onMore} style={Style.s({ direc: 'row' })}>
          <Text
            style={Fonts.t({
              s: 14,
              w: '500',
              c: colors.primary.default,
              r: 8,
            })}
          >
            {'More'}
          </Text>
          <Image
            style={Style.s({ size: 14 })}
            source={icons.iconChevronRight}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        // contentContainerStyle={{ width: 400 }}
        horizontal
        // pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={dappByPageData}
        renderItem={({ item }: { item: DappByPage }) => {
          return (
            <View style={Style.s({ w: SCREEN_WIDTH * 0.7, px: 16 })}>
              {item?.apps?.map((dapp) => (
                <DappCell key={dapp.id} dapp={dapp} />
              ))}
            </View>
          );
        }}
      />
    </View>
  );
};
