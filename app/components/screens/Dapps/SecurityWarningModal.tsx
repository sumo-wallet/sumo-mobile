/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable react/display-name */
import React from 'react';
import { View, Text } from 'react-native';
import Modalbox from 'react-native-modalbox';
import FastImage from 'react-native-fast-image';
import CheckBox from '@react-native-community/checkbox';

import { Colors, Fonts, Style } from './../../../styles';
import { SCREEN_WIDTH } from './../../../constants/ui';
import { icons } from './../../../assets';
import { SButton } from './../../common/SButton';

export const SECURITY_WARNING_DESCRIPTION = `You are about to redirect to a third-party Dapp. When making a transfer, please make  sure you are aware of the financial risks and operate with caution. 

iCross Wallet is net responsible for any losses caused  by using this Dapp.`;

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const SecurityWarningModal = React.memo(
  ({ isOpen, onClose, onConfirm, onCancel }: Props) => {
    const [confirmed, setConfirm] = React.useState<boolean>(false);

    const onValueChange = React.useCallback((value: boolean) => {
      setConfirm(value);
    }, []);
    return (
      <Modalbox
        style={Style.s({
          w: SCREEN_WIDTH,
          h: 492,
          px: 16,
          bor: 8,
          over: 'hidden',
          bg: Colors.tran,
        })}
        useNativeDriver
        backdropPressToClose={false}
        backdropColor={'rgba(16, 15, 15, 0.7)'}
        animationDuration={500}
        backdrop
        backButtonClose={false}
        isOpen={isOpen}
        swipeToClose={false}
        position={'center'}
        onClosed={onClose}
      >
        <View style={Style.s({ bg: Colors.gray[4], bor: 20, px: 16, py: 24 })}>
          <FastImage
            style={Style.s({ size: 80, self: 'center' })}
            tintColor={Colors.yellow[1]}
            source={icons.iconWarningRed}
          />
          <View style={Style.s({ mt: 20 })}>
            <Text
              style={Fonts.t({
                s: 20,
                c: Colors.white[2],
                text: 'center',
                w: '700',
              })}
            >
              {'Security Warning'}
            </Text>
            <Text
              style={Fonts.t({
                s: 14,
                c: Colors.white[2],
                text: 'center',
                t: 12,
              })}
            >
              {SECURITY_WARNING_DESCRIPTION}
            </Text>
          </View>
          <View style={Style.s({ direc: 'row', items: 'center', mt: 24 })}>
            <CheckBox
              value={confirmed}
              onValueChange={onValueChange}
              boxType="circle"
              style={Style.s({})}
            />
            <Text
              style={Fonts.t({
                s: 14,
                c: Colors.white[2],
                l: 12,
              })}
            >
              {'Don’t remind me next time'}
            </Text>
          </View>
          <SButton
            onPress={onConfirm}
            title="Confirm"
            type="primary"
            style={Style.s({ mt: 24 })}
            disabled={!confirmed}
          />
          <SButton
            onPress={onCancel}
            title="Cancel"
            type="textOnly"
            style={Style.s({ mt: 8 })}
            titleStyle={Fonts.t({ c: Colors.white[2] })}
          />
        </View>
      </Modalbox>
    );
  },
);
