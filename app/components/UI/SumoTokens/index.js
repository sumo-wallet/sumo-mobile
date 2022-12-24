import React, { PureComponent } from 'react';
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
import { ThemeContext, mockTheme } from '../../../util/theme';
import Text from '../../Base/Text';
import NotificationManager from '../../../core/NotificationManager';
import { getDecimalChainId, isTestNet } from '../../../util/networks';
import BalanceFrame from '../../screens/Wallet/components/BalanceFrame';
import { SearchBar } from '../../screens/Dapps/SearchBar';
import { icons } from '../../../assets';
import { FlatList } from 'react-native-gesture-handler';

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
    containerSearchBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.box.default,
    },
    containerSetting: {
      justifyContent: 'center',
      marginRight: 16,
    },
    containerIcon: {
      padding: 12,
      backgroundColor: colors.background.alternativeHover,
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
      marginTop: 24,
    },
    balances: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
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
      fontSize: 14,
      color: colors.text.alternative,
    },
    iconManageToken: {
      width: 16,
      height: 16,
      marginRight: 4,
      tintColor: colors.text.alternative,
    },
  });

/**
 * View that renders a list of ERC-20 Tokens
 */
class SumoTokens extends PureComponent {
  static propTypes = {
    /**
     * Navigation object required to push
     * the Asset detail view
     */
    navigation: PropTypes.object,
    /**
     * Array of assets (in this case ERC20 tokens)
     */
    tokens: PropTypes.array,
    /**
     * Network provider chain id
     */
    chainId: PropTypes.string,
    /**
     * ETH to current currency conversion rate
     */
    conversionRate: PropTypes.number,
    /**
     * Currency code of the currently-active currency
     */
    currentCurrency: PropTypes.string,
    /**
     * Object containing token balances in the format address => balance
     */
    tokenBalances: PropTypes.object,
    /**
     * Object containing token exchange rates in the format address => exchangeRate
     */
    tokenExchangeRates: PropTypes.object,
    /**
     * Array of transactions
     */
    transactions: PropTypes.array,
    /**
     * Primary currency, either ETH or Fiat
     */
    primaryCurrency: PropTypes.string,
    /**
     * A bool that represents if the user wants to hide zero balance token
     */
    hideZeroBalanceTokens: PropTypes.bool,
    /**
     * List of tokens from TokenListController
     */
    tokenList: PropTypes.object,
    /**
     * List of detected tokens from TokensController
     */
    detectedTokens: PropTypes.array,
    /**
     * Boolean that indicates if token detection is enabled
     */
    isTokenDetectionEnabled: PropTypes.bool,
    selectedAddress: PropTypes.number,
    identities: PropTypes.object,
    accounts: PropTypes.object,
  };

  actionSheet = null;

  tokenToRemove = null;

  state = {
    isAddTokenEnabled: true,
    refreshing: false,
  };

