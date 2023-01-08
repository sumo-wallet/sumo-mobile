import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { strings } from '../../../../locales/i18n';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { useTheme } from '../../../util/theme';
import { icons } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import Engine from '../../../core/Engine';
import { useNavigatorParams } from '../../hooks';
import { useNavigation } from '@react-navigation/native';
import EthereumAddress from '../../../components/UI/EthereumAddress';
import ClipboardManager from '../../../core/ClipboardManager';
import { showAlert } from '../../../actions/alert';
import { toDateFormat } from '../../../util/date';
import { renderShortText } from '../../../util/general';
import { TRANSACTION_TYPES } from '../../../util/transactions';
import { NO_RPC_BLOCK_EXPLORER, RPC } from '../../../constants/network';
import {
  findBlockExplorerForRpc,
  getBlockExplorerName,
  getNetworkTypeById,
} from '../../../util/networks';
import { getEtherscanBaseUrl, getEtherscanTransactionUrl } from '../../../util/etherscan';
import Logger from '../../../util/Logger';
import { fontStyles } from '../../../styles/common';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    screenWrapper: {
      flex: 1,
    },
    container: {},
    contentContainer: {
      marginVertical: 20,
      marginHorizontal: 16,
    },
    iconContainer: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
      borderWidth: 1,
      borderColor: colors.border.muted,
      backgroundColor: colors.box.default,
      marginRight: 10,
    },
    containerHeader: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
    },
    icon: {
      width: 20,
      height: 20,
    },
    nameWallet: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text.default,
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: 12,
    },
    containerOptionRight: {
      flexDirection: 'row',
    },
    containerOption: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderRadius: 8,
      backgroundColor: colors.background.default,
      width: '100%',
      marginTop: 20,
      marginBottom: 10,
    },
    transactionTitle: {
      fontSize: 16,
      fontWeight: '500',
      marginVertical: 2,
      color: colors.text.muted,
    },
    amountTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginVertical: 2,
      color: colors.text.default,
    },
    leftTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.muted,
    },
    valueText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.default,
    },
    containerBtn: {
      backgroundColor: 'blue',
      flex: 1,
      width: '100%',
      alignSelf: 'flex-end',
    },
    line: {
      backgroundColor: colors.text.muted,
      height: 0.5,
      marginVertical: 10,
    },
    iconQR: {
      width: 14,
      height: 14,
      tintColor: colors.text.default,
      marginLeft: 12,
    },
    touchableViewOnEtherscan: {
      marginBottom: 24,
      marginTop: 12,
    },
    viewOnEtherscan: {
      fontSize: 16,
      color: colors.primary.default,
      ...fontStyles.normal,
      textAlign: 'center',
    },
  });

const transactionIconApprove = require('../../../images/transaction-icons/approve.png');
const transactionIconInteraction = require('../../../images/transaction-icons/interaction.png');
const transactionIconSent = require('../../../images/transaction-icons/send.png');
const transactionIconReceived = require('../../../images/transaction-icons/receive.png');

const transactionIconApproveFailed = require('../../../images/transaction-icons/approve-failed.png');
const transactionIconInteractionFailed = require('../../../images/transaction-icons/interaction-failed.png');
const transactionIconSentFailed = require('../../../images/transaction-icons/send-failed.png');
const transactionIconReceivedFailed = require('../../../images/transaction-icons/receive-failed.png');

