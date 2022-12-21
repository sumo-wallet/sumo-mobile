import CollectionNFT from '../../UI/CollectionNFT';
import React from 'react';
import { View, SafeAreaView, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { strings } from '../../../../locales/i18n';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/theme';
import { fontStyles } from '../../../styles/common';
import FastImage from 'react-native-fast-image';
import { images } from '../../../assets';
import { SHeader } from '../../../components/common';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
      marginTop: 16,
    },
    flatlistContainer: {
      flex: 1,
    },
    emptyView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    add: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addText: {
      fontSize: 14,
      color: colors.primary.default,
      ...fontStyles.normal,
    },
    footer: {
      flex: 1,
      paddingBottom: 30,
      alignItems: 'center',
      marginTop: 24,
    },
    emptyContainer: {
      flex: 1,
      marginBottom: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyImageContainer: {
      width: 76,
      height: 76,
      marginTop: 30,
      marginBottom: 12,
      tintColor: colors.icon.muted,
    },
    emptyTitleText: {
      fontSize: 24,
      color: colors.text.alternative,
    },
    emptyText: {
      color: colors.text.alternative,
      marginBottom: 8,
      fontSize: 14,
    },
    headerContainer: {
      flex: 1,
      marginBottom: 10,
    },
    collectionThumbnail: {
      height: 100,
      width: '100%',
    },
    collectionInfoContainer: {
      paddingHorizontal: 10,
    },
    collectionAvatar: {
      width: 90,
      height: 90,
      position: 'absolute',
      top: -20,
      left: 20,
      borderRadius: 45,
      borderWidth: 4,
      borderColor: colors.background.default,
    },
    emptyViewContainer: {
      height: '100%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: colors.background.alternative,
      justifyContent: 'center',
      alignItems: 'center',
    },

    nameContainer: {
      width: '100%',
      marginLeft: 130,
      paddingTop: 10,
    },
    collectionNameTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text.default,
      ...fontStyles.normal,
    },
    collectionSubTitle: {
      fontSize: 14,
      color: colors.text.muted,
      ...fontStyles.normal,
    },
    collectionPropertyContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
    },
    collectionItemContainer: {
      width: '24%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    collectionPropertyLine: {
      width: 1,
      height: 30,
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border.default,
    },
  });
export const NftCollectionScreen = React.memo(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const collectionHeader = () => (
    <View style={styles.headerContainer}>
      <SHeader title={strings('wallet.collectibles')} />
      <StatusBar barStyle="light-content" />
      <FastImage
        style={styles.collectionThumbnail}
        source={{
          uri: 'https://i.seadn.io/gae/gYMU9ZpVqOn2XRl3YbO-K3feT-bP09Hw9xFefwEuQ28jZvvEWKNnxhVraJTLu_TKCnQw7Ny6Le58gy-ujKAjE2nqnE18Boqr5XCw5w?auto=format&w=1920',
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.collectionInfoContainer}>
        <FastImage
          style={styles.collectionAvatar}
          source={{
            uri: 'https://i.seadn.io/gae/OMha_ibw2qTvRqXCR1toX78uWoHs5ZQmZy8qPxXjHimrjakRSZBN8d8GARykrH-5YPyRwPLXW-3DtlZ8FLKU0wiYnrmYyCU5C7PZkTU?auto=format&w=256',
          }}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.collectionNameTitle}>{'NFT Collection'}</Text>
        </View>
        <View style={styles.collectionPropertyContainer}>
          <View style={styles.collectionItemContainer}>
            <Text style={styles.collectionNameTitle}>{'1K'}</Text>
            <Text style={styles.collectionSubTitle}>{'Items'}</Text>
          </View>
          <View style={styles.collectionPropertyLine} />
          <View style={styles.collectionItemContainer}>
            <Text style={styles.collectionNameTitle}>{'1K'}</Text>
            <Text style={styles.collectionSubTitle}>{'Owner'}</Text>
          </View>
          <View style={styles.collectionPropertyLine} />
          <View style={styles.collectionItemContainer}>
            <Text style={styles.collectionNameTitle}>{'1K'}</Text>
            <Text style={styles.collectionSubTitle}>{'Floor'}</Text>
          </View>
          <View style={styles.collectionPropertyLine} />
          <View style={styles.collectionItemContainer}>
            <Text style={styles.collectionNameTitle}>{'1K'}</Text>
            <Text style={styles.collectionSubTitle}>{'Vol'}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const emptyView = () => (
    <View style={styles.emptyViewContainer}>
      <FastImage
        style={styles.emptyImageContainer}
        source={images.emptyBox}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text style={styles.emptyText}>{'empty'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <FlatList
        style={styles.flatlistContainer}
        data={[]}
        renderItem={() => {
          return (
            <View></View>
          )
        }}
        ListHeaderComponent={collectionHeader()}
        ListEmptyComponent={emptyView()}
      />
    </SafeAreaView>
  );
});
