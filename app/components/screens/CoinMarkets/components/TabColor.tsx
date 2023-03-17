import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../util/theme';

interface TabColor {
  isSelected: boolean;
  typeTab: string;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    textStyles: {
      color: colors.primary.default,
      fontSize: 15,
      fontWeight: '600',
    },
    wrapper: {
      paddingVertical: 10,
      width: '100%',
      alignItems: 'center',
    },
    line: {
      borderBottomWidth: 2,
      borderColor: colors.primary.default,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

function TabColor({ isSelected, typeTab }: TabColor) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <>
      {isSelected ? (
        <View style={[styles.wrapper]}>
          <Text style={styles.textStyles}>{typeTab}</Text>
          <View style={styles.line} />
        </View>
      ) : (
        <View style={styles.wrapper}>
          <Text style={[styles.textStyles, { color: colors.text.muted }]}>
            {typeTab}
          </Text>
        </View>
      )}
    </>
  );
}

export default memo(TabColor);
