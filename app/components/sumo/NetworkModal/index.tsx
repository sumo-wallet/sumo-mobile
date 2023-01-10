import React from 'react';
import Engine from '../../../core/Engine';
import PropTypes from 'prop-types';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { fontStyles } from '../../../styles/common';
import Modal from 'react-native-modal';
import { strings } from '../../../../locales/i18n';
import { isprivateConnection } from '../../../util/networks';
import { isWebUri } from 'valid-url';
import { ThemeContext, useTheme } from '../../../util/theme';
import sanitizeUrl from '../../../util/sanitizeUrl';
import { ThemeColors } from '@thanhpn1990/design-tokens/dist/js/themes/types';
import ModalDragger from '../../../components/Base/ModalDragger';
import Text from '../../../components/Base/Text';
import StyledButton from '../../../components/UI/StyledButton';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {
  NETWORK_LIST_MODAL_CONTAINER_ID,
  APPROVE_NETWORK_DISPLAY_NAME_ID,
  APPROVE_NETWORK_CANCEL_BUTTON_ID,
  APPROVE_NETWORK_APPROVE_BUTTON_ID,
} from '../../../constants/test-ids';
import URLPARSE from 'url-parse';
import getDecimalChainId from '../../../util/networks/getDecimalChainId';
const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },

    wrapper: {
      backgroundColor: colors.background.default,
      borderRadius: 10,
      // minHeight: 470,
      flex: 1,
    },
    titleWrapper: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border.muted,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      fontSize: 18,
      marginVertical: 12,
      marginHorizontal: 20,
      color: colors.text.default,
      ...fontStyles.bold,
    },
    otherNetworksHeader: {
      marginTop: 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border.muted,
    },
    networksWrapper: {
      flex: 1,
    },
    networkContainer: {
      borderColor: colors.border.muted,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      // paddingVertical: 20,
      paddingLeft: 16,
    },
    mainnet: {
      borderBottomWidth: 0,
      flexDirection: 'column',
    },
    networkInfo: {
      marginLeft: 15,
      flex: 1,
    },
    networkLabel: {
      fontSize: 14,
      color: colors.text.default,
      ...fontStyles.normal,
    },
    footer: {
      marginVertical: 10,
      flexDirection: 'row',
    },
    footerButton: {
      flex: 1,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
    },
    networkIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    networkWrapper: {
      flex: 0,
      flexDirection: 'row',
    },
    selected: {
      marginLeft: 20,
      marginTop: 20,
    },
    mainnetSelected: {
      marginLeft: 0,
      marginTop: 3,
    },
    closeIcon: {
      position: 'absolute',
      right: 0,
      padding: 15,
      color: colors.icon.default,
    },
    text: {
      textAlign: 'center',
      color: colors.text.default,
      fontSize: 10,
      marginTop: 4,
    },
    nameWrapper: {
      backgroundColor: colors.background.alternative,
      marginRight: '15%',
      marginLeft: '15%',
      paddingVertical: 5,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    infoIconContainer: {
      paddingHorizontal: 3,
    },
    infoIcon: {
      fontSize: 12,
      color: colors.icon.default,
    },
    popularNetworkImage: {
      width: 20,
      height: 20,
      marginRight: 10,
      borderRadius: 10,
    },
    networkInformation: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      borderWidth: 1,
      borderColor: colors.text.muted,
      borderRadius: 10,
      padding: 16,
      marginBottom: 10,
    },
    buttonView: {
      flexDirection: 'row',
      paddingVertical: 16,
    },
    button: {
      flex: 1,
    },
    cancel: {
      marginRight: 8,
      borderColor: colors.text.muted,
      borderWidth: 1,
    },
    confirm: {
      marginLeft: 8,
    },
    bottomSpace: {
      marginBottom: 10,
    },
  });

/**
 * View that contains the list of all the available networks
 */
