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
import { View as AnimatableView } from 'react-native-animatable';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import Logger from '../../../util/Logger';
import {
  balanceToFiat,
  fromTokenMinimalUnitString,
  renderFromTokenMinimalUnit,
  toTokenMinimalUnit,
  weiToFiat,
  safeNumberToBN,
} from '../../../util/number';
import { safeToChecksumAddress } from '../../../util/address';
import { swapsUtils } from '@metamask/swaps-controller';
import { ANALYTICS_EVENT_OPTS } from '../../../util/analytics';

import {
  setSwapsHasOnboarded,
  setSwapsLiveness,
  swapsControllerTokens,
  swapsHasOnboardedSelector,
  swapsTokensSelector,
  swapsTokensWithBalanceSelector,
  swapsTopAssetsSelector,
} from '../../../reducers/swaps';
import Analytics from '../../../core/Analytics/Analytics';
import Device from '../../../util/device';
import Engine from '../../../core/Engine';
import AppConstants from '../../../core/AppConstants';

import { strings } from '../../../../locales/i18n';
import {
  setQuotesNavigationsParams,
  isSwapsNativeAsset,
  isDynamicToken,
} from './utils';
import { getSwapsAmountNavbar } from '../Navbar';

import Onboarding from './components/Onboarding';
import useModalHandler from '../../Base/hooks/useModalHandler';
import Text from '../../Base/Text';
import Keypad from '../../Base/Keypad';
import StyledButton from '../StyledButton';
import ScreenView from '../FiatOrders/components/ScreenView';
import ActionAlert from './components/ActionAlert';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import TokenSelectButton from './components/TokenSelectButton';
>>>>>>> 59f329c5... wip: swap view
=======
>>>>>>> 6e5e0448... chore: swap ui
import TokenSelectModal from './components/TokenSelectModal';
import SlippageModal from './components/SlippageModal';
import useBalance from './utils/useBalance';
import useBlockExplorer from './utils/useBlockExplorer';
import InfoModal from './components/InfoModal';
import { toLowerCaseEquals } from '../../../util/general';
import { AlertType } from '../../Base/Alert';
import { isZero, gte } from '../../../util/lodash';
import { useTheme } from '../../../util/theme';
import TokenIcon from './components/TokenIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
// import TokenIcon from './../../../TokenIcon';

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
    },
    keypad: {
      flexGrow: 1,
      justifyContent: 'space-around',
    },
    tokenButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      margin: Device.isIphone5() ? 5 : 10,
    },
    amountContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 25,
    },
    amount: {
      textAlignVertical: 'center',
<<<<<<< HEAD
<<<<<<< HEAD
      fontSize: Device.isIphone5() ? 20 : 30,
      height: Device.isIphone5() ? 30 : 40,
      maxWidth: '50%',
=======
      fontSize: Device.isIphone5() ? 30 : 40,
      height: Device.isIphone5() ? 40 : 50,
>>>>>>> 59f329c5... wip: swap view
=======
      fontSize: Device.isIphone5() ? 20 : 30,
      height: Device.isIphone5() ? 30 : 40,
      maxWidth: '50%',
>>>>>>> 6e5e0448... chore: swap ui
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
      top: 143,
<<<<<<< HEAD
<<<<<<< HEAD
      left: '44%',
=======
      left: '46%',
>>>>>>> 59f329c5... wip: swap view
=======
      left: '44%',
>>>>>>> 6e5e0448... chore: swap ui
    },
    horizontalRule: {
      flex: 1,
      borderBottomWidth: StyleSheet.hairlineWidth,
      height: 1,
      borderBottomColor: colors.border.muted,
    },
    arrowDown: {
      color: colors.background.default,
      fontSize: 25,
      marginHorizontal: 15,
<<<<<<< HEAD
<<<<<<< HEAD
      transform: [{ rotate: '90deg' }],
=======
>>>>>>> 59f329c5... wip: swap view
=======
      transform: [{ rotate: '90deg' }],
>>>>>>> 6e5e0448... chore: swap ui
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
      paddingHorizontal: Device.isIphone5() ? 10 : 20,
    },
    disabled: {
      opacity: 0.4,
    },
    sendTokenContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      height: 156,
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

    sendOptionButton: {
      flexDirection: 'row',
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
      borderRadius: 10,
      borderWidth: 1,
      paddingHorizontal: 10,
      borderColor: colors.border.muted,
    },
    sendOptionRight: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendOptionButtonTitle: {
      textAlignVertical: 'center',
      fontSize: Device.isIphone5() ? 10 : 14,
      height: Device.isIphone5() ? 13 : 16,
      fontWeight: '500',
      color: colors.text.default,
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
      flex: 1,
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
      width: 56,
      height: 56,
      borderRadius: 28,
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
<<<<<<< HEAD
<<<<<<< HEAD
      marginVertical: 5,
=======
>>>>>>> 59f329c5... wip: swap view
=======
      marginVertical: 5,
>>>>>>> 6e5e0448... chore: swap ui
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
<<<<<<< HEAD
<<<<<<< HEAD
    },
