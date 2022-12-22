import CollectionNFT from '../../UI/CollectionNFT';
import React, { useCallback } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
} from 'react-native';
import { strings } from '../../../../locales/i18n';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/theme';
import { baseStyles, fontStyles } from '../../../styles/common';
import FastImage from 'react-native-fast-image';
import { icons, images } from '../../../assets';
import { SHeader } from '../../../components/common';
import { useNavigatorParams } from '../../../components/hooks';
import CollectibleMedia from '../../UI/CollectibleMedia';
// import Text from '../../Base/Text';
import Device from '../../../util/device';
import { toLocaleDate } from '../../../util/date';
import { renderFromWei } from '../../../util/number';
import { renderShortAddress } from '../../../util/address';
import { newAssetTransaction } from '../../../actions/transaction';
import { isMainNet } from '../../../util/networks';
import etherscanLink from '@metamask/etherscan-link';
import StyledButton from '../../../components/UI/StyledButton';
import { ROUTES } from '../../../navigation/routes';
import Share from 'react-native-share';
import AppConstants from '../../../core/AppConstants';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  addFavoriteCollectible,
  removeFavoriteCollectible,
} from '../../../actions/collectibles';
import { isCollectibleInFavoritesSelector } from '../../../reducers/collectibles';
import { renderShortText } from '../../../util/general';
import ClipboardManager from '../../../core/ClipboardManager';
import { showAlert } from '../../../actions/alert';

const DEVICE_WIDTH = Device.getDeviceWidth();
const COLLECTIBLE_WIDTH = (DEVICE_WIDTH - 30 - 16) / 2;
const ANIMATION_VELOCITY = 250;
const HAS_NOTCH = Device.hasNotch();
const ANIMATION_OFFSET = HAS_NOTCH ? 30 : 50;
const IS_SMALL_DEVICE = Device.isSmallDevice();
const VERTICAL_ALIGNMENT = IS_SMALL_DEVICE ? 12 : 16;

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
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.default,
      ...fontStyles.normal,
    },
    collectionSubTitle: {
      fontSize: 14,
      color: colors.text.muted,
      ...fontStyles.normal,
    },
    collectionAddressTitle: {
      fontSize: 14,
      height: 20,
      numberOfLines: 1,
      color: colors.text.muted,
      ...fontStyles.normal,
    },
    collectionPropertyContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
      borderRadius: 10,
      backgroundColor: colors.background.alternative,
      marginHorizontal: 10,
    },
    collectionItemContainer: {
      flex: 1,
      width: '90%',
      marginHorizontal: 10,
      paddingVertical: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border.default,
    },
    collectionPropertyLine: {
      width: '100%',
      height: 1,
    },
    collectionItemOptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nftItemContainer: {
      height: COLLECTIBLE_WIDTH + 40,
      width: COLLECTIBLE_WIDTH,
      margin: 10,
      marginHorizontal: 10,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    collectibleIcon: {
      height: COLLECTIBLE_WIDTH,
      marginHorizontal: 10,
    },
    nftTitle: {
      width: '100%',
      paddingHorizontal: 10,
      marginTop: 10,
      color: colors.text.default,
    },
    nftTitleContent: {
      color: colors.text.default,
    },
    iconQR: {
      width: 14,
      height: 14,
      tintColor: colors.text.default,
      marginLeft: 12,
      tintColor: colors.primary.default,
    },
    generalContainer: {
      paddingHorizontal: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: VERTICAL_ALIGNMENT,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      backgroundColor: colors.primary.default,
    },
    iconButtons: {
      width: 54,
      height: 54,
    },
    leftButton: {
      marginRight: 16,
    },
    buttonTitle: {
      color: colors.text.default,
    },
  });
