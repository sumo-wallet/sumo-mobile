import React, { memo, useCallback, useMemo } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { ModelCategoryApp, ModelMarketItemData } from 'app/types';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../../constants/navigation/Routes';
import { useGetHotAuction } from '../../../../components/hooks/Marketplace/useGetHotAuction';
import { FlatList } from 'react-native-gesture-handler';
import { icons } from '../../../../assets';

const screenWidth = Dimensions.get('window').width;

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      marginVertical: 8,
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
      width: screenWidth * 0.9,
      marginHorizontal: screenWidth * 0.05,
      height: 150,
      marginBottom: 8,
      borderRadius: 10,
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 10,
    },
    containerItem: {
      flex: 1,
      height: 200,
      width: '100%',
      flexDirection: 'column',
    },
    containerHeaderTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerFlatList: {
      paddingTop: 10,
    },
    containerLogo: {
      flexDirection: 'row',
      position: 'absolute',
      top: 135,
      left: 50,
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
    iconHot: {
      width: 16,
      height: 16,
      marginLeft: 4,
      tintColor: colors.text.default,
    },
  });


export const Popular = function Popular() {
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
          source={{ uri: item.imageUrl }}
          style={styles.icon}
          resizeMode={FastImage.resizeMode.cover}
        />

        <View style={styles.containerLogo}>
          <FastImage
            source={{ uri: item.imageUrl }}
            style={styles.logo}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{ justifyContent: 'center', marginTop: 10, marginLeft: 8 }}>
            <Text style={styles.nameDapp}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.containerHeaderTitle}>
        <Text style={styles.titleHeader}>{'Popular'}</Text>
        <Image source={icons.iconHot} style={styles.iconHot} />
      </View>
      <FlatList
        style={styles.containerFlatList}
        data={auctions}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default memo(Popular);
