import React, { PureComponent, useCallback } from 'react';
import { KeyringTypes } from '@metamask/controllers';
import Engine from '../../../core/Engine';
import PropTypes from 'prop-types';
import {
  Alert,
  InteractionManager,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
} from 'react-native';
import { fontStyles } from '../../../styles/common';
import Device from '../../../util/device';
import { strings } from '../../../../locales/i18n';
import { toChecksumAddress } from 'ethereumjs-util';
import Logger from '../../../util/Logger';
import Analytics from '../../../core/Analytics/Analytics';
import AnalyticsV2 from '../../../util/analyticsV2';
import { ANALYTICS_EVENT_OPTS } from '../../../util/analytics';
import { doENSReverseLookup } from '../../../util/ENSUtils';
import AccountElement from './AccountElement';
import { connect } from 'react-redux';
import { ThemeContext, mockTheme } from '../../../util/theme';
import { Colors, Style } from '../../../styles';
import { SButton } from '../../common/SButton';
import { BaseModal } from '../../Base/BaseModal';
import { icons } from '../../../assets';
import ClipboardManager from '../../../core/ClipboardManager';
import { showAlert } from '../../../actions/alert';
import { toggleAccountsModal } from '../../../actions/modals';
import {
  protectWalletModalVisible,
  setAvatarUser,
  setNameWallet,
} from '../../../actions/user';
import {
  findBlockExplorerForRpc,
  getBlockExplorerName,
  getNetworkTypeById,
} from '../../../util/networks';
import {
  getEtherscanBaseUrl,
  getEtherscanTransactionUrl,
} from '../../../util/etherscan';
import { NO_RPC_BLOCK_EXPLORER, RPC } from '../../../constants/network';
import Modal from 'react-native-modal';
import Identicon from '../Identicon';
import { SInput } from '../../common';
import File from '../../../services/File';

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      minHeight: 600,
    },
    titleWrapper: {
      width: '100%',
      height: 33,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dragger: {
      width: 48,
      height: 5,
      borderRadius: 4,
      backgroundColor: colors.text.default,
    },
    accountsWrapper: {
      flex: 1,
      marginTop: 8,
    },
    footer: {
      height: Device.isIphoneX() ? 200 : 170,
      paddingBottom: Device.isIphoneX() ? 30 : 0,
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    },
    btnText: {
      fontSize: 14,
      color: Colors.white[3],
      ...fontStyles.normal,
    },
    footerButton: {
      width: '100%',
      height: 55,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.gray[5],
    },
    titleWallet: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text.default,
      alignSelf: 'center',
      marginVertical: 12,
    },
    titleMain: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.default,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    subTitleMain: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.text.default,
    },
    containerMain: {},
    containerBtn: {
      backgroundColor: colors.background.button,
      marginTop: 20,
      marginHorizontal: 16,
    },
    titleButton: {
      color: colors.text.inverse,
    },
    containerOrder: {
      marginTop: 24,
    },
    containerModal: {
      backgroundColor: colors.background.default,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      minHeight: 200,
      width: '100%',
      paddingBottom: 32,
    },
    containerIconModal: {
      flexDirection: 'row',
      margin: 16,
      alignItems: 'center',
    },
    iconModal: {
      width: 24,
      height: 24,
      marginRight: 16,
      tintColor: colors.text.default,
    },
    titleIconModal: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.default,
    },
    modalEdit: {
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerEdit: {
      backgroundColor: colors.background.default,
      width: '80%',
      borderRadius: 12,
      padding: 16,
      paddingTop: 20,
      alignItems: 'center',
    },
    containerBtnEdit: {
      marginTop: 20,
      marginHorizontal: 16,
      paddingHorizontal: 32,
      minWidth: 120,
    },
    imageAvatar: {
      width: 52,
      height: 52,
      borderRadius: 52,
    },
    wrapperBtnEdit: {
      flexDirection: 'row',
      marginHorizontal: 12,
    },
    textWarning: {
      marginTop: 8,
      color: colors.warning.default,
    },
  });

