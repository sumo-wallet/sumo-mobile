import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  ImageSourcePropType,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SelectorItem, SelectorOption, UNIQUE_STRING } from './SelectorItem';

import { BottomMenuModal } from './BottomMenuModal';
import { BottomMenuContainer } from './BottomMenuContainer';
import { BottomMenuHeader } from './BottomMenuHeader';
import { useTheme } from '../../../util/theme';
import { icons } from '../../../assets';
import FastImage from 'react-native-fast-image';

interface Props {
  label: string;
  options: SelectorOption[];
  selectedValue?: string | number;
  placeholder?: string;
  inputName: string;
  renderIcon?: (icon: ImageSourcePropType) => React.ReactElement | null;
  onSelectOption: (inputName: string, value: string | number) => void;
  containerStyle?: ViewStyle;
  filtered?: boolean | undefined;
  textStyle?: TextStyle;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {},
    optionContainer: {},
    cancel: {
      padding: 12,
      paddingRight: 0,
    },
    maxHeightScroll: {
      maxHeight: 500,
    },
    label: {
      backgroundColor: 'transparent',
    },
    image: {
      width: 9,
      height: 5,
    },
    touch: {
      paddingVertical: 6,
      paddingHorizontal: 8,
      backgroundColor: colors.background.alternative,
      borderRadius: 12,
      marginRight: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
      marginRight: 4,
    },
  });

export const BottomMenuSelector = memo(
  ({
    inputName,
    label,
    options,
    selectedValue,
    placeholder = '',
    onSelectOption,
    renderIcon,
    textStyle,
    containerStyle,
  }: Props) => {
    const [visible, setVisible] = useState(false);
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const selectedOption: SelectorOption | undefined = useMemo(() => {
      return options
        ? options.filter((option) => option.value === selectedValue)[0]
        : undefined;
    }, [options, selectedValue]);

    const selectedOptionLabel = useMemo(
      () => (selectedOption ? selectedOption.label : placeholder),
      [selectedOption, placeholder],
    );

    const noTranslate = useMemo(
      () => (selectedOption ? !!selectedOption.noTranslate : false),
      [selectedOption],
    );

    const text = selectedOption
      ? noTranslate
        ? selectedOptionLabel
        : selectedOptionLabel
      : '';

    const hideMenu = useCallback(() => {
      setVisible(false);
    }, []);

    const onSelectOptionCb = useCallback(
      (value: string | number) => {
        hideMenu();
        onSelectOption(inputName, value);
      },
      [inputName, onSelectOption, hideMenu],
    );

    const showMenu = useCallback(() => {
      setVisible(true);
      Keyboard.dismiss();
    }, []);

    return (
      <View style={containerStyle}>
        <TouchableOpacity onPress={showMenu} style={styles.touch}>
          <Text
            style={[textStyle, styles.title]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text === '' ? placeholder : text}
          </Text>
          <FastImage
            style={styles.image}
            source={icons.iconArrowDown}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </TouchableOpacity>
        <BottomMenuModal isVisible={visible} onClose={hideMenu} propagateSwipe>
          <BottomMenuContainer>
            <BottomMenuHeader title={label} onClose={hideMenu} />
            <ScrollView style={styles.maxHeightScroll}>
              {options.map((option) => {
                const selected = option.value === selectedValue;
                return (
                  <View
                    style={styles.optionContainer}
                    key={option.value || UNIQUE_STRING}
                  >
                    <SelectorItem
                      option={option}
                      renderIcon={renderIcon}
                      selected={selected}
                      onSelect={onSelectOptionCb}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </BottomMenuContainer>
        </BottomMenuModal>
      </View>
    );
  },
);
