import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  InteractionManager,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { View as AnimatableView } from 'react-native-animatable';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import Logger from '../../../../util/Logger';
import {
  balanceToFiat,
  // fromTokenMinimalUnitString,
  renderFromTokenMinimalUnit,
  toTokenMinimalUnit,
  weiToFiat,
  safeNumberToBN,
} from '../../../../util/number';
import { safeToChecksumAddress } from '../../../../util/address';
import { swapsUtils } from '@metamask/swaps-controller';
import { ANALYTICS_EVENT_OPTS } from '../../../../util/analytics';

import {
  setSwapsHasOnboarded,
  setSwapsLiveness,
  swapsControllerTokens,
  swapsHasOnboardedSelector,
  swapsTokensSelector,
  swapsTokensWithBalanceSelector,
  swapsTopAssetsSelector,
} from '../../../../reducers/swaps';
import Analytics from '../../../../core/Analytics/Analytics';
import Device from '../../../../util/device';
import Engine from '../../../../core/Engine';
import AppConstants from '../../../../core/AppConstants';

import { strings } from '../../../../../locales/i18n';
import {
  // setQuotesNavigationsParams,
  isSwapsNativeAsset,
  // isDynamicToken,
} from './utils';
import { getSwapsAmountNavbar } from '../../../UI/Navbar';

import Onboarding from './components/Onboarding';
import useModalHandler from '../../../Base/hooks/useModalHandler';
import Text from '../../../Base/Text';
import StyledButton from '../../../UI/StyledButton';
import ScreenView from '../../../UI/FiatOrders/components/ScreenView';
// import ActionAlert from './components/ActionAlert';
import TokenSelectModal from './components/TokenSelectModal';
import ChainSelectModal from './components/ChainSelectModal';

