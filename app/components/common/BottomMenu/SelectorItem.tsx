import React, { memo, useCallback, useMemo } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { icons } from '../../../assets';
import { useTheme } from '../../../util/theme';
import FastImage from 'react-native-fast-image';

export const UNIQUE_STRING = 'wework@unique123';

export interface SelectorOption {
  value: string | number | undefined;
  subValue?: string | number;
  label: string;
  noTranslate?: boolean;
  icon?: ImageSourcePropType;
  symbol?: string;
}

export interface SelectorItemProps {
  option: SelectorOption;
  onSelect?: (value: any) => void;
  selected: boolean;
  subSelected?: boolean;
  renderIcon?: (icon: ImageSourcePropType) => React.ReactElement | null;
  isRound?: boolean;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    menuItem: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border.muted,
      justifyContent: 'space-between',
    },
    selectedIcon: {
      width: 24,
      height: 24,
      tintColor: colors.primary.default,
    },
    icon: {
      width: 12,
      height: 12,
      marginRight: 16,
    },
    title: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
      marginRight: 4,
    },
    image: {
      width: 9,
      height: 5,
      tintColor: colors.primary.default,
    },
    imageRotate: {
      marginHorizontal: 4,
      width: 9,
      height: 5,
      tintColor: colors.primary.default,
      transform: [{ rotate: '180deg' }],
    },
    containerSubSelected: {
      alignItems: 'center',
      flexDirection: 'row',
    },
  });

export const SelectorItem = memo(
  ({
    onSelect,
    option,
    selected,
    renderIcon,
    subSelected,
    isRound,
  }: SelectorItemProps) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const onPress = useCallback(() => {
      if (selected && option.subValue) {
        onSelect?.(option.subValue);
        return;
      }
      onSelect?.(option.value);
      return;
    }, [selected, onSelect, option.subValue, option.value]);

    const colorTitle = useMemo(() => {
      if (selected || subSelected) return colors.primary.default;
      return colors.text.default;
    }, [colors.primary.default, colors.text.default, selected, subSelected]);

    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.containerSubSelected}>
          <Text style={[styles.title, { color: colorTitle }]} numberOfLines={1}>
            {option?.label || ''}
          </Text>
          {option.icon &&
            (typeof renderIcon === 'function' ? (
              renderIcon(option.icon)
            ) : (
              <Image
                source={option.icon}
                style={[styles.icon, { tintColor: colorTitle }]}
              />
            ))}
          {isRound && (
            <View>
              {selected && (
                <View style={styles.containerSubSelected}>
                  <Image
                    style={styles.image}
                    source={icons.iconArrowDown}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                  <Image
                    style={[
                      styles.imageRotate,
                      { tintColor: colors.overlay.default },
                    ]}
                    source={icons.iconArrowDown}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                </View>
              )}
              {subSelected && (
                <View style={styles.containerSubSelected}>
                  <Image
                    style={[
                      styles.image,
                      { tintColor: colors.overlay.default },
                    ]}
                    source={icons.iconArrowDown}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                  <Image
                    style={styles.imageRotate}
                    source={icons.iconArrowDown}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                </View>
              )}
            </View>
          )}
        </View>

        {selected && !isRound && (
          <Image
            resizeMode="contain"
            style={styles.selectedIcon}
            source={icons.iconChecked}
          />
        )}
      </TouchableOpacity>
    );
  },
);
