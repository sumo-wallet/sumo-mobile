import React, { useCallback } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../util/theme';
import FastImage from 'react-native-fast-image';
import { useGetNews } from '../../../hooks/Explore/useGetNews';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
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

export const ExploreNewsScreen = React.memo(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { isLoading, news, isLoadingMore, reload, loadMore } = useGetNews();

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
      <View style={styles.wrapper}>
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
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={reload} />
          }
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyView}>
                <Text style={styles.description}>{'No data'}</Text>
              </View>
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={() => {
            if (news?.length === 0) {
              return null;
            }
            if (isLoadingMore) {
              return (
                <View style={styles.emptyView}>
                  <Text style={styles.description}>{'Loading ...'}</Text>
                </View>
              );
            }
            return (
              <View style={styles.emptyView}>
                <Text style={styles.description}>{'No more data'}</Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
});
