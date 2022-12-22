import React from 'react';
import {
  View,
  FlatList,
  StyleProp,
  ViewStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Style, Colors, Fonts } from '../../../styles';
import { ModelCategory, ModelDApps } from './../../../types';
import { useTheme } from './../../..//util/theme';

export interface CategoryHeaderProps {
  style?: StyleProp<ViewStyle>;
  categories?: ModelCategory[];
  dappByCate?: ModelDApps[];
  setPageIndex: (tabIndex: number) => void;
  pageIndex: number;
}

export const CategoryHeader = ({
  style,
  categories = [],
  setPageIndex,
  pageIndex,
}: CategoryHeaderProps) => {
  const { colors } = useTheme();
  const renderItem = React.useCallback(
    ({ item, index }: { item: ModelCategory; index: number }) => {
      const isCurPage = index === pageIndex;
      const titleColor = isCurPage ? colors.text.default : colors.text.muted;
      const bgColor = isCurPage ? colors.primary.default : Colors.tran;
      return (
        <TouchableOpacity
          onPress={() => setPageIndex(index)}
          style={[
            Style.s({
              minH: 32,
              px: 16,
              py: 6,
              cen: true,
              bg: bgColor,
            }),
            Style.b({ bor: 50, width: 0.5, color: colors.border.default }),
          ]}
        >
          <Text style={Fonts.t({ s: 14, c: titleColor, w: '500' })}>
            {item?.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [
      colors.border.default,
      colors.primary.default,
      colors.text.default,
      colors.text.muted,
      pageIndex,
      setPageIndex,
    ],
  );
  const separator = React.useCallback(() => {
    return <View style={Style.s({ w: 8 })} />;
  }, []);
  return (
    <View style={[Style.s({ bg: colors.background.default }), style]}>
      <FlatList
        data={categories}
        contentContainerStyle={Style.s({ px: 16, pt: 8, pb: 16 })}
        horizontal
        renderItem={renderItem}
        ItemSeparatorComponent={separator}
      />
    </View>
  );
};
