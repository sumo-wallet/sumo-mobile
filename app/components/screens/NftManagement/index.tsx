import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { strings } from '../../../../locales/i18n';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/theme';
import { fontStyles } from '../../../styles/common';
import FastImage from 'react-native-fast-image';
import { images } from '../../../assets';
import { SHeader } from '../../../components/common';
import { useNavigatorParams } from '../../../components/hooks';
import CollectibleMedia from '../../UI/CollectibleMedia';
import Device from '../../../util/device';
import { renderShortText } from '../../../util/general';
import {
  collectibleContractsSelector,
  collectiblesSelector,
  favoritesCollectiblesSelector,
} from '../../../reducers/collectibles';
import { useSelector } from 'react-redux';
import { SearchBar } from '../../screens/Dapps/SearchBar';

const DEVICE_WIDTH = Device.getDeviceWidth();
const COLLECTIBLE_WIDTH = (DEVICE_WIDTH - 30 - 16) / 2;

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
    nftItemContainer: {
      height: 50,
      margin: 10,
      marginHorizontal: 10,
      paddingHorizontal: 10,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    collectibleIcon: {
      width: 50,
      height: 50,
    },
    nftTitle: {
      flex: 1,
      paddingHorizontal: 10,
      marginTop: 10,
      justifyContent: 'flex-start',
      color: colors.text.default,
    },
    nftTitleContent: {
      color: colors.text.default,
    },
  });
export const NftManagementScreen = React.memo(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const collectibleContracts = useSelector((state: any) =>
    collectibleContractsSelector(state),
  );

  const collectionHeader = () => (
    <View style={styles.headerContainer}>
      <FastImage
        style={styles.collectionThumbnail}
        source={{
          uri: 'https://preview.redd.it/1h0gxywrseh81.jpg?width=640&crop=smart&auto=webp&s=665574e7cb81a0404c0d7f215cf84900c42d8f42',
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <SearchBar
        style={{ width: '100%' }}
        placeholder={'Search...'}
        onInputSubmit={(text) => { }}
      />
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
      <SHeader title={'NFT Management'} />
      <StatusBar barStyle="light-content" />
      <FlatList
        style={styles.flatlistContainer}
        data={collectibleContracts || []}
        renderItem={({ item }) => {
          return (
            <View
              style={styles.nftItemContainer}
            >
              <CollectibleMedia
                style={styles.collectibleIcon}
                collectible={{ ...item, name: 'contractName' }}
              />
              <View style={styles.nftTitle}>
                <Text style={styles.nftTitleContent}>{`# ${renderShortText(
                  item.name,
                  20,
                )}`}</Text>
                <Text style={styles.nftTitleContent}>{`# ${renderShortText(
                  item.address,
                  8
                )}`}</Text>
              </View>
              <Switch
                value={true}
                // onValueChange={this.toggleTokenDetection}
                trackColor={{
                  true: colors.primary.default,
                  false: colors.border.muted,
                }}
                thumbColor={'white'}
                ios_backgroundColor={colors.border.muted}
              />
            </View>
          );
        }}
        ListHeaderComponent={collectionHeader()}
        ListEmptyComponent={emptyView()}
      />
    </SafeAreaView>
  );
});
