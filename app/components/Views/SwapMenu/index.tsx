import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from 'react';
import {
  RefreshControl,
  ScrollView,
  InteractionManager,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DefaultTabBar from 'react-native-scrollable-tab-view/DefaultTabBar';
import { fontStyles, baseStyles } from '../../../styles/common';
import AccountOverview from '../../UI/AccountOverview';
import Tokens from '../../UI/Tokens';
import SwapsAmountView from '../../UI/SumoSwaps';
import SumoExchangeView from '../../UI/SumoExchange';
<<<<<<< HEAD
import BridgeView from '../../UI/SumoSwaps/BridgeView';

=======
>>>>>>> 59f329c5... wip: swap view
import { getWalletNavbarOptions } from '../../UI/Navbar';
import { strings } from '../../../../locales/i18n';
import { renderFromWei, weiToFiat, hexToBN } from '../../../util/number';
import Engine from '../../../core/Engine';
import CollectibleContracts from '../../UI/CollectibleContracts';
import Analytics from '../../../core/Analytics/Analytics';
import { ANALYTICS_EVENT_OPTS } from '../../../util/analytics';
import { getTicker } from '../../../util/transactions';
import OnboardingWizard from '../../UI/OnboardingWizard';
import ErrorBoundary from '../ErrorBoundary';
import { DrawerContext } from '../../Nav/Main/MainNavigator';
import { useTheme } from '../../../util/theme';
import { shouldShowWhatsNewModal } from '../../../util/onboarding';
import Logger from '../../../util/Logger';
import Routes from '../../../constants/navigation/Routes';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { icons } from '../../../assets';
import { toggleAccountsModal } from '../../../actions/modals';
// import { isDefaultAccountName } from '../../../util/ENSUtils';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    tabUnderlineStyle: {
      height: 2,
      backgroundColor: colors.primary.default,
      width: 60,
      marginHorizontal: 30,
    },
    tabStyle: {
      paddingBottom: 0,
    },
    tabBar: {
      borderColor: colors.border.muted,
    },
    textStyle: {
      fontSize: 16,
      ...(fontStyles.normal as any),
    },
    loader: {
      backgroundColor: colors.background.default,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerRight: {
      flexDirection: 'row',
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: colors.text.default,
    },
    iconQR: {
      width: 24,
      height: 24,
      tintColor: colors.text.default,
      marginLeft: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.default,
    },
    iconArrow: {
      width: 16,
      height: 16,
      marginLeft: 8,
      tintColor: colors.text.default,
    },
  });

/**
 * Main view for the wallet
 */