// import SlippageModal from './components/SlippageModal';
import useBalance from './utils/useBalance';
import useBlockExplorer from './utils/useBlockExplorer';
// import InfoModal from './components/InfoModal';
import { toLowerCaseEquals } from '../../../../util/general';
// import { AlertType } from '../../Base/Alert';
import { isZero, gte } from '../../../../util/lodash';
import { useTheme } from '../../../../util/theme';
import TokenIcon from './components/TokenIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useGetBridgeChain } from '../../../../components/hooks/useGetBridgeChain';
import { useGetBridgeToken } from '../../../../components/hooks/useGetBridgeToken';
import { useGetMultichainToken } from '../../../../components/hooks/useGetMultichainToken';
import NetworkModal from '../../../../components/sumo/NetworkModal';
// import NetworkModals from '../NetworkModal';

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.default,
    },
    screen: {
      flexGrow: 1,
      justifyContent: 'space-between',
      backgroundColor: colors.background.default,
    },
    scrollview: {
      flex: 1,
      backgroundColor: 'red',
    },
    contentContainer: {
      paddingVertical: 20,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    keypad: {
      flexGrow: 1,
      justifyContent: 'space-around',
    },
    tokenButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: Device.isIphone5() ? 5 : 10,
    },
    amountContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 25,
    },
    amount: {
      textAlignVertical: 'center',
      fontSize: Device.isIphone5() ? 16 : 20,
      height: Device.isIphone5() ? 30 : 40,
      maxWidth: '50%',
      color: colors.text.default,
    },
    amountInvalid: {
      color: colors.error.default,
    },
    verifyToken: {
      marginHorizontal: 40,
    },
    tokenAlert: {
      marginTop: 10,
      marginHorizontal: 30,
    },
    linkText: {
      color: colors.primary.default,
    },
    horizontalRuleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 190,
      left: '80%',
    },
    horizontalRule: {
      flex: 1,
      borderBottomWidth: StyleSheet.hairlineWidth,
      height: 1,
      borderBottomColor: colors.border.muted,
    },
    arrowDown: {
      color: colors.background.default,
      fontSize: 21,
      marginHorizontal: 15,
      transform: [{ rotate: '90deg' }],
    },
    buttonsContainer: {
      marginTop: Device.isIphone5() ? 10 : 30,
      marginBottom: 5,
      paddingHorizontal: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    column: {
      flex: 1,
    },
    ctaContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginVertical: 15,
    },
    cta: {
      flex: 1,
      height: 50,
      paddingHorizontal: Device.isIphone5() ? 10 : 20,
    },
    disabled: {
      opacity: 0.4,
    },

    selectTokenView: {
      padding: 10,
      marginTop: 10,
      borderRadius: 10,
      backgroundColor: colors.box.default,
    },
    sendTokenContainer: {
      // flex: 1,
      width: '100%',
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.box.default,
    },

    sendOptionContainer: {
      flex: 1,
      flexDirection: 'row',
      height: 40,
      paddingVertical: 5,
      justifyContent: 'space-between',
    },

    sendOptionRight: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    selectTokenInputContainer: {
      flex: 1,
      flexDirection: 'row',
      height: 50,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectTokenContainer: {
      flexDirection: 'row',
      padding: 10,
    },
    inputTokenAmount: {
      textAlignVertical: 'center',
      fontSize: Device.isIphone5() ? 16 : 20,
      height: Device.isIphone5() ? 13 : 16,
      fontWeight: '500',
      color: colors.text.default,
    },
    balanceContainer: {
      justifyContent: 'flex-start',
      marginBottom: 20,
      height: 30,
    },
    caretDown: {
      textAlign: 'right',
      color: colors.text.alternative,
      marginLeft: 10,
      marginRight: 5,
    },
    icon: {
      marginRight: 8,
    },
    flipButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary.default,
    },
    providerContainer: {
      flex: 1,
      padding: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.box.default,
      borderRadius: 10,
      marginHorizontal: 10,
      marginVertical: 5,
    },
    swapDetailTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.default,
    },
    swapDetailContainer: {
      flex: 1,
      padding: 10,
      marginTop: 10,
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: colors.box.default,
      borderRadius: 10,
      marginHorizontal: 10,
    },
    swapDetailItemContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomColor: colors.border.default,
      borderBottomWidth: 0.3,
    },
    amountInputView: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 10,
      marginTop: 10,
      borderRadius: 10,
      backgroundColor: colors.box.default,
    },
  });