export const TransactionDetailScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const {
    transactionDetails,
    transactionObject,
    transactionElement,
  }: {
    transactionDetails: PropTypes.object;
    transactionObject: PropTypes.object;
    transactionElement: PropTypes.object;
  } = useNavigatorParams();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { status, time, transaction } = transactionObject;
  const [rpcBlockExplorer, setRpcBlockExplorer] = useState('');

  const frequentRpcList = useSelector(
    (state) =>
      state.engine.backgroundState.PreferencesController.frequentRpcList,
  );
  const network = useSelector(
    (state) => state.engine.backgroundState.NetworkController,
  );

  const onClipBoard = useCallback(
    async (content) => {
      await ClipboardManager.setString(content);
      dispatch(
        showAlert({
          isVisible: true,
          autodismiss: 1500,
          content: 'clipboard-alert',
          data: { msg: content },
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    let blockExplorer;
    if (network.provider.type === RPC) {
      blockExplorer =
        findBlockExplorerForRpc(network.provider.rpcTarget, frequentRpcList) ||
        NO_RPC_BLOCK_EXPLORER;
    }
    setRpcBlockExplorer(blockExplorer);
  }, [network, frequentRpcList]);
  const renderTxElementIcon = (transactionElement, status) => {
    const { transactionType } = transactionElement;

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

  const viewOnEtherscan = () => {
    // const {
    //   navigation,
    //   transactionObject: { networkID },
    //   transactionDetails: { transactionHash },
    //   network: {
    //     provider: { type },
    //   },
    //   close,
    // } = this.props;
    // const { rpcBlockExplorer } = this.state;
    try {
      if (network.provider.type === RPC) {
        const url = `${rpcBlockExplorer}/tx/${transactionDetails.transactionHash}`;
        const title = new URL(rpcBlockExplorer).hostname;
        navigation.push('Webview', {
          screen: 'SimpleWebview',
          params: { url, title },
        });
      } else {
        const network = getNetworkTypeById(transactionObject.networkID);
        const url = getEtherscanTransactionUrl(network, transactionDetails.transactionHash);
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
    } catch (e) {
      // eslint-disable-next-line no-console
      Logger.error(e, {
        message: `can't get a block explorer link for network `,
        networkID,
      });
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <DynamicHeader title={'Transaction Detail'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.containerHeader}>
          <View style={styles.iconContainer}>
            {renderTxElementIcon(transactionElement, status)}
          </View>
          <View>
            <Text style={styles.transactionTitle} numberOfLines={1}>
              {transactionElement.actionKey}
            </Text>
            <Text style={styles.amountTitle}>{transactionElement.value}</Text>
          </View>
        </View>
        <View style={styles.containerOption}>
          <Text style={styles.leftTitle}>{'Status'}</Text>
          <Text style={styles.valueText}>{status}</Text>
        </View>
        <View style={styles.containerOption}>
          <Text style={styles.leftTitle}>{'Time'}</Text>
          <Text style={styles.valueText}>{toDateFormat(time)}</Text>
        </View>
        <View style={styles.line} />
        {!!transaction?.nonce && (
          <View style={styles.containerOption}>
            <Text style={styles.leftTitle}>{'Heigh'}</Text>
            <Text style={styles.valueText}>{`#${parseInt(
              transaction.nonce.replace(/^#/, ''),
              16,
            )}`}</Text>
          </View>
        )}
        <View style={styles.containerOption}>
          <Text style={styles.leftTitle}>{'Confirm'}</Text>
          <Text style={styles.valueText}>{'Success'}</Text>
        </View>
        <View style={styles.containerOption}>
          <Text style={styles.leftTitle}>{'Tx'}</Text>
          <Text style={styles.valueText}>
            {renderShortText(transactionDetails.transactionHash, 10)}

            <TouchableOpacity
              onPress={() => {
                onClipBoard(transactionDetails.transactionHash);
              }}
            >
              <Image source={icons.iconCopy} style={styles.iconQR} />
            </TouchableOpacity>
          </Text>
        </View>
        <View style={styles.containerOption}>
          <Text style={styles.leftTitle}>{strings('transactions.from')}</Text>
          <Text style={styles.valueText}>
            <EthereumAddress
              type="short"
              address={transactionDetails.renderFrom}
            />
            <TouchableOpacity
              onPress={() => {
                onClipBoard(transactionDetails.renderFrom);
              }}
            >
              <Image source={icons.iconCopy} style={styles.iconQR} />
            </TouchableOpacity>
          </Text>
        </View>
        <View style={styles.containerOption}>
          <Text style={styles.leftTitle}>{strings('transactions.to')}</Text>
          <Text style={styles.valueText}>
            <EthereumAddress
              type="short"
              address={transactionDetails.renderTo}
            />
            <TouchableOpacity
              onPress={() => {
                onClipBoard(transactionDetails.renderTo);
              }}
            >
              <Image source={icons.iconCopy} style={styles.iconQR} />
            </TouchableOpacity>
          </Text>
        </View>

        {transactionDetails.transactionHash &&
          status !== 'cancelled' &&
          rpcBlockExplorer !== NO_RPC_BLOCK_EXPLORER && (
            <TouchableOpacity
              onPress={viewOnEtherscan}
              style={styles.touchableViewOnEtherscan}
            >
              <Text style={styles.viewOnEtherscan}>
                {(rpcBlockExplorer &&
                  `${strings('transactions.view_on')} ${getBlockExplorerName(
                    rpcBlockExplorer,
                  )}`) ||
                  strings('transactions.view_on_etherscan')}
              </Text>
            </TouchableOpacity>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};
