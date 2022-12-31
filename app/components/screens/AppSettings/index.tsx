import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Style } from './../../../styles';
import { strings } from '../../../../locales/i18n';
import { SButton } from '../../common/SButton';
import { useTheme } from '../../../util/theme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SecuritySetting from './components/SecuritySetting';
import GeneralSetting from './components/GeneralSetting';
import OtherSetting from './components/OtherSetting';
import WalletSetting from './components/WalletSetting';
import { getClosableNavigationOptions } from '../../../components/UI/Navbar';
import { logOut } from '../../../actions/user';
import AccountSetting from './components/AccountSetting';
import CommunitySetting from './components/CommunitySetting';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    contentContainer: {
      alignItems: 'center',
      marginVertical: 20,
      marginHorizontal: 16,
      paddingBottom: 100,
    },
    containerHeader: {
      alignItems: 'center',
    },
    icon: {
      width: 72,
      height: 72,
    },
  });

export const AppSettingsScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const updateNavBar = () => {
    navigation.setOptions(
      getClosableNavigationOptions(
        strings('app_settings.title'),
        strings('navigation.close'),
        navigation,
        colors,
      ),
    );
  };

  useEffect(() => {
    updateNavBar();
  }, []);

  const handleLogOut = () => {
    dispatch(logOut());
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* <DynamicHeader title={'Wallet Detail'} /> */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <AccountSetting />
        <WalletSetting />
        <SecuritySetting />
        <GeneralSetting />
        <OtherSetting />
        <CommunitySetting />
      </ScrollView>
      <SButton
        title={'Lock wallet'}
        onPress={handleLogOut}
        type="danger"
        style={Style.s({ mx: 16, mb: 20 })}
      />
    </SafeAreaView>
  );
};