=======
    }
>>>>>>> 59f329c5... wip: swap view
=======
    },
>>>>>>> 6e5e0448... chore: swap ui
  });

const SWAPS_NATIVE_ADDRESS = swapsUtils.NATIVE_SWAPS_TOKEN_ADDRESS;
const TOKEN_MINIMUM_SOURCES = 1;
const MAX_TOP_ASSETS = 20;

function SwapsAmountView({
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

  const explorer = useBlockExplorer(provider, frequentRpcList);
  const initialSource = route.params?.sourceToken ?? SWAPS_NATIVE_ADDRESS;
  const [amount, setAmount] = useState('0');
  const [slippage, setSlippage] = useState(AppConstants.SWAPS.DEFAULT_SLIPPAGE);
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
  const [destinationToken, setDestinationToken] = useState(null);
  const [hasDismissedTokenAlert, setHasDismissedTokenAlert] = useState(true);
  const [contractBalance, setContractBalance] = useState(null);
  const [contractBalanceAsUnits, setContractBalanceAsUnits] = useState(
    safeNumberToBN(0),
  );
  const [isDirectWrapping, setIsDirectWrapping] = useState(false);

  const [isSourceModalVisible, toggleSourceModal] = useModalHandler(false);
  const [isDestinationModalVisible, toggleDestinationModal] =
    useModalHandler(false);
  const [isSlippageModalVisible, toggleSlippageModal] = useModalHandler(false);
  const [
    isTokenVerificationModalVisisble,
    toggleTokenVerificationModal,
    ,
    hideTokenVerificationModal,
  ] = useModalHandler(false);

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

  const keypadViewRef = useRef(null);

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

  useEffect(() => {
    setHasDismissedTokenAlert(false);
  }, [destinationToken]);

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

  const destinationTokenHasEnoughOcurrances = useMemo(() => {
    if (!destinationToken || isSwapsNativeAsset(destinationToken)) {
      return true;
    }
    return destinationToken?.occurrences > TOKEN_MINIMUM_SOURCES;
  }, [destinationToken]);

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
    return navigation.navigate(
      'SwapsQuotesView',
      setQuotesNavigationsParams(
        sourceToken?.address,
        destinationToken?.address,
        toTokenMinimalUnit(amount, sourceToken?.decimals).toString(10),
        slippage,
        [sourceToken, destinationToken],
      ),
    );
  }, [
    amount,
    destinationToken,
    hasInvalidDecimals,
    isTokenInBalances,
    navigation,
    slippage,
    sourceToken,
    isBalanceZero,
  ]);

  /* Keypad Handlers */
  const handleKeypadChange = useCallback(
    ({ value }) => {
      if (value === amount) {
        return;
      }

      setAmount(value);
    },
    [amount],
  );

  const setSlippageAfterTokenPress = useCallback(
    (sourceTokenAddress, destinationTokenAddress) => {
      const enableDirectWrapping = swapsUtils.shouldEnableDirectWrapping(
        chainId,
        sourceTokenAddress,
        destinationTokenAddress,
      );
      if (enableDirectWrapping && !isDirectWrapping) {
        setSlippage(0);
        setIsDirectWrapping(true);
      } else if (isDirectWrapping && !enableDirectWrapping) {
        setSlippage(AppConstants.SWAPS.DEFAULT_SLIPPAGE);
        setIsDirectWrapping(false);
      }
    },
    [setSlippage, chainId, isDirectWrapping],
  );

  const handleSourceTokenPress = useCallback(
    (item) => {
      toggleSourceModal();
      setSourceToken(item);
      setSlippageAfterTokenPress(item.address, destinationToken?.address);
    },
    [toggleSourceModal, setSlippageAfterTokenPress, destinationToken],
  );

  const handleDestinationTokenPress = useCallback(
    (item) => {
      toggleDestinationModal();
      setDestinationToken(item);
      setSlippageAfterTokenPress(sourceToken?.address, item.address);
    },
    [toggleDestinationModal, setSlippageAfterTokenPress, sourceToken],
  );

  const handleUseMax = useCallback(() => {
    if (!sourceToken || !balanceAsUnits) {
      return;
    }
    setAmount(
      fromTokenMinimalUnitString(
        balanceAsUnits.toString(10),
        sourceToken.decimals,
      ),
    );
  }, [balanceAsUnits, sourceToken]);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6e5e0448... chore: swap ui
  const handleUse50Max = useCallback(() => {
    if (!sourceToken || !balanceAsUnits) {
      return;
    }
    setAmount(
      fromTokenMinimalUnitString(
        (balanceAsUnits / 2).toString(10),
        sourceToken.decimals,
      ),
    );
  }, [balanceAsUnits, sourceToken]);
