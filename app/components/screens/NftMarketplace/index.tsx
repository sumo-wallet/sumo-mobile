import CollectibleContracts from '../../UI/CollectibleContracts';
import React from 'react';
import { View, SafeAreaView, Text, StyleSheet, FlatList } from 'react-native';
import { strings } from '../../../../locales/i18n';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/theme';
import { fontStyles } from '../../../styles/common';
import { Category } from './components/Category';
import Auction from './components/Auction';
import Collection from './components/Collection';
import Market from './components/Market';
import Popular from './components/Popular';
import Spotlight from './components/Spotlight';

const LAYOUT = [
  {
    name: '',
    type: 'category',
  },
  {
    name: 'Top Market',
    type: 'top_market',
  },
  {
    name: 'Hot Bids',
    type: 'hot_bids',
  },
  {
    name: 'Trending collections',
    type: 'trending_collection',
  },
  {
    name: 'Spotlight',
    type: 'spotlight',
  },
  {
    name: 'Popular',
    type: 'popular',
  },
];

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      marginTop: 16,
    },
    emptyView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    add: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addText: {
      fontSize: 14,
      color: colors.primary.default,
      ...fontStyles.normal,
    },
    footer: {
      flex: 1,
      paddingBottom: 30,
      alignItems: 'center',
      marginTop: 24,
    },
    emptyContainer: {
      flex: 1,
      marginBottom: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyImageContainer: {
      width: 76,
      height: 76,
      marginTop: 30,
      marginBottom: 12,
      tintColor: colors.icon.muted,
    },
    emptyTitleText: {
      fontSize: 24,
      color: colors.text.alternative,
    },
    emptyText: {
      color: colors.text.alternative,
      marginBottom: 8,
      fontSize: 14,
    },
  });

interface LayoutData {
  name: string;
  type: string;
}
export const NftMarketplaceScreen = React.memo(() => {
  // const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderItem = ({ item, index }: { item: LayoutData; index: number }) => {
    if (item.type === 'category') {
      return <Category />;
    } else if (item.type === 'top_market') {
      return <Market />;
    } else if (item.type === 'hot_bids') {
      return <Auction title={item.name} />;
    } else if (item.type === 'trending_collection') {
      return <Collection />;
    } else if (item.type === 'popular') {
      return <Popular />;
    } else if (item.type === 'spotlight') {
      return <Spotlight />;
    }



    return null;
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.wrapper}>
        <FlatList data={LAYOUT} renderItem={renderItem} />
      </View>
    </SafeAreaView>
  );
});
