import React from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { strings } from '../../../../locales/i18n';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/theme';
import { useGetAllNews } from '../../hooks/useGetAllNews';
import FastImage from 'react-native-fast-image';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      marginTop: 16,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 16,
    },
    emptyView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    thumbnail: {
      width: 120,
      height: 60,
    },
    description: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.default,
    },
    titleHour: {
      fontSize: 10,
      fontWeight: '500',
      color: colors.text.alternative,
    },
    containerTitle: {
      width: '60%',
      justifyContent: 'space-around',
    },
    title: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text.default,
    },
    titleViewAll: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.default,
    },
    containerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    containerViewAll: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 14,
      height: 14,
      marginLeft: 8,
    },
  });
export const NewsScreen = React.memo(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { news } = useGetAllNews();
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.wrapper}>
        {news.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.container}
              onPress={() => {
              }}
            >
              <View style={styles.containerTitle}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.titleHour}>{item.hours}</Text>
              </View>
              <FastImage
                style={styles.thumbnail}
                source={{ uri: item.thumbnail }}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
});
