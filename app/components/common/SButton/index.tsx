import { ThemeColors } from '@thanhpn1990/design-tokens/dist/js/themes/types';
import React from 'react';
import {
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Fonts, Style, Colors } from './../../../styles';
import { useTheme } from './../../../util/theme';

export const getSButtonStyle = (
  colors: ThemeColors | undefined,
  type: SButtonType = 'primary',
  disabled = false,
): any => {
  switch (type) {
    case 'primary':
      if (disabled) {
        return Style.s({ bg: Colors.gray[5] });
      }
      return Style.s({ bg: Colors.green[1] });
    case 'textOnly':
      return Style.s({ bg: Colors.tran });
    case 'danger':
      return Style.s({ bg: Colors.red[1] });
    case 'border':
      return Style.b({ bor: 100, width: 1, color: colors?.border.default });
    default:
      return {};
  }
};

export const getSButtonTitleStyle = (
  colors: ThemeColors | undefined,
  type: SButtonType | undefined = 'primary',
): ViewStyle => {
  switch (type) {
    case 'primary':
      return Fonts.t({ c: colors?.text.alternative });
    case 'textOnly':
      return Fonts.t({ c: colors?.text.default });
    case 'danger':
      return Fonts.t({ c: colors?.text.default });
    case 'border':
      return Fonts.t({ c: colors?.text.default });
    default:
      return {};
  }
};

export type SButtonType = 'primary' | 'textOnly' | 'danger' | 'border';

export interface SButtonProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
  type?: SButtonType;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const SButton = ({
  title,
  style,
  type,
  onPress,
  titleStyle,
  disabled,
  children,
}: React.PropsWithChildren<SButtonProps>) => {
  const { colors } = useTheme();
  const _onPress = React.useCallback(() => {
    if (disabled) {
      return;
    }
    onPress?.();
  }, [disabled, onPress]);
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={_onPress}
      style={[
        Style.s({ h: 48, bor: 48, cen: true, direc: 'row' }),
        getSButtonStyle(colors, type, disabled),
        style,
      ]}
    >
      {children}
      <Text
        style={[
          Fonts.t({ s: 14, w: '500' }),
          getSButtonTitleStyle(colors, type),
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
