/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { LogBox } from 'react-native';
import messaging from '@react-native-firebase/messaging';

LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background app is quit!', remoteMessage);
  });

AppRegistry.registerComponent(appName, () => App);