function NetworkModal({ onClose, isVisible, network }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const {
    chainId,
    nickname,
    ticker,
    rpcUrl,
    formattedRpcUrl,
    rpcPrefs: { blockExplorerUrl, imageUrl },
  } = network;

  const [showDetails, setShowDetails] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);

  const showToolTip = () => setShowInfo(!showInfo);
  const showDetailsModal = () => setShowDetails(!showDetails);

  const goToLink = () => Linking.openURL(strings('networks.security_link'));
  const validateRpcUrl = (url: string) => {
    if (!isWebUri(url)) return false;
    return true;
  };
  const addNetwork = async () => {
    const { PreferencesController } = Engine.context;
    let formChainId = chainId.trim().toLowerCase();

    if (!formChainId.startsWith('0x')) {
      formChainId = `0x${parseInt(formChainId, 10).toString(16)}`;
    }

    const validUrl = validateRpcUrl(rpcUrl);

    if (validUrl) {
      const url = new URLPARSE(rpcUrl);
      const sanitizedUrl = sanitizeUrl(url.href);
      const decimalChainId = getDecimalChainId(chainId);
      !isprivateConnection(url.hostname) && url.set('protocol', 'https:');
      PreferencesController.addToFrequentRpcList(
        url.href,
        decimalChainId,
        ticker,
        nickname,
        {
          blockExplorerUrl,
        },
      );
    }
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      avoidKeyboard
      // onModalHide={() => setSearchString('')}
      style={styles.modal}
      backdropColor={colors.overlay.default}
      backdropOpacity={0.7}
      animationInTiming={600}
      animationOutTiming={600}
      swipeDirection={'down'}
      propagateSwipe
    >
      <SafeAreaView
        style={styles.wrapper}
        testID={NETWORK_LIST_MODAL_CONTAINER_ID}
      >
        <ModalDragger />
        <View>
          <Text reset style={styles.title}>
            {strings('networks.want_to_add_network')}
          </Text>
          <Text centered style={styles.bottomSpace}>
            {strings('networks.network_infomation')}
          </Text>
          <Text centered bold>
            {strings('networks.network_endorsement')}
            <View style={styles.infoIconContainer}>
              <FAIcon
                name="info-circle"
                style={styles.infoIcon}
                onPress={showToolTip}
              />
            </View>
          </Text>
          <Text centered style={styles.bottomSpace}>
            <Text>{strings('networks.learn_about')} </Text>
            <Text link onPress={goToLink}>
              {strings('networks.network_risk')}
            </Text>
          </Text>
          <View style={styles.networkInformation}>
            <View>
              <Text black>{strings('networks.network_display_name')}</Text>
              <Text
                bold
                black
                style={styles.bottomSpace}
                testID={APPROVE_NETWORK_DISPLAY_NAME_ID}
              >
                {nickname}
              </Text>
              <Text black>{strings('networks.network_chain_id')}</Text>
              <Text bold black style={styles.bottomSpace}>
                {chainId}
              </Text>
              <Text black>{strings('networks.network_rpc_url')}</Text>
              <Text bold black style={styles.bottomSpace}>
                {formattedRpcUrl || rpcUrl}
              </Text>
            </View>
          </View>
          <Text onPress={showDetailsModal} centered link bold>
            {strings('networks.view_details')}
          </Text>
          <View style={styles.buttonView}>
            <StyledButton
              type={'cancel'}
              onPress={onClose}
              containerStyle={[styles.button, styles.cancel]}
              testID={APPROVE_NETWORK_CANCEL_BUTTON_ID}
            >
              <Text centered>{strings('networks.cancel')}</Text>
            </StyledButton>
            <StyledButton
              type={'confirm'}
              onPress={addNetwork}
              containerStyle={[styles.button, styles.confirm]}
              testID={APPROVE_NETWORK_APPROVE_BUTTON_ID}
              disabled={!validateRpcUrl(rpcUrl)}
            >
              {strings('networks.approve')}
            </StyledButton>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

NetworkModal.propTypes = {
  onClose: PropTypes.func,
  provider: PropTypes.object,
  isVisible: PropTypes.bool,
  network: PropTypes.any,
};

NetworkModal.contextType = ThemeContext;

export default NetworkModal;
