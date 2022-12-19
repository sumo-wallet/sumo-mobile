import React, {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
<<<<<<< HEAD
  FlatList,
  StyleSheet,
  TouchableOpacity,
=======
  StyleSheet,
>>>>>>> 59f329c5... wip: swap view
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View as AnimatableView } from 'react-native-animatable';

import {
  setSwapsLiveness,
} from '../../../reducers/swaps';
import Device from '../../../util/device';
import Text from '../../Base/Text';
import ScreenView from '../FiatOrders/components/ScreenView';
import { useTheme } from '../../../util/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
<<<<<<< HEAD
import FastImage from 'react-native-fast-image';
import { images } from '../../../assets';
=======
>>>>>>> 59f329c5... wip: swap view

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
<<<<<<< HEAD
    providerContainer: {
      padding: 10,
=======
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
      fontSize: Device.isIphone5() ? 30 : 40,
      height: Device.isIphone5() ? 40 : 50,
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
      left: '46%',
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
      padding: 10,
      height: 60,
>>>>>>> 59f329c5... wip: swap view
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.box.default,
      borderRadius: 10,
<<<<<<< HEAD
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
  },
  {
    logo: 'https://styles.redditmedia.com/t5_261gdr/styles/communityIcon_u34qachuimz31.png',
    name: 'MEXC',
    description: 'Spot, future trading',
  },
  {
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/16334.png',
    name: 'ApolloX',
    description: 'Future trading DEX',
  }
]

=======
      marginHorizontal: 10,
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
    }
  });

>>>>>>> 59f329c5... wip: swap view
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
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={{ flex: 1 }}>
<<<<<<< HEAD
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
          )
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={styles.providerContainer}>
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
          )
        }}
      ></FlatList>
=======
      <ScreenView
        style={styles.container}
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
        vertical
        automaticallyAdjustContentInsets={false}
      >
        <View
          style={[styles.keypad]}
        >
          <View style={styles.providerContainer}>
            <Text style={styles.swapDetailTitle}>{'Provider'}</Text>
            <Icon name="share" size={18} style={styles.caretDown} ></Icon>
          </View>
        </View>
      </ScreenView>
>>>>>>> 59f329c5... wip: swap view
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
