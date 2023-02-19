import React, { PureComponent, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  InteractionManager,
  Image,
  RefreshControl,
} from 'react-native';
import TokenImage from '../TokenImage';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import ActionSheet from 'react-native-actionsheet';
import {
  renderFromTokenMinimalUnit,
  balanceToFiat,
} from '../../../util/number';
import Engine from '../../../core/Engine';
import Logger from '../../../util/Logger';
import AssetElement from '../AssetElement';
import { connect } from 'react-redux';
import { safeToChecksumAddress } from '../../../util/address';
import Analytics from '../../../core/Analytics/Analytics';
import AnalyticsV2 from '../../../util/analyticsV2';
import NetworkMainAssetLogo from '../NetworkMainAssetLogo';
import { getTokenList } from '../../../reducers/tokens';
import { isZero } from '../../../util/lodash';
import { ThemeContext, mockTheme, useTheme } from '../../../util/theme';
import Text from '../../Base/Text';
import NotificationManager from '../../../core/NotificationManager';
import { getDecimalChainId, isTestNet } from '../../../util/networks';
import BalanceFrame from '../../screens/Wallet/components/BalanceFrame';
import { SearchBar } from '../../screens/Dapps/SearchBar';
import { icons, images } from '../../../assets';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { toLowerCaseEquals, toLowerCaseIncludes } from '../../../util/general';

interface ISumoTokenProp {
  /**
   * Network provider chain id
   */
  chainId: PropTypes.string;
  /**
   * Array of assets (in this case ERC20 tokens)
   */
  tokens: PropTypes.array;
  /**
   * Object containing token balances in the format address => balance
   */
  tokenBalances: PropTypes.object;

  selectedAddress: PropTypes.number;
  // identities: PropTypes.object;
  accounts: PropTypes.object;
  /**
   * ETH to current currency conversion rate
   */
  conversionRate: PropTypes.number;
  /**
   * Currency code of the currently-active currency
   */
  currentCurrency: PropTypes.string;

  /**
   * Object containing token exchange rates in the format address => exchangeRate
   */
  tokenExchangeRates: PropTypes.object;
  /**
   * Array of transactions
   */
  transactions: PropTypes.array;
  /**
   * Primary currency, either ETH or Fiat
   */
  primaryCurrency: PropTypes.string;
  /**
   * A bool that represents if the user wants to hide zero balance token
   */
  hideZeroBalanceTokens: PropTypes.bool;
  /**
   * List of tokens from TokenListController
   */
  tokenList: PropTypes.object;
  /**
   * List of detected tokens from TokensController
   */
  detectedTokens: PropTypes.array;
  /**
   * Boolean that indicates if token detection is enabled
   */
  isTokenDetectionEnabled: PropTypes.bool;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      minHeight: 600,
    },
    wrapperTokens: {
      flex: 1,
      backgroundColor: colors.box.default,
    },
    emptyView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
    },
    emptyImage: {
      width: 130,
      height: 130,
    },
    containerSearchBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.box.default,
      marginTop: 8,
    },
    containerSetting: {
      justifyContent: 'center',
      marginRight: 16,
    },
    containerIcon: {
      padding: 12,
      backgroundColor: colors.search.default,
      borderRadius: 40,
    },
    icon: {
      width: 20,
      height: 20,
    },
    text: {
      fontSize: 20,
      color: colors.text.default,
      ...fontStyles.normal,
    },
    add: {
      marginTop: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addText: {
      fontSize: 14,
      color: colors.text.default,
      ...fontStyles.normal,
    },
    tokensDetectedButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    tokensDetectedText: {
      fontSize: 14,
      ...fontStyles.normal,
      color: colors.text.default,
    },
    footer: {
      flex: 1,
      paddingBottom: 30,
      alignItems: 'center',
      backgroundColor: colors.background.walletBody,
    },
    balances: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 0.4,
      borderBottomColor: colors.border.default,
    },
    balanceSymbol: {
      fontWeight: '500',
    },
    balance: {
      fontSize: 16,
      ...fontStyles.normal,
      textTransform: 'uppercase',
      color: colors.text.default,
      fontWeight: '500',
    },
    testNetBalance: {
      fontSize: 16,
      ...fontStyles.normal,
      color: colors.text.default,
    },
    balanceFiat: {
      fontSize: 14,
      ...fontStyles.normal,
      textTransform: 'uppercase',
      color: colors.text.default,
      fontWeight: '500',
    },
    balanceFiatTokenError: {
      textTransform: 'capitalize',
    },
    ethLogo: {
      width: 40,
      height: 40,
      borderRadius: 25,
      overflow: 'hidden',
      marginRight: 16,
    },
    emptyText: {
      marginBottom: 8,
      marginTop: 8,
      fontSize: 14,
      color: colors.text.alternative,
    },
    iconManageToken: {
      width: 16,
      height: 16,
      marginRight: 4,
      tintColor: colors.text.alternative,
    },
    containerList: {
      flexGrow: 1,
      backgroundColor: colors.background.walletHeader,
    },
  });

