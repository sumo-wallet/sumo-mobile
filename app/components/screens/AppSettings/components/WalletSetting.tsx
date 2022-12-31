import React, { memo, useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontStyles } from '../../../../styles/common';
import { icons } from '../../../../assets';
import { useTheme } from '../../../../util/theme';
import { Ticker } from 'app/types';
import { strings } from '../../../../../locales/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { setLockTime } from '../../../../actions/settings';
import { useNavigator } from '../../../hooks';
import { SelectModal } from '../../../UI/SelectModal';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  });

export const WalletSetting = function WalletSetting() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();
  const navigation = useNavigator();

  const seedphraseBackedUp = useSelector(
    (state) => state.user.seedphraseBackedUp,
  );
  const selectedAddress = useSelector(
    (state) =>
      state.engine.backgroundState.PreferencesController.selectedAddress,
  );
  const accounts = useSelector(
    (state) => state.engine.backgroundState.AccountTrackerController.accounts,
  );
  const identities = useSelector(
    (state) => state.engine.backgroundState.PreferencesController.identities,
  );

  const handleRevealSecretPhase = () => {
    navigation.navigate('RevealPrivateCredentialView', {
      privateCredentialName: 'seed_phrase',
    });
  };
  const handleShowPrivateKey = () => {
    navigation.navigate('RevealPrivateCredentialView', {
      privateCredentialName: 'private_key',
    });
  };

  const WarningIcon = () => {
    const { colors } = useTheme();

    return (
      <Icon size={16} color={colors.error.default} name="exclamation-triangle" />
    );
  };


  const renderFaceID = () => {
    return (
      <TouchableOpacity
        style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
      >
        <Text style={styles.settingTitle}>{'Backup'}</Text>
        <View style={styles.containerValue}>
          <Text style={styles.settingSubTitle}>
            {strings(
              seedphraseBackedUp
                ? 'app_settings.seedphrase_backed_up'
                : 'app_settings.seedphrase_not_backed_up',
            )}
          </Text>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderShowPrivateKey = () => {
    const account = {
      address: selectedAddress,
      ...identities[selectedAddress],
      ...accounts[selectedAddress],
    };
    return (
      <>
        <TouchableOpacity
          style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
          onPress={handleShowPrivateKey}
        >
          <Text style={styles.settingTitle}>
            {strings('reveal_credential.private_key_title_for_account', {
              accountName: account.name,
            })}
          </Text>
          <View style={styles.containerValue}>
            <Image source={icons.iconArrowRight} style={styles.icon} />
          </View>
        </TouchableOpacity>
      </>
    );
  };
  const renderRevealSecretPhase = () => {
    return (
      <TouchableOpacity
        style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
        onPress={handleRevealSecretPhase}
      >
        <Text style={styles.settingTitle}>
          {strings('app_settings.protect_title')}
        </Text>
        <View style={styles.containerValue}>
          {!seedphraseBackedUp && <WarningIcon />}
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderAdvance = () => {
    return (
      <TouchableOpacity style={styles.containerItem} onPress={() => { }}>
        <Text style={styles.settingTitle}>{'Delete wallet'}</Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.title}>{'WALLET'}</Text>
      </View>
      <View style={styles.containerBox}>
        {renderRevealSecretPhase()}
        {renderShowPrivateKey()}
        {renderAdvance()}
      </View>
    </View>
  );
};

export default memo(WalletSetting);
