import React from 'react';
import {
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Fonts, Style, Colors } from './../../../styles';

export const getSButtonStyle = (
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
      return Style.b({ bor: 100, width: 1, color: Colors.white[1] });
    default:
      return {};
  }
};

export const getSButtonTitleStyle = (
  type: SButtonType = 'primary',
): ViewStyle => {
  switch (type) {
    case 'primary':
      return Fonts.t({ c: Colors.gray[4] });
    case 'textOnly':
      return Fonts.t({ c: Colors.gray[1] });
    case 'danger':
      return Fonts.t({ c: Colors.gray[1] });
    case 'border':
      return Fonts.t({ c: Colors.white[1] });
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
        getSButtonStyle(type, disabled),
        style,
      ]}
    >
      {children}
      <Text
        style={[
          Fonts.t({ s: 14, w: '500' }),
          getSButtonTitleStyle(type),
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
