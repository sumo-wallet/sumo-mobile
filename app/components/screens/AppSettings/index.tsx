import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
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
import SecuritySetting from './components/SecuritySetting';
import GeneralSetting from './components/GeneralSetting';

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
      backgroundColor: colors.background.default,
      width: '100%',
      marginTop: 20,
    },
    logoContainer: {
      marginTop: 20,
      marginHorizontal: 50,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    joinTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text.default,
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: 12,
    },
    imageLogo: {
      width: 44,
      height: 44,
    },
    containerBtn: {
      backgroundColor: 'blue',
      flex: 1,
      width: '100%',
      alignSelf: 'flex-end',
    },
  });

export const AppSettingsScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.wrapper}>
      <DynamicHeader title={'Wallet Detail'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <SecuritySetting></SecuritySetting>
        <GeneralSetting></GeneralSetting>
        <View style={styles.containerOption}>
          <Text style={styles.joinTitle}>{'JOIN OUR COMMUNITY'}</Text>
          <View style={styles.logoContainer}>
            <TouchableOpacity>
              <Image style={styles.imageLogo} source={icons.logoFacebook}></Image>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={styles.imageLogo} source={icons.logoFacebook}></Image>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={styles.imageLogo} source={icons.logoFacebook}></Image>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
      <SButton
        title={'Lock wallet'}
        onPress={() => {
          // onLongPress(
          //   address,
          //   selectedAddress,
          //   index,
          //   orderedAccounts,
          //   navigation,
          // );
        }}
        type="danger"
        style={Style.s({ mx: 16 })}
      />
    </SafeAreaView>
  );
};
