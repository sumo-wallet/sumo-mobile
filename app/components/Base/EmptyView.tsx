import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../styles/common';
import { images } from '../../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    lineHeight: 20,
    color: colors.gray4,
    paddingTop: 16,
  },
});

interface Props {
  title?: string;
}
export const EmptyView = memo((props: Props) => {
  const { title } = props;
  return (
    <View style={styles.container}>
      <Image source={images.imageEmptyView} />
      <Text style={styles.title}>{title || 'No data!'}</Text>
    </View>
  );
});
