import React from 'react';
import {
  Image,
  StyleProp,
  Text,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Fonts, Style } from './../../../styles';
import { icons } from './../../../assets';
import { useNavigator } from './../../hooks';
import { ROUTES } from './../../../navigation/routes';
import { useTheme } from '../../../util/theme';

export interface SearchBarProps {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
}

export const SearchBar = ({ style, placeholder }: SearchBarProps) => {
  const nav = useNavigator();
  const { colors } = useTheme();
  const handleOpenSearchScreen = React.useCallback(() => {
    nav.navigate(ROUTES.DappSearch);
  }, [nav]);
  return (
    <View style={[Style.s({ px: 16, py: 8 }), style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleOpenSearchScreen}
        style={Style.s({
          px: 16,
          py: 6,
          direc: 'row',
          items: 'center',
          bor: 8,
          bg: colors.background.defaultHover,
          minH: 32,
        })}
      >
        <Image
          style={Style.s({ size: 20, tin: colors.text.alternative })}
          source={icons.iconSearch}
        />
        <Text
          style={[
            Style.s({ flex: 1, mx: 12, py: 6, px: 6 }),
            Fonts.t({ c: colors.text.alternative }),
          ]}
        >
          {placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
