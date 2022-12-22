/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-require-imports: "off" */

'use strict';
import React, { useRef, useCallback } from 'react';
import {
  InteractionManager,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
// import Icon from 'react-native-vector-icons/Ionicons';
import { parse } from 'eth-url-parser';
// import { colors as importedColors } from '../../../styles/common';
import { isValidAddress } from 'ethereumjs-util';
import { strings } from '../../../../locales/i18n';
import SharedDeeplinkManager from '../../../core/DeeplinkManager';
import AppConstants from '../../../core/AppConstants';
import {
  failedSeedPhraseRequirements,
  isValidMnemonic,
} from '../../../util/validators';
import { isValidAddressInputViaQRCode } from '../../../util/address';
import { getURLProtocol } from '../../../util/general';
import Engine from '../../../core/Engine';
import Routes from '../../../constants/navigation/Routes';
import { PROTOCOLS } from '../../../constants/deeplinks';
import styles from './styles';
import {
  createNavigationDetails,
  useParams,
} from '../../../util/navigation/navUtils';

import { Fonts, Style } from './../../../styles';
import { icons } from './../../../assets';
import { useTheme } from './../../../util/theme';

// const frameImage = require('../../../images/frame.png'); // eslint-disable-line import/no-commonjs

export interface QRScannerParams {
  onScanSuccess: (data: any, content?: string) => void;
  onScanError?: (error: string) => void;
  onStartScan?: (data: any) => Promise<void>;
  origin?: string;
}

export const createQRScannerNavDetails =
  createNavigationDetails<QRScannerParams>(Routes.QR_SCANNER);

/**
 * View that wraps the QR code scanner screen
 */
const QRScanner = () => {
  const navigation = useNavigation();
  const { onScanError, onScanSuccess, onStartScan, origin } =
    useParams<QRScannerParams>();

  const { colors } = useTheme();

  const mountedRef = useRef<boolean>(true);
  const shouldReadBarCodeRef = useRef<boolean>(true);
  const [flashMode, setFlashMode] = React.useState<any>(
    RNCamera.Constants.FlashMode.auto,
  );

  const currentChainId = useSelector(
    (state: any) =>
      state.engine.backgroundState.NetworkController.provider.chainId,
  );

  const goBack = useCallback(() => {
    navigation.goBack();
    onScanError?.('USER_CANCELLED');
  }, [onScanError, navigation]);

  const end = useCallback(() => {
    mountedRef.current = false;
    navigation.goBack();
  }, [mountedRef, navigation]);

  const showAlertForInvalidAddress = () => {
    Alert.alert(
      strings('qr_scanner.unrecognized_address_qr_code_title'),
      strings('qr_scanner.unrecognized_address_qr_code_desc'),
      [
        {
          text: strings('qr_scanner.ok'),
          onPress: () => null,
          style: 'default',
        },
      ],
    );
  };

  const showAlertForURLRedirection = (url: string): Promise<boolean> =>
    new Promise((resolve) => {
      mountedRef.current = false;
      Alert.alert(
        strings('qr_scanner.url_redirection_alert_title'),
        `${url} \n\n ${strings('qr_scanner.url_redirection_alert_desc')}`,
        [
          {
            text: strings('qr_scanner.cancel'),
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: strings('qr_scanner.continue'),
            onPress: () => resolve(true),
            style: 'default',
          },
        ],
      );
    });

  const onBarCodeRead = useCallback(
    async (response) => {
      const content = response.data;
      /**
       * Barcode read triggers multiple times
       * shouldReadBarCodeRef controls how often the logic below runs
       * Think of this as a allow or disallow bar code reading
       */
      if (!shouldReadBarCodeRef.current || !mountedRef.current || !content) {
        return;
      }

      if (
        origin === Routes.SEND_FLOW.SEND_TO ||
        origin === Routes.SETTINGS.CONTACT_FORM
      ) {
        if (!isValidAddressInputViaQRCode(content)) {
          showAlertForInvalidAddress();
          end();
          return;
        }
      }

      const contentProtocol = getURLProtocol(content);
      if (
        contentProtocol === PROTOCOLS.HTTP ||
        contentProtocol === PROTOCOLS.HTTPS
      ) {
        const redirect = await showAlertForURLRedirection(content);

        if (!redirect) {
          navigation.goBack();
          return;
        }
      }

      let data = {};

      if (content.split('metamask-sync:').length > 1) {
        shouldReadBarCodeRef.current = false;
        data = { content };
        if (onStartScan) {
          onStartScan(data).then(() => {
            onScanSuccess(data);
          });
          mountedRef.current = false;
        } else {
          Alert.alert(
            strings('qr_scanner.error'),
            strings('qr_scanner.attempting_sync_from_wallet_error'),
          );
          mountedRef.current = false;
        }
      } else {
        if (
          !failedSeedPhraseRequirements(content) &&
          isValidMnemonic(content)
        ) {
          shouldReadBarCodeRef.current = false;
          data = { seed: content };
          end();
          onScanSuccess(data, content);
          return;
        }
        const { KeyringController } = Engine.context as any;
        const isUnlocked = KeyringController.isUnlocked();

        if (!isUnlocked) {
          navigation.goBack();
          Alert.alert(
            strings('qr_scanner.error'),
            strings('qr_scanner.attempting_to_scan_with_wallet_locked'),
          );
          mountedRef.current = false;
          return;
        }
        // Let ethereum:address and address go forward
        if (
          (content.split(`${PROTOCOLS.ETHEREUM}:`).length > 1 &&
            !parse(content).function_name) ||
          (content.startsWith('0x') && isValidAddress(content))
        ) {
          const handledContent = content.startsWith('0x')
            ? `${PROTOCOLS.ETHEREUM}:${content}@${currentChainId}`
            : content;
          shouldReadBarCodeRef.current = false;
          data = parse(handledContent);
          const action = 'send-eth';
          data = { ...data, action };
          end();
          onScanSuccess(data, handledContent);
          return;
        }

        // Checking if it can be handled like deeplinks
        const handledByDeeplink = SharedDeeplinkManager.parse(content, {
          origin: AppConstants.DEEPLINKS.ORIGIN_QR_CODE,
          onHandled: () => navigation?.pop(2),
        });

        if (handledByDeeplink) {
          mountedRef.current = false;
          return;
        }

        // I can't be handled by deeplinks, checking other options
        if (
          content.length === 64 ||
          (content.substring(0, 2).toLowerCase() === '0x' &&
            content.length === 66)
        ) {
          shouldReadBarCodeRef.current = false;
          data = {
            private_key: content.length === 64 ? content : content.substr(2),
          };
        } else if (content.substring(0, 2).toLowerCase() === '0x') {
          shouldReadBarCodeRef.current = false;
          data = { target_address: content, action: 'send-eth' };
        } else if (content.split('wc:').length > 1) {
          shouldReadBarCodeRef.current = false;
          data = { walletConnectURI: content };
        } else {
          // EIP-945 allows scanning arbitrary data
          data = content;
        }
        onScanSuccess(data, content);
      }

      end();
    },
    [origin, end, navigation, onStartScan, onScanSuccess, currentChainId],
  );

  const showCameraNotAuthorizedAlert = () =>
    Alert.alert(
      strings('qr_scanner.not_allowed_error_title'),
      strings('qr_scanner.not_allowed_error_desc'),
      [
        {
          text: strings('qr_scanner.ok'),
        },
      ],
    );

  const onError = useCallback(
    (error) => {
      navigation.goBack();
      InteractionManager.runAfterInteractions(() => {
        if (onScanError && error) {
          onScanError(error.message);
        }
      });
    },
    [onScanError, navigation],
  );

  const onStatusChange = useCallback(
    (event) => {
      if (event.cameraStatus === 'NOT_AUTHORIZED') {
        showCameraNotAuthorizedAlert();
        navigation.goBack();
      }
    },
    [navigation],
  );

  const onPressFlash = React.useCallback(() => {
    if (flashMode !== 'torch') {
      setFlashMode(RNCamera.Constants.FlashMode.torch);
    } else {
      setFlashMode(RNCamera.Constants.FlashMode.auto);
    }
  }, [flashMode]);

  const onPressOpenGallery = () => {
    console.log('onPressOpenGallery');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={Style.s({
          direc: 'row',
          px: 4,
          minH: 48,
          bg: colors.background.default,
        })}
      >
        <TouchableOpacity onPress={goBack} style={Style.s({ p: 12 })}>
          <Image style={Style.s({ size: 24 })} source={icons.iconArrowLeft} />
        </TouchableOpacity>
        <View style={Style.s({ flex: 1, cen: true })}>
          <Text style={Fonts.t({ s: 14, w: '500', c: colors.text.default })}>
            {'Scan'}
          </Text>
        </View>
        <TouchableOpacity onPress={onPressFlash} style={Style.s({ p: 12 })}>
          <Image style={Style.s({ size: 24 })} source={icons.iconFlash} />
        </TouchableOpacity>
      </View>
      <RNCamera
        onMountError={onError}
        captureAudio={false}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={onBarCodeRead}
        flashMode={flashMode}
        androidCameraPermissionOptions={{
          title: strings('qr_scanner.allow_camera_dialog_title'),
          message: strings('qr_scanner.allow_camera_dialog_message'),
          buttonPositive: strings('qr_scanner.ok'),
          buttonNegative: strings('qr_scanner.cancel'),
        }}
        onStatusChange={onStatusChange}
      >
        <SafeAreaView style={Style.s({ flex: 1 })}>
          <View style={Style.s({ flex: 1, bg: '#000311', op: 0.75 })} />
          <View style={Style.s({ h: 210, direc: 'row', z: 2 })}>
            <View style={Style.s({ flex: 1, bg: '#000311', op: 0.75 })} />
            <View style={Style.s({ size: 210, cen: true, z: 2 })}>
              <Image
                style={Style.s({
                  size: 226,
                  self: 'center',
                  pos: 'absolute',
                  t: -8,
                  z: 2,
                })}
                source={icons.iconScanFrame}
              />
            </View>
            <View style={Style.s({ flex: 1, bg: '#000311', op: 0.75 })} />
          </View>
          <View
            style={Style.s({
              flex: 1,
              bg: '#000311',
              op: 0.75,
            })}
          >
            <TouchableOpacity
              onPress={onPressOpenGallery}
              style={Style.s({ mt: 58, items: 'center' })}
            >
              <Image style={Style.s({ size: 48 })} source={icons.iconGallery} />
              <Text
                style={Fonts.t({
                  s: 12,
                  h: 18,
                  c: colors.text.default,
                  t: 10,
                  text: 'center',
                  w: '500',
                })}
              >
                {'Pick QR\nfrom gallery'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity style={styles.closeIcon} onPress={goBack}>
            <Icon name={'ios-close'} size={50} color={importedColors.white} />
          </TouchableOpacity>
          <Image source={frameImage} style={styles.frame} />
          <Text style={styles.text}>{strings('qr_scanner.scanning')}</Text> */}
        </SafeAreaView>
      </RNCamera>
    </SafeAreaView>
  );
};

export default QRScanner;
