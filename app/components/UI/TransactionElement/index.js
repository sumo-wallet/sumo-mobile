import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import { fontStyles } from '../../../styles/common';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { strings } from '../../../../locales/i18n';
import { toDateFormat } from '../../../util/date';
import TransactionDetails from './TransactionDetails';
import {
  renderShortAddress,
  safeToChecksumAddress,
} from '../../../util/address';
import { connect } from 'react-redux';
import StyledButton from '../StyledButton';
import Modal from 'react-native-modal';
import decodeTransaction from './utils';
import { TRANSACTION_TYPES } from '../../../util/transactions';
import ListItem from '../../Base/ListItem';
// import StatusText from '../../Base/StatusText';
import DetailsModal from '../../Base/DetailsModal';
// import { isMainNet } from '../../../util/networks';
import { WalletDevice, util } from '@metamask/controllers/';
import { ThemeContext, mockTheme } from '../../../util/theme';
import { Style } from './../../../styles';
import { icons } from './../../../assets';
import { isMainNet } from '../../../util/networks';
import StatusText from '../../../components/Base/StatusText';
const { weiHexToGweiDec, isEIP1559Transaction } = util;

const createStyles = (colors) =>
  StyleSheet.create({
    row: {
      backgroundColor: colors.background.default,
      flex: 1,
      // borderBottomWidth: StyleSheet.hairlineWidth,
      // borderColor: colors.border.muted,
      borderRadius: 10,
    },
    actionContainerStyle: {
      height: 25,
      padding: 0,
    },
    speedupActionContainerStyle: {
      marginRight: 10,
    },
    actionStyle: {
      fontSize: 10,
      padding: 0,
      paddingHorizontal: 10,
    },
    icon: {
      width: 24,
      height: 24,
    },
    summaryWrapper: {
      padding: 15,
    },
    fromDeviceText: {
      color: colors.text.alternative,
      fontSize: 14,
      marginBottom: 10,
      ...fontStyles.normal,
    },
    importText: {
      color: colors.text.alternative,
      fontSize: 14,
      ...fontStyles.bold,
      alignContent: 'center',
    },
    importRowBody: {
      alignItems: 'center',
      backgroundColor: colors.box.default,
      paddingTop: 10,
    },
    itemContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
      marginHorizontal: 8,
      flexDirection: 'column',
      borderRadius: 10,
      backgroundColor: colors.box.default,
    },
    iconContainer: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border.muted,
      backgroundColor: colors.box.default,
    },
    iconStatus: {
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: 'green',
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
    iconImage: {
      width: 10,
      height: 10,
    },
    itemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleText: {
      color: colors.text.default,
      fontSize: 14,
      fontWeight: '500',
      ...fontStyles.bold,
      alignContent: 'center',
    },
    dateText: {
      color: colors.text.muted,
      fontSize: 10,
      ...fontStyles.normal,
      alignContent: 'center',
    },
    descriptionText: {
      color: colors.text.muted,
      fontSize: 10,
      ...fontStyles.normal,
      alignContent: 'center',
    },
    amountContainer: {
      flexDirection: 'row',
      // flex: 0.6,
      alignItems: 'flex-start',
    },
    amountText: {
      color: colors.text.default,
      fontSize: 14,
      fontWeight: '400',
      ...fontStyles.bold,
    },
    amountUSDText: {
      color: colors.text.default,
      fontSize: 12,
      ...fontStyles.bold,
    },
  });

/* eslint-disable import/no-commonjs */
const transactionIconApprove = require('../../../images/transaction-icons/approve.png');
const transactionIconInteraction = require('../../../images/transaction-icons/interaction.png');
const transactionIconSent = require('../../../images/transaction-icons/send.png');
const transactionIconReceived = require('../../../images/transaction-icons/receive.png');

const transactionIconApproveFailed = require('../../../images/transaction-icons/approve-failed.png');
const transactionIconInteractionFailed = require('../../../images/transaction-icons/interaction-failed.png');
const transactionIconSentFailed = require('../../../images/transaction-icons/send-failed.png');
const transactionIconReceivedFailed = require('../../../images/transaction-icons/receive-failed.png');
/* eslint-enable import/no-commonjs */

/**
 * View that renders a transaction item part of transactions list
 */
class TransactionElement extends PureComponent {
  static propTypes = {
    assetSymbol: PropTypes.string,
    /**
     * Asset object (in this case ERC721 token)
     */
    tx: PropTypes.object,
    /**
     * String of selected address
     */
    selectedAddress: PropTypes.string,
    /**
    /* Identities object required to get import time name
    */
    identities: PropTypes.object,
    /**
     * Current element of the list index
     */
    i: PropTypes.number,
    /**
     * Callback to render transaction details view
     */
    onPressItem: PropTypes.func,
    /**
     * Callback to speed up tx
     */
    onSpeedUpAction: PropTypes.func,
    /**
     * Callback to cancel tx
     */
    onCancelAction: PropTypes.func,
    swapsTransactions: PropTypes.object,
    swapsTokens: PropTypes.arrayOf(PropTypes.object),
    /**
     * Chain Id
     */
    chainId: PropTypes.string,
    signQRTransaction: PropTypes.func,
    cancelUnsignedQRTransaction: PropTypes.func,
    isQRHardwareAccount: PropTypes.bool,
  };

