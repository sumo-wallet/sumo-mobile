import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDisclosure } from '@dwarvesf/react-hooks';

import Logger from '../../../util/Logger';
import { Fonts, Style } from './../../../styles';
import { SHeader } from './../../common/SHeader';
import { icons } from './../../../assets';
import { SButton } from './../../common/SButton';
import ClipboardManager from './../../../core/ClipboardManager';
import { showAlert } from './../../../actions/alert';
import { strings } from '../../../../locales/i18n';
import { generateUniversalLinkAddress } from '../../../util/payment-link-generator';
import { ChooseCurrencyModal } from './ChooseCurrencyModal';
import { UserToken } from './../../../types';
import { useTheme } from './../../../util/theme';

export interface ReceiveAssetProps {
  showAsset: boolean;
  asset: any;
}

export const ReceiveScreen = ({ showAsset, asset }: ReceiveAssetProps) => {
  const chooseCurrencyModal = useDisclosure();
  const inputRef = React.useRef<TextInput>();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [tokenSelected, setToken] = React.useState<UserToken | undefined>();

  const { chainId } = useSelector(
    (state: any) => state.engine.backgroundState.NetworkController.provider,
  );
  const { selectedAddress } = useSelector(
    (state: any) => state.engine.backgroundState.PreferencesController,
  );
  // const { receiveAsset = {} } = useSelector((state: any) => state.modals);
  // const { symbol = '' } = receiveAsset;

  // React.useEffect(() => {
  //   console.log('receiveAsset: ', receiveAsset);
  // }, [receiveAsset]);

  const handleCopyAddress = React.useCallback(() => {
    ClipboardManager.setString(selectedAddress);
    dispatch(
      showAlert({
        isVisible: true,
        autodismiss: 1500,
        content: 'clipboard-alert',
        data: { msg: strings('account_details.account_copied_to_clipboard') },
      }),
    );
  }, [dispatch, selectedAddress]);

  const handleShare = React.useCallback(() => {
    Share.open({
      message: generateUniversalLinkAddress(selectedAddress),
    })
      .then(() => {
        // this.props.hideModal();
        // setTimeout(() => this.props.protectWalletModalVisible(), 1000);
      })
      .catch((err) => {
        Logger.log('Error while trying to share address', err);
      });
    // InteractionManager.runAfterInteractions(() => {
    //   Analytics.trackEvent(ANALYTICS_EVENT_OPTS.RECEIVE_OPTIONS_SHARE_ADDRESS);
    // });
  }, [selectedAddress]);

  const handleClearInput = React.useCallback(() => {
    if (inputRef) {
      inputRef?.current?.clear();
    }
  }, []);

  const onChangeToken = React.useCallback((token: UserToken) => {
    setToken(token);
  }, []);

  return (
    <SafeAreaView style={Style.s({ flex: 1, bg: colors.background.default })}>
      <SHeader title="Receive" />
      <KeyboardAwareScrollView
        enableOnAndroid
        extraHeight={160}
        contentContainerStyle={{}}
      >
        <View
          style={Style.s({
            m: 16,
            bg: colors.box.default,
            pt: 12,
            pb: 16,
            px: 16,
            items: 'center',
            bor: 8,
          })}
        >
          {/* <TouchableOpacity
            onPress={chooseCurrencyModal.onOpen}
            style={Style.s({ direc: 'row', items: 'center' })}
          >
            <Text style={Fonts.t({ s: 14, w: '700', c: colors.text.default })}>
              {`${tokenSelected?.symbol ?? ''} (BEP2)`}
            </Text>
            <FastImage
              style={Style.s({ size: 16, l: 8 })}
              source={icons.iconChevronDown}
            />
          </TouchableOpacity> */}
          <View
            style={Style.s({
              p: 8,
              bg: colors.text.default,
              cen: true,
              bor: 8,
              mt: 16,
            })}
          >
            <QRCode
              value={`${selectedAddress}`}
              size={Dimensions.get('window').width / 2}
              logo={icons.iconLogo}
              logoSize={40}
              logoBorderRadius={5}
            />
          </View>
          <Text
            style={[
              Fonts.t({
                s: 12,
                c: colors.text.muted,
                t: 16,
                text: 'center',
              }),
            ]}
          >
            {selectedAddress}
          </Text>
        </View>
        {showAsset && (
          <View style={Style.s({ px: 16, mt: 8 })}>
            <Text style={[Fonts.t({ s: 14, c: colors.text.default })]}>
              {strings('receive_request.request_payment')}
            </Text>
            <TouchableOpacity
              onPress={() => inputRef?.current?.focus()}
              style={[
                Style.s({
                  mt: 8,
                  px: 16,
                  py: 12,
                  minH: 64,
                  direc: 'row',
                  items: 'center',
                }),
                Style.b({ color: colors.border.default, bor: 8, width: 1 }),
              ]}
            >
              <View style={Style.s({ flex: 1 })}>
                <View style={Style.s({ direc: 'row', items: 'center' })}>
                  <Text
                    style={[
                      Fonts.t({
                        s: 18,
                        w: '500',
                        c: colors.text.default,
                        r: 4,
                      }),
                    ]}
                  >
                    {'$'}
                  </Text>
                  <TextInput
                    ref={inputRef as any}
                    style={[
                      Style.s({ minW: 42 }),
                      Fonts.t({ s: 18, w: '500', c: colors.text.default }),
                    ]}
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor={colors.text.muted}
                    maxLength={16}
                  />
                  <Text
                    style={[
                      Fonts.t({
                        s: 18,
                        w: '500',
                        c: colors.text.default,
                        l: 4,
                      }),
                    ]}
                  >
                    {asset.symbol}
                  </Text>
                </View>
                <Text
                  style={Fonts.t({
                    s: 12,
                    c: colors.text.default,
                    t: 6,
                    w: '500',
                  })}
                >
                  {'0 USD'}
                </Text>
              </View>
              <TouchableOpacity>
                <FastImage
                  style={Style.s({ size: 20 })}
                  source={icons.iconSwap2}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <Text
              onPress={handleClearInput}
              style={Fonts.t({
                s: 14,
                w: '600',
                c: colors.error.default,
                t: 8,
                self: 'flex-end',
              })}
            >
              {'Clear'}
            </Text>
          </View>
        )}
      </KeyboardAwareScrollView>
      <View
        style={Style.s({
          direc: 'row',
          items: 'center',
          mt: 'auto',
          px: 16,
          // mb: 34,
        })}
      >
        <SButton
          onPress={handleShare}
          title="Share"
          style={Style.s({ flex: 1, mr: 8 })}
          type="border"
        />
        <SButton
          onPress={handleCopyAddress}
          title={strings('payment_request.copy_address')}
          style={Style.s({ flex: 1, bg: colors.text.default, ml: 8 })}
          titleStyle={{ color: colors.background.default }}
        />
      </View>
      <ChooseCurrencyModal
        isOpen={chooseCurrencyModal.isOpen}
        onClose={chooseCurrencyModal.onClose}
        onChangeToken={onChangeToken}
      />
    </SafeAreaView>
  );
};
