import React, { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { ModelCategoryApp, ModelCollection } from 'app/types';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../../constants/navigation/Routes';

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      width: '100%',
      backgroundColor: colors.background.default,
      padding: 16,
      marginVertical: 16,
    },
    icon: {
      width: 40,
      height: 40,
      marginRight: 8,
      borderRadius: 10,
    },
    containerItem: {
      flexDirection: 'column',
      marginVertical: 4,
    },
    containerFlatList: {
      height: 400,
    },
    containerMain: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
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
    changeTitle: {
      fontSize: 14,
      fontWeight: '400',
      paddingRight: 15,
      color: 'green',
    },
    indexTitle: {
      fontSize: 14,
      fontWeight: '600',
      paddingRight: 15,
      color: colors.text.default,
      alignItems: 'center',
    },
    containerName: { justifyContent: 'center', flex: 1 },
    containerStats: {
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    containerStatsItem: {
      flexDirection: 'column',
      alignItems: 'center',
      marginHorizontal: 2,
    },
    titleStats: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.text.muted,
    },
    changeStats: {
      fontSize: 12,
      fontWeight: '400',
      color: 'green',
      marginVertical: 1,
    },
    valueStats: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.default,
    },
  });
export interface CollectionItemData {
  item: ModelCollection;
  index: number;
}
export const CollectionItem = function CollectionItem({
  item,
  index,
}: CollectionItemData) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isOpen, setOpen] = useState(false);
  // const navigation = useNavigation();
  // const dispatch = useDispatch();

  const handleCollectionDetail = (item: ModelCollection) => { };
  const openHandle = () => {
    setOpen(!isOpen);
  };

  return (
    <TouchableOpacity
      key={item.id}
      style={styles.containerItem}
      onPress={() => {
        handleCollectionDetail(item);
      }}
    >
      <View style={styles.containerMain}>
        <Text style={styles.indexTitle}>{`# ${index}`}</Text>
        <FastImage
          source={{ uri: item.image_url }}
          style={styles.icon}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.containerName}>
          <Text style={styles.nameDapp}>{item.name}</Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.nameDapp}>{item.stats?.floor_price}</Text>
          <Text style={styles.changeStats}>{`${item.stats?.one_hour_sales_change}%`}</Text>
        </View>
        <TouchableOpacity
          style={{ justifyContent: 'center' }}
          onPress={openHandle}
        >
          <Text style={styles.nameDapp}>{isOpen ? '^' : '-'}</Text>
        </TouchableOpacity>
      </View>
      {isOpen && (
        <View style={styles.containerStats}>
          <View style={styles.containerStatsItem}>
            <Text style={styles.titleStats}>{'24H VOL'}</Text>
            <Text style={styles.valueStats}>{'281.21'}</Text>
            <Text style={styles.changeStats}>{'+12%'}</Text>
          </View>
          <View style={styles.containerStatsItem}>
            <Text style={styles.titleStats}>{'TOTAL VOL'}</Text>
            <Text style={styles.valueStats}>{'24H VOL'}</Text>
            <Text style={styles.changeStats}>{'-12%'}</Text>
          </View>
          <View style={styles.containerStatsItem}>
            <Text style={styles.titleStats}>{'OWNER'}</Text>
            <Text style={styles.valueStats}>{'996'}</Text>
          </View>
          <View style={styles.containerStatsItem}>
            <Text style={styles.titleStats}>{'ITEMS'}</Text>
            <Text style={styles.valueStats}>{'2423'}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(CollectionItem);
