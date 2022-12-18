/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Style, Colors, Fonts } from '../../../styles';
import { placeholders } from '../../../assets';
import { Dapp } from './../../../types';
// import FlatMarquee from './FlatMarquee/FlatMarquee';
import { useTheme } from '../../../util/theme';

export const data = [
  'AAPL',
  'GOOGL',
  'GOOG',
  'MSFT',
  'FB',
  'TSM',
  'INTC',
  'ORCL',
  'CSCO',
  'NVDA',
  'IBM',
  'SAP',
  'TXN',
  'QCOM',
  'ADBE',
  'AVGO',
  'DCM',
  'CRM',
  'AABA',
  'BIDU',
  'ITW',
  'ATVI',
  'AMAT',
  'ADP',
  'MU',
  'VMW',
  'CTSH',
  'INTU',
  'NXPI',
  'INFY',
  'EA',
  'ETN',
  'HPQ',
  'ADI',
  'NOK',
  'FISV',
  'DXC',
  'LRCX',
  'NOW',
  'HPE',
  'WDC',
  'WDAY',
  'WIT',
  'TWTR',
  'ADSK',
  'SNAP',
  'WPP',
  'RHT',
  'KYO',
  'CERN',
].map((item) => ({
  title: item,
  price: parseInt((Math.random() * 1000).toFixed(2), 10),
  change: parseInt((Math.random() * 100).toFixed(2), 10),
  isGain: Math.floor(Math.random() * 10).toFixed(2) > 5,
}));

export const dummyDataNowTrending: Dapp[] = [
  {
    id: 0,
    name: 'AAVE',
    image: placeholders.dapp3,
    banner: undefined,
    chainName: 'Binance Smart Chain',
    provider: 'AAVE',
    website: 'https://aave.com/',
  },
  {
    id: 1,
    name: 'UniSwap',
    image: placeholders.dapp4,
    banner: undefined,
    chainName: 'Ethereum',
    provider: 'Ethereum',
    website: 'https://uniswap.org/',
  },
  {
    id: 2,
    name: 'Biswap',
    image: placeholders.dapp5,
    banner: undefined,
    chainName: 'Binance Smart Chain',
    provider: 'Biswap',
    website: 'https://biswap.org/',
  },
  {
    id: 3,
    name: 'Solana',
    image: placeholders.dapp6,
    banner: placeholders.dappBanner1,
  },
  {
    id: 4,
    name: 'PancakeSwap',
    image: placeholders.dapp7,
    banner: placeholders.dappBanner1,
    chainName: 'Binance Smart Chain',
    provider: 'PancakeSwap',
    website: 'https://pancakeswap.finance',
  },
  {
    id: 5,
    name: 'AAVE',
    image: placeholders.dapp3,
    banner: placeholders.dappBanner1,
  },
  {
    id: 6,
    name: 'UniSwap',
    image: placeholders.dapp4,
    banner: placeholders.dappBanner1,
  },
];

export interface NowTrendingProps {
  style?: StyleProp<ViewStyle>;
  onSelect?: (dapp: Dapp) => void;
}

export const NowTrending = ({ style, onSelect }: NowTrendingProps) => {
  const { colors } = useTheme();
  const renderItem = React.useCallback(
    ({ item }: { item: Dapp; index: number }) => {
      return (
        <TouchableOpacity onPress={() => onSelect && onSelect(item)}>
          <Image style={Style.s({ size: 64, bor: 8 })} source={item.image} />
        </TouchableOpacity>
      );
    },
    [onSelect],
  );

  return (
    <View
      style={[
        Style.s({ bg: colors.background.default, mt: 24, pb: 16 }),
        Style.shadow(Colors.shadow[1], 2, 4, 16),
        style,
      ]}
    >
      <View
        style={Style.s({
          px: 16,
          pt: 12,
        })}
      >
        <Text style={Fonts.t({ s: 12, c: colors.text.default })}>
          {'NOW TRENDING'}
        </Text>
        <Text
          style={Fonts.t({ s: 24, w: '700', c: colors.text.default, t: 4 })}
        >
          {'Top Dapps all \nover the world'}
        </Text>
      </View>
      <View style={Style.s({ mt: 18 })}>
        <FlatList
          data={dummyDataNowTrending}
          contentContainerStyle={Style.s({ l: -20 })}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={Style.s({ w: 8 })} />}
        />
        <FlatList
          style={Style.s({ mt: 8 })}
          data={dummyDataNowTrending}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={Style.s({ w: 8 })} />}
        />
        {/* <FlatList
          style={Style.s({ mt: 8 })}
          contentContainerStyle={Style.s({ l: -26 })}
          data={dummyDataNowTrending}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={Style.s({ w: 8 })} />}
        /> */}
        {/* <FlatMarquee
          style={Style.s({ mt: 8 })}
          data={data}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity>
                <Image
                  style={Style.s({ size: 64, bor: 8 })}
                  source={placeholders.dapp1}
                />
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={Style.s({ w: 8 })} />}
        /> */}
      </View>
    </View>
  );
};
