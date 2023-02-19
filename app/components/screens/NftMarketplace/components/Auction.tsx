import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { ModelCategoryApp, ModelMarketItemData } from 'app/types';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../../constants/navigation/Routes';
import { useGetHotAuction } from '../../../../components/hooks/Marketplace/useGetHotAuction';
import { FlatList } from 'react-native-gesture-handler';

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      backgroundColor: colors.background.default,
      marginVertical: 16,
    },
    titleHeader: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.default,
      marginLeft: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text.default,
      width: 250,
      marginTop: 4,
    },
    icon: {
      height: 150,
      marginHorizontal: 8,
      marginBottom: 8,
      borderRadius: 10,
      backgroundColor: 'red',
    },
    containerItem: {
      minWidth: 200,
      flexDirection: 'column',
      marginLeft: 16,
      borderColor: colors.border.default,
      borderWidth: 0.5,
      borderRadius: 10,
      padding: 6,
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
    containerBidInfo: {
      width: '100%',
      flexDirection: 'row',
    },
    bidTitle: {
      fontSize: 14,
      color: colors.text.muted,
    },
    bidValue: {
      fontSize: 14,
      color: colors.text.default,
    },
    bidTime: {
      fontSize: 14,
      color: colors.text.default,
    },
    bidTimeContainer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      flex: 1,
    },
  });

export interface HeaderInterface {
  title: string;
  subTitle: string;
}

export const Auction = function Auction({ title, subTitle }: HeaderInterface) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  const { isLoadingAuction, auctions } = useGetHotAuction();

  const handleAuctionDetail = (item: any) => { };
  const renderItem = ({ item }: { item: ModelMarketItemData }) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.containerItem}
        onPress={handleAuctionDetail}
      >
        <FastImage
          source={{ uri: item.nftAddress }}
          style={styles.icon}
          resizeMode={FastImage.resizeMode.contain}
        />

        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.nameDapp}>{item.name}</Text>
          <Text style={styles.subNameDapp}>{item.description}</Text>
        </View>
        <View style={styles.containerBidInfo}>
          <View style={{ justifyContent: 'space-around', flex: 1 }}>
            <Text style={styles.bidTitle}>{'Current bid'}</Text>
            <Text style={styles.bidValue}>{item.price}</Text>
          </View>
          <View style={styles.bidTimeContainer}>
            <Text style={styles.bidTitle}>{'Ends on'}</Text>
            <Text style={styles.bidTime}>{item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenWrapper}>
      <Text style={styles.titleHeader}>{title}</Text>
      <Text style={styles.title}>{subTitle}</Text>
      <View style={styles.containerFlatList}>
        <FlatList data={auctions} renderItem={renderItem} horizontal />
      </View>
    </View>
  );
};

export default memo(Auction);