export const NftDetailScreen = React.memo(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();

  const {
    collectible,
    contractName,
    chainId,
  }: { collectible: Object; contractName: string; chainId: int } = useNavigatorParams();

  const selectedAddress = useSelector((state: any) => state.engine.backgroundState.PreferencesController.selectedAddress,);
  const isInFavorites = useSelector((state: any) => isCollectibleInFavoritesSelector(state, collectible));

  const isTradable = useCallback(() => {
    // This might be deprecated
    const lowerAddress = collectible.address.toLowerCase();
    const tradable =
      lowerAddress in collectiblesTransferInformation
        ? collectiblesTransferInformation[lowerAddress].tradable
        : true;

    return tradable && collectible.standard === 'ERC721';
  }, [collectible]);

  const openLink = useCallback(
    (url) => {
      navigation.replace('Webview', {
        screen: 'SimpleWebview',
        params: { url },
      });
    },
    [navigation],
  );

  const onSend = useCallback(async () => {
    newAssetTransaction({ contractName, ...collectible });
    navigation.replace(ROUTES.SendFlowView);
  }, [contractName, collectible, newAssetTransaction, navigation]);

  const shareCollectible = useCallback(() => {
    if (!collectible?.externalLink) return;
    Share.open({
      message: `${strings('collectible.share_check_out_nft')} ${collectible.externalLink
        }\n${strings('collectible.share_via')} ${AppConstants.SHORT_HOMEPAGE_URL
        }`,
    });
  }, [collectible.externalLink]);

  const addFavoriteCollectibleHandle = useCallback((selectedAddress, chainId, collectible) => {
    dispatch(addFavoriteCollectible(selectedAddress, chainId, collectible));
  });
  const removeFavoriteCollectibleHandle = useCallback((selectedAddress, chainId, collectible) => {
    dispatch(addFavoriteCollectible(selectedAddress, chainId, collectible));
  });

  const collectibleToFavorites = useCallback(() => {
    const action = isInFavorites
      ? removeFavoriteCollectibleHandle
      : addFavoriteCollectibleHandle;
    action(selectedAddress, chainId, collectible);
  }, [
    selectedAddress,
    chainId,
    collectible,
    isInFavorites,
    removeFavoriteCollectibleHandle,
    addFavoriteCollectibleHandle,
  ]);

  const onClipBoard = useCallback(async (content) => {
    await ClipboardManager.setString(content);
    dispatch(
      showAlert({
        isVisible: true,
        autodismiss: 1500,
        content: 'clipboard-alert',
        data: { msg: content },
      }),
    );
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <SHeader title={contractName} />
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <CollectibleMedia
          // onClose={() => modalRef.current.dismissModal()}
          cover
          renderAnimation
          collectible={collectible}
          style={styles.collectibleIcon}
        />
        <View style={styles.collectionPropertyContainer}>
          <View style={styles.collectionItemContainer}>
            <Text style={styles.collectionNameTitle}>{strings('collectible.collectible_asset_contract')}</Text>
            <View style={styles.collectionItemOptionContainer}>
              <Text style={styles.collectionAddressTitle}>
                {renderShortAddress(collectible?.address)}
              </Text>
              <TouchableOpacity onPress={() => {
                onClipBoard(collectible?.address);
              }}>
                <Image source={icons.iconCopy} style={styles.iconQR} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                if (isMainNet(chainId))
                  openLink(
                    etherscanLink.createTokenTrackerLink(collectible?.address, chainId),
                  );
              }}>
                <Image source={icons.iconChart} style={styles.iconQR} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.collectionItemContainer}>
            <Text style={styles.collectionNameTitle}>{'Token ID'}</Text>
            <View style={styles.collectionItemOptionContainer}>
              <Text style={styles.collectionSubTitle}>
                {renderShortText(collectible.tokenId, 8)}
              </Text>
              <TouchableOpacity onPress={() => {
                onClipBoard(collectible.tokenId);
              }}>
                <Image source={icons.iconCopy} style={styles.iconQR} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.collectionItemContainer}>
            <Text style={styles.collectionNameTitle}>{'Type'}</Text>
            <Text style={styles.collectionSubTitle}>{collectible.standard}</Text>
          </View>
          <View style={styles.collectionItemContainer}>
            <Text style={styles.collectionNameTitle}>{'Blockchain'}</Text>
            <Text style={styles.collectionSubTitle}>{collectible.blockchain}</Text>
          </View>

          {collectible?.lastSale && (
            <View style={styles.collectionItemContainer}>
              <Text style={styles.collectionNameTitle}>
                {strings('collectible.collectible_last_sold')}
              </Text>
              <Text style={styles.collectionSubTitle}>
                {collectible?.lastSale?.event_timestamp &&
                  toLocaleDate(
                    new Date(collectible?.lastSale?.event_timestamp),
                  ).toString()}
              </Text>
            </View>
          )}

          {collectible?.lastSale && (
            <View style={styles.collectionItemContainer}>
              <Text style={styles.collectionNameTitle}>
                {strings('collectible.collectible_last_price_sold')}
              </Text>
              <Text style={styles.collectionSubTitle}>
                {collectible?.lastSale?.total_price &&
                  `${renderFromWei(collectible?.lastSale?.total_price)} ETH`}
              </Text>
            </View>
          )}
          {collectible?.imageOriginal && (
            <TouchableOpacity
              style={styles.collectionItemContainer}
              onPress={() => {
                openLink(collectible?.imageOriginal);
              }}
            >
              <Text style={styles.collectionNameTitle}>
                {strings('collectible.collectible_source')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.generalContainer, styles.buttonContainer]}>
          {isTradable && (
            <StyledButton
              onPressOut={onSend}
              type={'rounded-normal'}
              containerStyle={[
                baseStyles.flexGrow,
                styles.button,
                styles.leftButton,
              ]}
            >
              <Text style={styles.buttonTitle}>
                {strings('asset_overview.send_button')}
              </Text>
            </StyledButton>
          )}
          {collectible?.externalLink && (
            <StyledButton
              type={'rounded-normal'}
              containerStyle={[
                styles.button,
                styles.iconButtons,
                styles.leftButton,
              ]}
              onPressOut={shareCollectible}
            >
              <Text style={styles.buttonTitle}>
                <EvilIcons
                  name={Device.isIos() ? 'share-apple' : 'share-google'}
                  size={32}
                  color={colors.text.default}
                />
              </Text>
            </StyledButton>
          )}
          <StyledButton
            type={'rounded-normal'}
            containerStyle={[styles.button, styles.iconButtons]}
            onPressOut={collectibleToFavorites}
          >
            <Text>
              <AntIcons name={isInFavorites ? 'star' : 'staro'} size={24} color={colors.text.default} />
            </Text>
          </StyledButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

// const mapStateToProps = (state, props) => ({
//   chainId: state.engine.backgroundState.NetworkController.provider.chainId,
//   selectedAddress:
//     state.engine.backgroundState.PreferencesController.selectedAddress,
//   isInFavorites: isCollectibleInFavoritesSelector(state, props.collectible),
// });

// const mapDispatchToProps = (dispatch) => ({
//   addFavoriteCollectible: (selectedAddress, chainId, collectible) =>
//     dispatch(addFavoriteCollectible(selectedAddress, chainId, collectible)),
//   removeFavoriteCollectible: (selectedAddress, chainId, collectible) =>
//     dispatch(removeFavoriteCollectible(selectedAddress, chainId, collectible)),
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(
//   Device.isIos()
//     ? CollectibleOverview
//     : gestureHandlerRootHOC(CollectibleOverview, {
//       flex: 0,
//       zIndex: 0,
//       elevation: 0,
//     }),
// );
