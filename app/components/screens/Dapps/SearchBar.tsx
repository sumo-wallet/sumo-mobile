import React from 'react';
import {
  Image,
  StyleProp,
  View,
  ViewStyle,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Fonts, Style } from './../../../styles';
import { icons } from './../../../assets';
import { useTheme } from '../../../util/theme';

export interface SearchBarProps {
  value?: string;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  onInputSubmit: (value: string) => void;
  onPressEnter: (value: string) => void;
  onOpenBrowser: () => void;
}

export const SearchBar = ({
  value,
  style,
  placeholder,
  onPressEnter,
  onInputSubmit,
  onOpenBrowser,
}: SearchBarProps) => {
  // const nav = useNavigator();
  const { colors } = useTheme();
  // const handleOpenSearchScreen = React.useCallback(() => {
  //   nav.navigate(ROUTES.DappSearch);
  // }, [nav]);
  return (
    <View
      style={[Style.s({ px: 16, py: 8, direc: 'row', items: 'center' }), style]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressEnter}
        style={Style.s({
          flex: 1,
          px: 16,
          py: 6,
          direc: 'row',
          items: 'center',
          bor: 8,
          bg: colors.search.default,
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
          returnKeyType="search"
          clearButtonMode="while-editing"
          onSubmitEditing={onPressEnter}
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

      <TouchableOpacity
        onPress={() => {
          onOpenBrowser();
        }}
        style={Style.s({
          px: 6,
          py: 6,
          direc: 'row',
          items: 'center',
          minH: 32,
        })}
      >
        <Image style={Style.s({ size: 20 })} source={icons.iconGallery} />
      </TouchableOpacity>
    </View>
  );
};
