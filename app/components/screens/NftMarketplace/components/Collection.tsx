import React, { memo, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../../util/theme';
import { ModelCategoryApp } from 'app/types';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../../../constants/navigation/Routes';

const createStyles = (colors: any) =>
  StyleSheet.create({
    screenWrapper: {
      backgroundColor: colors.background.default,
      padding: 16,
      marginVertical: 16,
      marginHorizontal: -16,
    },
    titleHeader: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.text.default,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text.default,
      width: 250,
      marginTop: 4,
    },
    icon: {
      width: 40,
      height: 40,
      marginRight: 8,
      borderRadius: 10,
    },
    containerItem: {
      flexDirection: 'row',
      marginVertical: 22,
      width: '50%',
    },
    containerFlatList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    nameDapp: {
      fontSize: 14,
      fontWeight: '600',
      paddingRight: 15,
      color: colors.text.default,
    },
    subNameDapp: {
      fontSize: 10,
      fontWeight: '400',
      color: colors.text.muted,
    },
  });

export interface RawDappInterface {
  title: string;
  subTitle: string;
  data: ModelCategoryApp[];
}

export const Collection = function Collection({
  title,
  subTitle,
  data,
}: RawDappInterface) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleCollectionDetail = (item: any) => {
  };

  return (
    <View style={styles.screenWrapper}>
      <Text style={styles.titleHeader}>{title}</Text>
      <Text style={styles.title}>{subTitle}</Text>
      {/* <Text style={styles.title}>{JSON.stringify(data)}</Text> */}
      <View style={styles.containerFlatList}>
        {data.map((item, index) => {
          const dapp = item.dapp;
          if (dapp && dapp.id > 0) {
            return (
              <TouchableOpacity
                key={index}
                style={styles.containerItem}
                onPress={() => { handleCollectionDetail(dapp) }}
              >
                {item.dapp && (
                  <FastImage
                    source={{ uri: item.dapp.logo }}
                    style={styles.icon}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                )}
                <View style={{ justifyContent: 'center' }}>
                  <Text style={styles.nameDapp}>{item.dapp.name}</Text>
                  <Text style={styles.subNameDapp}>
                    {item.dapp.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          } else {
            return <View />;
          }
        })}
      </View>
    </View>
  );
};

export default memo(Collection);