<<<<<<< HEAD
=======
>>>>>>> 59f329c5... wip: swap view
=======
>>>>>>> 6e5e0448... chore: swap ui

  const handleSlippageChange = useCallback((value) => {
    setSlippage(value);
  }, []);

  const handleDimissTokenAlert = useCallback(() => {
    setHasDismissedTokenAlert(true);
  }, []);

  const handleVerifyPress = useCallback(() => {
    if (!destinationToken) {
      return;
    }
    hideTokenVerificationModal();
    navigation.navigate('Webview', {
      screen: 'SimpleWebview',
      params: {
        url: explorer.token(destinationToken.address),
        title: strings('swaps.verify'),
      },
    });
  }, [explorer, destinationToken, hideTokenVerificationModal, navigation]);

  const handleAmountPress = useCallback(
    () => keypadViewRef?.current?.shake?.(),
    [],
  );

  const handleFlipTokens = useCallback(() => {
    setSourceToken(destinationToken);
    setDestinationToken(sourceToken);
  }, [destinationToken, sourceToken]);

  const disabledView =
    !destinationTokenHasEnoughOcurrances && !hasDismissedTokenAlert;

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

  // const themeAppearance = this.context.themeAppearance || 'light';

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
          <View
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6e5e0448... chore: swap ui
            style={[
              styles.tokenButtonContainer,
              disabledView && styles.disabled,
            ]}
