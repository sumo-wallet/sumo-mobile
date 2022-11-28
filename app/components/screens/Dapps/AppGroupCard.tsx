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
import { Style, Colors, Fonts } from '../../../styles';
import { icons } from './../../../assets';
import { DappCell } from './DappCell';
import { GroupDapp } from './../../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
export { SCREEN_WIDTH, SCREEN_HEIGHT };

export interface AppGroupCardProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
  groups?: GroupDapp[];
}

export const AppGroupCard = ({ style, title, groups }: AppGroupCardProps) => {
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
          <Text style={Fonts.t({ s: 18, w: '500', c: Colors.white[2] })}>
            {title}
          </Text>
        ) : null}
        <View style={Style.s({ direc: 'row' })}>
          <Text
            style={Fonts.t({
              s: 14,
              w: '500',
              c: Colors.green[1],
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
        data={groups}
        renderItem={({ item }: { item: GroupDapp }) => {
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