  state = {
    actionKey: undefined,
    cancelIsOpen: false,
    speedUpIsOpen: false,
    detailsModalVisible: false,
    importModalVisible: false,
    transactionGas: {
      gasBN: undefined,
      gasPriceBN: undefined,
      gasTotal: undefined,
    },
    transactionElement: undefined,
    transactionDetails: undefined,
  };

  mounted = false;

  componentDidMount = async () => {
    const [transactionElement, transactionDetails] = await decodeTransaction({
      ...this.props,
      swapsTransactions: this.props.swapsTransactions,
      swapsTokens: this.props.swapsTokens,
      assetSymbol: this.props.assetSymbol,
    });
    this.mounted = true;
    this.mounted && this.setState({ transactionElement, transactionDetails });
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  onPressItem = () => {
    const { tx, i, onPressItem } = this.props;
    onPressItem(tx.id, i);
    this.setState({ detailsModalVisible: true });
  };

  onPressImportWalletTip = () => {
    this.setState({ importModalVisible: true });
  };

  onCloseImportWalletModal = () => {
    this.setState({ importModalVisible: false });
  };

  onCloseDetailsModal = () => {
    this.setState({ detailsModalVisible: false });
  };

  renderTxTime = () => {
    const { tx, selectedAddress } = this.props;
    // const incoming =
    //   safeToChecksumAddress(tx.transaction.to) === selectedAddress;
    // const selfSent =
    //   incoming &&
    //   safeToChecksumAddress(tx.transaction.from) === selectedAddress;
    return `${toDateFormat(tx.time)}`;

    // return `${
    //   (!incoming || selfSent) && tx.deviceConfirmedOn === WalletDevice.MM_MOBILE
    //     ? `#${parseInt(tx.transaction.nonce, 16)} - ${toDateFormat(
    //         tx.time,
    //       )} ${strings(
    //         'transactions.from_device_label',
    //         // eslint-disable-next-line no-mixed-spaces-and-tabs
    //       )}`
    //     : `${toDateFormat(tx.time)}
    //   `
    // }`;
  };

  /**
   * Function that evaluates tx to see if the Added Wallet label should be rendered.
   * @returns Account added to wallet view
   */
  renderImportTime = () => {
    const { tx, identities, selectedAddress } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    const accountImportTime = identities[selectedAddress]?.importTime;
    if (tx.insertImportTime && accountImportTime) {
      return (
        <>
          <TouchableOpacity
            onPress={this.onPressImportWalletTip}
            style={styles.importRowBody}
          >
            <Text style={styles.importText}>
              {`${strings('transactions.import_wallet_row')} `}
              <FAIcon name="info-circle" style={styles.infoIcon} />
            </Text>
            <ListItem.Date>{toDateFormat(accountImportTime)}</ListItem.Date>
          </TouchableOpacity>
        </>
      );
    }
    return null;
  };

  renderTxElementIcon = (transactionElement, status) => {
    const { transactionType } = transactionElement;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    const isFailedTransaction = status === 'cancelled' || status === 'failed';
    let icon;
    switch (transactionType) {
      case TRANSACTION_TYPES.SENT_TOKEN:
      case TRANSACTION_TYPES.SENT_COLLECTIBLE:
      case TRANSACTION_TYPES.SENT:
        icon = isFailedTransaction
          ? transactionIconSentFailed
          : transactionIconSent;
        break;
      case TRANSACTION_TYPES.RECEIVED_TOKEN:
      case TRANSACTION_TYPES.RECEIVED_COLLECTIBLE:
      case TRANSACTION_TYPES.RECEIVED:
        icon = isFailedTransaction
          ? transactionIconReceivedFailed
          : transactionIconReceived;
        break;
      case TRANSACTION_TYPES.SITE_INTERACTION:
        icon = isFailedTransaction
          ? transactionIconInteractionFailed
          : transactionIconInteraction;
        break;
      case TRANSACTION_TYPES.APPROVE:
        icon = isFailedTransaction
          ? transactionIconApproveFailed
          : transactionIconApprove;
        break;
    }
    return <Image source={icon} style={styles.icon} resizeMode="stretch" />;
  };
  renderStatusIcon = (transactionElement, status) => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    const isFailedTransaction = status === 'cancelled' || status === 'failed';
    let icon;
    if (isFailedTransaction) {
      icon = icons.iconQuestion;
    } else {
      icon = icons.iconChecked;
    }
    return (
      <View style={styles.iconStatus}>
        <Image style={styles.iconImage} source={icon} resizeMode="stretch" />
      </View>
    );
  };

