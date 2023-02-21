/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';

import { Style, Fonts } from './../../../styles';
import { icons, images } from './../../../assets';
import { useNavigator, useDebounce, useNavigatorParams } from './../../hooks';
import { ModelDApp, ModelSearchHistory } from './../../../types';
import { useTheme } from './../../../util/theme';
import { ROUTES } from './../../../navigation/routes';
import { createNewTab, openDapp } from './../../../actions/browser';
import { useFetchDappPopularSearch } from './../../../services/dapp/useFetchDappPopularSearch';
import { SearchResultCell } from './SearchResultCell';
import { strings } from '../../../../locales/i18n';
import Routes from '../../../../app/constants/navigation/Routes';
import onUrlSubmit from '../../../util/browser';
import { useTrackingDAppUsage } from '../../../components/hooks/useTrackingDAppUsage';
import { useSearchDapp } from '../../../components/hooks/DApp/useSearchDapp';

const DAPP_SEARCH_HISTORY_KEY = 'DAPP_SEARCH_HISTORY_KEY';

export const pushToHistory = async (keyword: string) => {
  const historiesString =
    (await AsyncStorage.getItem(DAPP_SEARCH_HISTORY_KEY)) ?? '[]';
  const histories = JSON.parse(historiesString);
  let dataToSave: string[] = [];
  if (Array.isArray(histories)) {
    const remove = histories.filter((item: string) => item !== keyword);
    if (histories.includes(keyword)) {
      dataToSave = [keyword, ...remove];
    }
  } else {
    dataToSave = [keyword];
  }
  AsyncStorage.setItem(DAPP_SEARCH_HISTORY_KEY, JSON.stringify(dataToSave));
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      marginTop: 24,
      paddingBottom: 16,
      borderRadius: 10,
      backgroundColor: colors.box.default,
    },
    searchOnWebContainer: {
      marginTop: 4,
      height: 40,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 12,
      color: colors.text.default,
      marginHorizontal: 8,
    },
    searchValue: {
      fontSize: 12,
      color: colors.primary.default,
      marginHorizontal: 8,
    },
    titleContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
    },
  });