<<<<<<< HEAD
            pointerEvents={disabledView ? 'none' : 'auto'}
          >

            <View style={styles.sendTokenContainer}>
              <View style={styles.sendOptionContainer}>
                <Text>{'SEND'}</Text>
                <View style={styles.sendOptionRight}>
                  <TouchableOpacity
                    style={styles.sendOptionButton}
                    onPress={handleUse50Max}
                  >
                    <Text style={styles.sendOptionButtonTitle}>{'50%'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sendOptionButton}
                    onPress={handleUseMax}
                  >
                    <Text>{'MAX'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.selectTokenInputContainer}>
                {isInitialLoadingTokens ? (
                  <ActivityIndicator size="small" />
                ) : (
=======
            style={[styles.tokenButtonContainer, disabledView && styles.disabled]}
=======
>>>>>>> 6e5e0448... chore: swap ui
            pointerEvents={disabledView ? 'none' : 'auto'}
          >
            {isInitialLoadingTokens ? (
              <ActivityIndicator size="small" />
            ) : (
              <View style={styles.sendTokenContainer}>
                <View style={styles.sendOptionContainer}>
                  <Text>{'SEND'}</Text>
                  <View style={styles.sendOptionRight}>
                    <TouchableOpacity
                      style={styles.sendOptionButton}
                      onPress={handleUse50Max}
                    >
                      <Text style={styles.sendOptionButtonTitle}>{'50%'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sendOptionButton}
                      onPress={handleUseMax}
                    >
                      <Text>{'MAX'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.selectTokenInputContainer}>
>>>>>>> 59f329c5... wip: swap view
                  <TouchableOpacity
                    style={styles.selectTokenContainer}
                    onPress={toggleSourceModal}
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6e5e0448... chore: swap ui
                    <Icon
                      name="caret-down"
                      size={18}
                      style={styles.caretDown}
                    />
<<<<<<< HEAD
                  </TouchableOpacity>
                )}

                <TextInput
                  style={styles.amount}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  allowFontScaling
                  // ref={this.amountInput}
                  value={amount}
                  onChangeText={(value) => {
                    if (value.length > 0) {
                      if (value.includes(',')) {
                        setAmount(value.replace(',', '.'));
                      } else {
                        setAmount(value);
                      }
                    } else {
                      setAmount('0');
                    }
                  }}
                  keyboardType={'decimal-pad'}
                  placeholder={'0'}
                  placeholderTextColor={colors.text.muted}
                  testID={'txn-amount-input'}
                // keyboardAppearance={themeAppearance}
                />
              </View>
              <TouchableOpacity style={styles.balanceContainer}>
                {!!sourceToken &&
                  (hasInvalidDecimals ||
                    (!isAmountZero && !hasEnoughBalance) ? (
                    <Text style={styles.amountInvalid}>
                      {hasInvalidDecimals
                        ? strings('swaps.allows_up_to_decimals', {
                          symbol: sourceToken.symbol,
                          decimals: sourceToken.decimals,
                          // eslint-disable-next-line no-mixed-spaces-and-tabs
                        })
                        : strings('swaps.not_enough', {
                          symbol: sourceToken.symbol,
                        })}
                    </Text>
                  ) : isAmountZero ? (
                    <Text>
                      {!!sourceToken &&
                        balance !== null &&
                        strings('swaps.available_to_swap', {
                          asset: `${balance} ${sourceToken.symbol}`,
                        })}
                      {!isSwapsNativeAsset(sourceToken) && hasBalance && (
                        <Text style={styles.linkText} onPress={handleUseMax}>
                          {' '}
                          {strings('swaps.use_max')}
                        </Text>
                      )}
                    </Text>
                  ) : (
                    <Text upper>
                      {currencyAmount ? `~${currencyAmount}` : ''}
                    </Text>
                  ))}
              </TouchableOpacity>
            </View>

=======
                    <Icon name="caret-down" size={18} style={styles.caretDown} />
=======
>>>>>>> 6e5e0448... chore: swap ui
                  </TouchableOpacity>

                  <TextInput
                    style={styles.amount}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    allowFontScaling
                    // ref={this.amountInput}
                    value={amount}
                    onChangeText={(value) => {
                      if (value.length > 0) {
                        if (value.includes(',')) {
                          setAmount(value.replace(',', '.'));
                        } else {
                          setAmount(value);
                        }
                      } else {
                        setAmount('0');
                      }
                    }}
                    keyboardType={'decimal-pad'}
                    placeholder={'0'}
                    placeholderTextColor={colors.text.muted}
                    testID={'txn-amount-input'}
                  // keyboardAppearance={themeAppearance}
                  />
                </View>
                <TouchableOpacity style={styles.balanceContainer}>
                  {!!sourceToken &&
                    (hasInvalidDecimals ||
                      (!isAmountZero && !hasEnoughBalance) ? (
                      <Text style={styles.amountInvalid}>
                        {hasInvalidDecimals
                          ? strings('swaps.allows_up_to_decimals', {
                            symbol: sourceToken.symbol,
                            decimals: sourceToken.decimals,
                            // eslint-disable-next-line no-mixed-spaces-and-tabs
                          })
                          : strings('swaps.not_enough', {
                            symbol: sourceToken.symbol,
                          })}
                      </Text>
                    ) : isAmountZero ? (
                      <Text>
                        {!!sourceToken &&
                          balance !== null &&
                          strings('swaps.available_to_swap', {
                            asset: `${balance} ${sourceToken.symbol}`,
                          })}
                        {!isSwapsNativeAsset(sourceToken) && hasBalance && (
                          <Text style={styles.linkText} onPress={handleUseMax}>
                            {' '}
                            {strings('swaps.use_max')}
                          </Text>
                        )}
                      </Text>
                    ) : (
                      <Text upper>
                        {currencyAmount ? `~${currencyAmount}` : ''}
                      </Text>
                    ))}
                </TouchableOpacity>
              </View>
            )}
