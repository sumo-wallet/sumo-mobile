import React from 'react';
import { View, SafeAreaView, Text, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';

import { Style, Fonts } from './../../../styles';
import { SHeader, SButton } from './../../common';
import { useNavigator, useNavigatorParams } from './../../hooks';
import { ModelDApp } from './../../../types';
import { icons } from './../../../assets';
import { ROUTES } from './../../../navigation/routes';
import { createNewTab, openDapp } from './../../../actions/browser';
import { useTheme } from './../../../util/theme';

export const InfoRow = ({
  title,
  value,
}: {
  title: string;
  value: string | undefined;
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={Style.s({
        minH: 44,
        direc: 'row',
        items: 'center',
        justify: 'space-between',
        py: 12,
      })}
    >
      <Text style={Fonts.t({ s: 14, c: colors.text.default, t: 2, r: 40 })}>
        {title}
      </Text>
      <Text style={Fonts.t({ s: 14, c: colors.text.muted, t: 2, w: '500' })}>
        {value}
      </Text>
    </View>
  );
};

export const DappDetails = React.memo(() => {
  const { dapp }: { dapp: ModelDApp } = useNavigatorParams();
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
    <SafeAreaView style={Style.s({ flex: 1, bg: colors.background.default })}>
      <SHeader title="PancakeSwap" />
      <ScrollView style={Style.s({ flex: 1 })}>
        <View style={Style.s({ items: 'center', self: 'center', mt: 20 })}>
          <FastImage
            style={Style.s({ size: 72, bor: 8 })}
            source={{ uri: dapp?.logo }}
          />
          <Text
            style={Fonts.t({ s: 18, w: '500', c: colors.text.default, t: 12 })}
          >
            {dapp?.name}
          </Text>
        </View>
        <View
          style={Style.s({ direc: 'row', items: 'center', mt: 24, px: 16 })}
        >
          <SButton
            style={Style.s({ flex: 1, mr: 8 })}
            titleStyle={Fonts.t({ s: 16, w: '500', c: colors.text.default })}
            type="border"
            title="Favorite"
          >
            <FastImage
              style={Style.s({ size: 12, mr: 8 })}
              source={icons.iconStar}
              tintColor={colors.icon.default}
            />
          </SButton>
          <SButton
            onPress={handleOpenDapp}
            style={Style.s({ flex: 1, ml: 8 })}
            titleStyle={Fonts.t({ s: 16, w: '500', c: colors.text.default })}
            type="border"
            title="Open"
          />
        </View>
        {dapp?.thumbnail ? (
          <View style={Style.s({ px: 16, mt: 32 })}>
            <Text style={Fonts.t({ s: 14, w: '500', c: colors.text.default })}>
              {'Preview'}
            </Text>
            <FastImage
              style={Style.s({ h: 192, bor: 8, mt: 8 })}
              source={{ uri: dapp.thumbnail }}
            />
          </View>
        ) : null}
        <View style={Style.s({ px: 16, mt: 24 })}>
          <Text style={Fonts.t({ s: 14, w: '500', c: colors.text.default })}>
            {'Introduction'}
          </Text>
          <Text style={Fonts.t({ s: 14, c: colors.text.alternative, t: 2 })}>
            {dapp.description}
          </Text>
          <View
            style={Style.s({
              mt: 12,
              bor: 8,
              bg: colors.box.default,
              px: 16,
              py: 4,
            })}
          >
            <InfoRow title="Running on" value={dapp.chain_id} />
            <View style={Style.s({ bg: colors.border.default, h: 0.5 })} />
            <InfoRow title="Provider" value={dapp.name} />
            <View style={Style.s({ bg: colors.border.default, h: 0.5 })} />
            <InfoRow title="Website" value={dapp.website} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});
