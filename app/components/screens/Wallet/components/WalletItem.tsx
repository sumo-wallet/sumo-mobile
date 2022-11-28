import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../../styles/common';
import Colors from '../../../../styles/colors';
import { icons } from '../../../../assets';

interface WalletItemInterface {
  title: string;
  description: string;
  isDisable?: boolean;
  isHiddenDivider?: boolean;
  isIconWarning?: boolean;
}

const styles = StyleSheet.create({
  screenWrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray5,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.gray[5],
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: 8,
  },
});

export const WalletItem = ({
  title,
  description,
  isDisable = true,
  isHiddenDivider,
  isIconWarning,
}: WalletItemInterface) => {
  return (
    <TouchableOpacity
      style={[
        styles.screenWrapper,
        {
          borderBottomWidth: isHiddenDivider ? 0 : 0.5,
          borderBottomColor: isHiddenDivider ? colors.transparent : '#1B2537',
        },
      ]}
      disabled={isDisable}
    >
      <View style={styles.containerTitle}>
        <Text style={styles.title}>{title}</Text>
        {isIconWarning && (
          <Image source={icons.iconNotice} style={styles.icon} />
        )}
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.description}>{description}</Text>
        {!isDisable && (
          <Image source={icons.iconArrowRight} style={styles.icon} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(WalletItem);
