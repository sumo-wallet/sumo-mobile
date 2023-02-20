import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../util/theme';
import { FlatList } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import Routes from '../../../../constants/navigation/Routes';
import { useNavigation } from '@react-navigation/native';

const MARKETS: [OpenMarket] = [
  {
    name: 'Opensea',
    website: 'https://opensea.io/',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/OpenSea_icon.svg/224px-OpenSea_icon.svg.png?20220821125510',
  },
  {
    name: 'Rarible',
    website: 'https://rarible.com/',
    image_url:
      'https://play-lh.googleusercontent.com/u8IKAAoel8dS1WG6n-ZbUbt_AXbpYGX8jLXCVp2l3LvRL5U9omMAk6TL4NyA9xXEqg',
  },
  {
    name: 'Nifty Gateway',
    website: 'https://opensea.io/',
    image_url:
      'https://cryptocurrencyjobs.co/startups/assets/logos/nifty-gateway.png',
  },
  {
    name: 'SuperRare',
    website: 'https://superrare.com/',
    image_url:
      'https://pbs.twimg.com/profile_images/1495039475839234052/gN6McV0d_400x400.png',
  },
  {
    name: 'Mintable',
    website: 'https://mintable.app/',
    image_url:
      'https://mintable.app/static/media/mintable-logo-new.e2bd394114ffcecad16c.png',
  },
  {
    name: 'NBA Top Shot',
    website: 'https://nbatopshot.com/',
    image_url:
      'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/T5WF37S5TFGFJFRBODOFGCY76M.png',
  },
  {
    name: 'Blur',
    website: 'https://blur.io/collections?utm_source=DappRadar&utm_medium=deeplink&utm_campaign=visit-website',
    image_url:
      'https://dashboard-assets.dappradar.com/document/20645/blur-dapp-marketplaces-ethereum-logo-166x166_af43246d0c88d0e9b308bbb033af89d0.png',
  },
  {
    name: 'LooksRare',
    website: 'https://looksrare.org/',
    image_url:
      'https://dashboard-assets.dappradar.com/document/12792/looksrare-dapp-marketplaces-ethereum-logo-166x166_bbc005cc5cca2ab3d6428ad10e97b92b.png',
  },
  {
    name: 'Immutable X',
    website: 'https://immutaswap.io/market',
    image_url:
      'https://dashboard-assets.dappradar.com/document/18681/immutaswapio-dapp-collectibles-immutablex-logo-166x166_d06c5d3a1e0adee3cbb057f3a23b9e6c.png',
  },
  {
    name: 'CryptoPunks',
    website: 'https://www.larvalabs.com/',
    image_url:
      'https://dashboard-assets.dappradar.com/document/12/cryptopunks-dapp-collectibles-eth-logo-166x166_63228960fde74ea67f2f9d5dd9dd5ce6.png',
  },
];

interface OpenMarket {
  name: string;
  website: string;
  image_url: string;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      width: '100%',
      backgroundColor: colors.background.default,
      padding: 16,
      marginVertical: 8,
    },
    headContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleHeader: {
      fontSize: 16,
      fontWeight: '600',
      marginVertical: 6,
      color: colors.text.default,
    },
    title: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text.default,
      width: 250,
      marginTop: 4,
    },
    containerFlatList: {
      marginTop: 8,
      backgroundColor: colors.background.default,
    },

    containerItem: {
      width: 100,
      height: 90,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background.default,
      marginHorizontal: 4,
    },
    containerName: { justifyContent: 'center', flex: 1 },
    nameDapp: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: 4,
      color: colors.text.default,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 10,
    },
  });

export const Market = function Market() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  // const dispatch = useDispatch();
  const handleOpenMarket = (item: OpenMarket) => {
    navigation.navigate(Routes.BROWSER_TAB_HOME, {
      screen: Routes.BROWSER_VIEW,
      params: {
        newTabUrl: item.website,
        timestamp: Date.now(),
        dapp: {
          logo: item.image_url,
          name: item.name,
          thumbnail: item.image_url,
          website: item.website,
        },
      },
    });
  };

  const renderItem = ({ item, index }: { item: OpenMarket; index: number }) => {
    return (
      <TouchableOpacity style={styles.containerItem} onPress={handleOpenMarket}>
        <FastImage
          source={{ uri: item.image_url }}
          style={styles.logo}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.containerName}>
          <Text style={styles.nameDapp}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.headContainer}>
        <Text style={styles.titleHeader}>{'Top Market'}</Text>
      </View>
      <View style={styles.containerFlatList}>
        <FlatList
          data={MARKETS}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default memo(Market);
