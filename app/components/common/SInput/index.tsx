import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Fonts, Style, Colors } from './../../../styles';
import { icons } from './../../../assets';
import { useDisclosure } from '@dwarvesf/react-hooks';
import { useTheme } from '../../../util/theme';

export interface SInputProps {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  secure?: boolean;
  onChange?: (text: string) => void;
  defaultValue?: string;
}

export const SInput = ({
  style,
  placeholder,
  secure = false,
  onChange,
  defaultValue,
}: SInputProps) => {
  const hinted = useDisclosure({ defaultIsOpen: secure });
  const focus = useDisclosure();
  const { colors } = useTheme();
  return (
    <View
      style={[
        Style.s({ h: 48, direc: 'row', items: 'center', px: 16 }),
        Style.b({
          color: focus.isOpen ? Colors.green[1] : Colors.gray[3],
          bor: 8,
          width: 1,
        }),
        style,
      ]}
    >
      <TextInput
        placeholder={placeholder}
        style={[
          Fonts.t({ s: 14, w: '600', c: colors.text.default }),
          Style.s({ flex: 1 }),
        ]}
        defaultValue={defaultValue}
        placeholderTextColor={colors.text.muted}
        secureTextEntry={hinted.isOpen}
        onChangeText={onChange}
        onFocus={() => focus.onOpen()}
        onBlur={() => focus.onClose()}
      />
      {secure && (
        <TouchableOpacity onPress={hinted.onToggle}>
          <Image
            style={Style.s({ size: 20 })}
            source={hinted.isOpen ? icons.iconEyeClose : icons.iconEyeOpen}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