/**
 * View that contains the list of all the available accounts
 */
class AccountList extends PureComponent {
  static propTypes = {
    /**
     * Map of accounts to information objects including balances
     */
    accounts: PropTypes.object,
    /**
     * An object containing each identity in the format address => account
     */
    identities: PropTypes.object,
    /**
     * A string representing the selected address => account
     */
    selectedAddress: PropTypes.string,
    /**
     * An object containing all the keyrings
     */
    keyrings: PropTypes.array,
    /**
     * function to be called when switching accounts
     */
    onAccountChange: PropTypes.func,
    /**
     * function to be called when importing an account
     */
    onImportAccount: PropTypes.func,
    /**
     * function to be called when connect to a QR hardware
     */
    onConnectHardware: PropTypes.func,
    /**
     * Current provider ticker
     */
    ticker: PropTypes.string,
    /**
     * Whether it will show options to create or import accounts
     */
    enableAccountsAddition: PropTypes.bool,
    /**
     * function to generate an error string based on a passed balance
     */
    getBalanceError: PropTypes.func,
    /**
     * Indicates whether third party API mode is enabled
     */
    thirdPartyApiMode: PropTypes.bool,
    /**
     * ID of the current network
     */
    network: PropTypes.string,
    showAlert: PropTypes.func,
    protectWalletModalVisible: PropTypes.func,
    navigation: PropTypes.object,
    toggleAccountsModal: PropTypes.func,
    setAvatarUser: PropTypes.func,
    setNameWallet: PropTypes.func,
    avatarUrl: PropTypes.object,
    nameWallet: PropTypes.object,
  };

  state = {
    loading: false,
    orderedAccounts: [],
    accountsENS: {},
    isVisible: false,
    newAddress: '',
    rpcBlockExplorer: '',
    isEditVisible: false,
    avatarUrl: this.props.avatarUrl,
    nameWallet: this.props.nameWallet,
    isEmpty: false,
  };

  flatList = React.createRef();
  lastPosition = 0;
  updating = false;

  componentDidMount() {
    this.mounted = true;
    const orderedAccounts = this.getAccounts();
    InteractionManager.runAfterInteractions(() => {
      this.assignENSToAccounts(orderedAccounts);
      if (orderedAccounts.length > 4) {
        const selectedAccountIndex =
          orderedAccounts.findIndex((account) => account.isSelected) || 0;
        this.scrollToCurrentAccount(selectedAccountIndex);
      }
    });
    this.mounted && this.setState({ orderedAccounts });

    const {
      provider: { rpcTarget, type },
      frequentRpcList,
    } = this.props;
    let blockExplorer;
    if (type === RPC) {
      blockExplorer =
        findBlockExplorerForRpc(rpcTarget, frequentRpcList) ||
        NO_RPC_BLOCK_EXPLORER;
    }
    this.setState({ rpcBlockExplorer: blockExplorer });
  }

  componentWillUnmount = () => {
    this.mounted = false;
  };

  scrollToCurrentAccount(selectedAccountIndex) {
    // eslint-disable-next-line no-unused-expressions
    this.flatList?.current?.scrollToIndex({
      index: selectedAccountIndex,
      animated: true,
    });
  }

