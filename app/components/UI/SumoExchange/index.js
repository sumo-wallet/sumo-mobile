import React, {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View as AnimatableView } from 'react-native-animatable';

import {
  setSwapsLiveness,
} from '../../../reducers/swaps';
import Text from '../../Base/Text';
import { useTheme } from '../../../util/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import { images } from '../../../assets';
import { createNewTab, openDapp } from '../../../actions/browser';
import { ROUTES } from '../../../navigation/routes';

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
    providerContainer: {
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.box.default,
      borderRadius: 10,
      paddingVertical: 10,
      marginHorizontal: 10,
      marginVertical: 4,
    },
    swapDetailTitle: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.text.default,
    },
    swapDetailDescription: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.muted,
    },
    headerContainer: {
      flex: 1,
      height: 200,
      padding: 10,
      marginVertical: 20,
      flexDirection: 'column',
      alignItems: 'center',
    },
    logo: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    cryptoAsset: {
      width: 200,
      height: 200,
    }
  });

const EXCHANGE = [
  {
    logo: 'https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png',
    name: 'Binance',
    description: 'Spot, future & saving, KYC required',
    url: 'https://accounts.binance.com/en/register',
  },
  {
    logo: 'https://styles.redditmedia.com/t5_261gdr/styles/communityIcon_u34qachuimz31.png',
    name: 'MEXC',
    description: 'Spot, future trading',
    url: 'https://www.m.mexc.com/',
  },
  {
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/16334.png',
    name: 'ApolloX',
    description: 'Future trading DEX',
    url: 'https://www.apollox.finance/en',
  },
];

function SumoExchangeView({
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
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const openDappBrowser = (dapp) => {
    dispatch(createNewTab(dapp?.url, dapp));
    dispatch(openDapp({ dapp }));
    navigation.navigate(ROUTES.BrowserTabHome, { dapp });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={EXCHANGE}
        ListHeaderComponent={() => {
          return (
            <View style={styles.headerContainer}>
              <FastImage
                source={images.imageCryptoAsset}
                style={styles.cryptoAsset}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </View>
          );
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={styles.providerContainer} onPress={() => {
              openDappBrowser(item);
            }}>
              <FastImage
                source={{ uri: item.logo }}
                style={styles.logo}
                resizeMode={FastImage.resizeMode.stretch}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.swapDetailTitle}>{item.name}</Text>
                <Text style={styles.swapDetailDescription}>{item.description}</Text>
              </View>
              <Icon name="share" size={18} style={styles.caretDown} ></Icon>
            </TouchableOpacity>
          );
        }}
      ></FlatList>
    </View>
  );
}

SumoExchangeView.propTypes = {
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
  currentCurrency:
    state.engine.backgroundState.CurrencyRateController.currentCurrency,
  provider: state.engine.backgroundState.NetworkController.provider,
});

const mapDispatchToProps = (dispatch) => ({
  setLiveness: (liveness, chainId) =>
    dispatch(setSwapsLiveness(liveness, chainId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SumoExchangeView);
