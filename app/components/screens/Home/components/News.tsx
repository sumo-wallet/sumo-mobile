import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { icons } from '../../../../assets';
import { useTheme } from '../../../..//util/theme';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../../constants/navigation/Routes';

export interface DataNewsInterface {
  description: string;
  hours: number;
  thumbnail: string;
  url: string;
}

export interface RawNewsInterface {
  news: DataNewsInterface[];
  onSelect?: (item: DataNewsInterface) => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {},
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 16,
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

export const News = function News({ news, onSelect }: RawNewsInterface) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.containerHeader}>
        <Text style={styles.title}>{'News'}</Text>
        <TouchableOpacity
          style={styles.containerViewAll}
          onPress={() => {
            navigation.navigate(Routes.NEWS);
          }}
        >
          <Text style={styles.titleViewAll}>{'View all'}</Text>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {news.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={styles.container}
            onPress={() => {
              onSelect(item);
            }}
          >
            <View style={styles.containerTitle}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.titleHour}>{item.hours + ' hour ago'}</Text>
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
  );
};

export default memo(News);
