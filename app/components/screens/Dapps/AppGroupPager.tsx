import React from 'react';
import {
  View,
  FlatList,
  StyleProp,
  ViewStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Style, Colors, Fonts } from '../../../styles';
import { AppGroupCard } from './AppGroupCard';
import { dummyDAppPageData } from './../../../data';
import { DAppPageData } from 'app/types';

export interface AppGroupPagerProps {
  style?: StyleProp<ViewStyle>;
}

export const AppGroupPager = ({ style }: AppGroupPagerProps) => {
  const [curPage, setPage] = React.useState<DAppPageData>(dummyDAppPageData[0]);

  const renderItem = React.useCallback(
    ({ item }: { item: DAppPageData }) => {
      const isCurPage = curPage.id === item.id;
      const titleColor = isCurPage ? Colors.grayscale[100] : Colors.gray[2];
      const bgColor = isCurPage ? Colors.green[1] : Colors.tran;
      return (
        <TouchableOpacity
          onPress={() => setPage(item)}
          style={[
            Style.s({
              minH: 32,
              px: 16,
              py: 6,
              cen: true,
              bg: bgColor,
            }),
            Style.b({ bor: 50, width: 0.5, color: Colors.white[2] }),
          ]}
        >
          <Text style={Fonts.t({ s: 14, c: titleColor, w: '500' })}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [curPage],
  );
  const separator = React.useCallback(() => {
    return <View style={Style.s({ w: 8 })} />;
  }, []);
  return (
    <View style={[Style.s({ py: 8 }), style]}>
      <FlatList
        data={dummyDAppPageData}
        contentContainerStyle={Style.s({ px: 16, py: 16 })}
        horizontal
        renderItem={renderItem}
        ItemSeparatorComponent={separator}
      />
      <View style={Style.s({ mt: 8 })}>
        {dummyDAppPageData.map((page: DAppPageData) => {
          return (
            <AppGroupCard
              title={page.title}
              groups={page?.groups}
              key={`AppGroupCard-${page.title}`}
            />
          );
        })}
      </View>
    </View>
  );
};
