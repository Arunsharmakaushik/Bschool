import React, { Component, useEffect } from 'react';
import { AppNavigation } from './src/navigation/Routes';
import messaging from '@react-native-firebase/messaging';
import { Platform, Alert, View } from 'react-native';
import CONSTANTS from './src/utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const isAndroid = Platform.OS === 'android';
import Instabug from 'instabug-reactnative';
import * as NavigationService from './src/utils/NavigationService';
import PushNotification from 'react-native-push-notification';
import { StreamChat } from 'stream-chat';
let fcmData = null;
PushNotification.configure({
  onRegister(data) { 
    fcmData = data;
channel_id="events_123"
    PushNotification.channelExists(channel_id, function (exists) {
      if(!exists){
        PushNotification.createChannel(
          {
            channelId: channel_id, // (required)
            channelName: "Events", // (required)
            channelDescription: "Events from Bschool", // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: "notification.mp3", // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
      });
  },
  onNotification(notification) {
    console.log('hhhhhhh Clicked ' + JSON.stringify(notification))
      // alert(notification)

    // notification.finish();
    // notification.finish(PushNotificationIOS.FetchResult.NoData); 
  },
  senderID: "696736664653",// (Android Only) Grab this from your Firebase Dashboard where you got google-services.json 
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },

  requestPermissions: true
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
    this.getToken = this.getToken.bind(this);
    this.requestPermission = this.requestPermission.bind(this);
    this.checkNotificationPermission = this.checkNotificationPermission.bind(this);
  }

  componentWillMount() {
    Instabug.startWithToken('9bd3e3df06279859db8347eb52691d66', [Instabug.invocationEvent.shake]);
  }

  async componentDidMount() {
    // this.getStreamNotifications();

    this.checkNotificationPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
    });
    this.setNotificationListener();
    // this.registerFCMBackgroundMessageHandler();
    // this.registerFCMNotificationOpenedApp();
    // this.checkAppOpenedByNotification();
    return unsubscribe;
  }

  getStreamNotifications() {
    const client = new StreamChat(CONSTANTS.STREAM_CHAT_KEY, null);
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS', CONSTANTS.FCM_TOKEN]).then(async (response) => {
      // console.log(JSON.stringify(response))
      if (response !== null) {
        let data = JSON.parse(response[1][1]);
        const userTokken = response[0][1];
        const user = {
          id: String(data.id),
          name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
        };
        client.setUser(user, userTokken);
        client.addDevice(fcmData.token, fcmData.os === 'ios' ? 'apn' : 'firebase');

      }
    })
  }

  handleBackgroundMessage = async (remoteMessage) => {
    
    console.log('handleBackgroundMessage', { remoteMessage, isAppInBackground: true })
  }

  registerFCMBackgroundMessageHandler = () => {
    messaging().setBackgroundMessageHandler(this.handleBackgroundMessage)
    console.log(
      'registerFCMBackgroundMessageHandler',
      'successfully registered background message handler with FCM'
    )
  }

  handleNotificationOpenedApp = (remoteMessage) => {
   
    console.log('handleNotificationOpenedApp33 ' + JSON.stringify(remoteMessage)) 
    const data = remoteMessage.data;
    setTimeout(async () => {
      data.event_id ?
      
        await NavigationService.navigate('EventDetail', { EVENT_ID: data.event_id })
        :
        await NavigationService.navigate('Chat')

    }, 1100);
  
  }

  registerFCMNotificationOpenedApp = () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      this.handleNotificationOpenedApp(remoteMessage, true)
    })
  }

  async checkAppOpenedByNotification() {
    let initialNotification
    try {
      initialNotification = await messaging().getInitialNotification()
    } catch (error) {
      console.error('checkAppOpenedByNotification', 'error getting initialNotification', { error })
      return
    }
    if (initialNotification) {
      this.handleNotificationOpenedApp(initialNotification, false)
    } else {
      console.log('checkAppOpenedByNotification', 'no initialNotification')
    }
  }

  async setNotificationListener() {
    AsyncStorage.multiGet([CONSTANTS.LOGIN_ALREADY, CONSTANTS.MUTE_NOTIFICATION]).then((res) => {
      if (res !== null) {
        // alert(res[1][1])
        if (res[0][1] === '1' && res[1][1] != '11') {
          this.notificationListener = messaging().onMessage((notification) => {
            const { title, body } = notification.notification;
            console.log(JSON.stringify(notification))
            if (!notification.data.event_id) {
              this.showNotificationAlert(title, body, notification.data);
            }
          });
          this.notificationListenerWhenOpen = messaging().onNotificationOpenedApp(this.handleNotificationOpenedApp);
          this.notificationListenerWhenGetNoti = messaging()
            .getInitialNotification()
            .then(this.handleNotificationOpenedApp)
        }
      }
    })
  }

  showNotificationAlert(title, body, data) {
    console.log("notificationdata", JSON.stringify(data))
    console.log(`title ${title}`)
    let buttons = []
    buttons = [
      {
        text: 'OK', onPress: () => {
          NavigationService.navigate('EventDetail', { EVENT_ID: data.event_id })
          console.log("KKK")
        },
        style: 'cancel'
      },
    ]
    Alert.alert(
      title, body,
      buttons,
      { cancelable: false },
    );
  }

  setTheUser = (fcmToken) => {
    const client = new StreamChat(CONSTANTS.STREAM_CHAT_KEY, null);
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then(async (response) => {
      // console.log(JSON.stringify(response))
      if (response !== null) {
        let data = JSON.parse(response[1][1]);

        const userTokken = response[0][1];
        if (data != null) {
          const user = {
            id: String(data.id),
            name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
          };
          client.setUser(user, userTokken);
          client.addDevice(fcmToken, Platform.OS === 'ios' ? 'apn' : 'firebase')
        }
      }
    })
    // return true;
  }

  // firebase token for the user
  async getToken() {
    const fcmToken = await messaging().getToken();
    AsyncStorage.setItem(CONSTANTS.FCM_TOKEN, fcmToken);
    this.setTheUser(fcmToken);
    console.log('mytoken' + fcmToken)
    if (fcmToken) {
      console.log("Your Firebase Token is:", fcmToken);
    } else {
      console.log("Failed", "No token received");
    }
  }

  // request permission if permission disabled or not given
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission().then(() => {
        this.getToken();
      })
    }
    catch (error) {
      console.log('permission rejected');
    }
  }

  // if permission enabled get firebase token else request permission
  async checkNotificationPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      this.getToken() //<---- Add this
      console.log('Authorization status:', authStatus);
    }
  }

  render() {
    return (
      <AppNavigation/>
    );
  }
}