  /**
   * Renders an horizontal bar with basic tx information
   *
   * @param {object} transactionElement - Transaction information to render, containing addressTo, actionKey, value, fiatValue, contractDeployment
   */
  renderTxElement = (transactionElement) => {
    const {
      identities,
      chainId,
      selectedAddress,
      isQRHardwareAccount,
      tx: { time, status },
    } = this.props;
    const {
      value,
      fiatValue = false,
      actionKey,
      renderTo,
    } = transactionElement;
    const renderNormalActions =
      status === 'submitted' || (status === 'approved' && !isQRHardwareAccount);
    const renderUnsignedQRActions =
      status === 'approved' && isQRHardwareAccount;
    const accountImportTime = identities[selectedAddress]?.importTime;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    return (
      <>
        {accountImportTime > time && this.renderImportTime()}
        <View style={styles.itemContainer}>
          {/* <Text style={styles.descriptionText}>
            {JSON.stringify(transactionElement)}
          </Text> */}
          <View style={styles.itemContent}>
            <View style={styles.iconContainer}>
              {this.renderTxElementIcon(transactionElement, status)}
              {this.renderStatusIcon(transactionElement, status)}
            </View>
            <View style={Style.s({ ml: 16, flex: 2, backdropColor: 'red' })}>
              <View style={Style.s({ direc: 'row', items: 'center' })}>
                <Text style={styles.titleText}>{actionKey}</Text>
              </View>
              <Text style={styles.dateText}>{this.renderTxTime()}</Text>
              <Text style={styles.descriptionText}>{status}</Text>
              <Text style={styles.descriptionText}>
                {renderShortAddress(renderTo)}
              </Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>{value}</Text>
              {isMainNet(chainId) && (
                <Text style={styles.amountText}>{fiatValue}</Text>
              )}
            </View>
          </View>
          {renderNormalActions && (
            <ListItem.Actions>
              {this.renderSpeedUpButton()}
              {this.renderCancelButton()}
            </ListItem.Actions>
          )}
          {renderUnsignedQRActions && (
            <ListItem.Actions>
              {this.renderQRSignButton()}
              {this.renderCancelUnsignedButton()}
            </ListItem.Actions>
          )}
        </View>
        {/* <ListItem>
          <ListItem.Date>{this.renderTxTime()}</ListItem.Date>
          <ListItem.Content>
            <ListItem.Icon>
              {this.renderTxElementIcon(transactionElement, status)}
            </ListItem.Icon>
            <ListItem.Body>
              <ListItem.Title numberOfLines={1}>{actionKey}</ListItem.Title>
              <StatusText status={status} />
            </ListItem.Body>
            {Boolean(value) && (
              <ListItem.Amounts>
                <ListItem.Amount>{value}</ListItem.Amount>
                {isMainNet(chainId) && (
                  <ListItem.FiatAmount>{fiatValue}</ListItem.FiatAmount>
                )}
              </ListItem.Amounts>
            )}
          </ListItem.Content>
          {renderNormalActions && (
            <ListItem.Actions>
              {this.renderSpeedUpButton()}
              {this.renderCancelButton()}
            </ListItem.Actions>
          )}
          {renderUnsignedQRActions && (
            <ListItem.Actions>
              {this.renderQRSignButton()}
              {this.renderCancelUnsignedButton()}
            </ListItem.Actions>
          )}
        </ListItem> */}
        {accountImportTime <= time && this.renderImportTime()}
      </>
    );
  };