export const DappSearch = React.memo(() => {
  const nav = useNavigator();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const inputRef = React.useRef<TextInput>();
  const { trackingUsage } = useTrackingDAppUsage();

  const { searchText }: { searchText: string } = useNavigatorParams();
  const [inputValue, setInputValue] = React.useState<string>('');

  const { dapps: dappsResultSearch, isLoading, search } = useSearchDapp();
  const { data: dataPopularSearch = [] } = useFetchDappPopularSearch();

  const searchEngine = useSelector((state) => state.settings.searchEngine);

  const handleClearSearchHistory = React.useCallback(() => {
    console.log('handleClearSearchHistory: ');
  }, []);

  const handleDeleteHistory = React.useCallback((history: string) => {
    console.log('history: ', history);
  }, []);

  const isSearching = inputValue?.length > 0 && isLoading;

  useEffect(() => {
    if (searchText) {
      setInputValue(searchText);
      search(searchText);
    }
  }, [search, searchText]);

  const handleSearch = React.useCallback((keyword: string) => {
    setInputValue(keyword);
    search(keyword);
  },
    [search],
  );

  const handleSelectPopular = React.useCallback((keyword: string) => {
    setInputValue(keyword);
    search(keyword);
  }, []);

  const debounceSearchRequest = useDebounce(handleSearch, 500);

  const renderRecommend = React.useCallback(() => {
    if (inputValue?.length > 0) {
      return null;
    }
    return (
      <ScrollView style={Style.s({ flex: 1 })}>
        <View style={Style.s({ mt: 24, px: 16 })}>
          <Text style={Fonts.t({ s: 18, w: '500', c: colors.text.default })}>
            {'Popular search'}
          </Text>
          <View style={Style.s({ direc: 'row', wrap: 'wrap', mt: 12 })}>
            {dataPopularSearch.map((searchHistory: ModelSearchHistory) => {
              const { search_text } = searchHistory;
              if (!search_text) {
                return null;
              }
              return (
                <TouchableOpacity
                  onPress={() => handleSelectPopular(search_text)}
                  key={`renderRecommend.TouchableOpacity.${searchHistory?.id}`}
                  style={[
                    Style.s({ px: 16, py: 6, cen: true, mb: 12, mr: 12 }),
                    Style.b({
                      color: colors.border.default,
                      width: 1,
                      bor: 40,
                    }),
                  ]}
                >
                  <Text style={Fonts.t({ s: 14, c: colors.text.default })}>
                    {search_text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={Style.s({ mt: 24, px: 16 })}>
          <View
            style={Style.s({
              direc: 'row',
              items: 'center',
              justify: 'space-between',
            })}
          >
            <Text style={Fonts.t({ s: 18, w: '500', c: colors.text.default })}>
              {'Search History'}
            </Text>
            <TouchableOpacity
              style={Style.s({})}
              onPress={handleClearSearchHistory}
            >
              <FastImage
                style={Style.s({ size: 24 })}
                source={icons.iconTrash}
              />
            </TouchableOpacity>
          </View>
          <View style={Style.s({ mt: 12 })}>
            {['bnb', 'biswap'].map((history) => {
              return (
                <View
                  key={history}
                  style={[
                    Style.s({
                      minH: 40,
                      py: 10,
                      direc: 'row',
                      items: 'center',
                      mb: 8,
                    }),
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleSelectPopular(history)}
                    style={Style.s({ flex: 1, mr: 12 })}
                  >
                    <Text style={Fonts.t({ s: 14, c: colors.text.default })}>
                      {history}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteHistory(history)}
                  >
                    <FastImage
                      style={Style.s({ size: 16 })}
                      source={icons.iconClose}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }, [
    colors.border.default,
    colors.text.default,
    dataPopularSearch,
    handleClearSearchHistory,
    handleDeleteHistory,
    handleSelectPopular,
    inputValue?.length,
  ]);

  const handlePressDapp = React.useCallback(
    (dapp: ModelDApp) => {
      pushToHistory(inputValue);
      if (dapp.website) {
        dispatch(createNewTab(dapp?.website, dapp));
        dispatch(openDapp({ dapp }));
        nav.navigate(ROUTES.BrowserTabHome, { dapp });
        trackingUsage(dapp.id || 0, 'dapp-search');
      }
    },
    [dispatch, nav, inputValue, trackingUsage],
  );

  const handleSearchOnWeb = (text: string) => {
    const sanitizedInput = onUrlSubmit(text, searchEngine, 'https://');

    nav.navigate(Routes.BROWSER_TAB_HOME, {
      screen: Routes.BROWSER_VIEW,
      params: {
        newTabUrl: sanitizedInput,
        timestamp: Date.now(),
      },
    });
  };

  const renderItemResult = React.useCallback(
    ({ item }: { item: ModelDApp }) => {
      return <SearchResultCell item={item} onPress={handlePressDapp} />;
    },
    [handlePressDapp],
  );

  const renderItemSeparator = React.useCallback(() => {
    return (
      <View
        style={Style.s({ my: 13, ml: 52, h: 1, bg: colors.border.default })}
      />
    );
  }, [colors.border.default]);

  const renderEmptyComponent = React.useCallback(() => {
    if (isSearching) {
      return (
        <View style={Style.s({ items: 'center', mt: 180 })}>
          <FastImage
            style={Style.s({ w: 140, h: 120 })}
            source={images.emptyBox}
          />
          <View style={Style.s({ mt: 20, items: 'center' })}>
            <Text style={Fonts.t({ s: 18, w: '500', c: colors.text.default })}>
              {strings('transaction.loading')}
            </Text>
            <Text style={Fonts.t({ s: 14, c: colors.text.alternative, t: 8 })}>
              {'All Dapps include the keyword will appear here'}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={Style.s({ items: 'center', mt: 180 })}>
        <FastImage
          style={Style.s({ w: 140, h: 120 })}
          source={images.emptyBox}
        />
        <View style={Style.s({ mt: 20, items: 'center' })}>
          <Text style={Fonts.t({ s: 18, w: '500', c: colors.text.default })}>
            {'No search result found!'}
          </Text>
          <Text style={Fonts.t({ s: 14, c: colors.text.alternative, t: 8 })}>
            {'All Dapps include the keyword will appear here'}
          </Text>
        </View>
      </View>
    );
  }, [isSearching, colors.text.alternative, colors.text.default]);

  const listHeaderComponent = () => {
    if (!inputValue) return null;
    return (
      <TouchableOpacity
        style={styles.searchOnWebContainer}
        onPress={() => {
          handleSearchOnWeb(inputValue);
        }}
      >
        <View style={styles.titleContainer}>
          <FastImage style={Style.s({ size: 16 })} source={icons.iconSearch} />
          <Text style={styles.title}>
            {'Search '}
            <Text style={styles.searchValue}>{inputValue}</Text>
            {' on web'}
          </Text>
        </View>
        <FastImage
          style={Style.s({ size: 16 })}
          source={icons.iconArrowRight}
        />
      </TouchableOpacity>
    );
  };

  const keyEx = React.useCallback((i: ModelDApp) => `${i}`, []);
  const renderSearchResults = () => {
    if (inputValue?.length === 0) {
      return null;
    }
    return (
      <FlatList
        contentContainerStyle={Style.s({ px: 16, py: 24 })}
        data={dappsResultSearch}
        renderItem={renderItemResult}
        ItemSeparatorComponent={renderItemSeparator}
        keyExtractor={keyEx}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={listHeaderComponent}
        refreshing={isSearching}
        refreshControl={
          <RefreshControl
            colors={[colors.primary.default]}
            tintColor={colors.primary.default}
            refreshing={isSearching}
            onRefresh={handleSearch}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={Style.s({ flex: 1, bg: colors.background.default })}>
      <View style={Style.s({ direc: 'row', items: 'center', pl: 16 })}>
        <View
          style={Style.s({
            flex: 1,
            minH: 40,
            direc: 'row',
            items: 'center',
            bor: 8,
            bg: colors.box.default,
            px: 16,
            py: 8,
          })}
        >
          <FastImage style={Style.s({ size: 16 })} source={icons.iconSearch} />
          <TextInput
            ref={inputRef as any}
            style={[
              Style.s({ flex: 1, mx: 12, py: 6, px: 6 }),
              Fonts.t({ c: colors.text.alternative, w: '600' }),
            ]}
            placeholderTextColor={colors.text.muted}
            placeholder="Search..."
            onChangeText={(text: string) => {
              setInputValue(text);
              debounceSearchRequest(text);
            }}
            value={inputValue}
            clearButtonMode="always"
          />
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary.default} />
          ) : null}
        </View>
        <TouchableOpacity
          onPress={nav.goBack}
          style={Style.s({ px: 16, py: 14 })}
        >
          <Text style={Fonts.t({ s: 14, w: '500', c: colors.text.default })}>
            {'Cancel'}
          </Text>
        </TouchableOpacity>
      </View>
      {renderRecommend()}
      {renderSearchResults()}
    </SafeAreaView>
  );
});