>>>>>>> 59f329c5... wip: swap view
            <TokenSelectModal
              isVisible={isSourceModalVisible}
              dismiss={toggleSourceModal}
              title={strings('swaps.convert_from')}
              tokens={swapsTokens}
              initialTokens={tokensWithBalance}
              onItemPress={handleSourceTokenPress}
              excludeAddresses={[destinationToken?.address]}
            />
          </View>
          <View
            style={[styles.amountContainer, disabledView && styles.disabled]}
            pointerEvents={disabledView ? 'none' : 'auto'}
          >
            {!sourceToken && <Text> </Text>}
          </View>
          <View style={styles.sendTokenContainer}>
            <View style={styles.sendOptionContainer}>
              <Text>{'RECEIVE'}</Text>
            </View>

            <View style={styles.selectTokenInputContainer}>
              {isInitialLoadingTokens ? (
                <ActivityIndicator size="small" />
              ) : (
                <TouchableOpacity
                  style={styles.selectTokenContainer}
                  onPress={toggleDestinationModal}
                >
                  <View style={styles.icon}>
                    <TokenIcon
                      icon={destinationToken?.iconUrl}
                      symbol={destinationToken?.symbol}
                    />
                  </View>
                  <Text primary>
<<<<<<< HEAD
<<<<<<< HEAD
                    {destinationToken?.symbol ||
                      strings('swaps.select_a_token')}
=======
                    {destinationToken?.symbol || strings('swaps.select_a_token')}
>>>>>>> 59f329c5... wip: swap view
=======
                    {destinationToken?.symbol ||
                      strings('swaps.select_a_token')}
>>>>>>> 6e5e0448... chore: swap ui
                  </Text>
                  <Icon name="caret-down" size={18} style={styles.caretDown} />
                </TouchableOpacity>
              )}

              <TextInput
                style={styles.amount}
                numberOfLines={1}
                adjustsFontSizeToFit
                allowFontScaling
                // ref={this.amountInput}
<<<<<<< HEAD
<<<<<<< HEAD
                // value={amount}
=======
                value={amount}
>>>>>>> 59f329c5... wip: swap view
=======
                // value={amount}
>>>>>>> 6e5e0448... chore: swap ui
                // onChangeText={this.onInputChange}
                keyboardType={'numeric'}
                placeholder={'0'}
                placeholderTextColor={colors.text.muted}
                testID={'txn-amount-input'}
              />
            </View>

            <TouchableOpacity>
