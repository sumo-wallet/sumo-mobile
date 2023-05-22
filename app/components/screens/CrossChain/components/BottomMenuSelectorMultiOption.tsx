import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  Image,
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
import { SearchBar } from '../../Dapps/SearchBar';

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
  isToken?: boolean;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {},
    optionContainer: {
      borderTopColor: colors.border.default,
      borderTopWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    subTitle: {
      fontSize: 10,
      color: colors.text.default,
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
    icon: {
      width: 20,
      height: 20,
      tintColor: colors.text.default,
      marginRight: 12,
    },
    row: {
      flexDirection: 'row',
      paddingVertical: 12,
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 16,
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
    isToken,
  }: Props) => {
    const [visible, setVisible] = useState(visibleModal);
    const [searchOption, setSearchOption] = useState<SelectorOption[]>(options);
    const [currentOption, setCurrentOption] = useState<
      (SelectorOption & {
        isCheck: boolean;
      })[]
    >([]);

    const subOptions = useMemo((): (SelectorOption & {
      isCheck: boolean;
    })[] => {
      return searchOption.map((item) =>
        Object.assign({}, item, { isCheck: false }),
      );
    }, [searchOption]);

    useEffect(() => {
      setCurrentOption(subOptions.slice(0, 10));
    }, [visible, subOptions]);

    useLayoutEffect(() => {
      setVisible(visibleModal);
    }, [visibleModal]);

    const { colors } = useTheme();
    const styles = createStyles(colors);

    const selectedOption: SelectorOption | undefined = useMemo(() => {
      return searchOption
        ? searchOption.filter(
            (option) =>
              option.value === selectedValue ||
              option.subValue === selectedValue,
          )[0]
        : undefined;
    }, [searchOption, selectedValue]);

    const selectedOptionLabel = useMemo(
      () =>
        selectedOption
          ? isToken
            ? selectedOption.symbol
            : selectedOption.label
          : placeholder,
      [isToken, selectedOption, placeholder],
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

    const textLabel = useMemo(() => {
      return selectedOption ? selectedOption.label : placeholder;
    }, [placeholder, selectedOption]);

    const hideMenu = useCallback(() => {
      setVisible(false);
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

    const onChangeParams = useCallback(
      (value: boolean, index: number) => {
        const result = [...currentOption].map((item, subIndex) => {
          if (subIndex === index) {
            return { ...item, isCheck: value };
          }
          return item;
        });
        setCurrentOption(result);
      },
      [currentOption],
    );

    const renderChain = useCallback(
      ({
        item,
        index,
      }: {
        item: SelectorOption & {
          isCheck: boolean;
        };
        index: number;
      }) => {
        return (
          <View
            style={[
              styles.optionContainer,
              {
                backgroundColor:
                  selectedOption?.value === item.value
                    ? colors.background.alternativePressed
                    : '',
              },
            ]}
            key={item.value || UNIQUE_STRING}
          >
            <TouchableOpacity
              style={styles.row}
              onPress={() => onSelectOptionCb(item.value || '')}
            >
              <FastImage
                source={{ uri: item.icon || '' }}
                style={[styles.logoUrl, { marginRight: 12 }]}
              />
              {item.isCheck ? (
                <Text style={styles.label}>{item.subValue}</Text>
              ) : (
                <View>
                  <Text style={styles.label}>
                    {isToken ? item.symbol : item.label}
                  </Text>
                  {isToken && <Text style={styles.subTitle}>{item.label}</Text>}
                </View>
              )}
            </TouchableOpacity>
            {isToken ? (
              <></>
            ) : item.isCheck ? (
              <TouchableOpacity onPress={() => onChangeParams(false, index)}>
                <Image source={icons.iconValid} style={styles.icon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => onChangeParams(true, index)}>
                <Image style={styles.icon} source={icons.iconSettingv2} />
              </TouchableOpacity>
            )}
          </View>
        );
      },
      [
        colors.background.alternativePressed,
        isToken,
        onChangeParams,
        onSelectOptionCb,
        selectedOption?.value,
        styles.icon,
        styles.label,
        styles.logoUrl,
        styles.optionContainer,
        styles.row,
        styles.subTitle,
      ],
    );

    const onChangeOptionSearch = useCallback(
      (value: string) => {
        if (value === '') {
          setSearchOption(options);
          return;
        }
        const result =
          searchOption
            .map((item) => {
              if (item.label.toLowerCase().includes(value.toLowerCase()))
                return item;
              return null;
            })
            .filter(Boolean) || [];
        setSearchOption(result as SelectorOption[]);
        return;
      },
      [searchOption, options],
    );

    const updateParams = useCallback(async () => {
      if (currentOption.length >= 10) {
        const result = [...currentOption].concat(
          subOptions.slice(currentOption.length, currentOption.length + 10),
        );
        setTimeout(() => {
          setCurrentOption(result);
        }, 500);
      }
      return;
    }, [currentOption, subOptions]);

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
          <View>
            <Text
              style={[textStyle, styles.title]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {text === '' ? placeholder : text}
            </Text>
            {isToken && (
              <Text
                style={[textStyle, styles.subTitle]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {textLabel === '' ? placeholder : textLabel}
              </Text>
            )}
          </View>
          <FastImage
            style={styles.image}
            source={icons.iconArrowDown}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </TouchableOpacity>
        <BottomMenuModal isVisible={visible} onClose={hideMenu} propagateSwipe>
          <BottomMenuContainer>
            <BottomMenuHeader title={label} onClose={hideMenu} />
            <SearchBar
              placeholder="Search name ..."
              onInputSubmit={onChangeOptionSearch}
              onPressEnter={() => {}}
              onOpenBrowser={() => {}}
            />
            <FlatList
              data={currentOption}
              renderItem={renderChain}
              style={styles.maxHeightScroll}
              onEndReachedThreshold={0.4}
              onEndReached={updateParams}
            />
          </BottomMenuContainer>
        </BottomMenuModal>
      </View>
    );
  },
);
