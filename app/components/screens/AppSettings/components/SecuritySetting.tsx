import React, { memo, useCallback, useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { fontStyles } from '../../../../styles/common';
import { icons } from '../../../../assets';
import { useTheme } from '../../../..//util/theme';
import { strings } from '../../../../../locales/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { setLockTime } from '../../../../actions/settings';
import { useNavigator } from '../../../../components/hooks';
import { SelectModal } from '../../../../components/UI/SelectModal';
import SecureKeychain from '../../../../core/SecureKeychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BIOMETRY_CHOICE,
  BIOMETRY_CHOICE_DISABLED,
  EXISTING_USER,
  PASSCODE_CHOICE,
  PASSCODE_DISABLED,
  TRUE,
} from '../../../../constants/storage';
import Device from '../../../../util/device';
import Logger from '../../../../util/Logger';
import Engine from '../../../../core/Engine';
import { trackErrorAsAnalytics } from '../../../../util/analyticsV2';
import { passwordSet } from '../../../../actions/user';
import AppConstants from '../../../../core/AppConstants';

const autolockOptions = [
  {
    value: '0',
    label: strings('app_settings.autolock_immediately'),
    key: '0',
  },
  {
    value: '5000',
    label: strings('app_settings.autolock_after', { time: 5 }),
    key: '5000',
  },
  {
    value: '15000',
    label: strings('app_settings.autolock_after', { time: 15 }),
    key: '15000',
  },
  {
    value: '30000',
    label: strings('app_settings.autolock_after', { time: 30 }),
    key: '30000',
  },
  {
    value: '60000',
    label: strings('app_settings.autolock_after', { time: 60 }),
    key: '60000',
  },
  {
    value: '300000',
    label: strings('app_settings.autolock_after_minutes', { time: 5 }),
    key: '300000',
  },
  {
    value: '600000',
    label: strings('app_settings.autolock_after_minutes', { time: 10 }),
    key: '600000',
  },
  {
    value: '-1',
    label: strings('app_settings.autolock_never'),
    key: '-1',
  },
];

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    containerHeader: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'left',
      color: colors.text.muted,
      ...fontStyles.bold,
    },
    containerBox: {
      backgroundColor: colors.box.default,
      borderRadius: 8,
      justifyContent: 'space-around',
      paddingHorizontal: 16,
      marginVertical: 16,
    },
    containerItem: {
      backgroundColor: colors.box.default,
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderBottomColor: colors.text.muted,
    },
    containerValue: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerFlatList: {
      marginTop: 16,
      marginBottom: 24,
    },
    icon: {
      width: 22,
      height: 22,
      tintColor: colors.text.muted,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      paddingVertical: 16,
      color: colors.text.default,
    },
    settingSubTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.muted,
    },
    titlePercent: {
      fontSize: 18,
      fontWeight: '500',
    },
    titleAmount: {
      fontSize: 12,
      fontWeight: '500',
      opacity: 0.7,
      marginTop: 2,
      color: colors.text.alternative,
    },
    containerPercent: {
      marginTop: 22,
    },
    picker: {
      borderColor: colors.border.default,
      borderRadius: 5,
      borderWidth: 2,
      marginTop: 16,
    },
    itemValueContainer: {
      width: 150,
      height: 44,
      alignItems: 'stretch',
      justifyContent: 'center',
    },
    switch: {
      marginTop: 10,
      alignSelf: 'flex-start',
    },
  });

