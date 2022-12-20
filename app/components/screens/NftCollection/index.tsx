import CollectionNFT from '../../UI/CollectionNFT';
import React from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import { strings } from '../../../../locales/i18n';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/theme';
import { fontStyles } from '../../../styles/common';

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
export const NftCollectionScreen = React.memo(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.wrapper}>
        <CollectionNFT
          key={'nfts-tab'}
          navigation={navigation}
          style={styles.wrapper}
        />
      </View>
    </SafeAreaView>
  );
});