const SwapMenu = ({ navigation }: any) => {
  const { drawerRef } = useContext(DrawerContext);
  const [refreshing, setRefreshing] = useState(false);
  const accountOverviewRef = useRef(null);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  /**
   * Map of accounts to information objects including balances
   */
  const accounts = useSelector(
    (state: any) =>
      state.engine.backgroundState.AccountTrackerController.accounts,
  );
  /**
   * ETH to current currency conversion rate
   */
  const conversionRate = useSelector(
    (state: any) =>
      state.engine.backgroundState.CurrencyRateController.conversionRate,
  );
  /**
   * Currency code of the currently-active currency
   */
  const currentCurrency = useSelector(
    (state: any) =>
      state.engine.backgroundState.CurrencyRateController.currentCurrency,
  );
  /**
   * An object containing each identity in the format address => account
   */
  const identities = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.identities,
  );
  /**
   * A string that represents the selected address
   */
  const selectedAddress = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.selectedAddress,
  );
  /**
   * An array that represents the user tokens
   */
  const tokens = useSelector(
    (state: any) => state.engine.backgroundState.TokensController.tokens,
  );
  /**
   * Current provider ticker
   */
  const ticker = useSelector(
    (state: any) =>
      state.engine.backgroundState.NetworkController.provider.ticker,
  );
  /**
   * Current onboarding wizard step
   */
  const wizardStep = useSelector((state: any) => state.wizard.step);

  const { colors: themeColors } = useTheme();

  /**
   * Check to see if we need to show What's New modal
   */
  useEffect(() => {
    if (wizardStep > 0) {
      // Do not check since it will conflict with the onboarding wizard
      return;
    }
    const checkWhatsNewModal = async () => {
      try {
        const shouldShowWhatsNew = await shouldShowWhatsNewModal();
        if (shouldShowWhatsNew) {
          navigation.navigate(Routes.MODAL.ROOT_MODAL_FLOW, {
            screen: Routes.MODAL.WHATS_NEW,
          });
        }
      } catch (error) {
        Logger.log(error, "Error while checking What's New modal!");
      }
    };
    checkWhatsNewModal();
  }, [wizardStep, navigation]);

  useEffect(
    () => {
      requestAnimationFrame(async () => {
        const {
          TokenDetectionController,
          CollectibleDetectionController,
          AccountTrackerController,
        } = Engine.context as any;
        TokenDetectionController.detectTokens();
        CollectibleDetectionController.detectCollectibles();
        AccountTrackerController.refresh();
      });
    },
    /* eslint-disable-next-line */
    [navigation],
  );

  useEffect(() => {
    navigation.setOptions(
      getWalletNavbarOptions(
        'wallet.title',
        navigation,
        drawerRef,
        themeColors,
      ),
    );
    /* eslint-disable-next-line */
  }, [navigation, themeColors]);

  const onRefresh = useCallback(async () => {
    requestAnimationFrame(async () => {
      setRefreshing(true);
      const {
        TokenDetectionController,
        CollectibleDetectionController,
        AccountTrackerController,
        CurrencyRateController,
        TokenRatesController,
      } = Engine.context as any;
      const actions = [
        TokenDetectionController.detectTokens(),
        CollectibleDetectionController.detectCollectibles(),
        AccountTrackerController.refresh(),
        CurrencyRateController.start(),
        TokenRatesController.poll(),
      ];
      await Promise.all(actions);
      setRefreshing(false);
    });
  }, [setRefreshing]);

  const renderTabBar = useCallback(
    () => (
      <DefaultTabBar
        underlineStyle={styles.tabUnderlineStyle}
        activeTextColor={colors.text.default}
        inactiveTextColor={colors.text.muted}
        backgroundColor={colors.background.default}
        tabStyle={styles.tabStyle}
        textStyle={styles.textStyle}
        style={styles.tabBar}
      />
    ),
    [styles],
  );

  const onChangeTab = useCallback((obj) => {
    InteractionManager.runAfterInteractions(() => {
      if (obj.ref.props.tabLabel === strings('wallet.tokens')) {
        Analytics.trackEvent(ANALYTICS_EVENT_OPTS.WALLET_TOKENS);
      } else {
        Analytics.trackEvent(ANALYTICS_EVENT_OPTS.WALLET_COLLECTIBLES);
      }
    });
  }, []);

  const onRef = useCallback((ref) => {
    accountOverviewRef.current = ref;
  }, []);

  const renderContent = useCallback(() => {
    // const account = {
    //   address: selectedAddress,
    //   ...identities[selectedAddress],
    //   ...accounts[selectedAddress],
    // };
    let balance: any = 0;
    let assets = tokens;
    if (accounts[selectedAddress]) {
      balance = renderFromWei(accounts[selectedAddress].balance);
      assets = [
        {
          name: 'Ether', // FIXME: use 'Ether' for mainnet only, what should it be for custom networks?
          symbol: getTicker(ticker),
          isETH: true,
          balance,
          balanceFiat: weiToFiat(
            hexToBN(accounts[selectedAddress].balance) as any,
            conversionRate,
            currentCurrency,
          ),
          logo: '../images/eth-logo.png',
        },
        ...(tokens || []),
      ];
    } else {
      assets = tokens;
    }

    return (
      <View style={styles.wrapper}>
        <ScrollableTabView
          renderTabBar={renderTabBar}
          // eslint-disable-next-line react/jsx-no-bind
          onChangeTab={onChangeTab}
          style={{ flexGrow: 1 }}
        >
          <SwapsAmountView
            tabLabel={'Token'}
            key={'tokens-tab'}
            navigation={navigation}
            tokens={assets}
          />
<<<<<<< HEAD
          <BridgeView
=======
          <CollectibleContracts
>>>>>>> 59f329c5... wip: swap view
            tabLabel={'Bridge'}
            key={'nfts-tab'}
            navigation={navigation}
          />
          <SumoExchangeView
            tabLabel={'Exchange'}
            key={'exchange-tab'}
            navigation={navigation}
          />
        </ScrollableTabView>
        {/*<AccountOverview*/}
        {/*  account={account}*/}
        {/*  navigation={navigation}*/}
        {/*  onRef={onRef}*/}
        {/*/>*/}
      </View>
    );
  }, [
    renderTabBar,
    accounts,
    conversionRate,
    currentCurrency,
    identities,
    navigation,
    onChangeTab,
    onRef,
    selectedAddress,
    ticker,
    tokens,
    styles,
  ]);

  const renderLoader = useCallback(
    () => (
      <View style={styles.loader}>
        <ActivityIndicator size="small" />
      </View>
    ),
    [styles],
  );

  /**
   * Return current step of onboarding wizard if not step 5 nor 0
   */
  const renderOnboardingWizard = useCallback(
    () =>
      [1, 2, 3, 4].includes(wizardStep) && (
        <OnboardingWizard
          navigation={navigation}
          coachmarkRef={accountOverviewRef.current}
        />
      ),
    [navigation, wizardStep],
  );

  const account = {
    address: selectedAddress,
    ...identities[selectedAddress],
    ...accounts[selectedAddress],
  };

  const onAccountsModal = useCallback(() => {
    dispatch(toggleAccountsModal());
  }, [dispatch]);
  return (
    <ErrorBoundary view="Wallet">
      <DynamicHeader
        title={''}
        isHiddenTitle
        hideGoBack
        isShowAvatar
        address={selectedAddress}
        centerComponent={
          <TouchableOpacity
            style={styles.containerHeader}
            onPress={onAccountsModal}
          >
            <Text style={styles.title}>{account.name}</Text>
            <Image source={icons.iconChevronDown} style={styles.iconArrow} />
          </TouchableOpacity>
        }
      >
        <View style={styles.containerRight}>
          <TouchableOpacity onPress={() => { navigation.navigate(Routes.QR_SCANNER); }}>
<<<<<<< HEAD
<<<<<<< HEAD
            <Image source={icons.iconSlippage} style={styles.iconQR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate(Routes.QR_SCANNER); }}>
            <Image source={icons.iconHistory} style={styles.iconQR} />
=======
            <Image source={icons.iconArrowRefresh} style={styles.iconQR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate(Routes.QR_SCANNER); }}>
            <Image source={icons.iconArrowRefresh} style={styles.iconQR} />
>>>>>>> 59f329c5... wip: swap view
=======
            <Image source={icons.iconChart} style={styles.iconQR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate(Routes.QR_SCANNER); }}>
            <Image source={icons.iconHistory} style={styles.iconQR} />
>>>>>>> 7e3e051e... feat: swap exchange screen
          </TouchableOpacity>
        </View>
      </DynamicHeader>
      <View style={baseStyles.flexGrow} testID={'wallet-screen'}>
        {selectedAddress ? renderContent() : renderLoader()}
        {/* {renderOnboardingWizard()} */}
      </View>
    </ErrorBoundary>
  );
};

export default SwapMenu;