  getStyles = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    return styles;
  };

  renderEmpty = () => {
    const styles = this.getStyles();

    return (
      <View style={styles.emptyView}>
        <Text style={styles.text}>{strings('wallet.no_tokens')}</Text>
      </View>
    );
  };

  onItemPress = (token) => {
    this.props.navigation.navigate('Asset', {
      ...token,
      transactions: this.props.transactions,
    });
  };

  renderFooter = () => {
    const styles = this.getStyles();

    return (
      <View style={styles.footer} key={'tokens-footer'}>
        <Text style={styles.emptyText}>
          {strings('wallet.no_available_tokens')}
        </Text>
        <TouchableOpacity
          style={styles.add}
          onPress={this.goToAddToken}
          disabled={!this.state.isAddTokenEnabled}
          testID={'add-token-button'}
        >
          <Image source={icons.iconSetting} style={styles.iconManageToken} />
          <Text style={styles.addText}>{strings('wallet.add_tokens')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderItem = (asset) => {
    const {
      conversionRate,
      currentCurrency,
      tokenBalances,
      tokenExchangeRates,
      primaryCurrency,
      tokenList,
      chainId,
    } = this.props;
    const styles = this.getStyles();

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
        onPress={this.onItemPress}
        onLongPress={asset.isETH ? null : this.showRemoveMenu}
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

  goToBuy = () => {
    this.props.navigation.navigate('FiatOnRampAggregator');
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEventWithParameters(
        AnalyticsV2.ANALYTICS_EVENTS.BUY_BUTTON_CLICKED,
        {
          text: 'Buy Native Token',
          location: 'Home Screen',
          chain_id_destination: this.props.chainId,
        },
      );
    });
  };

  showDetectedTokens = () => {
    const { NetworkController } = Engine.context;
    const { detectedTokens } = this.props;
    this.props.navigation.navigate('DetectedTokens');
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
      this.setState({ isAddTokenEnabled: true });
    });
  };

  renderTokensDetectedSection = () => {
    const { isTokenDetectionEnabled, detectedTokens } = this.props;
    const styles = this.getStyles();

    if (!isTokenDetectionEnabled || !detectedTokens?.length) {
      return null;
    }
    // return <TokenItem token={}/>

    return (
      <TouchableOpacity
        style={styles.tokensDetectedButton}
        onPress={this.showDetectedTokens}
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

  onRefresh = () => {
    requestAnimationFrame(async () => {
      this.setState({ refreshing: true });
      const {
        TokenDetectionController,
        CollectibleDetectionController,
        AccountTrackerController,
        CurrencyRateController,
        TokenRatesController,
      } = Engine.context;
      const actions = [
        TokenDetectionController.detectTokens(),
        CollectibleDetectionController.detectCollectibles(),
        AccountTrackerController.refresh(),
        CurrencyRateController.start(),
        TokenRatesController.poll(),
      ];
      await Promise.all(actions);
      this.setState({ refreshing: false });
    });
  };

  renderWallet() {
    const { selectedAddress, identities, accounts } = this.props;
    const account = {
      address: selectedAddress,
      ...identities[selectedAddress],
      ...accounts[selectedAddress],
    };
    const styles = this.getStyles();

    return (
      <View>
        <BalanceFrame
          account={selectedAddress}
          selectedAddress={selectedAddress}
          orderedAccounts={accounts}
        />
        <View style={styles.containerSearchBar}>
          <SearchBar
            style={{ width: 280 }}
            placeholder={'Search...'}
            onInputSubmit={(text) => { }}
          />
          <View style={styles.containerSetting}>
            <TouchableOpacity style={styles.containerIcon}>
              <Image source={icons.iconSetting} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderList() {
    const { tokens, hideZeroBalanceTokens, tokenBalances } = this.props;
    const tokensToDisplay = hideZeroBalanceTokens
      ? tokens.filter((token) => {
        const { address, isETH } = token;
        return !isZero(tokenBalances[address]) || isETH;
        // eslint-disable-next-line no-mixed-spaces-and-tabs
      })
      : tokens;
    const styles = this.getStyles();
    const colors = this.context.colors || mockTheme.colors;
    return (
      <View>
        {/* {this.renderWallet()}
        <View style={styles.wrapperTokens}>
          {tokensToDisplay.map((item) => this.renderItem(item))}
          {this.renderTokensDetectedSection()}
          {this.renderFooter()}
        </View> */}
        <FlatList
          data={tokensToDisplay}
          renderItem={({ item }) => this.renderItem(item)}
          ListHeaderComponent={this.renderWallet()}
          ListFooterComponent={this.renderFooter()}
          refreshControl={
            <RefreshControl
              colors={[colors.primary.default]}
              tintColor={colors.primary.default}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh()}
            />
          }
        />
        {this.renderTokensDetectedSection()}
      </View>
    );
  }

  goToAddToken = () => {
    const { NetworkController } = Engine.context;
    this.setState({ isAddTokenEnabled: false });
    this.props.navigation.push('AddAsset', { assetType: 'token' });
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
      this.setState({ isAddTokenEnabled: true });
    });
  };

  showRemoveMenu = (token) => {
    this.tokenToRemove = token;
    this.actionSheet.show();
  };

  removeToken = async () => {
    const { TokensController, NetworkController } = Engine.context;
    const tokenAddress = this.tokenToRemove?.address;
    const symbol = this.tokenToRemove?.symbol;
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

  createActionSheetRef = (ref) => {
    this.actionSheet = ref;
  };

  onActionSheetPress = (index) => (index === 0 ? this.removeToken() : null);

  render = () => {
    const { tokens } = this.props;
    const styles = this.getStyles();
    const themeAppearance = this.context.themeAppearance;

    return (
      <View style={styles.wrapper} testID={'tokens'}>
        {tokens && tokens.length ? this.renderList() : this.renderEmpty()}
        <ActionSheet
          ref={this.createActionSheetRef}
          title={strings('wallet.remove_token_title')}
          options={[strings('wallet.remove'), strings('wallet.cancel')]}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={this.onActionSheetPress}
          theme={themeAppearance}
        />
      </View>
    );
  };
}

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
  identities: state.engine.backgroundState.PreferencesController.identities,
  accounts: state.engine.backgroundState.AccountTrackerController.accounts,
});

SumoTokens.contextType = ThemeContext;

export default connect(mapStateToProps)(SumoTokens);
