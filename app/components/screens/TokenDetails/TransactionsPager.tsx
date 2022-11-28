import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { icons } from './../../../assets';
import { Colors, Fonts, Style } from './../../../styles';

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
  all: FirstRoute,
  listing: SecondRoute,
  trending: SecondRoute,
  breakingNews: SecondRoute,
  systemNotifications: SecondRoute,
});

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={Style.s({ bg: 'white' })}
    style={Style.s({ bg: 'pink' })}
    renderTabBarItem={(tabProps: any) => {
      // console.log('props: ', tabProps);
      return (
        <View style={Style.s({ flex: 1, bg: 'red' })}>
          <Text>{tabProps?.route?.title}</Text>
        </View>
      );
    }}
  />
);

export const TransactionsPager = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'all', title: 'All' },
    { key: 'listing', title: 'Listing' },
    { key: 'trending', title: 'Trending' },
    { key: 'breakingNews', title: 'Breaking News' },
    { key: 'systemNotifications', title: 'System Notifications' },
  ]);
  const onBack = () => {
    // navigation.goBack();
  };
  return (
    <SafeAreaView style={Style.s({ flex: 1, bg: Colors.grayscale[100] })}>
      <View
        style={Style.s({
          direc: 'row',
          h: 40,
          justify: 'space-between',
          px: 14,
        })}
      >
        <TouchableOpacity
          onPress={onBack}
          style={Style.s({ size: 40, cen: true })}
        >
          <FastImage
            style={Style.s({ size: 20 })}
            source={icons.iconArrowLeft}
          />
        </TouchableOpacity>
        <View style={Style.s({ flex: 1, cen: true })}>
          <Text style={Fonts.t({ s: 14, c: Colors.white[1], w: '500' })}>
            {'Notifications'}
          </Text>
        </View>
        <TouchableOpacity style={Style.s({ size: 40, cen: true })} />
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};
