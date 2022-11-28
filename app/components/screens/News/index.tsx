import React, { useCallback } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../util/theme';
import { useGetAllNews } from '../../hooks/useGetAllNews';
import FastImage from 'react-native-fast-image';
import { DynamicHeader } from '../../../components/Base/DynamicHeader';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      paddingHorizontal: 10,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 16,
    },
    networksWrapper: {
      flex: 1,
    },
    emptyView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    thumbnail: {
      width: 120,
      height: 60,
      borderRadius: 3,
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
  });

export const NewsScreen = React.memo(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { news } = useGetAllNews();

  const openUrl = useCallback(
    async (url: string) => {
      navigation.navigate('Webview', {
        screen: 'SimpleWebview',
        params: { url },
      });
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <DynamicHeader title={'News'} />
      <View style={styles.wrapper}>
        {news.length > 0 ? (
          <FlatList
            data={news}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={styles.container}
                onPress={() => {
                  openUrl(item.url);
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
            )}
            keyExtractor={(item) => item.description}
          />
        ) : (
          <View style={styles.emptyView}>
            <Text style={styles.description}>{'Emptty'}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});
