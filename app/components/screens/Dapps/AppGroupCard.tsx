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
}

export const AppGroupCard = ({ style, title, dapps }: AppGroupCardProps) => {
  const { colors } = useTheme();

  const dappByPageData = React.useMemo(() => {
    const result: DappByPage[] = [];
    if (dapps?.length === 0) {
      return [];
    }
    dapps?.forEach((dapp: ModelDApp) => {
      if (result[result.length - 1].apps.length < 3) {
        result[result.length - 1].apps.push(dapp);
      } else {
        result.push({ apps: [dapp] });
      }
    });
    return result;
  }, [dapps]);

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
        <View style={Style.s({ direc: 'row' })}>
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
        </View>
      </View>
      <FlatList
        horizontal
        pagingEnabled
        data={dappByPageData}
        renderItem={({ item }: { item: DappByPage }) => {
          return (
            <View style={Style.s({ w: SCREEN_WIDTH, px: 16 })}>
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
