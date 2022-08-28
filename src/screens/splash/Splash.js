import React, { useContext, useState, useEffect } from 'react';
import { ImageBackground,SafeAreaView, Linking, BackHandler, StatusBar, Text } from 'react-native';
import Styles from './Styles';
import AppColors from '../../utils/AppColors';
import Actions from '../../webServices/Action';
import CONSTANTS from '../../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleToast from 'react-native-simple-toast';
import { StreamChat } from 'stream-chat';
import { Platform } from 'react-native';
import { ChatContext } from '../../navigation/TabNavigator';
import { setClient } from '../../utils';
import SplashScreen from 'react-native-splash-screen'
import { useFocusEffect } from '@react-navigation/core';
import { isInternetConnected } from '../../utils/CheckNetStatus';
// import VideoPlayer from 'react-native-video-player';

import Video from 'react-native-video';
import { View } from 'react-native-animatable';
import Images from '../../assets/Images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native';
import Fonts from '../../assets/Fonts';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Dimensions } from 'react-native';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true
};


var count = 0;
const Splash = props => {
  // SplashScreen.hide();
  const { channel, setChannel } = useContext(ChatContext);


  useEffect(() => {
    const interval = setInterval(() => {
      ReactNativeHapticFeedback.trigger("longPress", options);

    }, 100);

    return () => clearInterval(interval);

  }, []);
  useEffect(() => {

    AsyncStorage.getItem(CONSTANTS.LOGIN_ALREADY).then((res) => {
      if (res !== null) {
        if (res === '1') {
          Linking.getInitialURL().then(url => {
            if (url === null) {
              getProfileStatus();
            }
          });
          props.navigation.reset({ index: 0, routes: [{ name: 'BottomTabNavigator' }] });

        }

      }
    })
  }, ([]));
  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     Linking.getInitialURL().then(url => {
  //       navigate(url);
  //     });
  //   }
  //   //  else {
  //   //   Linking.addEventListener('url', handleOpenURL);
  //   // }
  //   return () => Linking.removeEventListener('url', handleOpenURL);
  // }, ([]));


  setTheUser = () => {
    const client = new StreamChat(CONSTANTS.STREAM_CHAT_KEY, null);
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS', CONSTANTS.FCM_TOKEN]).then(async (response) => {
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
          client.addDevice(response[2][1], Platform.OS === 'ios' ? 'apn' : 'firebase')
        }
      }
    })
  }

  const handleOpenURL = (event) => {
    if (event === '') {
    } else {
      navigate(event.url);
    }
  }

  const navigate = async (url) => {
    if (url !== null) {
      // getProfileStatus();
      AsyncStorage.getItem(CONSTANTS.LOGIN_ALREADY).then((res) => {
        if (res !== null) {
          if (res === '1') {
            const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
            let id = url.replace('https://www.mybschool.com/', '');
            AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS', CONSTANTS.FCM_TOKEN]).then(async (response) => {
              console.log(JSON.stringify(response))
              if (response !== null) {
                let data = JSON.parse(response[1][1]);
                const userToken = response[0][1];
                const user = {
                  id: String(data.id),
                  name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
                };
                chatClient.setUser(user, userToken);
                chatClient.addDevice(response[2][1]).enqueue(result => {
                  if (result.isSuccess()) {
                    console.log('Device was successfully registered')
                  } else {
                    console.log('Device was not registered')
                  }
                });
                setClient(chatClient);
                const channels = await chatClient.queryChannels({
                  members: { $in: [String(data.id)] },
                  // type: 'messaging',
                });
                channels.map((res) => {
                  if (res.id === id) {
                    setChannel(res);
                    Linking.removeEventListener('url', handleOpenURL)
                    props.navigation.navigate('ChatMessage')
                  }
                })
              }
            })
          }
          else {
            props.navigation.replace('Tutorial');
          }
        }
        else {
          props.navigation.replace('Tutorial');
        }
      })
    }
  }

  const getProfileStatus = () => {
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        console.log(myToken)
        let data = {
          token: myToken
        }

        Actions.ProfileStatus(data)
          .then((response) => {
            if (response && response.data && response.data.data && response.data.status && response.data.status === 'success') {
              let data = response.data.data;
              AsyncStorage.setItem('USER_DETAILS', JSON.stringify(data.user));
              if (data.user.profile_completed === 0 || data.user.profile_completed === '0') {
                SimpleToast.showWithGravity("Your Profile is not completed yet Please Complete  the flow", SimpleToast.SHORT, SimpleToast.CENTER)
                props.navigation.replace('Signup', { status: 'ProfileIncompleted' });
              }
              else {
                gotoNext();
              }
            }
          })
          .catch((err) => {
            if (err && err.response && err.response.status && err.response.status === 401) {
              refreshToken();
            }
            else {
              // SimpleToast.showWithGravity('Sometddddhing went wrong', SimpleToast.SHORT, SimpleToast.CENTER)
              console.log('Something went wrong')
            }
          })
      }
      else {
        gotoNext();
      }
    }
    )
  }

  const refreshToken = () => {
    AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.ACCESS_TOKEN]).then((res) => {
      if (res !== null) {
        let data = {
          token: res[0][1],
          oldToken: res[1][1]
        }
        Actions.Refresh_Token(data)
          .then((response) => {
            console.log("refreshed " + JSON.stringify(response))
            if (response.data.status === 'success') {
              let data = response.data.data;
              let token = data.token;
              AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
              AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
              AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
              getProfileStatus();
            }
          })
          .catch((err) => {
            if (err && err.response && err.response.data && err.response.data.message && err.response.data.message === 'unauthorized') {
              AsyncStorage.clear();
              const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
              chatClient.disconnect();
              props.navigation.reset({ index: 0, routes: [{ name: 'Tutorial' }] })
            }
            else {
              console.log(err)
            }
          })
      }
    })
  }

  const gotoNext = () => {
    AsyncStorage.getItem(CONSTANTS.LOGIN_ALREADY).then((res) => {
      if (res !== null) {
        if (res === '1') {
          // props.navigation.reset({ index: 0, routes: [{ name: 'BottomTabNavigator' }] });
        }
        else {
          props.navigation.replace('Tutorial');
        }
      }
      else {
        props.navigation.replace('Tutorial');
      }
    })
  }

  // useEffect(() => {
  //   Linking.getInitialURL().then(url => {
  //     if (url === null) {
  //       getProfileStatus();
  //     }
  //   });
  // }, []);

  const setTheClient = () => {
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS', CONSTANTS.FCM_TOKEN]).then(async (response) => {
      const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
      if (response !== null) {
        let data = JSON.parse(response[1][1]);
        const userToken = response[0][1];
        const user = {
          id: String(data.id),
          name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
        };
        chatClient.connectUser(user, userToken);
        chatClient.addDevice({ id: response[2][1], push_provider: Platform.OS === 'ios' ? 'apn' : 'firebase', userID: String(data.id) }).then((result) => {
          if (result.isSuccess()) {
            console.log('Device was successfully registered')
          } else {
            console.log('Device was not registered')
          }
        });
        setClient(chatClient);
      }
    })
  }

  const skipVideo = () => {

    Linking.getInitialURL().then(url => {
      if (url === null) {
        getProfileStatus();
      }
    });

    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        navigate(url);
      });
    }
    //  else {
    //   Linking.addEventListener('url', handleOpenURL);
    // }
    return () => Linking.removeEventListener('url', handleOpenURL);


  }


  return (
    // '#185953'
    <View style={{ flex: 1, backgroundColor: '#185953' }} >

      <Text onPress={() => skipVideo()}
        style={{
          fontSize: 25,
          fontFamily: Fonts.APP_MEDIUM_FONT,
          position: 'absolute',
          zIndex: 999,
          paddingHorizontal: 15,
          paddingVertical: Platform.OS == "ios" ? 50 : 10,
          width: '100%',
          color: 'white',
          textAlign: 'right'
        }} >Skip</Text>

      <Video
        source={Images.splashVideo}
        resizeMode='stretch'  
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }} />
      <Video
        onEnd={() => skipVideo()}
        source={Images.splashVideo2}
        // fullscreen={true}
             resizeMode='stretch'  
        style={{
          // flex: 1,
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }} />
    </View>

  )




};

export default Splash;
