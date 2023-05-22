import React, { memo, useCallback, useLayoutEffect, useState } from 'react';
import {
  BottomMenuContainer,
  BottomMenuModal,
} from '../../../common/BottomMenu';
import { DynamicHeader } from '../../../Base/DynamicHeader';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import WarningMessage from '../../../Views/SendFlow/WarningMessage';
import { strings } from '../../../../../locales/i18n';
import {
  ADD_CUSTOM_RPC_NETWORK_BUTTON_ID,
  INPUT_NETWORK_NAME,
} from '../../../../constants/test-ids';
import { themeAppearanceLight } from '../../../../constants/storage';
import { useTheme } from '../../../../util/theme';
import { fontStyles } from '../../../../styles/common';
import { icons } from '../../../../assets';
import { useCrossChain } from '../../../../reducers/crossChain/slice';
import StyledButton from '../../../UI/StyledButton/index.ios';
import Engine from '../../../../core/Engine';
import sanitizeUrl from '../../../../util/sanitizeUrl';
import { PRIVATENETWORK } from '../../../../constants/network';
import { useAsyncFn } from '../../../hooks/useAsyncFn';
import { useDispatch, useSelector } from 'react-redux';
import { showNetworkOnboardingAction } from '../../../../actions/onboardNetwork';
import { symbol } from 'prop-types';

interface CustomChainModalInterface {
  isVisible: boolean;
  onClose?: () => void;
  onCloseCustom?: () => void;
  chainId: string;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    label: {
      fontSize: 14,
      paddingVertical: 12,
      color: colors.text.default,
      ...fontStyles.bold,
    },
    iconClose: {
      width: 24,
      height: 24,
      tintColor: colors.background.button,
      marginRight: 12,
    },
    containerCustom: {
      marginHorizontal: 16,
      flex: 1,
    },
    warningContainer: {
      marginTop: 12,
    },
    scrollWrapper: {
      flex: 1,
      paddingVertical: 12,
    },
    input: {
      ...fontStyles.normal,
      borderColor: colors.border.default,
      borderRadius: 5,
      borderWidth: 2,
      padding: 10,
      color: colors.text.default,
    },
    buttonsContainer: {
      width: '100%',
      marginTop: 64,
    },
  });

export interface ParamChainInterface {
  name: string;
  symbol: string;
}

