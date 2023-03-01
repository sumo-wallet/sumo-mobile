import React, { memo, useCallback, useMemo } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { icons } from '../../../assets';
import { useTheme } from '../../../util/theme';

export const UNIQUE_STRING = 'wework@unique123';

export interface SelectorOption {
  value: string | number | undefined;
  label: string;
  noTranslate?: boolean;
  icon?: ImageSourcePropType;
}

export interface SelectorItemProps {
  option: SelectorOption;
  onSelect?: (value: any) => void;
  selected: boolean;
  renderIcon?: (icon: ImageSourcePropType) => React.ReactElement | null;
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
      width: 24,
      height: 24,
      marginRight: 16,
    },
    title: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
      marginRight: 4,
    },
  });

export const SelectorItem = memo(
  ({ onSelect, option, selected, renderIcon }: SelectorItemProps) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const onPress = useCallback(() => {
      onSelect?.(option.value);
    }, [option, onSelect]);

    const colorTitle = useMemo(() => {
      if (selected) return colors.primary.default;
      return colors.text.default;
    }, [selected]);

    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <>
          {option.icon &&
            (typeof renderIcon === 'function' ? (
              renderIcon(option.icon)
            ) : (
              <Image source={option.icon} style={styles.icon} />
            ))}
          <Text style={[styles.title, { color: colorTitle }]} numberOfLines={1}>
            {option?.label || ''}
          </Text>
          {selected && (
            <Image
              resizeMode="contain"
              style={styles.selectedIcon}
              source={icons.iconChecked}
            />
          )}
        </>
      </TouchableOpacity>
    );
  },
);
