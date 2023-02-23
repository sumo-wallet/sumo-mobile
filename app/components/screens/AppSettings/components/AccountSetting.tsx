import React, { memo, useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontStyles } from '../../../../styles/common';
import { icons } from '../../../../assets';
import { useTheme } from '../../../..//util/theme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigator } from '../../../../components/hooks';
import { renderShortAddress } from '../../../../util/address';
import Identicon from '../../../../components/UI/Identicon';
import File from '../../../../services/File';
import { setAvatarUser } from '../../../../actions/user';

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      paddingVertical: 10,
    },
    containerHeader: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingLeft: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'left',
      color: colors.text.default,
      ...fontStyles.bold,
    },
    addressTitle: {
      fontSize: 14,
      fontWeight: '500',
      paddingVertical: 6,
      color: colors.text.muted,
    },
    containerBox: {
      height: 26,
      position: 'absolute',
      top: 20,
      right: -27,
      paddingRight: 20,
      backgroundColor: colors.primary.muted,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    icon: {
      width: 20,
      height: 20,
      margin: 4,
      tintColor: colors.text.muted,
    },
    backupedTitle: {
      fontSize: 13,
      fontWeight: '400',
      color: colors.primary.default,
    },
    accountContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    containerValue: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export const AccountSetting = function AccountSetting() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();
  const navigation = useNavigator();
  const selectedAddress = useSelector(
    (state) =>
      state.engine.backgroundState.PreferencesController.selectedAddress,
  );

  const onSelectImage = useCallback(async () => {
    const file = await File.pickImage({ multiple: false });
    dispatch(setAvatarUser(file[0].path));
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.accountContainer}>
        <TouchableOpacity onPress={onSelectImage}>
          <Identicon address={selectedAddress || ''} diameter={36} />
        </TouchableOpacity>
        <View style={styles.containerHeader}>
          <Text style={styles.title}>{'User'}</Text>
          <Text style={styles.addressTitle}>
            {renderShortAddress(selectedAddress)}
          </Text>
        </View>
      </View>
      <View style={styles.containerBox}>
        <Image style={styles.icon} source={icons.iconChecked} />
        <Text style={styles.backupedTitle}>{'Backuped'}</Text>
      </View>
    </View>
  );
};

export default memo(AccountSetting);
