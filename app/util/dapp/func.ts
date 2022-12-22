import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAPP_RECENT } from '../../constants/storage';
import { ModelDApp } from '../../types';

export const getDappRecent = async () => {
  const recent = await AsyncStorage.getItem(DAPP_RECENT);
  const parsedArr = JSON.parse(recent + '');
  if (Array.isArray(parsedArr)) {
    return parsedArr;
  }
  return [];
};

export const MAX_APP_RECENT = 5;

export const pushToDappRecent = async (dapp: ModelDApp) => {
  const recent = await AsyncStorage.getItem(DAPP_RECENT);
  if (!recent) {
    await AsyncStorage.setItem(DAPP_RECENT, JSON.stringify([dapp]));
    return;
  }
  const parsedArr: ModelDApp[] = JSON.parse(recent);
  if (Array.isArray(parsedArr)) {
    const filterDup = parsedArr.filter(
      (item: ModelDApp) => item?.id !== dapp.id,
    );
    if (filterDup.length === MAX_APP_RECENT) {
      filterDup.pop();
    }
    await AsyncStorage.setItem(
      DAPP_RECENT,
      JSON.stringify([dapp, ...filterDup]),
    );
    return;
  }
};
