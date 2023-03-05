import React, { memo, useCallback } from 'react';
import { useTheme } from '../../../util/theme';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { SearchBar } from '../Dapps/SearchBar';
import { useAsyncEffect } from '../../hooks/useAsyncEffect';
import { getCategoriesMarket } from '../../../reducers/categoriesMarket/functions';
import { getCategoriesMarketByQuery } from '../../../reducers/categoriesMarket';
import { CategoryItem } from './components/CategoryItem';
import useNavigatorParams from '../../hooks/useNavigatorParams';
import { goBack } from '../../Base/navigation';
import { icons } from '../../../assets';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    container: {
      marginVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border.muted,
    },
    wrapperItem: {
      paddingVertical: 14,
      marginHorizontal: 12,
    },
    title: {
      fontSize: 14,
      color: colors.text.default,
      fontWeight: '500',
    },
    wrapperScroll: {
      flex: 1,
      backgroundColor: colors.background.default,
      marginHorizontal: 16,
    },
    selectedIcon: {
      width: 24,
      height: 24,
      tintColor: colors.primary.default,
    },
    touch: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

export interface CategoriesFilterMarketInterface {
  onCallBack?: (value: string) => void;
  category_id: string;
}

export const CategoriesFilterMarketScreen = memo(() => {
  const { category_id, onCallBack } =
    useNavigatorParams<CategoriesFilterMarketInterface>();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const categoryIds = getCategoriesMarketByQuery('all');

  const { call, error, loading } = useAsyncEffect(async () => {
    return await getCategoriesMarket();
  }, []);

  const onFilter = useCallback(
    (value: string) => {
      onCallBack?.(value);
      setTimeout(() => {
        goBack();
      }, 500);
    },
    [onCallBack],
  );

  if (!categoryIds) return null;
  return (
    <View style={styles.wrapper}>
      <DynamicHeader title={'Categories Filter'} />
      <SearchBar
        placeholder="Search for a category..."
        onInputSubmit={() => {}}
        onPressEnter={() => {}}
        onOpenBrowser={() => {}}
      />
      <ScrollView
        style={styles.wrapperScroll}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={call} />
        }
      >
        <View style={styles.container}>
          <View style={styles.wrapperItem}>
            <TouchableOpacity style={styles.touch} onPress={() => onFilter('')}>
              <Text
                style={[
                  styles.title,
                  {
                    color:
                      category_id === ''
                        ? colors.primary.default
                        : colors.text.default,
                  },
                ]}
              >
                {'All coins'}
              </Text>
              {category_id === '' && (
                <Image
                  resizeMode="contain"
                  style={styles.selectedIcon}
                  source={icons.iconChecked}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.title}>{'Categories'}</Text>
        <View style={styles.container}>
          {categoryIds.map((item: string, index: number) => {
            return (
              <TouchableOpacity onPress={() => onFilter(item)}>
                <CategoryItem
                  id={item}
                  key={index}
                  selected={item === category_id}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
});