const SWAPS_NATIVE_ADDRESS = swapsUtils.NATIVE_SWAPS_TOKEN_ADDRESS;
function BridgeView({
  swapsTokens,
  swapsControllerTokens,
  accounts,
  selectedAddress,
  chainId,
  provider,
  frequentRpcList,
  balances,
  tokensWithBalance,
  tokensTopAssets,
  conversionRate,
  tokenExchangeRates,
  currentCurrency,
  userHasOnboarded,
  setHasOnboarded,
  setLiveness,
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [sourceChain, setSourceChain] = useState(null);
  const [destinationChain, setDestinationChain] = useState(null);

  const { isGetList, bridgeChains } = useGetBridgeChain();
  const { bridgeTokens, getBridgeTokenByChain } = useGetBridgeToken();
  const { multiChainTokens, getTokenByChain } = useGetMultichainToken();

  const explorer = useBlockExplorer(provider, frequentRpcList);
  const initialSource = SWAPS_NATIVE_ADDRESS;
  const [amount, setAmount] = useState('0');
  const [slippage, setSlippage] = useState(AppConstants.SWAPS.DEFAULT_SLIPPAGE);
  const [showAddNetwork, setShowAddNetwork] = useState(true);
  const [isInitialLoadingTokens, setInitialLoadingTokens] = useState(false);
  const [, setLoadingTokens] = useState(false);
  const [isSourceSet, setIsSourceSet] = useState(() =>
    Boolean(
      swapsTokens?.find((token) =>
        toLowerCaseEquals(token.address, initialSource),
      ),
    ),
  );

  const [sourceToken, setSourceToken] = useState(() =>
    swapsTokens?.find((token) =>
      toLowerCaseEquals(token.address, initialSource),
    ),
  );

  useEffect(() => {
    getBridgeTokenByChain(
      sourceChain ? sourceChain.id : 1,
      destinationChain ? destinationChain.id : 1,
    );
  }, [sourceChain, destinationChain, getBridgeTokenByChain]);

  // useEffect(() => {
  //   if (sourceChain && sourceChain.id === 1 && !showAddNetwork) {
  //     setShowAddNetwork(true);
  //   }
  // }, [sourceChain, showAddNetwork]);

  useEffect(() => {
    if (bridgeTokens && bridgeTokens.length > 0) {
      const tokens = [
        // '0x55af5865807b196bd0197e0902746f31fbccfa58',
        // '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
      ];
      bridgeTokens.forEach((item) => {
        tokens.push(item.srcTokenAddress);
      });
      getTokenByChain(sourceChain ? sourceChain.id : 1, tokens);
    }
  }, [sourceChain, getTokenByChain, bridgeTokens]);

  const [contractBalance, setContractBalance] = useState(null);
  const [contractBalanceAsUnits, setContractBalanceAsUnits] = useState(
    safeNumberToBN(0),
  );

  const [isTokenModalVisible, toggleTokenModal] = useModalHandler(false);
  const [isSourceModalVisible, toggleSourceModal] = useModalHandler(false);
  const [isDestinationModalVisible, toggleDestinationModal] =
    useModalHandler(false);

  useEffect(() => {
    navigation.setOptions(getSwapsAmountNavbar(navigation, route, colors));
  }, [navigation, route, colors]);

  useEffect(() => {
    (async () => {
      try {
        const data = await swapsUtils.fetchSwapsFeatureLiveness(
          chainId,
          AppConstants.SWAPS.CLIENT_ID,
        );
        const liveness =
          typeof data === 'boolean' ? data : data?.mobileActive ?? false;
        setLiveness(liveness, chainId);
        if (liveness) {
          // Triggered when a user enters the MetaMask Swap feature
          InteractionManager.runAfterInteractions(() => {
            const parameters = {
              source:
                initialSource === SWAPS_NATIVE_ADDRESS
                  ? 'MainView'
                  : 'TokenView',
              activeCurrency: swapsTokens?.find((token) =>
                toLowerCaseEquals(token.address, initialSource),
              )?.symbol,
              chain_id: chainId,
            };
            Analytics.trackEventWithParameters(
              ANALYTICS_EVENT_OPTS.SWAPS_OPENED,
              {},
            );
            Analytics.trackEventWithParameters(
              ANALYTICS_EVENT_OPTS.SWAPS_OPENED,
              parameters,
              true,
            );
          });
        } else {
          navigation.pop();
        }
      } catch (error) {
        Logger.error(error, 'Swaps: error while fetching swaps liveness');
        setLiveness(false, chainId);
        navigation.pop();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSource, chainId, navigation, setLiveness]);

  useEffect(() => {
    (async () => {
      const { SwapsController } = Engine.context;
      try {
        await SwapsController.fetchAggregatorMetadataWithCache();
        await SwapsController.fetchTopAssetsWithCache();
      } catch (error) {
        Logger.error(
          error,
          'Swaps: Error while updating agg metadata and top assets in amount view',
        );
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { SwapsController } = Engine.context;
      try {
        if (
          !swapsControllerTokens ||
          !swapsTokens ||
          swapsTokens?.length === 0
        ) {
          setInitialLoadingTokens(true);
        }
        setLoadingTokens(true);
        await SwapsController.fetchTokenWithCache();
        setLoadingTokens(false);
        setInitialLoadingTokens(false);
      } catch (error) {
        Logger.error(
          error,
          'Swaps: Error while fetching tokens in amount view',
        );
      } finally {
        setLoadingTokens(false);
        setInitialLoadingTokens(false);
      }
    })();
  }, [swapsControllerTokens, swapsTokens]);

  useEffect(() => {
    if (
      !isSourceSet &&
      initialSource &&
      swapsControllerTokens &&
      swapsTokens?.length > 0 &&
      !sourceToken
    ) {
      setIsSourceSet(true);
      setSourceToken(
        swapsTokens.find((token) =>
          toLowerCaseEquals(token.address, initialSource),
        ),
      );
    }
  }, [
    initialSource,
    isSourceSet,
    sourceToken,
    swapsControllerTokens,
    swapsTokens,
  ]);

  const isTokenInBalances =
    sourceToken && !isSwapsNativeAsset(sourceToken)
      ? safeToChecksumAddress(sourceToken.address) in balances
      : false;

  useEffect(() => {
    (async () => {
      if (
        sourceToken &&
        !isSwapsNativeAsset(sourceToken) &&
        !isTokenInBalances
      ) {
        setContractBalance(null);
        setContractBalanceAsUnits(safeNumberToBN(0));
        const { AssetsContractController } = Engine.context;
        try {
          const balance = await AssetsContractController.getERC20BalanceOf(
            sourceToken.address,
            selectedAddress,
          );
          setContractBalanceAsUnits(balance);
          setContractBalance(
            renderFromTokenMinimalUnit(balance, sourceToken.decimals),
          );
        } catch (e) {
          // Don't validate balance if error
        }
      }
    })();
  }, [isTokenInBalances, selectedAddress, sourceToken]);

  const hasInvalidDecimals = useMemo(() => {
    if (sourceToken) {
      return amount?.split('.')[1]?.length > sourceToken.decimals;
    }
    return false;
  }, [amount, sourceToken]);

  const amountAsUnits = useMemo(
    () =>
      toTokenMinimalUnit(
        hasInvalidDecimals ? '0' : amount,
        sourceToken?.decimals,
      ),
    [amount, hasInvalidDecimals, sourceToken],
  );
  const controllerBalance = useBalance(
    accounts,
    balances,
    selectedAddress,
    sourceToken,
  );
  const controllerBalanceAsUnits = useBalance(
    accounts,
    balances,
    selectedAddress,
    sourceToken,
    { asUnits: true },
  );

  const balance =
    isSwapsNativeAsset(sourceToken) || isTokenInBalances
      ? controllerBalance
      : contractBalance;
  const balanceAsUnits =
    isSwapsNativeAsset(sourceToken) || isTokenInBalances
      ? controllerBalanceAsUnits
      : contractBalanceAsUnits;

  const isBalanceZero = isZero(balanceAsUnits);
  const isAmountZero = isZero(amountAsUnits);

  const hasBalance = useMemo(() => {
    if (!balanceAsUnits || !sourceToken) {
      return false;
    }

    return !(isBalanceZero ?? true);
  }, [balanceAsUnits, sourceToken, isBalanceZero]);

  const hasEnoughBalance = useMemo(() => {
    if (hasInvalidDecimals || !hasBalance || !balanceAsUnits) {
      return false;
    }

    // TODO: Cannot call .gte on balanceAsUnits since it isn't always guaranteed to be type BN. Should consolidate into one type.
    return gte(balanceAsUnits, amountAsUnits) ?? false;
  }, [amountAsUnits, balanceAsUnits, hasBalance, hasInvalidDecimals]);

  const currencyAmount = useMemo(() => {
    if (!sourceToken || hasInvalidDecimals) {
      return undefined;
    }
    let balanceFiat;
    if (isSwapsNativeAsset(sourceToken)) {
      balanceFiat = weiToFiat(
        toTokenMinimalUnit(amount, sourceToken?.decimals),
        conversionRate,
        currentCurrency,
      );
    } else {
      const sourceAddress = safeToChecksumAddress(sourceToken.address);
      const exchangeRate =
        sourceAddress in tokenExchangeRates
          ? tokenExchangeRates[sourceAddress]
          : undefined;
      balanceFiat = balanceToFiat(
        amount,
        conversionRate,
        exchangeRate,
        currentCurrency,
      );
    }
    return balanceFiat;
  }, [
    amount,
    conversionRate,
    currentCurrency,
    hasInvalidDecimals,
    sourceToken,
    tokenExchangeRates,
  ]);

  /* Navigation handler */
  const handleGetQuotesPress = useCallback(async () => {
    if (hasInvalidDecimals) {
      return;
    }
    if (
      !isSwapsNativeAsset(sourceToken) &&
      !isTokenInBalances &&
      !isBalanceZero
    ) {
      const { TokensController } = Engine.context;
      const { address, symbol, decimals } = sourceToken;
      await TokensController.addToken(address, symbol, decimals);
    }
    // return navigation.navigate(
    //   'SwapsQuotesView',
    //   setQuotesNavigationsParams(
    //     sourceToken?.address,
    //     destinationToken?.address,
    //     toTokenMinimalUnit(amount, sourceToken?.decimals).toString(10),
    //     slippage,
    //     [sourceToken, destinationToken],
    //   ),
    // );
  }, [
    hasInvalidDecimals,
    sourceToken,
    isTokenInBalances,
    isBalanceZero,
    navigation,
    amount,
    slippage,
  ]);

  const handleTokenPress = useCallback(
    (item) => {
      toggleTokenModal();
      setSourceToken(item);
    },
    [toggleTokenModal, sourceToken],
  );

  const handleSourceChainPress = useCallback(
    (item) => {
      toggleSourceModal();
      setSourceChain(item);
      const rpc = frequentRpcList.find((rpc) => rpc.chainId === item.id + '');
      // if (rpc) {
      //   setShowAddNetwork(true);
      // }
    },
    [frequentRpcList, toggleSourceModal],
  );

  const handleDestinationChainPress = useCallback(
    (item) => {
      toggleDestinationModal();
      setDestinationChain(item);
    },
    [toggleDestinationModal],
  );

  const handleFlipTokens = useCallback(() => {
    setSourceChain(destinationChain);
    setDestinationChain(sourceChain);
  }, [destinationChain, sourceChain]);

  if (!userHasOnboarded) {
    return (
      <ScreenView
        style={styles.container}
        contentContainerStyle={styles.screen}
      >
        <Onboarding setHasOnboarded={setHasOnboarded} />
      </ScreenView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenView
        style={styles.container}
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
        vertical
        automaticallyAdjustContentInsets={false}
      >
        <View style={styles.content}>
          {isInitialLoadingTokens ? (
            <ActivityIndicator size="small" />
          ) : (
            <View style={styles.selectTokenView}>
              <TouchableOpacity
                style={styles.selectTokenContainer}
                onPress={toggleTokenModal}
              >
                <View style={styles.icon}>
                  <TokenIcon
                    icon={sourceToken?.iconUrl}
                    symbol={sourceToken?.symbol}
                  />
                </View>
                <Text primary>
                  {sourceToken?.symbol || strings('swaps.select_a_token')}
                </Text>
                <Icon name="caret-down" size={18} style={styles.caretDown} />
              </TouchableOpacity>
            </View>
          )}

          <TokenSelectModal
            isVisible={isTokenModalVisible}
            dismiss={toggleTokenModal}
            title={strings('swaps.convert_from')}
            tokens={multiChainTokens}
            initialTokens={multiChainTokens}
            onItemPress={handleTokenPress}
            excludeAddresses={[]}
          />
          <View style={[styles.tokenButtonContainer]} pointerEvents={'auto'}>
            {isInitialLoadingTokens ? (
              <ActivityIndicator size="small" />
            ) : (
              <View style={styles.sendTokenContainer}>
                <View style={styles.sendOptionContainer}>
                  <Text>{'SEND'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.selectTokenContainer}
                  onPress={toggleSourceModal}
                >
                  <View style={styles.icon}>
                    <TokenIcon
                      icon={sourceChain?.iconUrl}
                      symbol={sourceChain?.symbol}
                    />
                  </View>
                  <Text primary>
                    {sourceChain?.name || 'Select source chain'}
                  </Text>
                  <Icon name="caret-down" size={18} style={styles.caretDown} />
                </TouchableOpacity>
              </View>
            )}
            <ChainSelectModal
              isVisible={isSourceModalVisible}
              dismiss={toggleSourceModal}
              title={strings('swaps.convert_from')}
              chains={bridgeChains}
              initialTokens={[]}
              onItemPress={handleSourceChainPress}
              excludeChains={[sourceChain?.id]}
            />
          </View>
          <View style={[styles.amountContainer]} pointerEvents={'auto'}>
            {!sourceToken && <Text> </Text>}
          </View>
          <View style={styles.sendTokenContainer}>
            <View style={styles.sendOptionContainer}>
              <Text>{'RECEIVE'}</Text>
            </View>
            {isInitialLoadingTokens ? (
              <ActivityIndicator size="small" />
            ) : (
              <TouchableOpacity
                style={styles.selectTokenContainer}
                onPress={toggleDestinationModal}
              >
                <View style={styles.icon}>
                  <TokenIcon
                    icon={destinationChain?.iconUrl}
                    symbol={destinationChain?.symbol}
                  />
                </View>
                <Text primary>
                  {destinationChain?.name || 'Select destination chain'}
                </Text>
                <Icon name="caret-down" size={18} style={styles.caretDown} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.tokenButtonContainer}>
            <ChainSelectModal
              isVisible={isDestinationModalVisible}
              dismiss={toggleDestinationModal}
              title={strings('swaps.convert_to')}
              chains={bridgeChains}
              initialTokens={[]}
              onItemPress={handleDestinationChainPress}
              excludeChains={[sourceChain?.id]}
            />
          </View>
          <View style={[styles.horizontalRuleContainer]} pointerEvents={'auto'}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={handleFlipTokens}
            >
              <IonicIcon style={styles.arrowDown} name="ios-swap" />
            </TouchableOpacity>
          </View>
        </View>

        {isInitialLoadingTokens ? (
          <ActivityIndicator size="small" />
        ) : (
          <View style={styles.amountInputView}>
            <View>
              <Text>{'Amount'}</Text>
              <Text>{contractBalance}</Text>
            </View>
            <TextInput
              style={styles.amount}
              numberOfLines={1}
              adjustsFontSizeToFit
              allowFontScaling
              // ref={this.amountInput}
              // value={amount}
              // onChangeText={this.onInputChange}
              keyboardType={'numeric'}
              placeholder={'0'}
              placeholderTextColor={colors.text.muted}
              testID={'txn-amount-input'}
            />
          </View>
        )}

        <View style={[styles.keypad]} pointerEvents={'auto'}>
          <View style={styles.ctaContainer}>
            <StyledButton
              type="blue"
              onPress={handleGetQuotesPress}
              containerStyle={styles.cta}
              disabled={
                isInitialLoadingTokens ||
                !sourceToken ||
                hasInvalidDecimals ||
                isAmountZero
              }
            >
              {'Bridge'}
            </StyledButton>
          </View>
          <View style={styles.providerContainer}>
            <Text style={styles.swapDetailTitle}>{'Provider'}</Text>
            <Text style={styles.swapDetailTitle}>{'Multichain'}</Text>
          </View>
        </View>
        {showAddNetwork && (
          <NetworkModal
            navigation={navigation}
            isVisible={showAddNetwork}
            network={{
              name: sourceChain.name,
              shortName: sourceChain.name,
              networkId: sourceChain.id,
              chainId: sourceChain.id,
              hexChainId: '0x1',
              color: '#3cc29e',
              networkType: 'mainnet',
              formattedRpcUrl: sourceChain.rpc,
              rpcPrefs: {
                blockExplorerUrl: sourceChain.explore_url,
                imageUrl: sourceChain.logo,
              },
            }}
            onClose={() => {
              setShowAddNetwork(false);
            }}
          />
        )}
        {/* <NetworkModals
          isVisible={showAddNetwork}
          onClose={() => {
            setShowAddNetwork(!showAddNetwork);
          }}
          network={{
            name: 'Ethereum Main Network',
            shortName: 'Ethereum',
            networkId: 1,
            chainId: 1,
            hexChainId: '0x1',
            color: '#3cc29e',
            networkType: 'mainnet',
            formattedRpcUrl: '',
            rpcPrefs: {
              blockExplorerUrl: '',
              imageUrl: '',
            },
          }}
          navigation={navigation}
        /> */}
      </ScreenView>
    </View>
  );
}

BridgeView.propTypes = {
  swapsTokens: PropTypes.arrayOf(PropTypes.object),
  swapsControllerTokens: PropTypes.arrayOf(PropTypes.object),
  tokensWithBalance: PropTypes.arrayOf(PropTypes.object),
  tokensTopAssets: PropTypes.arrayOf(PropTypes.object),
  /**
   * Map of accounts to information objects including balances
   */
  accounts: PropTypes.object,
  /**
   * A string that represents the selected address
   */
  selectedAddress: PropTypes.string,
  /**
   * An object containing token balances for current account and network in the format address => balance
   */
  balances: PropTypes.object,
  /**
   * ETH to current currency conversion rate
   */
  conversionRate: PropTypes.number,
  /**
   * Currency code of the currently-active currency
   */
  currentCurrency: PropTypes.string,
  /**
   * An object containing token exchange rates in the format address => exchangeRate
   */
  tokenExchangeRates: PropTypes.object,
  /**
   * Wether the user has been onboarded or not
   */
  userHasOnboarded: PropTypes.bool,
  /**
   * Function to set hasOnboarded
   */
  setHasOnboarded: PropTypes.func,
  /**
   * Current Network provider
   */
  provider: PropTypes.object,
  /**
   * Chain Id
   */
  chainId: PropTypes.string,
  /**
   * Frequent RPC list from PreferencesController
   */
  frequentRpcList: PropTypes.array,
  /**
   * Function to set liveness
   */
  setLiveness: PropTypes.func,
};

const mapStateToProps = (state) => ({
  swapsTokens: swapsTokensSelector(state),
  swapsControllerTokens: swapsControllerTokens(state),
  accounts: state.engine.backgroundState.AccountTrackerController.accounts,
  selectedAddress:
    state.engine.backgroundState.PreferencesController.selectedAddress,
  balances:
    state.engine.backgroundState.TokenBalancesController.contractBalances,
  conversionRate:
    state.engine.backgroundState.CurrencyRateController.conversionRate,
  tokenExchangeRates:
    state.engine.backgroundState.TokenRatesController.contractExchangeRates,
  currentCurrency:
    state.engine.backgroundState.CurrencyRateController.currentCurrency,
  provider: state.engine.backgroundState.NetworkController.provider,
  frequentRpcList:
    state.engine.backgroundState.PreferencesController.frequentRpcList,
  chainId: state.engine.backgroundState.NetworkController.provider.chainId,
  tokensWithBalance: swapsTokensWithBalanceSelector(state),
  tokensTopAssets: swapsTopAssetsSelector(state),
  userHasOnboarded: swapsHasOnboardedSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  setHasOnboarded: (hasOnboarded) =>
    dispatch(setSwapsHasOnboarded(hasOnboarded)),
  setLiveness: (liveness, chainId) =>
    dispatch(setSwapsLiveness(liveness, chainId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BridgeView);
