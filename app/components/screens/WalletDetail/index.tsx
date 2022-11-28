import React from 'react';
import { View, SafeAreaView, Text, StatusBar, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { SHeader } from './../../common/SHeader';
import { Style } from './../../../styles';
import { strings } from '../../../../locales/i18n';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { WalletItem } from '../Wallet/components/WalletItem';
import { SButton } from '../../common/SButton';
import { useTheme } from '../../../util/theme';
import { icons } from '../../../assets';
import { useSelector } from 'react-redux';
import Engine from '../../../core/Engine';
import { useNavigatorParams } from '../../hooks';
import NotificationManager from '../../../../app/core/NotificationManager';
import { useNavigation } from '@react-navigation/native';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    screenWrapper: {
      flex: 1,
    },
    container: {},
    contentContainer: {
      alignItems: 'center',
      marginVertical: 20,
      marginHorizontal: 16,
    },
    containerHeader: {
      alignItems: 'center',
    },
    icon: {
      width: 72,
      height: 72,
    },
    nameWallet: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text.default,
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: 12,
    },
    containerDescription: {
      borderRadius: 8,
      backgroundColor: colors.background.default,
      width: '100%',
      marginTop: 36,
    },
    containerOption: {
      borderRadius: 8,
      backgroundColor: colors.background.default,
      width: '100%',
      marginTop: 20,
    },
    containerBtn: {
      backgroundColor: 'blue',
      flex: 1,
      width: '100%',
      alignSelf: 'flex-end',
    },
  });

const onLongPress = (address: string, selectedAddress: string, index: int, orderedAccounts: any, navigation: any) => {

  Alert.alert(
    strings('accounts.remove_account_title'),
    strings('accounts.remove_account_message'),
    [
      {
        text: strings('accounts.no'),
        onPress: () => false,
        style: 'cancel',
      },
      {
        text: strings('accounts.yes_remove_it'),
        onPress: async () => {
          const { PreferencesController } = Engine.context;
          const isRemovingCurrentAddress = selectedAddress === address;
          const fallbackAccountIndex = 0; //index - 1;
          const fallbackAccountAddress =
            orderedAccounts[fallbackAccountIndex].address;

          // TODO - Refactor logic. onAccountChange is only used for refreshing latest orderedAccounts after account removal. Duplicate call for PreferencesController.setSelectedAddress exists.
          // Set fallback address before removing account if removing current account
          isRemovingCurrentAddress && orderedAccounts.length > 0 &&
            PreferencesController.setSelectedAddress(fallbackAccountAddress);
          await Engine.context.KeyringController.removeAccount(address);
          // Default to the previous account in the list if removing current account
          // this.onAccountChange(
          //   isRemovingCurrentAddress
          //     ? fallbackAccountAddress
          //     : selectedAddress,
          // );

          NotificationManager.showSimpleNotification({
            status: `simple_notification`,
            duration: 5000,
            title: strings('wallet.delete_wallet'),
            description: strings('wallet.delete_wallet_completed'),
          });
          setTimeout(() => {
            navigation.goBack();
          }, 6000);

        },
      },
    ],
    { cancelable: false },
  );
};

export const WalletDetailScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { address, selectedAddress, index, orderedAccounts }: { address: string, selectedAddress: string, index: int, orderedAccounts: array } = useNavigatorParams();
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.wrapper}>
      <DynamicHeader title={'Wallet Detail'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.containerHeader}>
          <Image source={icons.iconWalletDetail} style={styles.icon} />
          <Text style={styles.nameWallet}>{'Wallet address\n'}{address}</Text>
        </View>
        <View style={styles.containerDescription}>
          <WalletItem title={'Created by'} description={'Mnemonic Phrase'} />
          <WalletItem
            title={'Imported time'}
            description={'2022-10-18 11:35:09'}
          />
          <WalletItem
            title={'Security Suffix'}
            description={'5H2'}
            isHiddenDivider
            isIconWarning
          />
        </View>
        <View style={styles.containerOption}>
          <WalletItem
            title={'Mnemonic Phrase'}
            description={'Mnemonic Phrase'}
            isDisable={false}
          />
          <WalletItem
            title={'Export Public Key'}
            description={''}
            isDisable={false}
            isIconWarning
          />
          <WalletItem
            title={'Export Private Key'}
            description={''}
            isHiddenDivider
            isDisable={false}
          />
        </View>
        <View style={styles.containerOption}>
          <WalletItem title={'Coin'} description={'...'} isHiddenDivider />
        </View>
      </ScrollView>
      <SButton
        title={'Remove wallet'}
        onPress={() => { onLongPress(address, selectedAddress, index, orderedAccounts, navigation) }}
        type="danger"
        style={Style.s({ mx: 16 })}
      />
    </SafeAreaView>
  );
};
