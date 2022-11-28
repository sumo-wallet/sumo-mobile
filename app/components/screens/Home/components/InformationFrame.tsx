import React, { memo, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { icons } from '../../../../assets';
import { baseStyles } from '../../../../styles/common';
import EthereumAddress from '../../../UI/EthereumAddress';
import { renderFiat } from '../../../../util/number';
import { useSelector } from 'react-redux';
import Engine from '../../../../core/Engine';
import { useTheme } from '../../../../util/theme';

export interface InformationFrameInterface {
  address?: string;
  onManage?: () => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      borderRadius: 20,
      paddingLeft: 16,
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
      marginVertical: -20,
    },
    address: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.default,
    },
    containerBalance: {
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
      justifyContent: 'space-between',
    },
    titleTotal: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.default,
    },
    total: {
      fontSize: 32,
      fontWeight: '400',
      color: colors.text.default,
    },
  });

export const InformationFrame = function ({
  address,
  onManage,
}: InformationFrameInterface) {
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
          <View style={baseStyles.flexDirection}>
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
        </View>
      </View>
      <Image source={icons.iconLogo} style={styles.iconLogo} />
    </View>
  );
};

export default memo(InformationFrame);
