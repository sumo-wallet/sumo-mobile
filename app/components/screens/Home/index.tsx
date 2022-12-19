import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../styles/common';
import { icons, images } from '../../../assets';
import { RawFeatureInterface } from './types';
import {
  Hot24hComponent,
} from './components/Hot24hComponent';
import FastImage from 'react-native-fast-image';
import { FavouriteComponent } from './components/FavouriteComponent';
import { DataNewsInterface, News } from './components/News';
import { strings } from '../../../../locales/i18n';
import { importAccountFromPrivateKey } from '../../../util/address';
import {
  renderFromWei,
  weiToFiat,
  hexToBN,
  renderFiat,
} from '../../../util/number';
import { getTicker } from '../../../util/transactions';
import DeeplinkManager from '../../../core/DeeplinkManager';
import AppConstants from '../../../core/AppConstants';
import { useNavigation } from '@react-navigation/native';
import Engine from '../../../core/Engine';
import { useDispatch, useSelector } from 'react-redux';
import { InformationFrame } from './components/InformationFrame';
import { DynamicHeader } from '../../Base/DynamicHeader';
import ClipboardManager from '../../../core/ClipboardManager';
import { showAlert } from '../../../actions/alert';
import Routes from '../../../constants/navigation/Routes';
import { useTheme } from '../../../util/theme';
import { useGetNews } from '../../hooks/useGetNews';
import { useGetTickers } from '../../hooks/useGetTickers';
import { Ticker } from 'app/types';
import { ROUTES } from '../../../navigation/routes';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: colors.text.default,
      marginRight: 10,
    },
    iconQR: {
      width: 24,
      height: 24,
      tintColor: colors.text.default,
    },
    containerHeader: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: 'red',
    },
    containerRight: {
      flexDirection: 'row',
    },
    title: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text.default,
    },
    containerFeature: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    particularFeature: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 12,
      marginVertical: 16,
    },
    subTitleFeature: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.text.default,
    },
    iconFeature: {
      width: 24,
      height: 24,
      margin: 14,
    },
    container: {
      flex: 1,
    },
    iconHot: {
      width: 16,
      height: 16,
      marginLeft: 4,
    },
    banner: {
      width: '100%',
      height: 120,
      borderRadius: 8,
    },
    footer: {
      marginTop: 24,
      marginBottom: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleFooter: {
      fontSize: 10,
      fontWeight: '400',
      color: '#64748B',
    },
    contentScroll: { paddingHorizontal: 16 },
  });

