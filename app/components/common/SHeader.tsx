import React from 'react';
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Colors, Fonts, Style } from './../../styles';
import { icons } from './../../assets';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../util/theme';

interface SHeaderProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
  subTitle?: string;
  iconRight?: any;
}

export const SHeader = ({
  style,
  title,
  subTitle,
  iconRight,
}: SHeaderProps) => {
  const nav = useNavigation();
  const { colors } = useTheme();
  return (
    <View style={[Style.s({ minH: 48, direc: 'row', items: 'center' }), style]}>
      <TouchableOpacity
        onPress={nav.goBack}
        style={Style.s({ p: 14, cen: true })}
      >
        <FastImage
          style={Style.s({ size: 20 })}
          source={icons.iconArrowLeft}
          tintColor={colors.text.default}
        />
      </TouchableOpacity>
      <View style={Style.s({ flex: 1, cen: true })}>
        <Text style={[Fonts.t({ s: 16, w: '500', c: colors.text.default })]}>
          {title}
        </Text>
        {!!subTitle && (
          <Text style={[Fonts.t({ s: 14, c: colors.text.default })]}>
            {subTitle}
          </Text>
        )}
      </View>
      <TouchableOpacity style={Style.s({ p: 14, cen: true })}>
        <FastImage style={Style.s({ size: 20 })} source={iconRight} />
      </TouchableOpacity>
    </View>
  );
};
