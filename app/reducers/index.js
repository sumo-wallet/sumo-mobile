import bookmarksReducer from './bookmarks';
import browserReducer from './browser';
import engineReducer from './engine';
import privacyReducer from './privacy';
import modalsReducer from './modals';
import settingsReducer from './settings';
import alertReducer from './alert';
import transactionReducer from './transaction';
import userReducer from './user';
import wizardReducer from './wizard';
import onboardingReducer from './onboarding';
import fiatOrders from './fiatOrders';
import swapsReducer from './swaps';
import notificationReducer from './notification';
import infuraAvailabilityReducer from './infuraAvailability';
import collectiblesReducer from './collectibles';
import recentsReducer from './recents';
import navigationReducer from './navigation';
import networkOnboardReducer from './networkSelector';
import securityReducer from './security';
import dappReducer from './dapp';
import { combineReducers } from 'redux';
import { coinMarketsReducer } from './coinmarkets/slice';
import { categoriesMarketReducer } from './categoriesMarket';
import { favouriteMarketsReducer } from './favouritemarkets/slice';
import { crossChainReducer } from './crossChain/slice';
import { tokenByChainReducer } from './tokenByChain/slice';

const rootReducer = combineReducers({
  collectibles: collectiblesReducer,
  engine: engineReducer,
  privacy: privacyReducer,
  bookmarks: bookmarksReducer,
  recents: recentsReducer,
  browser: browserReducer,
  modals: modalsReducer,
  settings: settingsReducer,
  alert: alertReducer,
  transaction: transactionReducer,
  user: userReducer,
  wizard: wizardReducer,
  onboarding: onboardingReducer,
  notification: notificationReducer,
  swaps: swapsReducer,
  fiatOrders,
  infuraAvailability: infuraAvailabilityReducer,
  navigation: navigationReducer,
  networkOnboarded: networkOnboardReducer,
  security: securityReducer,
  dapp: dappReducer,
  coinMarkets: coinMarketsReducer,
  categoriesMarket: categoriesMarketReducer,
  favouriteMarkets: favouriteMarketsReducer,
  crossChain: crossChainReducer,
  tokenByChain: tokenByChainReducer,
});

export default rootReducer;
