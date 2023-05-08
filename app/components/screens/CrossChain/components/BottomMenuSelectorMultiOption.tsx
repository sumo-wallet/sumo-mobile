import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
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
import FastImage from 'react-native-fast-image';
import {
  BottomMenuContainer,
  BottomMenuHeader,
  BottomMenuModal,
  SelectorOption,
  UNIQUE_STRING,
} from '../../../common/BottomMenu';
import { icons } from '../../../../assets';
import { useTheme } from '../../../../util/theme';
import { scale } from '../../../../util/scale';

interface Props {
  label: string;
  visibleModal?: boolean;
  options: SelectorOption[];
  selectedValue?: string | number;
  placeholder?: string;
  inputName: string;
  renderIcon?: (icon: ImageSourcePropType) => React.ReactElement | null;
  onSelectOption: (inputName: string, value: string | number) => void;
  containerStyle?: ViewStyle;
  filtered?: boolean | undefined;
  textStyle?: TextStyle;
  containerTouch?: ViewStyle;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {},
    optionContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopColor: colors.border.default,
      borderTopWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
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
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
      width: scale(86),
    },
    label: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
    },
    logoUrl: {
      width: 32,
      height: 32,
      borderRadius: 32,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    touchSeeMore: {
      alignItems: 'center',
      marginTop: 12,
    },
  });

export const BottomMenuSelectorMultiOption = memo(
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
    containerTouch,
    visibleModal,
  }: Props) => {
    const [visible, setVisible] = useState(visibleModal);
    const [isSeeMore, setSeeMore] = useState(false);

    useLayoutEffect(() => {
      setVisible(visibleModal);
    }, [visibleModal]);

    const { colors } = useTheme();
    const styles = createStyles(colors);

    const selectedOption: SelectorOption | undefined = useMemo(() => {
      return options
        ? options.filter(
            (option) =>
              option.value === selectedValue ||
              option.subValue === selectedValue,
          )[0]
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
      setSeeMore(false);
    }, []);

    const showMenu = useCallback(() => {
      setVisible(true);
      Keyboard.dismiss();
    }, []);

    const onSelectOptionCb = useCallback(
      (value: string | number) => {
        hideMenu();
        onSelectOption(inputName, value);
      },
      [inputName, onSelectOption, hideMenu],
    );

    return (
      <View style={containerStyle}>
        <TouchableOpacity
          onPress={showMenu}
          style={[styles.touch, containerTouch]}
        >
          <FastImage
            source={{ uri: selectedOption?.icon || '' }}
            style={styles.logoUrl}
          />
          <Text
            style={[textStyle, styles.title]}
            numberOfLines={2}
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
              {options
                .slice(0, isSeeMore ? options.length : 20)
                .map((option) => {
                  const selected = option.value === selectedValue;
                  const subSelected = option.subValue === selectedValue;
                  return (
                    <TouchableOpacity
                      style={styles.optionContainer}
                      key={option.value || UNIQUE_STRING}
                      onPress={() => onSelectOptionCb(option.value || '')}
                    >
                      <FastImage
                        source={{ uri: option.icon || '' }}
                        style={[styles.logoUrl, { marginRight: 12 }]}
                      />
                      <Text style={styles.label}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              {options.length > 20 && !isSeeMore && (
                <TouchableOpacity
                  onPress={() => setSeeMore(true)}
                  style={styles.touchSeeMore}
                >
                  <Text style={styles.title}>{'See more...'}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </BottomMenuContainer>
        </BottomMenuModal>
      </View>
    );
  },
);
