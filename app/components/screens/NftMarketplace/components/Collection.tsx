import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { ModelCategoryApp, ModelCollection } from 'app/types';
import { FlatList } from 'react-native-gesture-handler';
import { useGetTrendingCollection } from '../../../../components/hooks/Marketplace/useGetTrendingCollection';
import CollectionItem from './CollectionItem';

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      width: '100%',
      backgroundColor: colors.background.default,
      padding: 16,
      marginVertical: 16,
    },
    headContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleHeader: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.text.default,
    },
    title: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text.default,
      width: 250,
      marginTop: 4,
    },
    containerFlatList: {
      height: 400,
    },
  });

export const Collection = function Collection() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  const { trendingCollections } = useGetTrendingCollection();

  const handleCollectionDetail = (item: ModelCollection) => { };

  const renderItem = ({
    item,
    index,
  }: {
    item: ModelCollection;
    index: number;
  }) => {
    return <CollectionItem item={item} index={index} />;
  };

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.headContainer}>
        <Text style={styles.titleHeader}>{'Trending collection'}</Text>
        <Text style={styles.title}>{'See all'}</Text>
      </View>
      <View style={styles.containerFlatList}>
        <FlatList data={trendingCollections} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default memo(Collection);