export const SecuritySetting = function SecuritySetting() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();
  const navigation = useNavigator();
  const [isShowLockTimeModal, setShowLockTimeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometryType, setBiometryType] = useState('');
  const [biometryChoice, setBiometryChoice] = useState(false);
  const [passcodeChoice, setPasscodeChoice] = useState(false);

  const lockTime: number = useSelector((state) => state.settings.lockTime);

  useEffect(() => {
    const load = async () => {
      const supportedBiometryType =
        await SecureKeychain.getSupportedBiometryType();
      if (supportedBiometryType) {
        let passcodeEnabled = false;
        const savedBiometryChoice = await AsyncStorage.getItem(BIOMETRY_CHOICE);
        if (!savedBiometryChoice) {
          const savedPasscodeChoice = await AsyncStorage.getItem(
            PASSCODE_CHOICE,
          );
          if (savedPasscodeChoice !== '' && savedPasscodeChoice === TRUE) {
            passcodeEnabled = true;
          }
        }

        setBiometryType(
          supportedBiometryType && Device.isAndroid()
            ? 'biometrics'
            : supportedBiometryType,
        );
        setBiometryChoice(!!savedBiometryChoice);
        setPasscodeChoice(passcodeEnabled);
        // this.setState({
        //   analyticsEnabled,
        //   passcodeChoice: passcodeEnabled,
        //   hintText: manualBackup,
        // });
      } else {
        // this.setState({
        //   analyticsEnabled,
        //   hintText: manualBackup,
        // });
      }
    };
    load();
  }, [loading]);

  const selectLockTime = (lockTime: string) => {
    dispatch(setLockTime(parseInt(lockTime, 10)));
  };

  const handleChangePassword = () => {
    navigation.navigate('ResetPassword');
  };
  const toggleShowLockTimeModal = () => {
    setShowLockTimeModal(!isShowLockTimeModal);
  };

  const dispatchPasswordSet = () => {
    dispatch(passwordSet());
  };

  const storeCredentials = async (password, enabled, type) => {
    try {
      await SecureKeychain.resetGenericPassword();

      await Engine.context.KeyringController.exportSeedPhrase(password);

      await AsyncStorage.setItem(EXISTING_USER, TRUE);

      if (!enabled) {
        if (type === 'passcodeChoice') {
          await AsyncStorage.setItem(PASSCODE_DISABLED, TRUE);
          setPasscodeChoice(false);
        } else if (type === 'biometryChoice') {
          await AsyncStorage.setItem(BIOMETRY_CHOICE_DISABLED, TRUE);
          setBiometryChoice(false);
        }

        return;
      }

      if (type === 'passcodeChoice')
        await SecureKeychain.setGenericPassword(
          password,
          SecureKeychain.TYPES.PASSCODE,
        );
      else if (type === 'biometryChoice')
        await SecureKeychain.setGenericPassword(
          password,
          SecureKeychain.TYPES.BIOMETRICS,
        );

      dispatchPasswordSet();

      if (lockTime === -1) {
        setLockTime(AppConstants.DEFAULT_LOCK_TIMEOUT);
      }

      if (type === 'passcodeChoice') {
        setPasscodeChoice(true);
      } else if (type === 'biometryChoice') {
        setBiometryChoice(true);
      }
      setLoading(false);
    } catch (e) {
      if (e.message === 'Invalid password') {
        Alert.alert(
          strings('app_settings.invalid_password'),
          strings('app_settings.invalid_password_message'),
        );
        trackErrorAsAnalytics('SecuritySettings: Invalid password', e?.message);
      } else {
        Logger.error(e, 'SecuritySettings:biometrics');
      }
      if (type === 'passcodeChoice') {
        setPasscodeChoice(!enabled);
      } else if (type === 'biometryChoice') {
        setBiometryChoice(!enabled);
      }
      setLoading(false);
    }
  };

  const onSingInWithBiometrics = async (enabled) => {
    // this.setState({ loading: true }, async () => {
    //   let credentials;
    //   try {
    //     credentials = await SecureKeychain.getGenericPassword();
    //   } catch (error) {
    //     Logger.error(error);
    //   }
    //   if (credentials && credentials.password !== '') {
    //     storeCredentials(credentials.password, enabled, 'biometryChoice');
    //   } else {
    //     navigation.navigate('EnterPasswordSimple', {
    //       onPasswordSet: (password) => {
    //         storeCredentials(password, enabled, 'biometryChoice');
    //       },
    //     });
    //   }
    // });
    setLoading(true);
    let credentials;
    try {
      credentials = await SecureKeychain.getGenericPassword();
    } catch (error) {
      Logger.error(error);
    }
    if (credentials && credentials.password !== '') {
      storeCredentials(credentials.password, enabled, 'biometryChoice');
    } else {
      navigation.navigate('EnterPasswordSimple', {
        onPasswordSet: (password) => {
          storeCredentials(password, enabled, 'biometryChoice');
        },
      });
    }
  };

  const renderFaceID = () => {
    return (
      <TouchableOpacity
        style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
      >
        <Text style={styles.settingTitle}>{'Face ID'}</Text>
        <View style={styles.containerValue}>
          <Switch
            value={biometryChoice}
            onValueChange={onSingInWithBiometrics}
            trackColor={{
              true: colors.primary.default,
              false: colors.border.muted,
            }}
            thumbColor={colors.text.default}
            style={styles.switch}
            ios_backgroundColor={colors.border.muted}
          />
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderAutoLock = () => {
    return (
      <>
        <TouchableOpacity
          style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
          onPress={toggleShowLockTimeModal}
        >
          <Text style={styles.settingTitle}>
            {strings('app_settings.auto_lock')}
          </Text>
          <View style={styles.containerValue}>
            <Text style={styles.settingSubTitle}>{lockTime.toString()}</Text>
            <Image source={icons.iconArrowRight} style={styles.icon} />
            {autolockOptions && (
              <SelectModal
                isVisible={isShowLockTimeModal}
                selectedValue={lockTime.toString()}
                onValueChange={selectLockTime}
                title={strings('app_settings.auto_lock')}
                options={autolockOptions}
                onToggleModal={toggleShowLockTimeModal}
              />
            )}
          </View>
        </TouchableOpacity>
      </>
    );
  };
  const renderChangePassword = () => {
    return (
      <TouchableOpacity
        style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
        onPress={handleChangePassword}
      >
        <Text style={styles.settingTitle}>
          {strings('password_reset.change_password')}
        </Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderAdvance = () => {
    return (
      <TouchableOpacity style={styles.containerItem} onPress={() => { }}>
        <Text style={styles.settingTitle}>{'Advance Security'}</Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.title}>{'SECURITY'}</Text>
      </View>
      <View style={styles.containerBox}>
        {renderFaceID()}
        {renderAutoLock()}
        {renderChangePassword()}
        {renderAdvance()}
      </View>
    </View>
  );
};

export default memo(SecuritySetting);
