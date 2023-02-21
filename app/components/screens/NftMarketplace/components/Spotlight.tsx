import React, { memo, useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { ModelMarketItemData } from 'app/types';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
// import { useDispatch } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import Routes from '../../../../constants/navigation/Routes';
import { useGetSpotlight } from '../../../hooks/Marketplace/useGetSpotlight';
import { FlatList } from 'react-native-gesture-handler';
import { icons } from '../../../../assets';

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      backgroundColor: colors.background.default,
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
      width: 200,
      height: 200,
      borderRadius: 10,
    },
    containerItem: {
      width: 200,
      height: 200,
      flexDirection: 'column',
      marginLeft: 16,
      borderColor: colors.border.default,
      borderWidth: 0.5,
      borderRadius: 10,
    },
    containerHeaderTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerFlatList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
    },
    nameDapp: {
      fontSize: 16,
      fontWeight: '600',
      paddingRight: 15,
      color: colors.background.default,
    },
    subNameDapp: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.background.default,
    },
    iconHot: {
      width: 16,
      height: 16,
      marginLeft: 4,
      tintColor: colors.text.default,
    },
    linearGradient: {
      width: 200,
      height: 200,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5,
      position: 'absolute',
      opacity: 0.4,
      top: 0,
      left: 0,
    },
    linearGradientOuter: {
      width: 200,
      height: 200,
      position: 'absolute',
      top: 0,
      left: 0,
      paddingHorizontal: 10,
      paddingBottom: 20,
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    },
  });

export const Spotlight = function Spotlight() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  const { datas } = useGetSpotlight();

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

        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          colors={['#000000', '#ffffff']}
          style={styles.linearGradient}
        />
        <View style={styles.linearGradientOuter}>
          <Text style={styles.nameDapp} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.subNameDapp} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.containerHeaderTitle}>
        <Text style={styles.titleHeader}>{'Spotlights'}</Text>
        <Image source={icons.iconHot} style={styles.iconHot} />
      </View>
      <View style={styles.containerFlatList}>
        <FlatList
          data={datas}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default memo(Spotlight);
