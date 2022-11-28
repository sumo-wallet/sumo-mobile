/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable react/display-name */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Modalbox from 'react-native-modalbox';
import FastImage from 'react-native-fast-image';
// import { toChecksumAddress } from 'ethereumjs-util';
import { useSelector } from 'react-redux';

import { Colors, Fonts, Style } from './../../../styles';
// import { SInput } from './../../common/SInput';
// import { SButton } from './../../common/SButton';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './../../../constants/ui';
// import { icons, placeholders } from './../../../assets';
// import NetworkMainAssetLogo from '../../UI/NetworkMainAssetLogo';
// import Identicon from '../../UI/Identicon';
// import AssetIcon from '../../UI/AssetIcon';
import { UserToken } from './../../../types';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChangeToken?: (token: UserToken) => void;
}

export const ChooseCurrencyModal = React.memo(
  ({ isOpen, onClose, onChangeToken }: Props) => {
    const { tokens }: { tokens: UserToken[] } = useSelector(
      (state: any) => state?.engine?.backgroundState?.TokensController,
    );

    // React.useEffect(() => {
    //   console.log('tokens: ', tokens);
    // }, [tokens]);

    // const renderLogo = React.useCallback(
    //   (asset: any) => {
    //     const { address, isETH } = asset;
    //     if (isETH) {
    //       return <NetworkMainAssetLogo big style={styles.ethLogo} />;
    //     }
    //     const token =
    //       tokenList?.[toChecksumAddress(address)] ||
    //       tokenList?.[address.toLowerCase()];
    //     const iconUrl = token?.iconUrl;
    //     if (!iconUrl) {
    //       return <Identicon address={address} />;
    //     }
    //     return <AssetIcon logo={iconUrl} />;
    //   },
    //   [tokenList, styles],
    // );

    const handleSelectToken = React.useCallback(
      (token: UserToken) => {
        onChangeToken && onChangeToken(token);
        onClose();
      },
      [onChangeToken, onClose],
    );

    const renderItem = React.useCallback(
      ({ item }: { item: UserToken }) => {
        return (
          <TouchableOpacity
            onPress={() => handleSelectToken(item)}
            style={Style.s({
              minH: 64,
              px: 16,
              py: 12,
              direc: 'row',
              items: 'center',
              bg: Colors.gray[4],
              bor: 8,
            })}
          >
            <FastImage
              style={Style.s({ size: 40 })}
              source={{ uri: item?.image }}
            />
            <Text style={Fonts.t({ s: 14, c: Colors.white[2], l: 16 })}>
              {item?.symbol}
              {/* <Text style={Fonts.t({ s: 14, c: Colors.grayscale[60] })}>
            {'BEP2'}
          </Text> */}
            </Text>
            <Text style={Fonts.t({ s: 14, c: Colors.white[2], l: 'auto' })}>
              {'0'}
            </Text>
          </TouchableOpacity>
        );
      },
      [handleSelectToken],
    );

    const height = SCREEN_HEIGHT - 56 - 34 - 100;
    return (
      <Modalbox
        style={Style.s({ w: SCREEN_WIDTH, h: height, bor: 8, over: 'hidden' })}
        useNativeDriver
        backdropPressToClose
        backdropColor={'rgba(16, 15, 15, 0.7)'}
        animationDuration={500}
        backdrop
        backButtonClose
        isOpen={isOpen}
        swipeToClose
        position={'bottom'}
        onClosed={onClose}
      >
        <View
          style={Style.s({
            w: SCREEN_WIDTH,
            h: height,
            bg: Colors.grayscale[80],
            bor: 8,
            px: 16,
          })}
        >
          <View
            style={Style.s({
              w: 40,
              h: 4,
              bor: 4,
              bg: Colors.white[1],
              self: 'center',
              mt: 8,
            })}
          />
          <Text
            style={Fonts.t({
              s: 18,
              w: '500',
              t: 24,
              c: Colors.white[2],
              self: 'center',
            })}
          >
            {'Choose currency'}
          </Text>
          <FlatList
            data={tokens}
            style={Style.s({ mt: 24 })}
            ItemSeparatorComponent={() => <View style={Style.s({ h: 8 })} />}
            renderItem={renderItem}
          />
        </View>
      </Modalbox>
    );
  },
);
