import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Style } from '../../../styles';
import { AppGroupCard } from './AppGroupCard';
import { ModelDApps } from 'app/types';

export interface AppGroupPagerProps {
  style?: StyleProp<ViewStyle>;
  dappByCate?: ModelDApps[];
}

export const AppGroupPager = ({
  style,
  dappByCate = [],
}: AppGroupPagerProps) => {
  return (
    <View style={[Style.s({ pb: 8 }), style]}>
      <View style={Style.s({ mt: 8 })}>
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
    </View>
  );
};