// eslint-disable-next-line react/display-name
export const HomeScreen = memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const featureData = useMemo((): RawFeatureInterface[] => {
    return [
      {
        title: 'Pool',
        icon: icons.iconCoin,
        url: 'https://pancakeswap.finance/pools',
      },
      {
        title: 'Farm',
        icon: icons.iconBagCoin,
        url: 'https://pancakeswap.finance/farms',
      },
      {
        title: 'Lottery',
        icon: icons.iconInvoice,
        url: 'https://pancakeswap.finance/lottery',
      },
      {
        title: 'Prediction',
        icon: icons.iconTarget,
        url: 'https://pancakeswap.finance/prediction',
      },
      {
        title: 'Loan',
        icon: icons.iconBagCoin,
        url: 'https://app.compound.finance/markets?market=1_USDC_0xc3d688B66703497DAA19211EEdff47f25384cdc3',
      },
    ];
  }, []);

  const { news } = useGetNews();
  const { tickers } = useGetTickers('BTC,ETH,XRP,BCH,BNB');

  const onScanSuccess = useCallback(
    (data: any, content?: string | undefined) => {
      if (data.private_key) {
        Alert.alert(
          strings('wallet.private_key_detected'),
          strings('wallet.do_you_want_to_import_this_account'),
          [
            {
              text: strings('wallet.cancel'),
              onPress: () => false,
              style: 'cancel',
            },
            {
              text: strings('wallet.yes'),
              onPress: async () => {
                try {
                  await importAccountFromPrivateKey(data.private_key);
                  navigation.navigate('ImportPrivateKeyView', {
                    screen: 'ImportPrivateKeySuccess',
                  });
                } catch (e) {
                  Alert.alert(
                    strings('import_private_key.error_title'),
                    strings('import_private_key.error_message'),
                  );
                }
              },
            },
          ],
          { cancelable: false },
        );
      } else if (data.seed) {
        Alert.alert(
          strings('wallet.error'),
          strings('wallet.logout_to_import_seed'),
        );
      } else {
        setTimeout(() => {
          DeeplinkManager.parse(content, {
            origin: AppConstants.DEEPLINKS.ORIGIN_QR_CODE,
          });
        }, 500);
      }
    },
    [navigation],
  );

  const onToggleScan = useCallback(() => {
    navigation.navigate('QRScanner', { onScanSuccess });
  }, [navigation, onScanSuccess]);

  const onViewNotifications = useCallback(() => {
    navigation.navigate(Routes.NOTIFICATIONS.NOTIFICATIONS);
  }, [navigation]);

  const onSelectNetworks = useCallback(() => {
    navigation.navigate(ROUTES.ChangeNetwork);
  }, [navigation]);
  const currentCurrency = useSelector(
    (state: any) =>
      state.engine.backgroundState.CurrencyRateController.currentCurrency,
  );
  /**
   * Map of accounts to information objects including balances
   */
  const accounts = useSelector(
    (state: any) =>
      state.engine.backgroundState.AccountTrackerController.accounts,
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
   * An object containing each identity in the format address => account
   */
  const identities = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.identities,
  );
  /**
   * ETH to current currency conversion rate
   */
  const conversionRate = useSelector(
    (state: any) =>
      state.engine.backgroundState.CurrencyRateController.conversionRate,
  );
  const fiatBalance = useMemo(() => {
    return `${renderFiat(
      Engine.getTotalFiatAccountBalance(),
      currentCurrency,
    )}`;
  }, [currentCurrency]);

  const onClipBoard = useCallback(async () => {
    await ClipboardManager.setString(selectedAddress);
    dispatch(
      showAlert({
        isVisible: true,
        autodismiss: 1500,
        content: 'clipboard-alert',
        data: { msg: strings('account_details.account_copied_to_clipboard') },
      }),
    );
  }, []);

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

  const openUrl = useCallback(
    async (url: string) => {
      navigation.navigate('Webview', {
        screen: 'SimpleWebview',
        params: { url },
      });
    },
    [navigation],
  );

  const renderWalletBalance = useCallback(() => {
    return (
      <View>
        <InformationFrame address={selectedAddress} onManage={onClipBoard} />
      </View>
    );
  }, [
    accounts,
    conversionRate,
    currentCurrency,
    identities,
    navigation,
    selectedAddress,
    ticker,
    tokens,
    styles,
  ]);

  return (
    <View style={styles.wrapper}>
      <DynamicHeader
        title={''}
        isHiddenTitle
        hideGoBack
        style={styles.containerHeader}
        isShowAvatar
        address={selectedAddress}
      >
        <View style={styles.containerRight}>
          <TouchableOpacity onPress={onSelectNetworks}>
            <Image source={icons.iconSetting} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onViewNotifications}>
            <Image source={icons.iconBell} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleScan}>
            <Image source={icons.iconScanQR} style={styles.iconQR} />
          </TouchableOpacity>
        </View>
      </DynamicHeader>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[colors.primary.default]}
            tintColor={colors.primary.default}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {renderWalletBalance()}
        <Text style={styles.title}>{'Features'}</Text>
        <View style={styles.containerFeature}>
          {featureData.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.particularFeature}
                onPress={() => {
                  openUrl(item.url);
                }}>
                <Image source={item.icon} style={styles.iconFeature} />
                <Text style={styles.subTitleFeature}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Hot24hComponent
          data={tickers}
          onSelected={(item: Ticker) => {
            openUrl(item.url);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            openUrl('https://www.coindesk.com/markets/');
          }}
        >
          <FastImage
            source={images.imageBanner}
            style={styles.banner}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </TouchableOpacity>
        <FavouriteComponent />
        <News
          news={news}
          onSelect={(item: DataNewsInterface) => {
            openUrl(item.url);
          }}
        />
        <View style={styles.footer}>
          <Text style={styles.titleFooter}>{'That’s all for now'}</Text>
        </View>
      </ScrollView>
    </View>
  );
});

export default HomeScreen;
