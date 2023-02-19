import React, { memo, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { icons } from '../../../../assets';
import { renderFiat } from '../../../../util/number';
import Engine from '../../../../core/Engine';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../../util/theme';
import { useNavigation } from '@react-navigation/native';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      padding: 16,
      borderBottomWidth: 4,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: colors.background.walletBody,
    },
    title: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.muted,
    },
    containerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    containerRightTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 14,
      height: 14,
      marginHorizontal: 4,
    },
    containerTotal: {
      flexDirection: 'row',
      marginTop: 4,
      paddingBottom: 12,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.muted,
    },
    titleAmount: {
      fontSize: 38,
      fontWeight: '500',
      color: colors.text.default,
    },
    iconEye: {
      width: 24,
      height: 24,
      tintColor: colors.text.default,
    },
    containerWallet: {
      flexDirection: 'row',
      marginTop: 12,
      alignItems: 'center',
    },
    titleWallet: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.default,
      marginRight: 8,
    },
  });

interface BalanceFrameInterface {
  account: any;
  selectedAddress: any;
  orderedAccounts: any;
}

export const BalanceFrame = memo(
  ({ account, selectedAddress, orderedAccounts }: BalanceFrameInterface) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const navigation = useNavigation();
    const [isHidden, setIsHidden] = useState<boolean>(false);
    const currentCurrency = useSelector(
      (state: any) =>
        state.engine.backgroundState.CurrencyRateController.currentCurrency,
    );
    const fiatBalance = useMemo(() => {
      return `${renderFiat(
        Engine.getTotalFiatAccountBalance(),
        currentCurrency,
      )}`;
    }, [currentCurrency]);

    return (
      <View style={styles.wrapper}>
        <View style={styles.containerTitle}>
          <Text style={styles.title}>{'Total Balance'}</Text>
          <View style={styles.containerRightTitle}>
            <Text style={[styles.title, { fontSize: 12 }]}>{'PNL'}</Text>
            <Image source={icons.iconNotice} style={styles.icon} />
            <Text
              style={[
                styles.title,
                { fontSize: 12, color: colors.primary.default },
              ]}
            >
              {'-%'}
            </Text>
          </View>
        </View>
        <View style={styles.containerTotal}>
          <Text style={styles.titleAmount}>
            {isHidden ? '******' : fiatBalance}
          </Text>
          <TouchableOpacity onPress={() => setIsHidden(!isHidden)}>
            <Image
              source={isHidden ? icons.iconEyeOpen : icons.iconEyeClose}
              style={styles.iconEye}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.containerWallet}
          onPress={() => {
            navigation.navigate('WalletDetailView', {
              address: account,
              selectedAddress,
              orderedAccounts,
            });
          }}
        >
          <Text style={styles.titleWallet}>{'Wallet Detail'}</Text>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  },
);

export default BalanceFrame;
