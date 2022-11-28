import React, { useCallback } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { strings } from '../../../../locales/i18n';
import { useTheme } from '../../../util/theme';
import { fontStyles } from '../../../styles/common';
import { DynamicHeader } from '../../Base/DynamicHeader';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { toggleAddAccountsModal } from '../../../actions/modals';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      flex: 1,
      minHeight: 500,
      marginTop: 16,
    },
    options: {
      backgroundColor: colors.background.default,
      flex: 1,
      marginTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addText: {
      fontSize: 14,
      color: colors.primary.default,
      fontWeight: '600',
      ...fontStyles.normal,
    },
    buttonTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.default,
      ...fontStyles.bold,
    },
    buttonSubTitle: {
      fontSize: 14,
      color: colors.text.default,
      ...fontStyles.normal,
    },
    footer: {
      flex: 1,
      paddingBottom: 30,
      alignItems: 'center',
      marginTop: 24,
    },

    buttonContainer: {
      marginBottom: 18,
      padding: 16,
      justifyContent: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border.default,
      marginHorizontal: 16,
      marginTop: 20,
    },
    button: {
      flexDirection: 'row',
    },
    title: {
      flexDirection: 'column',
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.border.default,
      tintColor: colors.icon.muted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
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
export const AddWalletScreen = React.memo(() => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();

  const onAccountsModal = useCallback(() => {
    dispatch(toggleAddAccountsModal());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <DynamicHeader title={'Add wallet'} />
      <View style={styles.options}>
        <Text style={styles.addText}>
          {'Add a wallet to start Your crypto Jourey'}
        </Text>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onAccountsModal}
        >
          <View style={styles.button}>
            <View style={styles.icon}>
              <Ionicon
                name="ios-wallet"
                size={20}
                color={colors.text.default}
              />
            </View>
            <View style={styles.title}>
              <Text style={styles.buttonTitle}>{'Software Wallet'}</Text>
              <Text style={styles.buttonSubTitle}>
                {'Create or import a software wallet'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <View style={styles.button}>
            <View style={styles.icon}>
              <Ionicon
                name="ios-finger-print"
                size={20}
                color={colors.text.default}
              />
            </View>
            <View style={styles.title}>
              <Text style={styles.buttonTitle}>{'Hardware Wallet'}</Text>
              <Text style={styles.buttonSubTitle}>
                {'Create or import a software wallet'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});
