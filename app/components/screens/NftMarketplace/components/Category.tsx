import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { MarketplaceCollectionCategory, ModelCategory, ModelCategoryApp } from 'app/types';
import FastImage from 'react-native-fast-image';
import { useGetCollectionCategory } from '../../../hooks/Collection/useGetCollectionCategory';
import { FlatList } from 'react-native-gesture-handler';

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      backgroundColor: colors.background.default,
    },
    titleHeader: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.text.default,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text.default,
      width: 250,
      marginTop: 4,
    },
    icon: {
      width: 24,
      height: 24,
      padding: 4,
      margin: 4,
    },
    containerItem: {
      flexDirection: 'row',
      marginVertical: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 6,
      borderRadius: 6,
    },
    containerFlatList: {
      flexDirection: 'row',
    },
    nameDapp: {
      fontSize: 14,
      fontWeight: '600',
      paddingRight: 15,
      marginLeft: 4,
      color: colors.text.default,
    },
    subNameDapp: {
      fontSize: 10,
      fontWeight: '400',
      color: colors.text.muted,
    },
  });


export const Category = function Category() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  const { categories } = useGetCollectionCategory();

  const handleCategoryDetail = (item: MarketplaceCollectionCategory) => { };
  const renderItem = ({ item }: { item: MarketplaceCollectionCategory }) => {
    return (
      <TouchableOpacity
        key={item.name}
        style={[styles.containerItem, { backgroundColor: item?.color }]}
        onPress={() => {
          handleCategoryDetail(item);
        }}
      >
        <FastImage
          source={{ uri: item?.imageUrl || 'https://i.imgur.com/4OpmWHF.png' }}
          style={styles.icon}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.nameDapp}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.containerFlatList}>
        <FlatList data={categories} renderItem={renderItem} horizontal showsHorizontalScrollIndicator={false} />
      </View>
    </View>
  );
};

export default memo(Category);