  onAccountChange = async (newAddress) => {
    const { PreferencesController } = Engine.context;
    const { accounts } = this.props;

    requestAnimationFrame(async () => {
      try {
        // If not enabled is used from address book so we don't change accounts
        if (!this.props.enableAccountsAddition) {
          this.props.onAccountChange(newAddress);
          const orderedAccounts = this.getAccounts();
          this.mounted && this.setState({ orderedAccounts });
          return;
        }

        PreferencesController.setSelectedAddress(newAddress);

        this.props.onAccountChange();

        this.props.thirdPartyApiMode &&
          InteractionManager.runAfterInteractions(async () => {
            setTimeout(() => {
              Engine.refreshTransactionHistory();
            }, 1000);
          });
      } catch (e) {
        Logger.error(e, 'error while trying change the selected account'); // eslint-disable-line
      }
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          // Track Event: "Switched Account"
          AnalyticsV2.trackEvent(
            AnalyticsV2.ANALYTICS_EVENTS.SWITCHED_ACCOUNT,
            {
              number_of_accounts: Object.keys(accounts ?? {}).length,
            },
          );
        }, 1000);
      });
      const orderedAccounts = this.getAccounts();
      this.mounted && this.setState({ orderedAccounts });
    });
  };

  onSelected = (newAddress) => {
    const selectedAccount = this.state.orderedAccounts.find(
      (item) => item.address === newAddress,
    );
    console.log('check =', selectedAccount);
    this.setState({
      isVisible: !this.state.isVisible,
      newAddress,
      nameWallet: this.state.nameWallet[newAddress]
        ? { ...this.state.nameWallet }
        : {
            ...this.state.nameWallet,
            [newAddress]: selectedAccount?.name || '',
          },
    });
  };

  importAccount = () => {
    this.props.onImportAccount();
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.ACCOUNTS_IMPORTED_NEW_ACCOUNT);
    });
  };

  connectHardware = () => {
    this.props.onConnectHardware();
    AnalyticsV2.trackEvent(
      AnalyticsV2.ANALYTICS_EVENTS.CONNECT_HARDWARE_WALLET,
    );
  };

  addAccount = async () => {
    this.props.navigation.navigate('AddWalletView');
    this.props.toggleAccountsModal();
    if (this.state.loading) return;
    // this.mounted && this.setState({ loading: true });
    // const { KeyringController } = Engine.context;
    // requestAnimationFrame(async () => {
    //   try {
    //     await KeyringController.addNewAccount();
    //     const { PreferencesController } = Engine.context;
    //     const newIndex = Object.keys(this.props.identities).length - 1;
    //     PreferencesController.setSelectedAddress(
    //       Object.keys(this.props.identities)[newIndex],
    //     );
    //     setTimeout(() => {
    //       this.flatList &&
    //         this.flatList.current &&
    //         this.flatList.current.scrollToEnd();
    //       this.mounted && this.setState({ loading: false });
    //     }, 500);
    //     const orderedAccounts = this.getAccounts();
    //     this.mounted && this.setState({ orderedAccounts });
    //   } catch (e) {
    //     // Restore to the previous index in case anything goes wrong
    //     Logger.error(e, 'error while trying to add a new account'); // eslint-disable-line
    //     this.mounted && this.setState({ loading: false });
    //   }
    // });
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.ACCOUNTS_ADDED_NEW_ACCOUNT);
    });
  };

  isImported(allKeyrings, address) {
    let ret = false;
    for (const keyring of allKeyrings) {
      if (keyring.accounts.includes(address)) {
        ret = keyring.type === KeyringTypes.simple;
        break;
      }
    }

    return ret;
  }

  isQRHardware(allKeyrings, address) {
    let ret = false;
    for (const keyring of allKeyrings) {
      if (keyring.accounts.includes(address)) {
        ret = keyring.type === KeyringTypes.qr;
        break;
      }
    }

    return ret;
  }

  onLongPress = (address, imported, index) => {
    if (!imported) return;
    Alert.alert(
      strings('accounts.remove_account_title'),
      strings('accounts.remove_account_message'),
      [
        {
          text: strings('accounts.no'),
          onPress: () => false,
          style: 'cancel',
        },
        {
          text: strings('accounts.yes_remove_it'),
          onPress: async () => {
            const { PreferencesController } = Engine.context;
            const { selectedAddress } = this.props;
            const isRemovingCurrentAddress = selectedAddress === address;
            const fallbackAccountIndex = index - 1;
            const fallbackAccountAddress =
              this.state.orderedAccounts[fallbackAccountIndex].address;

            // TODO - Refactor logic. onAccountChange is only used for refreshing latest orderedAccounts after account removal. Duplicate call for PreferencesController.setSelectedAddress exists.
            // Set fallback address before removing account if removing current account
            isRemovingCurrentAddress &&
              PreferencesController.setSelectedAddress(fallbackAccountAddress);
            await Engine.context.KeyringController.removeAccount(address);
            // Default to the previous account in the list if removing current account
            this.onAccountChange(
              isRemovingCurrentAddress
                ? fallbackAccountAddress
                : selectedAddress,
            );
          },
        },
      ],
      { cancelable: false },
    );
  };

  openEditModal = () => {
    this.setState({ isVisible: false });
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isEditVisible: true });
    });
  };

  closeEditModal = () => {
    this.setState({ isEditVisible: false });
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isVisible: true });
    });
  };

  onSelectImage = async (address) => {
    const file = await File.pickImage({ multiple: false });
    this.setState((state) => ({
      avatarUrl: { ...state.avatarUrl, [address]: file[0].path },
    }));
  };
  onChangeName = (text, address) => {
    this.setState((state) => ({
      nameWallet: { ...state.nameWallet, [address]: text },
    }));
  };

  onChangeWallet = (address) => {
    if (
      this.state.nameWallet[address] === '' ||
      !this.state.nameWallet[address]
    ) {
      this.setState({ isEmpty: true });
      return;
    }
    this.props.setAvatarUser(this.state.avatarUrl[address], address);
    this.props.setNameWallet(this.state.nameWallet[address], address);
    this.setState({ isEditVisible: false, isEmpty: false });
  };

  renderItem = ({ item }) => {
    const { ticker } = this.props;
    const { accountsENS } = this.state;
    return (
      <View>
        <AccountElement
          onPress={this.onSelected}
          onLongPress={this.onLongPress}
          item={{ ...item, ens: accountsENS[item.address] }}
          ticker={ticker}
          disabled={Boolean(item.balanceError)}
        />
      </View>
    );
  };

  getAccounts() {
    const { accounts, identities, selectedAddress, keyrings, getBalanceError } =
      this.props;
    // This is a temporary fix until we can read the state from @metamask/controllers
    const allKeyrings =
      keyrings && keyrings.length
        ? keyrings
        : Engine.context.KeyringController.state.keyrings;

    const accountsOrdered = allKeyrings.reduce(
      (list, keyring) => list.concat(keyring.accounts),
      [],
    );
    return accountsOrdered
      .filter((address) => !!identities[toChecksumAddress(address)])
      .map((addr, index) => {
        const checksummedAddress = toChecksumAddress(addr);
        const identity = identities[checksummedAddress];
        const { name, address } = identity;
        const identityAddressChecksummed = toChecksumAddress(address);
        const isSelected = identityAddressChecksummed === selectedAddress;
        const isImported = this.isImported(
          allKeyrings,
          identityAddressChecksummed,
        );
        const isQRHardware = this.isQRHardware(
          allKeyrings,
          identityAddressChecksummed,
        );
        let balance = 0x0;
        if (accounts[identityAddressChecksummed]) {
          balance = accounts[identityAddressChecksummed].balance;
        }

        const balanceError = getBalanceError ? getBalanceError(balance) : null;
        return {
          index,
          name,
          address: identityAddressChecksummed,
          balance,
          isSelected,
          isImported,
          isQRHardware,
          balanceError,
        };
      });
  }

  assignENSToAccounts = (orderedAccounts) => {
    const { network } = this.props;
    orderedAccounts.forEach(async (account) => {
      try {
        const ens = await doENSReverseLookup(account.address, network);
        this.setState((state) => ({
          accountsENS: {
            ...state.accountsENS,
            [account.address]: ens,
          },
        }));
      } catch {
        // Error
      }
    });
  };

  keyExtractor = (item) => item.address;

  copyClipboard = async () => {
    await ClipboardManager.setString(this.props.selectedAddress);
    this.mounted;
    this.setState({ isVisible: false });
    this.props.showAlert({
      isVisible: true,
      autodismiss: 1500,
      content: 'clipboard-alert',
      data: { msg: strings('account_details.account_copied_to_clipboard') },
    });
    setTimeout(() => this.props.protectWalletModalVisible(), 2000);
  };

  viewOnEtherscan = (address) => {
    const {
      navigation,
      provider: { type, chainId },
    } = this.props;
    const { rpcBlockExplorer } = this.state;
    try {
      if (type === RPC) {
        const url = `${rpcBlockExplorer}/address/${address}`;
        const title = new URL(rpcBlockExplorer).hostname;
        navigation.push('Webview', {
          screen: 'SimpleWebview',
          params: { url, title },
        });
      } else {
        const network = getNetworkTypeById(chainId);
        const url = getEtherscanTransactionUrl(network, address);
        const etherscan_url = getEtherscanBaseUrl(network).replace(
          'https://',
          '',
        );
        navigation.push('Webview', {
          screen: 'SimpleWebview',
          params: {
            url,
            title: etherscan_url,
          },
        });
      }
      this.setState({ isVisible: false });
      this.props.toggleAccountsModal();
    } catch (e) {
      // eslint-disable-next-line no-console
      Logger.error(e, {
        message: `can't get a block explorer link for network `,
        chainId,
      });
    }
  };

  render() {
    const { orderedAccounts, accountsENS, isEditVisible } = this.state;
    const { ticker } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    const selectedAccount = orderedAccounts.find((item) => item.isSelected);
    const uri = this.state.avatarUrl[this.state.newAddress];
    return (
      <SafeAreaView style={styles.wrapper} testID={'account-list'}>
        <View style={styles.titleWrapper}>
          <View style={styles.dragger} testID={'account-list-dragger'} />
        </View>
        <Text style={styles.titleWallet}>{'My Wallet'}</Text>
        <View style={styles.containerMain}>
          <Text style={styles.titleMain}>
            {'Main '}
            <Text style={styles.subTitleMain}>{'(show at home screen)'}</Text>
          </Text>
          <AccountElement
            item={{
              ...selectedAccount,
              ens: accountsENS[selectedAccount?.address || ''],
            }}
            ticker={ticker}
            onLongPress={this.onLongPress}
            disabled
          />
        </View>
        <View style={styles.containerOrder}>
          <Text style={styles.titleMain}>{'Order'}</Text>
        </View>
        <FlatList
          data={orderedAccounts || []}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ref={this.flatList}
          style={styles.accountsWrapper}
          testID={'account-number-button'}
          getItemLayout={(_, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })} // eslint-disable-line
        />
        <BaseModal
          isVisible={this.state.isVisible}
          onClose={() => this.setState({ isVisible: false })}
        >
          <View style={styles.containerModal}>
            <View style={styles.titleWrapper}>
              <View style={styles.dragger} testID={'account-list-dragger'} />
            </View>
            <TouchableOpacity
              style={styles.containerIconModal}
              onPress={() => {
                this.setState({ isVisible: false });
                this.onAccountChange(this.state.newAddress);
              }}
            >
              <Image source={icons.iconWallet} style={styles.iconModal} />
              <Text style={styles.titleIconModal}>{'Set as Main Wallet'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.containerIconModal}
              onPress={this.copyClipboard}
            >
              <Image source={icons.iconClipBoard} style={styles.iconModal} />
              <Text style={styles.titleIconModal}>{'Copy address'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.containerIconModal}
              onPress={() => {
                this.setState({ isVisible: false });
                this.props.toggleAccountsModal();
                this.props.navigation.navigate('WalletDetailView', {
                  address: this.state.newAddress,
                  selectedAddress: this.props.selectedAddress,
                  orderedAccounts,
                });
              }}
            >
              <Image source={icons.iconViewDetail} style={styles.iconModal} />
              <Text style={styles.titleIconModal}>{'View Details'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.containerIconModal}
              onPress={() => {
                this.viewOnEtherscan(this.state.newAddress);
              }}
            >
              <Image source={icons.iconClipBoard} style={styles.iconModal} />
              <Text style={styles.titleIconModal}>
                {(this.state.rpcBlockExplorer &&
                  `${strings('transactions.view_on')} ${getBlockExplorerName(
                    this.state.rpcBlockExplorer,
                  )}`) ||
                  strings('transactions.view_on_etherscan')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.containerIconModal}
              onPress={() => this.openEditModal()}
            >
              <Image source={icons.iconEditSquare} style={styles.iconModal} />
              <Text style={styles.titleIconModal}>{'Edit Wallet'}</Text>
            </TouchableOpacity>
          </View>
        </BaseModal>
        <Modal
          isVisible={isEditVisible}
          useNativeDriver
          animationIn={'zoomIn'}
          animationOut={'zoomOut'}
          backdropTransitionOutTiming={0}
          onBackButtonPress={() => this.closeEditModal()}
          onBackdropPress={() => this.closeEditModal()}
          style={styles.modalEdit}
        >
          <View style={styles.containerEdit}>
            <TouchableOpacity
              onPress={() => this.onSelectImage(this.state.newAddress)}
            >
              {this.state.avatarUrl[this.state.newAddress] ? (
                <Image style={styles.imageAvatar} source={{ uri }} />
              ) : (
                <Identicon address={this.state.newAddress} diameter={52} />
              )}
            </TouchableOpacity>
            <SInput
              style={Style.s({ mt: 16, mx: 32 })}
              onChange={(text) =>
                this.onChangeName(text, this.state.newAddress)
              }
              defaultValue={this.state.nameWallet[this.state.newAddress]}
            />
            <View>
              {this.state.isEmpty && (
                <Text style={styles.textWarning}>{'Cannot be empty!'}</Text>
              )}
            </View>
            )
            <View style={styles.wrapperBtnEdit}>
              <SButton
                style={styles.containerBtnEdit}
                titleStyle={styles.titleButton}
                type={'border'}
                title={'cancel'}
                onPress={this.closeEditModal}
              />
              <SButton
                style={styles.containerBtnEdit}
                titleStyle={styles.titleButton}
                type={'primary'}
                title={'Done'}
                onPress={() => this.onChangeWallet(this.state.newAddress)}
              />
            </View>
          </View>
        </Modal>
        <SButton
          style={styles.containerBtn}
          titleStyle={styles.titleButton}
          type={'primary'}
          title={'Add wallet'}
          onPress={this.addAccount}
        />
      </SafeAreaView>
    );
  }
}

AccountList.contextType = ThemeContext;

const mapStateToProps = (state) => ({
  accounts: state.engine.backgroundState.AccountTrackerController.accounts,
  thirdPartyApiMode: state.privacy.thirdPartyApiMode,
  keyrings: state.engine.backgroundState.KeyringController.keyrings,
  network: state.engine.backgroundState.NetworkController.network,
  address: state.engine.backgroundState.PreferencesController.selectedAddress,
  frequentRpcList:
    state.engine.backgroundState.PreferencesController.frequentRpcList,
  provider: state.engine.backgroundState.NetworkController.provider,
  avatarUrl: state.user.avatarUrl,
  nameWallet: state.user.nameWallet,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: (config) => dispatch(showAlert(config)),
  protectWalletModalVisible: () => dispatch(protectWalletModalVisible()),
  toggleAccountsModal: () => dispatch(toggleAccountsModal()),
  setAvatarUser: (url, address) => dispatch(setAvatarUser(url, address)),
  setNameWallet: (name, address) => dispatch(setNameWallet(name, address)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountList);
