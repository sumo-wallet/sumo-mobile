import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Style, Fonts } from '../../../styles';
import { Dapp } from './../../../types';
import { createNewTab, openDapp } from './../../../actions/browser';
import { ROUTES } from './../../../navigation/routes';
import { useNavigator } from './../../hooks';
import { useTheme } from './../../..//util/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

export { SCREEN_WIDTH, SCREEN_HEIGHT };

export interface DappCellProps {
  style?: StyleProp<ViewStyle>;
  dapp?: Dapp;
}

export const DappCell = ({ style, dapp }: DappCellProps) => {
  const dispatch = useDispatch();
  const nav = useNavigator();

  const { colors } = useTheme();

  const handleOpenDapp = React.useCallback(() => {
    if (dapp?.website) {
      dispatch(createNewTab(dapp?.website));
      dispatch(openDapp({ dapp }));
      nav.navigate(ROUTES.BrowserTabHome, { dapp });
    }
  }, [dapp, dispatch, nav]);

  return (
    <View style={[Style.s({ direc: 'row', items: 'center', mt: 16 }), style]}>
      <Image style={Style.s({ size: 40, bor: 8 })} source={dapp?.image} />
      <View style={Style.s({ ml: 12 })}>
        <Text style={Fonts.t({ s: 14, c: colors.text.default })}>
          {dapp?.name}
        </Text>
        <Text style={Fonts.t({ s: 12, c: colors.text.alternative })}>
          {dapp?.description}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleOpenDapp}
        style={[
          Style.s({ minH: 28, px: 16, py: 6, cen: true, ml: 'auto' }),
          Style.b({ width: 1, color: colors.border.default, bor: 50 }),
        ]}
      >
        <Text style={Fonts.t({ s: 14, w: '500', c: colors.text.alternative })}>
          {'Open'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
