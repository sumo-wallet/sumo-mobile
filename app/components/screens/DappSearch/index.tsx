/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Style, Fonts } from './../../../styles';
import { icons, images } from './../../../assets';
import { useNavigator, useDebounce } from './../../hooks';
import { dummyDAppPageData } from './../../../data';
import { Dapp } from './../../../types';
import { keyExtractor } from './../../../util';
import { useTheme } from './../../../util/theme';

import { ROUTES } from './../../../navigation/routes';
import { useDispatch } from 'react-redux';
import { createNewTab, openDapp } from './../../../actions/browser';

const DAPP_SEARCH_HISTORY_KEY = 'DAPP_SEARCH_HISTORY_KEY';

export const pushToHistory = async (keyword: string) => {
  const historiesString =
    (await AsyncStorage.getItem(DAPP_SEARCH_HISTORY_KEY)) ?? '[]';
  // console.log('historiesString: ' + historiesString);
  const histories = JSON.parse(historiesString);
  // console.log('histories: ' + JSON.stringify(histories));
  let dataToSave: string[] = [];
  if (Array.isArray(histories)) {
    const remove = histories.filter((item: string) => item !== keyword);
    if (histories.includes(keyword)) {
      dataToSave = [keyword, ...remove];
    }
  } else {
    dataToSave = [keyword];
  }
  // console.log('dataToSave: ' + JSON.stringify(dataToSave));
  AsyncStorage.setItem(DAPP_SEARCH_HISTORY_KEY, JSON.stringify(dataToSave));
};

export const DappSearch = React.memo(() => {
  const nav = useNavigator();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  React.useEffect(() => {
    pushToHistory('Pancake');
  }, [colors]);

  const [textSearch, setTextSearch] = React.useState<string>('');
  const inputRef = React.useRef<TextInput>();
  const [searchResults, setSearchResults] = React.useState<Dapp[]>([]);
  const handleClearSearchHistory = React.useCallback(() => {
    console.log('handleClearSearchHistory: ');
  }, []);
  const handleDeleteHistory = React.useCallback((history: string) => {
    console.log('history: ', history);
  }, []);

  const isSearching = textSearch?.length > 0;

  const handleSearch = React.useCallback((keyword: string) => {
    const keywordValid = keyword.toLowerCase().replace(/ /g, '');
    const results: Dapp[] = [];
    dummyDAppPageData.forEach((page) => {
      page.groups.forEach((group) => {
        group.apps.forEach((app) => {
          if (app.name.toLowerCase().replace(/ /g, '').includes(keywordValid)) {
            results.push(app);
          }
        });
      });
    });
    setSearchResults(results);
  }, []);

  const handleSelectPopular = React.useCallback(
    (keyword: string) => {
      handleSearch(keyword);
      setTextSearch(keyword);
    },
    [handleSearch],
  );

  const debounceSearchRequest = useDebounce(handleSearch, 500);

  const renderRecommend = React.useCallback(() => {
    if (isSearching) {
      return null;
    }
    return (
      <ScrollView style={Style.s({ flex: 1 })}>
        <View style={Style.s({ mt: 24, px: 16 })}>
          <Text style={Fonts.t({ s: 18, w: '500', c: colors.text.default })}>
            {'Popular search'}
          </Text>
          <View style={Style.s({ direc: 'row', wrap: 'wrap', mt: 12 })}>
            {['Binance', 'PancakeSwap', 'Uniswap', 'CoinMarketCap'].map(
              (keyword) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleSelectPopular(keyword)}
                    key={keyword}
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
                      {keyword}
                    </Text>
                  </TouchableOpacity>
                );
              },
            )}
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
    handleClearSearchHistory,
    handleDeleteHistory,
    handleSelectPopular,
    isSearching,
  ]);

  const handlePressDapp = React.useCallback(
    (dapp: Dapp) => {
      pushToHistory(textSearch);
      if (dapp.website) {
        dispatch(createNewTab(dapp?.website));
        dispatch(openDapp({ dapp }));
        nav.navigate(ROUTES.BrowserTabHome, { dapp });
      }
    },
    [dispatch, nav, textSearch],
  );

  const renderItemResult = React.useCallback(
    ({ item }: { item: Dapp }) => {
      return (
        <TouchableOpacity
          onPress={() => handlePressDapp(item)}
          style={Style.s({ direc: 'row', items: 'center' })}
        >
          <FastImage style={Style.s({ size: 40 })} source={item.image} />
          <View style={Style.s({ ml: 12 })}>
            <Text style={Fonts.t({ s: 14, c: colors.text.default })}>
              {item?.name}
            </Text>
            <Text style={Fonts.t({ s: 14, c: colors.text.default })}>
              {item?.description}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [colors.text.default, handlePressDapp],
  );

  const renderItemSeparator = React.useCallback(() => {
    return (
      <View
        style={Style.s({ my: 13, ml: 52, h: 1, bg: colors.border.default })}
      />
    );
  }, [colors.border.default]);

  const renderEmptyComponent = React.useCallback(() => {
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
  }, [colors.text.alternative, colors.text.default]);

  const renderSearchResults = React.useCallback(() => {
    if (!isSearching) {
      return null;
    }
    return (
      <FlatList
        style={Style.s({})}
        contentContainerStyle={Style.s({ px: 16, py: 24 })}
        data={searchResults}
        renderItem={renderItemResult}
        ItemSeparatorComponent={renderItemSeparator}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyComponent}
      />
    );
  }, [
    isSearching,
    renderEmptyComponent,
    renderItemResult,
    renderItemSeparator,
    searchResults,
  ]);

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
            bg: colors.background.defaultHover,
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
              setTextSearch(text);
              debounceSearchRequest(text);
            }}
            value={textSearch}
            clearButtonMode="always"
          />
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
