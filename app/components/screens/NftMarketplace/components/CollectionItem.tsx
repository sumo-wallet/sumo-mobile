import React, { memo, useCallback, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { ModelCategoryApp, ModelCollection } from 'app/types';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../../constants/navigation/Routes';
import { icons } from '../../../../assets';

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
      paddingVertical: 7,
      paddingHorizontal: 10,
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
      fontSize: 15,
      fontWeight: '500',
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
      paddingTop: 8,
      borderTopWidth: 0.5,
      borderTopColor: colors.text.muted,
    },
    containerStatsItem: {
      flexDirection: 'column',
      alignItems: 'center',
      marginHorizontal: 2,
    },
    titleStats: {
      fontSize: 12,
      fontWeight: '400',
      marginTop: 4,
      color: colors.text.muted,
    },
    changeStats: {
      fontSize: 12,
      fontWeight: '400',
      color: 'green',
      marginVertical: 1,
      justifyContent: 'flex-end',
      textAlign: 'right',
    },
    valueStats: {
      fontSize: 14,
      fontWeight: '500',
      marginTop: 4,
      color: colors.text.default,
    },
    iconArrow: {
      width: 12,
      height: 12,
    },
    iconCurrency: {
      width: 13,
      height: 13,
      marginRight: 2,
      tintColor: colors.text.default,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
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
      style={[styles.containerItem, { backgroundColor: isOpen ? colors.background.alternative : colors.background.default }]}
      onPress={() => {
        handleCollectionDetail(item);
      }}
    >
      <View style={styles.containerMain}>
        <Text style={styles.indexTitle}>{`# ${index + 1}`}</Text>
        <FastImage
          source={{ uri: item.image_url }}
          style={styles.icon}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.containerName}>
          <Text style={styles.nameDapp}>{item.name}</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', marginRight: 12 }}>
          <View style={styles.priceContainer}>
            <Image
              style={styles.iconCurrency}
              source={icons.currency_ethereum}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.nameDapp}>{item.stats?.floor_price}</Text>
          </View>
          <Text
            style={styles.changeStats}
          >{`${item.stats?.one_hour_sales_change}%`}</Text>
        </View>
        <TouchableOpacity
          style={{ justifyContent: 'center', paddingHorizontal: 4 }}
          onPress={openHandle}
        >
          <Image
            style={styles.iconArrow}
            resizeMode={FastImage.resizeMode.contain}
            source={isOpen ? icons.iconArrowUp : icons.iconArrowDown}
          />
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
