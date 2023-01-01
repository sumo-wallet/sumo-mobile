import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { SHeader } from './../../common/SHeader';
import { Style } from './../../../styles';
import { strings } from '../../../../locales/i18n';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { WalletItem } from '../Wallet/components/WalletItem';
import { SButton } from '../../common/SButton';
import { useTheme } from '../../../util/theme';
import { icons } from '../../../assets';
import Engine from '../../../core/Engine';
import { useNavigatorParams } from '../../hooks';
import NotificationManager from '../../../../app/core/NotificationManager';
import { useNavigation } from '@react-navigation/native';
import deviceInfoModule from 'react-native-device-info';

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
      backgroundColor: colors.box.default,
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

export const AppDetailScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  // const {
  //   address,
  //   selectedAddress,
  //   index,
  //   orderedAccounts,
  // }: {
  //   address: string;
  //   selectedAddress: string;
  //   index: number;
  //   orderedAccounts: any[];
  // } = useNavigatorParams();
  const navigation = useNavigation();

  const handleExportPrivateKey = () => {
    navigation.navigate('RevealPrivateCredentialView', {
      privateCredentialName: 'private_key',
    });
  }


  return (
    <SafeAreaView style={styles.wrapper}>
      {/* <DynamicHeader title={'SUMO'} /> */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.containerHeader}>
          <Image source={icons.iconWalletDetail} style={styles.icon} />
          <Text style={styles.nameWallet}>
            {deviceInfoModule.getVersion()}
          </Text>
        </View>
        <View style={styles.containerDescription}>
          <WalletItem title={'Check Update'} description={'2022-10-18 11:35:09'}
            onPress={() => {

            }} />
          <WalletItem
            title={'Give us feedback'}
            description={''}
          />
          <WalletItem
            title={strings('app_information.privacy_policy')}
            description={'sumowallet.io'}
          />
          <WalletItem
            title={strings('app_information.web_site')}
            description={'sumowallet.io'}
          />
          <WalletItem
            title={strings('app_information.contact_us')}
            description={'sumowallet.io'}
            isHiddenDivider
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
