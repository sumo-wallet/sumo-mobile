import React from 'react';
import { NavigationContainerRef, StackActions } from '@react-navigation/native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DrawerActions } from '@react-navigation/core';
import { CategoriesFilterMarketInterface } from '../screens/CoinMarkets/CategoriesFilterMarket';

export const navigationRef = React.createRef<NavigationContainerRef>();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const navigation = () => navigationRef.current!;

export const openDrawer = () =>
  navigation().dispatch(DrawerActions.openDrawer());

export const createNavigate =
  <T extends Record<string, any>>(screenName: string) =>
  (params?: T) => {
    return navigation().navigate(screenName, params);
  };

export const createPush =
  <T extends Record<string, any>>(screenName: string) =>
  (params?: T) => {
    return navigation().dispatch(StackActions.push(screenName, params));
  };

export const createReplace =
  <T extends Record<string, any>>(screenName: string) =>
  (params?: T) => {
    return navigation().dispatch(StackActions.replace(screenName, params));
  };

export const goBack = () => navigation().goBack();
//Screen

export const navigateToCategoriesFilterMarketScreen =
  createNavigate<CategoriesFilterMarketInterface>(
    'CategoriesFilterMarketScreen',
  );
