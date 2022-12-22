import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Style } from '../../../styles';
import { AppGroupCard } from './AppGroupCard';
import { ModelDApps, ModelCategory } from './../../../types';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './../../../constants/ui';
import { DappListByCategory } from './DappListByCategory';
import PagerView from 'react-native-pager-view';

export interface AppGroupPagerProps {
  style?: StyleProp<ViewStyle>;
  dappByCate?: ModelDApps[];
  categories?: ModelCategory[];
  setPageIndex: (value: number) => void;
  pageIndex: number;
}

export const AppGroupPager = ({
  style,
  dappByCate = [],
  categories = [],
}: AppGroupPagerProps) => {
  const FirstRoute = React.useCallback(() => {
    return (
      <View style={Style.s({ flex: 1, mt: 8, h: 500 })}>
        {dappByCate.map((page: ModelDApps, index) => {
          return (
            <AppGroupCard
              title={page?.category?.name}
              dapps={page?.app}
              key={`AppGroupCard.${page?.category?.id}.${index}`}
            />
          );
        })}
      </View>
    );
  }, [dappByCate]);

  return (
    <View
      style={[Style.s({ pb: 8, w: SCREEN_WIDTH, h: SCREEN_HEIGHT }), style]}
    >
      <PagerView style={Style.s({ flex: 1 })}>
        <FirstRoute />
        {categories.map((cate) => {
          return (
            <DappListByCategory
              key={`DappListByCategory.${cate.id}`}
              category={cate}
            />
          );
        })}
      </PagerView>
    </View>
  );
};