export const CustomChainModal = memo(
  ({
    isVisible,
    onClose,
    onCloseCustom,
    chainId,
  }: CustomChainModalInterface) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const chain = useCrossChain(chainId);
    const [params, setParams] = useState<ParamChainInterface>({
      name: '',
      symbol: '',
    });

    useLayoutEffect(() => {
      setParams({ name: chain?.name || '', symbol: chain?.symbol || '' });
    }, [chain]);

    const dispatch = useDispatch();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { PreferencesController, NetworkController, CurrencyRateController } =
      Engine.context;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const getDecimalChainId = useCallback((chainId: any) => {
      if (
        !chainId ||
        typeof chainId !== 'string' ||
        !chainId.startsWith('0x')
      ) {
        return chainId;
      }
      return parseInt(chainId, 16).toString(10);
    }, []);
    const networkOnboardedState = useSelector(
      (state: any) => state.networkOnboarded.networkOnboardedState,
    );

    const [{ loading, error }, addRpcUrl] = useAsyncFn(async () => {
      let isOnboarded = false;
      const isNetworkOnboarded = networkOnboardedState.filter(
        (item) => item.network === sanitizeUrl(chain?.rpc || ''),
      );
      if (isNetworkOnboarded.length === 0) {
        isOnboarded = true;
      }
      let chainFormId = chainId;
      const nativeToken = params.symbol || PRIVATENETWORK;
      const networkType = params.name || chain?.rpc || '';
      const networkUrl = sanitizeUrl(chain?.rpc || '') || '';
      const showNetworkOnboarding = isOnboarded;

      if (!chainFormId.startsWith('0x')) {
        chainFormId = `0x${parseInt(chainFormId, 10).toString(16)}`;
      }
      const url = new URL(chain?.rpc);
      const decimalChainId = getDecimalChainId(chainFormId);
      CurrencyRateController.setNativeCurrency(params.symbol);
      // Remove trailing slashes
      const formattedHref = url.href.replace(/\/+$/, '');
      PreferencesController.addToFrequentRpcList(
        url,
        decimalChainId,
        params.symbol,
        params.name,
        {
          blockExplorerUrl:
            chain?.explorer?.address || chain?.explorer_cn?.address || '',
        },
      );

      NetworkController.setRpcTarget(
        formattedHref,
        decimalChainId,
        params.symbol,
        params.name,
      );

      onClose?.();
      setTimeout(() => {
        dispatch(
          showNetworkOnboardingAction({
            networkUrl,
            networkType,
            nativeToken,
            showNetworkOnboarding,
          }),
        );
      }, 1000);
    }, [
      chain,
      chainId,
      PreferencesController,
      NetworkController,
      CurrencyRateController,
      params,
    ]);

    const onParamCustom = useCallback((inputName: string, value: string) => {
      setParams((state) => ({ ...state, [inputName]: value }));
    }, []);

    return (
      <BottomMenuModal
        isVisible={isVisible}
        onClose={onClose}
        propagateSwipe
        style={{ margin: 0 }}
      >
        <BottomMenuContainer containerStyle={{ flex: 1 }}>
          <DynamicHeader title={'Mạng'} hideGoBack>
            <TouchableOpacity onPress={onCloseCustom}>
              <Image source={icons.iconClose} style={styles.iconClose} />
            </TouchableOpacity>
          </DynamicHeader>
          <KeyboardAwareScrollView style={styles.containerCustom}>
            <WarningMessage
              style={styles.warningContainer}
              warningMessage={strings('networks.malicious_network_warning')}
            />
            <View style={styles.scrollWrapper}>
              <Text style={styles.label}>
                {strings('app_settings.network_name_label')}
              </Text>
              <TextInput
                style={styles.input}
                autoCapitalize={'none'}
                autoCorrect={false}
                value={params.name}
                editable
                onChangeText={(text: string) => onParamCustom('name', text)}
                placeholder={strings('app_settings.network_name_placeholder')}
                placeholderTextColor={colors.text.muted}
                testID={INPUT_NETWORK_NAME}
                keyboardAppearance={themeAppearanceLight}
              />
              <Text style={styles.label}>
                {strings('app_settings.network_rpc_url_label')}
              </Text>
              <TextInput
                style={styles.input}
                autoCapitalize={'none'}
                autoCorrect={false}
                value={chain?.rpc || ''}
                editable={false}
                placeholder={strings('app_settings.network_rpc_placeholder')}
                placeholderTextColor={colors.text.muted}
                testID={'input-rpc-url'}
                keyboardAppearance={themeAppearanceLight}
              />
              <Text style={styles.label}>
                {strings('app_settings.network_chain_id_label')}
              </Text>
              <TextInput
                style={styles.input}
                autoCapitalize={'none'}
                autoCorrect={false}
                value={chain?.id || ''}
                editable={false}
                placeholder={strings(
                  'app_settings.network_chain_id_placeholder',
                )}
                placeholderTextColor={colors.text.muted}
                keyboardType={'numbers-and-punctuation'}
                testID={'input-chain-id'}
                keyboardAppearance={themeAppearanceLight}
              />

              <Text style={styles.label}>
                {strings('app_settings.network_symbol_label')}
              </Text>
              <TextInput
                style={styles.input}
                autoCapitalize={'none'}
                autoCorrect={false}
                value={params.symbol}
                editable
                onChangeText={(text: string) => onParamCustom('symbol', text)}
                placeholder={strings('app_settings.network_symbol_placeholder')}
                placeholderTextColor={colors.text.muted}
                testID={'input-network-symbol'}
                keyboardAppearance={themeAppearanceLight}
              />

              <Text style={styles.label}>
                {strings('app_settings.network_block_explorer_label')}
              </Text>
              <TextInput
                style={styles.input}
                autoCapitalize={'none'}
                autoCorrect={false}
                value={
                  chain?.explorer?.address || chain?.explorer_cn?.address || ''
                }
                editable={false}
                placeholder={strings(
                  'app_settings.network_block_explorer_placeholder',
                )}
                placeholderTextColor={colors.text.muted}
                keyboardAppearance={themeAppearanceLight}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <StyledButton
                type="confirm"
                onPress={addRpcUrl}
                testID={ADD_CUSTOM_RPC_NETWORK_BUTTON_ID}
                disabled={loading}
              >
                {strings('app_settings.network_add')}
              </StyledButton>
            </View>
          </KeyboardAwareScrollView>
        </BottomMenuContainer>
      </BottomMenuModal>
    );
  },
);
