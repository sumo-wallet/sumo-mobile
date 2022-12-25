import React from 'react';
import {
  Image,
  StyleProp,
  View,
  ViewStyle,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import { Fonts, Style } from './../../../styles';
import { icons } from './../../../assets';
import { useNavigator } from './../../hooks';
import { ROUTES } from './../../../navigation/routes';
import { useTheme } from '../../../util/theme';

export interface SearchBarProps {
  value?: string;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  onInputSubmit: (value: string) => {};
  onPress: (value: string) => {};
}

export const SearchBar = ({
  value,
  style,
  placeholder,
  onInputSubmit,
}: SearchBarProps) => {
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
          bg: colors.box.default,
          minH: 32,
        })}
      >
        <Image
          style={Style.s({ size: 20, tin: colors.icon.alternative })}
          source={icons.iconSearch}
        />
        <TextInput
          style={[
            Style.s({ flex: 1, mx: 12, py: 6, px: 6 }),
            Fonts.t({ c: colors.text.alternative }),
          ]}
          placeholder={placeholder}
          onChangeText={onInputSubmit}
          value={value}
          placeholderTextColor={colors.text.muted}
        />
        {value?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              onInputSubmit('');
            }}
          >
            <Image
              style={Style.s({ size: 20, tin: colors.icon.muted })}
              source={icons.iconClose2}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};
