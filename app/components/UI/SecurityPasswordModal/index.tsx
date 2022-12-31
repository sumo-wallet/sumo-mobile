/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, UIManager, Text } from 'react-native';
import Modalbox from 'react-native-modalbox';
import Device from '../../../util/device';
import { Fonts, Style } from './../../../styles';
import { SInput } from './../../common/SInput';
import { SButton } from './../../common/SButton';
import { useTheme } from '../../../util/theme';
import { strings } from '../../../../locales/i18n';

if (Device.isAndroid() && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onErase?: () => void;
  onConfirm?: () => void;
  onPassChanged?: (text: string) => void;
  fieldRef: any;
  errorMsg?: string;
  onTryBiometric?: () => void;
}

const SecurityPasswordModal = ({
  isOpen,
  onClose,
  onErase,
  onConfirm,
  onPassChanged,
  errorMsg,
}: Props) => {
  const { colors } = useTheme();
  return (
    <Modalbox
      style={Style.s({ w: 343, h: 410, bor: 8, over: 'hidden' })}
      useNativeDriver
      backdropPressToClose
      backdropColor={'rgba(16, 15, 15, 0.7)'}
      animationDuration={500}
      backdrop
      backButtonClose
      isOpen={isOpen}
      swipeToClose
      position={'center'}
      // coverScreen
      onClosed={onClose}
    >
      <View
        style={Style.s({
          w: 343,
          h: 410,
          bg: colors.background.default,
          // bg: 'red',
          pt: 24,
          bor: 8,
          px: 16,
        })}
      >
        <Text
          style={Fonts.t({
            s: 24,
            w: '700',
            c: colors.text.default,
            x: 8,
            text: 'center',
          })}
        >
          {strings('login.password')}
        </Text>
        <SInput
          style={Style.s({ mt: 24 })}
          placeholder={strings('enter_password.title')}
          secure
          onChange={onPassChanged}
        />
        <View style={Style.s({ mt: 20, flex: 1 })}>
          <Text
            style={Fonts.t({ s: 14, c: colors.error.default, text: 'center' })}
          >
            {errorMsg}
          </Text>
          <SButton
            title={strings('enter_password.confirm_button')}
            onPress={onConfirm}
            style={Style.s({ mt: 20 })}
            titleStyle={Fonts.t({ c: colors.text.default })}
          />
          <View style={Style.s({ direc: 'row', items: 'center', mt: 24 })}>
            <View style={Style.s({ flex: 1, h: 1, bg: colors.border.muted })} />
            <Text style={Fonts.t({ s: 14, c: colors.text.default, x: 13 })}>
              {'or'}
            </Text>
            <View style={Style.s({ flex: 1, h: 1, bg: colors.border.muted })} />
          </View>
          <Text
            style={Fonts.t({
              s: 14,
              c: colors.text.default,
              x: 13,
              t: 24,
              text: 'center',
              w: '500',
            })}
          >
            {"Wallet wont's unlock? You can"}
            <Text
              onPress={onErase}
              style={Fonts.t({
                s: 14,
                c: colors.primary.default,
                x: 13,
                w: '600',
              })}
            >
              {' Erase '}
            </Text>
            {'your current wallet and setup a new one'}
          </Text>
          <SButton
            title={strings('accounts.cancel')}
            onPress={onClose}
            type="textOnly"
            style={Style.s({ mt: 24 })}
          />
        </View>
      </View>
    </Modalbox>
  );
};

export default React.memo(SecurityPasswordModal);
