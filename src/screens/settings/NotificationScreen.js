import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderView from '../../components/HeaderView';
import Images from '../../assets/Images';
import Fonts from '../../assets/Fonts';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import Actions from '../../webServices/Action';
import SimpleToast from 'react-native-simple-toast';
import { show } from 'instabug-reactnative';
import Spinner from '../../components/Spinner';
// import useStateWithCallback from 'use-state-with-callback';
const NotificationScreen = ({ navigation }) => {
  const [soundOn, setSoundOn] = useState(false);
  const [readReciptOn, setReadReciptOn] = useState(false);
  const [pauseOn, setPauseOn] = useState(false);
  const [appSettingOn, setAppSettingOn] = useState(false);
  const [showNotification, setshowNotification] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getProfileData();
    checkNotification();
  }, ([]))

  const checkNotification = () => {
    AsyncStorage.getItem(CONSTANTS.MUTE_NOTIFICATION).then((res) => {
      if (res !== null) {
        setshowNotification(res === '11' ? true : false)
      }
    })
  }
  const refreshToken = (state, itemToLike) => {
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
              setAccessToken(token.access_token);
              AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
              AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
              AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);

              getDetails(token.access_token);


            }
          })
          .catch((err) => {
            console.log(err.response.data)
            // SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
          })
      }
      else
      {
        setLoading(false)
      }
    })
  }
  const getProfileData = () => {

    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {

      getDetails(myToken);


    })

  }
  const getDetails = (myToken) => {
    setLoading(true);
    if (myToken != '') {
      let data = { token: myToken }
      Actions.ProfileStatus(data)
        .then((response) => {
          if (response.data.status === 'success') {
            setLoading(false);
            let data = response.data.data;
            let user = data.user;
            setPauseOn(user.notification_sound_status ? true : false)
            setshowNotification(user.pause_notification_status ? true : false)
          }
        })
        .catch((err) => {
          if (err&&err.response&&err.response.status&& err.response.status === 401) {
            loading ? null : refreshToken('', {});
          }
          else if (err&&err.response&&err.response.status&& err.response.status ===403) {
            setLoading(false);
            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
            AsyncStorage.clear();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
          else {
            setLoading(false);

          }

        })
    }
  }

  const setNotification = () => {


    AsyncStorage.getItem(CONSTANTS.MUTE_NOTIFICATION).then((res) => {
      if (res !== null) {
        if (res === '00') {
          AsyncStorage.setItem(CONSTANTS.MUTE_NOTIFICATION, '11');
          setshowNotification(true);
          updateNotificationSettings(pauseOn, !showNotification);
          SimpleToast.showWithGravity('Notification is off', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else {
          AsyncStorage.setItem(CONSTANTS.MUTE_NOTIFICATION, '00');
          setshowNotification(false);
          updateNotificationSettings(pauseOn,!showNotification);
          SimpleToast.showWithGravity('Notification is on', SimpleToast.SHORT, SimpleToast.CENTER);
        }
      }
    })




  }
  const pauseNotificationCall = () => {
    setPauseOn(!pauseOn),
      updateNotificationSettings(!pauseOn, showNotification);
  }

  const updateNotificationSettings = (soundStatus, pauseStatus) => {
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      let data =
      {
        'notificationSoundStatus': soundStatus ? 1 : 0,
        'pauseNotificationStatus': pauseStatus ? 1 : 0,
      }
      // alert(JSON.stringify(data))
      let mainData = {
        myTokens: myToken,
        data: data
      }
      if (myToken !== null) {

        Actions.updateNotificationSetting(mainData)
          .then((response) => {
            console.log("res " + JSON.stringify(response))
            if (response) {
              setLoading(false);
              // SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
              getProfileData();
            }
            else {
              setLoading(false);
              // SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.BOTTOM)
            }
          })
          .catch((err) => {
            if (err&&err.response&&err.response.status&& err.response.status === 401) {
              loading ? null : refreshToken('', {});
            }
            else
            {
              setLoading(false);
              SimpleToast.showWithGravity(err.message, SimpleToast.SHORT, SimpleToast.CENTER);
            }
          })
      }
    })
  }
  return (
    <View style={{ flex: 1 }} >
      {loading ? <Spinner /> : null}
      <HeaderView white title='Notification' onLeftClick={() => { navigation.goBack() }} />
      <ListView title='Notification Sound' isSwitchOn={pauseOn} onPress={() => { pauseNotificationCall() }} />
      <ListView title='Pause push notifications' isSwitchOn={showNotification} onPress={() => { setNotification() }} />
      {/* <TouchableOpacity onPress={() => setNotificationSetting()} >
        <Text>jjgfgfhgfhgfhfhfghf</Text>
      </TouchableOpacity> */}
    </View>
  )

}
export default NotificationScreen;

const ListView = (props) => {

  return (
    <View style={styles.listContainer} >
      <Text style={styles.textTitle} >{props.title}</Text>
      <TouchableOpacity onPress={props.onPress} style={styles.switchIconContainer} >
        <FastImage resizeMode={FastImage.resizeMode.contain} style={styles.switchIconStyle} source={!props.isSwitchOn ? Images.switch_off : Images.switch_on} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  switchIconContainer: {
    width: hp(8),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  switchIconStyle:
  {
    height: hp(5.5),
    textAlign: 'right',
    width: hp(5.5)
  },
  listContainer:
  {
    flexDirection: 'row',
    paddingHorizontal: hp(2),
    paddingVertical: hp(1),
    alignItems: 'center'
  },
  textTitle:
  {
    fontSize: hp(2.2),
    flexGrow: 1,
    fontFamily: Fonts.APP_SEMIBOLD_FONT
  },

})