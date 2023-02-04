import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { ModelCategory, ModelCategoryApp } from 'app/types';
import FastImage from 'react-native-fast-image';
import { useGetCollectionCategory } from '../../../hooks/Collection/useGetCollectionCategory';

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      backgroundColor: colors.background.default,
      padding: 16,
      marginVertical: 16,
      marginHorizontal: -16,
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
      width: 30,
      height: 30,
      marginRight: 8,
    },
    containerItem: {
      flexDirection: 'row',
      marginVertical: 22,
    },
    containerFlatList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    nameDapp: {
      fontSize: 14,
      fontWeight: '600',
      paddingRight: 15,
      color: colors.text.default,
    },
    subNameDapp: {
      fontSize: 10,
      fontWeight: '400',
      color: colors.text.muted,
    },
  });

export interface RawDappInterface {
  title: string;
  subTitle: string;
}

export const Category = function Category({
  title,
  subTitle,
}: RawDappInterface) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  const { categories } = useGetCollectionCategory();

  const handleCategoryDetail = (item: ModelCategory) => { };

  return (
    <View style={styles.screenWrapper}>
      <Text style={styles.titleHeader}>{title}</Text>
      <Text style={styles.title}>{subTitle}</Text>
      {/* <Text style={styles.title}>{JSON.stringify(data)}</Text> */}
      <View style={styles.containerFlatList}>
        {categories.map((item, index) => {
          if (item) {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.containerItem, { backgroundColor: item?.name }]}
                onPress={() => {
                  handleCategoryDetail(item);
                }}
              >
                <FastImage
                  source={{ uri: item?.imageUrl || '' }}
                  style={styles.icon}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text style={styles.nameDapp}>{item.name}</Text>
              </TouchableOpacity>
            );
          }
          return <View />;
        })}
      </View>
    </View>
  );
};

export default memo(Category);
