import React, { memo } from 'react';
import { useCategoriesMarket } from '../../../../reducers/categoriesMarket';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { icons } from '../../../../assets';

export interface CategoryItemInterface {
  id: string;
  selected: boolean;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      paddingVertical: 14,
      marginHorizontal: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border.muted,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '500',
    },
    selectedIcon: {
      width: 24,
      height: 24,
      tintColor: colors.primary.default,
    },
  });

export const CategoryItem = memo(({ id, selected }: CategoryItemInterface) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const category = useCategoriesMarket(id);

  if (!category) return null;
  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.title,
          {
            color: selected ? colors.primary.default : colors.text.default,
          },
        ]}
      >
        {category.name}
      </Text>
      {selected && (
        <Image
          resizeMode="contain"
          style={styles.selectedIcon}
          source={icons.iconChecked}
        />
      )}
    </View>
  );
});