/**
 * View that renders a list of ERC-20 Tokens
 */
const SumoTokens = ({
  chainId,
  tokens,
  tokenBalances,
  selectedAddress,
  // identities,
  accounts,
  conversionRate,
  currentCurrency,
  tokenExchangeRates,
  transactions,
  primaryCurrency,
  hideZeroBalanceTokens,
  tokenList,
  detectedTokens,
  isTokenDetectionEnabled,
}: ISumoTokenProp) => {
  // static propTypes = {
  //   /**
  //    * Navigation object required to push
  //    * the Asset detail view
  //    */
  //   navigation: PropTypes.object,
  //   /**
  //    * Array of assets (in this case ERC20 tokens)
  //    */
  //   tokens: PropTypes.array,
  //   /**
  //    * Network provider chain id
  //    */
  //   chainId: PropTypes.string,
  //   /**
  //    * ETH to current currency conversion rate
  //    */
  //   conversionRate: PropTypes.number,
  //   /**
  //    * Currency code of the currently-active currency
  //    */
  //   currentCurrency: PropTypes.string,
  //   /**
  //    * Object containing token balances in the format address => balance
  //    */
  //   tokenBalances: PropTypes.object,
  //   /**
  //    * Object containing token exchange rates in the format address => exchangeRate
  //    */
  //   tokenExchangeRates: PropTypes.object,
  //   /**
  //    * Array of transactions
  //    */
  //   transactions: PropTypes.array,
  //   /**
  //    * Primary currency, either ETH or Fiat
  //    */
  //   primaryCurrency: PropTypes.string,
  //   /**
  //    * A bool that represents if the user wants to hide zero balance token
  //    */
  //   hideZeroBalanceTokens: PropTypes.bool,
  //   /**
  //    * List of tokens from TokenListController
  //    */
  //   tokenList: PropTypes.object,
  //   /**
  //    * List of detected tokens from TokensController
  //    */
  //   detectedTokens: PropTypes.array,
  //   /**
  //    * Boolean that indicates if token detection is enabled
  //    */
  //   isTokenDetectionEnabled: PropTypes.bool,
  //   selectedAddress: PropTypes.number,
  //   identities: PropTypes.object,
  //   accounts: PropTypes.object,
  // };

  const { colors, themeAppearance } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();

  const actionSheet = useRef(null);

  const [tokenToRemove, setTokenToRemove] = useState(null);
  const [isAddTokenEnabled, setAddTokenEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  // getStyles = () => {
  //   const colors = this.context.colors || mockTheme.colors;
  //   const styles = createStyles(colors);
  //   return styles;
  // };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyView}>
        <Image style={styles.emptyImage} source={images.imageEmptyView}></Image>
        <Text style={styles.text}>{strings('wallet.no_tokens')}</Text>
      </View>
    );
  };

  const onItemPress = (token: any) => {
    navigation.navigate('Asset', {
      ...token,
      transactions: transactions,
    });
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer} key={'tokens-footer'}>
        <Text style={styles.emptyText}>
          {strings('wallet.no_available_tokens')}
        </Text>
        <TouchableOpacity
          style={styles.add}
          onPress={goToAddToken}
          disabled={!isAddTokenEnabled}
          testID={'add-token-button'}
        >
          <Image source={icons.iconSetting} style={styles.iconManageToken} />
          <Text style={styles.addText}>{strings('wallet.add_tokens')}</Text>
        </TouchableOpacity>
        <View style={{ height: 600 }}></View>
      </View>
    );
  };

  const renderItem = (asset) => {
    const itemAddress = safeToChecksumAddress(asset.address);
    const logo = tokenList?.[itemAddress?.toLowerCase?.()]?.iconUrl;
    const exchangeRate =
      itemAddress in tokenExchangeRates
        ? tokenExchangeRates[itemAddress]
        : undefined;
    const balance =
      asset.balance ||
      (itemAddress in tokenBalances
        ? renderFromTokenMinimalUnit(tokenBalances[itemAddress], asset.decimals)
        : 0);
    const balanceFiat =
      asset.balanceFiat ||
      balanceToFiat(balance, conversionRate, exchangeRate, currentCurrency);
    const balanceValue = `${balance}`;

    // render balances according to primary currency
    let mainBalance, secondaryBalance;
    if (primaryCurrency === 'ETH') {
      mainBalance = balanceValue;
      secondaryBalance = balanceFiat;
    } else {
      mainBalance = !balanceFiat ? balanceValue : balanceFiat;
      secondaryBalance = !balanceFiat ? balanceFiat : balanceValue;
    }

    if (asset?.balanceError) {
      mainBalance = asset.symbol;
      secondaryBalance = strings('wallet.unable_to_load');
    }

    asset = { logo, ...asset, balance, balanceFiat };
    return (
      <AssetElement
        key={itemAddress || '0x'}
        testID={'asset'}
        onPress={onItemPress}
        onLongPress={asset.isETH ? null : showRemoveMenu}
        asset={asset}
      >
        {asset.isETH ? (
          <NetworkMainAssetLogo
            big
            style={styles.ethLogo}
            testID={'eth-logo'}
          />
        ) : (
          <TokenImage asset={asset} containerStyle={styles.ethLogo} />
        )}

        <View style={styles.balances} testID={'balance'}>
          <View>
            <Text
              style={[
                isTestNet(chainId) ? styles.testNetBalance : styles.balance,
                styles.balanceSymbol,
              ]}
            >
              {asset.symbol}
            </Text>
            <Text
              style={
                isTestNet(chainId) ? styles.testNetBalance : styles.balance
              }
            >
              {mainBalance}
            </Text>
          </View>

          {secondaryBalance ? (
            <Text
              style={[
                styles.balanceFiat,
                asset?.balanceError && styles.balanceFiatTokenError,
              ]}
            >
              {secondaryBalance}
            </Text>
          ) : null}
        </View>
      </AssetElement>
    );
  };

  const goToBuy = () => {
    navigation.navigate('FiatOnRampAggregator');
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEventWithParameters(
        AnalyticsV2.ANALYTICS_EVENTS.BUY_BUTTON_CLICKED,
        {
          text: 'Buy Native Token',
          location: 'Home Screen',
          chain_id_destination: chainId,
        },
      );
    });
  };

  const showDetectedTokens = () => {
    const { NetworkController } = Engine.context;
    // const { detectedTokens } = this.props;
    navigation.navigate('DetectedTokens');
    InteractionManager.runAfterInteractions(() => {
      AnalyticsV2.trackEvent(
        AnalyticsV2.ANALYTICS_EVENTS.TOKEN_IMPORT_CLICKED,
        {
          source: 'detected',
          chain_id: getDecimalChainId(
            NetworkController?.state?.provider?.chainId,
          ),
          tokens: detectedTokens.map(
            (token) => `${token.symbol} - ${token.address}`,
          ),
        },
      );
      setAddTokenEnabled(true);
    });
  };

  const renderTokensDetectedSection = () => {
    if (!isTokenDetectionEnabled || !detectedTokens?.length) {
      return null;
    }
    // return <TokenItem token={}/>

    return (
      <TouchableOpacity
        style={styles.tokensDetectedButton}
        onPress={showDetectedTokens}
      >
        <Text style={styles.tokensDetectedText}>
          {strings('wallet.tokens_detected_in_account', {
            tokenCount: detectedTokens.length,
            tokensLabel: detectedTokens.length > 1 ? 'tokens' : 'token',
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const {
      TokenDetectionController,
      CollectibleDetectionController,
      AccountTrackerController,
      CurrencyRateController,
      TokenRatesController,
    }: any = Engine.context;
    const actions = [
      TokenDetectionController.detectTokens(),
      CollectibleDetectionController.detectCollectibles(),
      AccountTrackerController.refresh(),
      CurrencyRateController.start(),
      TokenRatesController.poll(),
    ];
    await Promise.all(actions);
    setRefreshing(false);
  };

  const renderWallet = () => {
    return (
      <View>
        <BalanceFrame
          account={selectedAddress}
          selectedAddress={selectedAddress}
          orderedAccounts={accounts}
        />
        <View style={styles.containerSearchBar}>
          <SearchBar
            value={searchText}
            style={{ width: 280 }}
            placeholder={'Search...'}
            onInputSubmit={setSearchText}
          />
          <View style={styles.containerSetting}>
            <TouchableOpacity style={styles.containerIcon}>
              <Image source={icons.iconSetting} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderList = () => {
    // const { tokens, hideZeroBalanceTokens, tokenBalances } = this.props;
    const tokensToDisplay = hideZeroBalanceTokens
      ? tokens.filter((token: any) => {
        const { address, isETH } = token;
        return !isZero(tokenBalances[address]) || isETH;
      })
      : tokens;
    const filteredTokens =
      searchText.length > 0
        ? tokensToDisplay.filter((token: any) => {
          const { address, symbol } = token;
          return (
            toLowerCaseIncludes(symbol, searchText) ||
            toLowerCaseIncludes(address, searchText)
          );
        })
        : tokensToDisplay;
    return (
      <View style={styles.containerList}>
        <FlatList
          data={filteredTokens}
          renderItem={({ item }) => renderItem(item)}
          ListHeaderComponent={renderWallet()}
          ListFooterComponent={renderFooter()}
          refreshControl={
            <RefreshControl
              colors={[colors.primary.default]}
              tintColor={colors.primary.default}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={renderEmpty}
        />
        {renderTokensDetectedSection()}
      </View>
    );
  };

  const goToAddToken = () => {
    const { NetworkController }: any = Engine.context;
    setAddTokenEnabled(false);
    navigation.push('AddAsset', { assetType: 'token' });
    InteractionManager.runAfterInteractions(() => {
      AnalyticsV2.trackEvent(
        AnalyticsV2.ANALYTICS_EVENTS.TOKEN_IMPORT_CLICKED,
        {
          source: 'manual',
          chain_id: getDecimalChainId(
            NetworkController?.state?.provider?.chainId,
          ),
        },
      );
      setAddTokenEnabled(true);
    });
  };

  const showRemoveMenu = (token) => {
    setTokenToRemove(token);
    actionSheet?.current.show();
  };

  const removeToken = async () => {
    const { TokensController, NetworkController }: any = Engine.context;
    const tokenAddress = tokenToRemove?.address;
    const symbol = tokenToRemove?.symbol;
    try {
      await TokensController.ignoreTokens([tokenAddress]);
      NotificationManager.showSimpleNotification({
        status: `simple_notification`,
        duration: 5000,
        title: strings('wallet.token_toast.token_hidden_title'),
        description: strings('wallet.token_toast.token_hidden_desc', {
          tokenSymbol: symbol,
        }),
      });
      InteractionManager.runAfterInteractions(() =>
        AnalyticsV2.trackEvent(AnalyticsV2.ANALYTICS_EVENTS.TOKENS_HIDDEN, {
          location: 'assets_list',
          token_standard: 'ERC20',
          asset_type: 'token',
          tokens: [`${symbol} - ${tokenAddress}`],
          chain_id: getDecimalChainId(
            NetworkController?.state?.provider?.chainId,
          ),
        }),
      );
    } catch (err) {
      Logger.log(err, 'Wallet: Failed to hide token!');
    }
  };

  const onActionSheetPress = (index) => (index === 0 ? removeToken() : null);

  return (
    <View style={styles.wrapper} testID={'tokens'}>
      {renderList()}
      <ActionSheet
        ref={actionSheet}
        title={strings('wallet.remove_token_title')}
        options={[strings('wallet.remove'), strings('wallet.cancel')]}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        onPress={onActionSheetPress}
        theme={themeAppearance}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  chainId: state.engine.backgroundState.NetworkController.provider.chainId,
  currentCurrency:
    state.engine.backgroundState.CurrencyRateController.currentCurrency,
  conversionRate:
    state.engine.backgroundState.CurrencyRateController.conversionRate,
  primaryCurrency: state.settings.primaryCurrency,
  tokenBalances:
    state.engine.backgroundState.TokenBalancesController.contractBalances,
  tokenExchangeRates:
    state.engine.backgroundState.TokenRatesController.contractExchangeRates,
  hideZeroBalanceTokens: state.settings.hideZeroBalanceTokens,
  tokenList: getTokenList(state),
  selectedAddress:
    state.engine.backgroundState.PreferencesController.selectedAddress,
  detectedTokens: state.engine.backgroundState.TokensController.detectedTokens,
  isTokenDetectionEnabled:
    state.engine.backgroundState.PreferencesController.useTokenDetection,
  // identities: state.engine.backgroundState.PreferencesController.identities,
  accounts: state.engine.backgroundState.AccountTrackerController.accounts,
});

SumoTokens.contextType = ThemeContext;

export default connect(mapStateToProps)(SumoTokens);