<<<<<<< HEAD
<<<<<<< HEAD
              {!!destinationToken &&
=======
              {!!sourceToken &&
>>>>>>> 59f329c5... wip: swap view
=======
              {!!destinationToken &&
>>>>>>> 6d5f5782... feat: bridge ui
                (hasInvalidDecimals || (!isAmountZero && !hasEnoughBalance) ? (
                  <Text style={styles.amountInvalid}>
                    {hasInvalidDecimals
                      ? strings('swaps.allows_up_to_decimals', {
                        symbol: sourceToken.symbol,
                        decimals: sourceToken.decimals,
                        // eslint-disable-next-line no-mixed-spaces-and-tabs
                      })
                      : strings('swaps.not_enough', {
                        symbol: sourceToken.symbol,
                      })}
                  </Text>
                ) : isAmountZero ? (
                  <Text>
<<<<<<< HEAD
<<<<<<< HEAD
                    {!!destinationToken &&
                      balance !== null &&
                      strings('swaps.available_to_swap', {
                        asset: `${balance} ${destinationToken.symbol}`,
                      })}
                    {!isSwapsNativeAsset(destinationToken) && hasBalance && (
=======
                    {!!sourceToken &&
=======
                    {!!destinationToken &&
>>>>>>> 6d5f5782... feat: bridge ui
                      balance !== null &&
                      strings('swaps.available_to_swap', {
                        asset: `${balance} ${destinationToken.symbol}`,
                      })}
<<<<<<< HEAD
                    {!isSwapsNativeAsset(sourceToken) && hasBalance && (
>>>>>>> 59f329c5... wip: swap view
=======
                    {!isSwapsNativeAsset(destinationToken) && hasBalance && (
>>>>>>> 6d5f5782... feat: bridge ui
                      <Text style={styles.linkText} onPress={handleUseMax}>
                        {' '}
                        {strings('swaps.use_max')}
                      </Text>
                    )}
                  </Text>
                ) : (
<<<<<<< HEAD
<<<<<<< HEAD
                  <Text upper>
                    {currencyAmount ? `~${currencyAmount}` : ''}
                  </Text>
=======
                  <Text upper>{currencyAmount ? `~${currencyAmount}` : ''}</Text>
>>>>>>> 59f329c5... wip: swap view
=======
                  <Text upper>
                    {currencyAmount ? `~${currencyAmount}` : ''}
                  </Text>
>>>>>>> 6e5e0448... chore: swap ui
                ))}
            </TouchableOpacity>
          </View>

          <View style={styles.tokenButtonContainer}>
            <TokenSelectModal
              isVisible={isDestinationModalVisible}
              dismiss={toggleDestinationModal}
              title={strings('swaps.convert_to')}
              tokens={swapsTokens}
              initialTokens={[
                swapsUtils.getNativeSwapsToken(chainId),
                ...tokensTopAssets
                  .slice(0, MAX_TOP_ASSETS)
                  .filter(
                    (asset) =>
                      asset.address !==
                      swapsUtils.getNativeSwapsToken(chainId).address,
                  ),
              ]}
              onItemPress={handleDestinationTokenPress}
              excludeAddresses={[sourceToken?.address]}
            />
          </View>
          <View>
            {Boolean(destinationToken) &&
              !isSwapsNativeAsset(destinationToken) ? (
              destinationTokenHasEnoughOcurrances ? (
                <TouchableOpacity
                  onPress={explorer.isValid ? handleVerifyPress : undefined}
                  style={styles.verifyToken}
                >
                  <Text small centered>
                    <Text reset bold>
                      {strings('swaps.verified_on_sources', {
                        sources: destinationToken.occurrences,
                      })}
                    </Text>
                    {` ${strings('swaps.verify_on')} `}
                    {explorer.isValid ? (
                      <Text reset link>
                        {explorer.name}
                      </Text>
                    ) : (
                      strings('swaps.a_block_explorer')
                    )}
                    .
                  </Text>
                </TouchableOpacity>
              ) : (
                <ActionAlert
                  type={
                    !destinationToken.occurances ||
                      isDynamicToken(destinationToken)
                      ? AlertType.Error
                      : AlertType.Warning
                  }
                  style={styles.tokenAlert}
                  action={
                    hasDismissedTokenAlert ? null : strings('swaps.continue')
                  }
                  onPress={handleDimissTokenAlert}
                  onInfoPress={toggleTokenVerificationModal}
                >
                  {(textStyle) => (
                    <TouchableOpacity
                      onPress={explorer.isValid ? handleVerifyPress : undefined}
                    >
                      <Text style={textStyle} bold centered>
                        {!destinationToken.occurrences ||
                          isDynamicToken(destinationToken)
                          ? strings('swaps.added_manually', {
                            symbol: destinationToken.symbol,
                            // eslint-disable-next-line no-mixed-spaces-and-tabs
                          })
                          : strings('swaps.only_verified_on', {
                            symbol: destinationToken.symbol,
                            occurrences: destinationToken.occurrences,
                            // eslint-disable-next-line no-mixed-spaces-and-tabs
                          })}
                      </Text>
                      {!destinationToken.occurrences ||
                        isDynamicToken(destinationToken) ? (
                        <Text style={textStyle} centered>
                          {`${strings('swaps.verify_this_token_on')} `}
                          {explorer.isValid ? (
                            <Text reset link>
                              {explorer.name}
                            </Text>
                          ) : (
                            strings('swaps.a_block_explorer')
                          )}
                          {` ${strings('swaps.make_sure_trade')}`}
                        </Text>
                      ) : (
                        <Text style={textStyle} centered>
                          {`${strings('swaps.verify_address_on')} `}
                          {explorer.isValid ? (
                            <Text reset link>
                              {explorer.name}
                            </Text>
                          ) : (
                            strings('swaps.a_block_explorer')
                          )}
                          .
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </ActionAlert>
              )
            ) : (
              <Text> </Text>
            )}
          </View>

          <View
            style={[
              styles.horizontalRuleContainer,
              disabledView && styles.disabled,
            ]}
            pointerEvents={disabledView ? 'none' : 'auto'}
          >
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6e5e0448... chore: swap ui
            <TouchableOpacity
              style={styles.flipButton}
              onPress={handleFlipTokens}
            >
              <IonicIcon style={styles.arrowDown} name="ios-swap" />
<<<<<<< HEAD
=======
            <TouchableOpacity style={styles.flipButton} onPress={handleFlipTokens}>
              <IonicIcon style={styles.arrowDown} name="md-arrow-down" />
>>>>>>> 59f329c5... wip: swap view
=======
>>>>>>> 6e5e0448... chore: swap ui
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[styles.keypad, disabledView && styles.disabled]}
          pointerEvents={disabledView ? 'none' : 'auto'}
        >
          <View style={styles.ctaContainer}>
            <StyledButton
              type="blue"
              onPress={handleGetQuotesPress}
              containerStyle={styles.cta}
              disabled={
                isInitialLoadingTokens ||
                !sourceToken ||
                !destinationToken ||
                hasInvalidDecimals ||
                isAmountZero
              }
            >
              {strings('swaps.get_quotes')}
            </StyledButton>
          </View>
          <View style={styles.providerContainer}>
            <Text style={styles.swapDetailTitle}>{'Provider'}</Text>
<<<<<<< HEAD
<<<<<<< HEAD
            <Icon name="arrow-right" size={18} style={styles.caretDown}></Icon>
          </View>

          <TouchableOpacity
            style={styles.providerContainer}
            onPress={toggleSlippageModal}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            disabled={isDirectWrapping}
          >
            <Text style={styles.swapDetailTitle}>{'Slippage'}</Text>
            <Text style={styles.swapDetailTitle}>{`${slippage}%`}</Text>
          </TouchableOpacity>

=======
            <Icon name="arrow-right" size={18} style={styles.caretDown} ></Icon>
          </View>

>>>>>>> 59f329c5... wip: swap view
=======
            <Icon name="arrow-right" size={18} style={styles.caretDown}></Icon>
          </View>

          <TouchableOpacity
            style={styles.providerContainer}
            onPress={toggleSlippageModal}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            disabled={isDirectWrapping}
          >
            <Text style={styles.swapDetailTitle}>{'Slippage'}</Text>
            <Text style={styles.swapDetailTitle}>{`${slippage}%`}</Text>
          </TouchableOpacity>

>>>>>>> 6e5e0448... chore: swap ui
          <View style={styles.swapDetailContainer}>
            <View style={styles.swapDetailItemContainer}>
              <Text style={styles.swapDetailTitle}>{'Provider Fee'}</Text>
              <Text style={styles.swapDetailTitle}>{'0.1'}</Text>
            </View>
            <View style={styles.swapDetailItemContainer}>
              <Text style={styles.swapDetailTitle}>{'Price Impact'}</Text>
              <Text style={styles.swapDetailTitle}>{'0.1%'}</Text>
            </View>
            <View style={styles.swapDetailItemContainer}>
              <Text style={styles.swapDetailTitle}>{'Routing'}</Text>
              <Text style={styles.swapDetailTitle}>{''}</Text>
            </View>
          </View>
<<<<<<< HEAD
<<<<<<< HEAD
          {/* <AnimatableView ref={keypadViewRef}>
=======
          <AnimatableView ref={keypadViewRef}>
>>>>>>> 59f329c5... wip: swap view
=======
          {/* <AnimatableView ref={keypadViewRef}>
>>>>>>> 6e5e0448... chore: swap ui
            <Keypad
              onChange={handleKeypadChange}
              value={amount}
              currency="native"
            />
<<<<<<< HEAD
<<<<<<< HEAD
          </AnimatableView> */}
          {/* <View style={styles.buttonsContainer}>
=======
          </AnimatableView>

          <View style={styles.buttonsContainer}>
>>>>>>> 59f329c5... wip: swap view
=======
          </AnimatableView> */}
          {/* <View style={styles.buttonsContainer}>
>>>>>>> 6e5e0448... chore: swap ui
            <View style={styles.column}>
              <TouchableOpacity
                onPress={toggleSlippageModal}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                disabled={isDirectWrapping}
              >
                <Text bold link={!isDirectWrapping}>
                  {strings('swaps.max_slippage_amount', {
                    slippage: `${slippage}%`,
                  })}
                </Text>
              </TouchableOpacity>
            </View>
<<<<<<< HEAD
<<<<<<< HEAD
          </View> */}
=======
          </View>
>>>>>>> 59f329c5... wip: swap view
=======
          </View> */}
>>>>>>> 6e5e0448... chore: swap ui
        </View>
        <InfoModal
          isVisible={isTokenVerificationModalVisisble}
          toggleModal={toggleTokenVerificationModal}
          title={strings('swaps.token_verification')}
          body={
            <Text>
              {strings('swaps.token_multiple')}
              {` ${strings('swaps.token_check')} `}
              {explorer.isValid ? (
                <Text reset link onPress={handleVerifyPress}>
                  {explorer.name}
                </Text>
              ) : (
                strings('swaps.a_block_explorer')
              )}
              {` ${strings('swaps.token_to_verify')}`}
            </Text>
          }
        />
        <SlippageModal
          isVisible={isSlippageModalVisible}
          dismiss={toggleSlippageModal}
          onChange={handleSlippageChange}
          slippage={slippage}
        />
      </ScreenView>
    </View>
  );
}

SwapsAmountView.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SwapsAmountView);
