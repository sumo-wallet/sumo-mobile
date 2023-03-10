import React, { memo, useMemo } from 'react';
import { DetailCoinInterface } from '../DetailCoinScreen';
import { useTheme } from '../../../../util/theme';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { scale } from '../../../../util/scale';
import { useAsyncEffect } from '../../../hooks/useAsyncEffect';
import { CoinsDetailParams } from '../../../../types/coingecko/schema';
import { getCoinDetails } from '../../../../reducers/coinmarkets/functions';
import { useCoinMarkets } from '../../../../reducers/coinmarkets/slice';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.border.default + '30',
    },
    wrapperHeader: {
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.muted,
      paddingVertical: 12,
    },
    wrapperItem: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    titleItem: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text.muted,
      textTransform: 'uppercase',
    },
    titleGlobal: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text.muted,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    wrapperGlobal: {
      flexDirection: 'row',
      marginVertical: 12,
    },
    containerGlobal: {
      paddingVertical: 8,
      paddingLeft: 12,
      paddingRight: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border.muted,
      marginRight: 20,
    },

    title: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
    },

    titlePrompt: {
      fontSize: 14,
      color: colors.text.muted,
      fontWeight: '500',
    },
    titlePrice: {
      fontSize: 32,
      color: colors.text.default,
      fontWeight: '700',
      paddingLeft: 20,
    },
    titleValue: {
      fontSize: 14,
      color: colors.primary.default,
      textAlign: 'right',
    },
    titlePercent: {
      fontSize: 14,
      color: colors.error.default,
      fontWeight: '600',
    },
    titleTime: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '600',
      marginRight: 40,
    },
    iconArrow: {
      width: 20,
      height: 12,
      tintColor: colors.error.default,
    },
    containerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 4,
    },
    containerMarket: {
      alignItems: 'flex-end',
      width: scale(120),
    },
    containerSymbol: {
      alignItems: 'center',
      width: scale(50),
    },
    containerScroll: {
      paddingVertical: 10,
    },
    btnScroll: {
      marginHorizontal: 10,
    },
    wrapTable: {
      backgroundColor: colors.background.default,
      margin: 20,
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: colors.border.muted,
    },
    containerTable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 20,
      marginHorizontal: 20,
      borderTopWidth: 0.5,
      borderColor: colors.border.muted,
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border.muted,
      marginHorizontal: 20,
    },
    row: {
      flexDirection: 'row',
    },
  });

export const InfoCoinTab = memo(({ id, currency }: DetailCoinInterface) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { call, error, loading } = useAsyncEffect(async () => {
    const params: Omit<CoinsDetailParams, 'id'> = {
      localization: 'false',
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    };
    await getCoinDetails(params, id);
  }, [id]);

  const coin_details = useCoinMarkets(id);
  console.log('check = ', coin_details);

  const titleHomePage = useMemo(() => {
    if (!coin_details) return '';
    return coin_details.links.homepage.filter(Boolean).join('\n');
  }, [coin_details]);

  const titleBlockchainSite = useMemo(() => {
    if (!coin_details) return '';
    return coin_details.links.blockchain_site.filter(Boolean).join('\n');
  }, [coin_details]);

  const titleChatUrl = useMemo(() => {
    if (!coin_details) return '';
    return coin_details.links.chat_url.filter(Boolean).join('\n');
  }, [coin_details]);

  const titleGenesisChat = useMemo(() => {
    if (!coin_details) return '';
    return coin_details.genesis_date;
  }, [coin_details]);

  const titleTwitter = useMemo(() => {
    if (!coin_details) return '';
    return 'www.twitter.com/' + coin_details.links.twitter_screen_name;
  }, [coin_details]);

  const titleOfficialForum = useMemo(() => {
    if (!coin_details) return '';
    return coin_details.links.official_forum_url.filter(Boolean).join('\n');
  }, [coin_details]);

  if (!coin_details) return null;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={call} />}
    >
      <View style={styles.wrapTable}>
        <View style={[styles.containerTable, { borderTopWidth: 0 }]}>
          <Text style={styles.titlePrompt}>{'Homepage'}</Text>
          <Text style={styles.titleValue}>{titleHomePage}</Text>
        </View>
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Blockchain/Supply'}</Text>
          <Text style={styles.titleValue}>{titleBlockchainSite}</Text>
        </View>
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Discussion Forum'}</Text>
          <Text style={styles.titleValue}>{titleOfficialForum}</Text>
        </View>
        {titleChatUrl !== '' && (
          <View style={styles.containerTable}>
            <Text style={styles.titlePrompt}>{'Chat'}</Text>
            <Text style={styles.titleValue}>{titleChatUrl}</Text>
          </View>
        )}
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Genesis Date'}</Text>
          <Text style={[styles.titleValue, { color: colors.text.default }]}>
            {titleGenesisChat}
          </Text>
        </View>
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Twitter'}</Text>
          <Text style={styles.titleValue}>{titleTwitter}</Text>
        </View>
        <View style={styles.containerTable}>
          <Text style={styles.titlePrompt}>{'Facebook'}</Text>
          <Text style={styles.titleValue}>{titleTwitter}</Text>
        </View>
      </View>
    </ScrollView>
  );
});
