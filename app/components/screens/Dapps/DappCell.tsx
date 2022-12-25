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
import { ModelDApp } from './../../../types';
import { createNewTab, openDapp } from './../../../actions/browser';
import { useNavigator } from './../../hooks';
import { useTheme } from './../../..//util/theme';
import Routes from '../../../constants/navigation/Routes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

export { SCREEN_WIDTH, SCREEN_HEIGHT };

export interface DappCellProps {
  style?: StyleProp<ViewStyle>;
  dapp?: ModelDApp;
}

export const DappCell = ({ style, dapp }: DappCellProps) => {
  const dispatch = useDispatch();
  const nav = useNavigator();

  const { colors } = useTheme();

  const handleOpenDapp = React.useCallback(() => {
    if (dapp?.website) {
      dispatch(openDapp({ dapp }));
      nav.navigate(Routes.BROWSER_TAB_HOME, {
        screen: Routes.BROWSER_VIEW,
        params: {
          newTabUrl: dapp.website,
          timestamp: Date.now(),
        },
      });
    }
  }, [dapp, dispatch, nav]);

  return (
    <TouchableOpacity style={[Style.s({ direc: 'row', items: 'center', mt: 16 }), style]} onPress={handleOpenDapp}>
      <Image
        style={Style.s({ size: 40, bor: 8 })}
        source={{ uri: dapp?.logo }}
      />
      <View style={Style.s({ ml: 12 })}>
        <Text style={Fonts.t({ s: 14, c: colors.text.default })}>
          {dapp?.name}
        </Text>
        <Text style={Fonts.t({ s: 12, c: colors.text.alternative })}>
          {dapp?.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