  renderCancelButton = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <StyledButton
        type={'cancel'}
        containerStyle={styles.actionContainerStyle}
        style={styles.actionStyle}
        onPress={this.showCancelModal}
      >
        {strings('transaction.cancel')}
      </StyledButton>
    );
  };

  parseGas = () => {
    const { tx } = this.props;

    let existingGas = {};
    const transaction = tx?.transaction;
    if (transaction) {
      if (isEIP1559Transaction(transaction)) {
        existingGas = {
          isEIP1559Transaction: true,
          maxFeePerGas: weiHexToGweiDec(transaction.maxFeePerGas),
          maxPriorityFeePerGas: weiHexToGweiDec(
            transaction.maxPriorityFeePerGas,
          ),
        };
      } else {
        const existingGasPrice = tx.transaction
          ? tx.transaction.gasPrice
          : '0x0';
        const existingGasPriceDecimal = parseInt(
          existingGasPrice === undefined ? '0x0' : existingGasPrice,
          16,
        );
        existingGas = { gasPrice: existingGasPriceDecimal };
      }
    }
    return existingGas;
  };

  showCancelModal = () => {
    const existingGas = this.parseGas();

    this.mounted && this.props.onCancelAction(true, existingGas, this.props.tx);
  };

  showSpeedUpModal = () => {
    const existingGas = this.parseGas();

    this.mounted &&
      this.props.onSpeedUpAction(true, existingGas, this.props.tx);
  };

  hideSpeedUpModal = () => {
    this.mounted && this.props.onSpeedUpAction(false);
  };

  showQRSigningModal = () => {
    this.mounted && this.props.signQRTransaction(this.props.tx);
  };

  cancelUnsignedQRTransaction = () => {
    this.mounted && this.props.cancelUnsignedQRTransaction(this.props.tx);
  };

  renderSpeedUpButton = () => {
    return (
      <StyledButton
        type={'normal'}
        containerStyle={[
          styles.actionContainerStyle,
          styles.speedupActionContainerStyle,
        ]}
        style={styles.actionStyle}
        onPress={this.showSpeedUpModal}
      >
        {strings('transaction.speedup')}
      </StyledButton>
    );
  };

  renderQRSignButton = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    return (
      <StyledButton
        type={'normal'}
        containerStyle={[
          styles.actionContainerStyle,
          styles.speedupActionContainerStyle,
        ]}
        style={styles.actionStyle}
        onPress={this.showQRSigningModal}
      >
        {strings('transaction.sign_with_keystone')}
      </StyledButton>
    );
  };

  renderCancelUnsignedButton = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    return (
      <StyledButton
        type={'cancel'}
        containerStyle={[
          styles.actionContainerStyle,
          styles.speedupActionContainerStyle,
        ]}
        style={styles.actionStyle}
        onPress={this.cancelUnsignedQRTransaction}
      >
        {strings('transaction.cancel')}
      </StyledButton>
    );
  };

  render() {
    const { tx } = this.props;
    const {
      detailsModalVisible,
      importModalVisible,
      transactionElement,
      transactionDetails,
    } = this.state;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    if (!transactionElement || !transactionDetails) return null;
    return (
      <>
        <TouchableHighlight
          style={styles.row}
          onPress={this.onPressItem}
          underlayColor={colors.background.alternative}
          activeOpacity={1}
        >
          {this.renderTxElement(transactionElement)}
        </TouchableHighlight>
        {detailsModalVisible && (
          <Modal
            isVisible={detailsModalVisible}
            onBackdropPress={this.onCloseDetailsModal}
            onBackButtonPress={this.onCloseDetailsModal}
            onSwipeComplete={this.onCloseDetailsModal}
            swipeDirection={'down'}
            backdropColor={colors.overlay.default}
            backdropOpacity={1}
          >
            <DetailsModal>
              <DetailsModal.Header>
                <DetailsModal.Title onPress={this.onCloseDetailsModal}>
                  {transactionElement?.actionKey}
                </DetailsModal.Title>
                <DetailsModal.CloseIcon onPress={this.onCloseDetailsModal} />
              </DetailsModal.Header>
              <TransactionDetails
                transactionObject={tx}
                transactionDetails={transactionDetails}
                showSpeedUpModal={this.showSpeedUpModal}
                showCancelModal={this.showCancelModal}
                close={this.onCloseDetailsModal}
              />
            </DetailsModal>
          </Modal>
        )}
        <Modal
          isVisible={importModalVisible}
          onBackdropPress={this.onCloseImportWalletModal}
          onBackButtonPress={this.onCloseImportWalletModal}
          onSwipeComplete={this.onCloseImportWalletModal}
          swipeDirection={'down'}
          backdropColor={colors.overlay.default}
          backdropOpacity={1}
        >
          <DetailsModal>
            <DetailsModal.Header>
              <DetailsModal.Title onPress={this.onCloseImportWalletModal}>
                {strings('transactions.import_wallet_label')}
              </DetailsModal.Title>
              <DetailsModal.CloseIcon onPress={this.onCloseImportWalletModal} />
            </DetailsModal.Header>
            <View style={styles.summaryWrapper}>
              <Text style={styles.fromDeviceText}>
                {strings('transactions.import_wallet_tip')}
              </Text>
            </View>
          </DetailsModal>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ticker: state.engine.backgroundState.NetworkController.provider.ticker,
  chainId: state.engine.backgroundState.NetworkController.provider.chainId,
  identities: state.engine.backgroundState.PreferencesController.identities,
  primaryCurrency: state.settings.primaryCurrency,
  selectedAddress:
    state.engine.backgroundState.PreferencesController.selectedAddress,
  swapsTransactions:
    state.engine.backgroundState.TransactionController.swapsTransactions || {},
  swapsTokens: state.engine.backgroundState.SwapsController.tokens,
});

TransactionElement.contextType = ThemeContext;

export default connect(mapStateToProps)(TransactionElement);
