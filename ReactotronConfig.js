/* eslint-disable no-console */
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({ host, name: 'Sumo App React Native', port: 9090 })
  .useReactNative()
  .use(reactotronRedux())
  .connect();

console.log = reactotron.log;
export default reactotron;
