import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { icons } from '../../../../assets';
import { useTheme } from '../../../../util/theme';

interface WalletItemInterface {
  title: string;
  description: string;
  isDisable?: boolean;
  isHiddenDivider?: boolean;
  isIconWarning?: boolean;
  onPress: () => void;
}

const createStyles = (colors) =>
  StyleSheet.create({
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
      color: colors.text.default,
    },
    description: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.muted,
    },
    containerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 16,
      height: 16,
      marginLeft: 8,
      tintColor: colors.text.muted,
    },
  });

export const WalletItem = ({
  title,
  description,
  isDisable = true,
  isHiddenDivider,
  isIconWarning,
  onPress,
}: WalletItemInterface) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <TouchableOpacity
      style={[
        styles.screenWrapper,
        {
          borderBottomWidth: isHiddenDivider ? 0 : 0.5,
          borderBottomColor: isHiddenDivider ? 'transparent' : '#1B2537',
        },
      ]}
      disabled={isDisable}
      onPress={onPress}
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
