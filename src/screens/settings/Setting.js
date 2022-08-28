import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image,Modal, ImageBackground } from 'react-native';
import Images from '../../assets/Images';
import HeaderView from '../../components/HeaderView';
import Styles from './Styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Spinner from '../../components/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import Actions from '../../webServices/Action';
import SimpleToast from 'react-native-simple-toast';
import { StreamChat } from 'stream-chat';
import branch from 'react-native-branch';
import messaging from '@react-native-firebase/messaging';
import styles from '../profile/Styles';
import NotificationSetting from 'react-native-open-notification';

const Setting = ({ navigation }) => {
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  const AlertView=(props)=>{
    return(
        <Modal
          visible={showLogout}
          transparent={true}
          onRequestClose={() => {
            setShowLogout(false);
          }}
        >
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={() => setShowLogout(false)}
            style={styles.outerView}
          >
            <View
              style={styles.alertOuterView}
            >
              <View style={{ backgroundColor: "white" }}>
                <Image
                  style={styles.logoImageView}
                  source={Images.logout}
                  resizeMode="contain"
                />
                <Text style={styles.selectCountryText}>Logout</Text>
                <Text style={styles.sureText}>
                  Are you sure you want to logout?
                </Text>
                <View
                  style={styles.btnView}
                >
                  <TouchableOpacity
                   onPress={() => {
                    setShowLogout(false);
                  }}
                    style={styles.noBtn}
                  >
                    <Text style={styles.choiceText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                                      onPress={()=>{setShowLogout(false); setLoading(true); Logout(navigation)}}

                   
                    style={styles.yesBtn}
                  >
                    <Text style={styles.choiceText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
    )
  }

  const Logout = () => {
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        Actions.Logout(myToken)
          .then(async(response) => {
            if (response.data.status === 'success') {
              SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
              AsyncStorage.clear();
              const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
              chatClient.disconnect();
              const fcmToken = await messaging().getToken();
              AsyncStorage.setItem(CONSTANTS.FCM_TOKEN, fcmToken);
              branch.logout()
              navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
            }
            else {
              setLoading(false);
              SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(JSON.stringify(err.response))
            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
          })
      }
    })
  }

  const doContact = () => {
    navigation.push('ContactUs')
  }
 
  return (
    <View style={Styles.container}>
           {loading ? <Spinner/>: null}
      <HeaderView white title={'Settings'} onLeftClick={() => { navigation.goBack() }} />
      <View height={hp(4)} />
      <SettingsView onPress={() => { navigation.push('Profile') }} text='Profile' />
      <SettingsView onPress={() => { navigation.push('Referrals') }} text='Referrals' />
      <SettingsView onPress={() => { navigation.push('Itemsale') }} text='Items for sale' />
      <SettingsView onPress={() => { navigation.push('InterestView') }} buttonText='Change' text='Change interest' />
      {/* <SettingsView onPress={() => { navigation.push('NotificationScreen') }} text='Notification settings' /> */}
      <SettingsView onPress={() => { NotificationSetting.open() }} text='Notification settings' />
      <SettingsView onPress={() => { doContact() }} text='Contact us' />
      <SettingsView onPress={() => { setShowLogout(true) }} text='Logout' />
      <AlertView />
    </View>
  );
}

export default Setting;

const SettingsView = (props) => {
  return (
    <TouchableOpacity onPress={() => props.onPress()} style={Styles.settingView}>
      <Text style={Styles.textStyle}>{props.text}</Text>
      {props.buttonText ?
        <Text style={Styles.buttonText}>{props.buttonText}</Text> :
        <Image resizeMode='contain' source={Images.whiteArrowRight} style={Styles.imageView} />
      }
    </TouchableOpacity>
  )
}
