import React, { memo, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { icons } from '../../../../assets';
import { baseStyles } from '../../../../styles/common';
import EthereumAddress from '../../../UI/EthereumAddress';
import { renderFiat } from '../../../../util/number';
import { useSelector } from 'react-redux';
import Engine from '../../../../core/Engine';
import { useTheme } from '../../../../util/theme';
import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/core';
import { ROUTES } from '../../../../navigation/routes';

export interface InformationFrameInterface {
  address?: string;
  onManage?: () => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      height: 200,
      borderRadius: 20,
      paddingVertical: 20,
      borderWidth: 1,
      borderColor: colors.primary.default,
      overflow: 'hidden',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 24,
      backgroundColor: colors.background.alternative,
    },
    iconLogo: {
      position: 'absolute',
      right: 0,
      bottom: 10,
    },
    address: {
      marginLeft: 16,
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.default,
    },
    containerBalance: {
      width: '100%',
      flexDirection: 'column',
    },
    containerAddress: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 16,
      height: 16,
      marginLeft: 4,
    },
    container: {
      width: '100%',
      justifyContent: 'space-between',
    },
    containerTotalTitle: {
      marginTop: 16,
      flexDirection: 'row',
    },
    titleTotal: {
      marginLeft: 16,
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.muted,
    },
    total: {
      marginHorizontal: 16,
      fontSize: 32,
      fontWeight: '500',
      color: colors.text.default,
    },
    blurView: {
      position: 'absolute',
      width: '100%',
      height: 100,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      opacity: 0.9,
    },
    manageContainer: {
      flexDirection: 'row',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      right: 10,
    },
    manageTitle: {
      marginHorizontal: 8,
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.default,
    },
  });

export const InformationFrame = function ({
  address,
  onManage,
}: InformationFrameInterface) {
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
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.container}>
        <Image
          source={icons.iconLogo}
          style={styles.iconLogo}
          resizeMode={'contain'}
        />
        <View style={styles.containerAddress}>
          <EthereumAddress
            address={address}
            style={styles.address}
            type={'short'}
          />
          <TouchableOpacity onPress={onManage}>
            <Image source={icons.iconClipBoard} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.containerBalance}>
          <BlurView
            blurType={'ultraThinMaterialDark'}
            blurAmount={10}
            style={styles.blurView}
          />
          <View style={styles.containerTotalTitle}>
            <Text style={styles.titleTotal}>{'Total Balance'}</Text>
            <TouchableOpacity
              onPress={() => {
                setIsHidden(!isHidden);
              }}
            >
              <Image
                source={isHidden ? icons.iconEyeOpen : icons.iconEyeClose}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>{isHidden ? '******' : fiatBalance}</Text>
          <TouchableOpacity
            style={styles.manageContainer}
            onPress={() => {
              navigation.navigate(ROUTES.WalletScreen);
            }}
          >
            <Text style={styles.manageTitle}>{'Manage'}</Text>
            <Image source={icons.iconArrowRight} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(InformationFrame);
