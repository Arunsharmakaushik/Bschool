import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, BackHandler, Keyboard, TextInput, NativeModules, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import InputView from '../../components/InputView'
import AppColors from '../../utils/AppColors';
import Images from '../../assets/Images';
import styles from './Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Actions from '../../webServices/Action';
import Spinner from '../../components/Spinner';
import SimpleToast from 'react-native-simple-toast';
import CONSTANTS from '../../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo, { getAvailableLocationProviders } from 'react-native-device-info';
import { StreamChat } from 'stream-chat';
import HeaderView from '../../components/HeaderView';
const Login = ({ navigation, route }) => {
  const [focusId, setFocusId] = useState('');
  const [errorId, setErrorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [passShow, setPassShow] = useState(true);

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      setErrMsg('')

    });
  }, [navigation]);


  const doLogin = (statusId) => {
    setErrorId('');
    setErrMsg('');
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    switch (statusId) {
      case '0':
        if (email === '') {
          setErrorId(0);
          setFocusId(0);
          setErrMsg('Please enter Email');
        } else if (reg.test(email) === false) {
          setErrorId(0);
          setFocusId(0);
          setErrMsg('Please enter valid Email');
        }
        //   else if (email.search(".edu")==-1) {
        //     setErrorId(0);
        //     setFocusId(0);
        //     setErrMsg('Please enter .edu emails only');
        // }
        else {
          setFocusId(1)
        }
        break;
      case '1':
        if (password === '') {
          setErrorId(1);
          setFocusId(1);
          setErrMsg('Please enter Password');
        }
        else if (password.length < 6) {
          setErrorId(1);
          setFocusId(1);
          setErrMsg('Password length must be 6');
        }
        else {
          Login();
        }
        break;
      case 'final':
        if (email === '') {
          setErrorId(0);
          setFocusId(0);
          setErrMsg('Please enter Email');
        } else if (reg.test(email) === false) {
          setErrorId(0);
          setFocusId(0);
          setErrMsg('Please enter valid Email');
        }
        //   else if (email.search(".edu")==-1) {
        //     setErrorId(0);
        //     setFocusId(0);
        //     setErrMsg('Please enter .edu emails only');
        // }
        else if (password === '') {
          setErrorId(1);
          setFocusId(1);
          setErrMsg('Please enter Password');
        }
        else if (password.length < 6) {
          setErrorId(1);
          setFocusId(1);
          setErrMsg('Password length must be 6');
        }
        else {
          Login();
        }
        break;
      default:
        alert("Something went wrong");
    }
  }

  const Login = async () => {
    setLoading(true);
    let fcmToken = await AsyncStorage.getItem(CONSTANTS.FCM_TOKEN);
    let uuid = DeviceInfo.getUniqueId();
    let data = {
      'email': email,
      'password': password,
      'device_token': fcmToken != null ? fcmToken : '',
      'uuid': uuid,
    }
    Actions.Login(data)
      .then((response) => {
        console.log(JSON.stringify(response))
        setLoading(false);
        if (response && response.data && response.data.status && response.data.status === 'success') {
          setLoading(false);
          let data = response.data.data;
          let token = data.token;
          AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
          AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
          AsyncStorage.setItem(CONSTANTS.LOGIN_ALREADY, '1');
          AsyncStorage.setItem(CONSTANTS.MUTE_NOTIFICATION, '00');
          AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
          navigation.reset({ index: 0, routes: [{ name: 'BottomTabNavigator' }] })
        }
        else {
          setLoading(false);
          SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
        }
      })
      .catch((err) => {
        setLoading(false);
        let errMsg = err && err.response && err.response.data && err.response.data ? err.response.data.message : 'Something went Wrong';
        if (err && err.response && err.response.status && err.response.status === 401) {
          setLoading(false);
          SimpleToast.showWithGravity(errMsg, SimpleToast.SHORT, SimpleToast.CENTER);

        }
        if (errMsg === 'Email id not verified') {
          setLoading(false);
          SimpleToast.showWithGravity(errMsg, SimpleToast.SHORT, SimpleToast.CENTER);
          navigation.push('Signup', { status: 'NotVerified' });
        }
        else if (err && err.response && err.response.status && err.response.status === 403) {
          setLoading(false);
          SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
          AsyncStorage.clear();
          // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
        else {
          setLoading(false);
          SimpleToast.showWithGravity(errMsg, SimpleToast.SHORT, SimpleToast.CENTER);
        }
      })
  }

  return (
    // <KeyboardAwareScrollView enableAutomaticScroll={false}  contentContainerStyle={{flexGrow:1}}>
    <TouchableOpacity onPress={() => { Keyboard.dismiss() }} activeOpacity={1.0} style={[styles.mainContainer, { backgroundColor: AppColors.LITEGREEN }]}>
      <StatusBar backgroundColor={AppColors.APP_THEME} />
      {navigation.canGoBack() ? <HeaderView login title='Login' onLeftClick={() => { navigation.goBack() }} />
        :
        <HeaderView login title='Login' noLeft />
      }
      {loading ? <Spinner /> : null}
      <KeyboardAwareScrollView extraScrollHeight={100} enableAutomaticScroll={true} enableOnAndroid
        contentContainerStyle={{ height: hp(90), marginTop: hp(4), alignItems: 'center', width: wp(100) }}
        keyboardShouldPersistTaps='always'
      >
        <View backgroundColor='white' alignItems='center' width={wp(90)}>
          <InputView
            onFocus={() => setFocusId(0)}
            id={0}
            login
            style={{ width: wp(80), marginTop: hp(3) }}
            autoFocus={true}
            returnKeyType='next'
            onSubmitEditing={() => doLogin('0')}
            focusId={focusId}
            errorId={errorId}
            errMsg={errMsg}
            value={email}
            autoCapitalize='none'
            keyboardType="email-address"
            onChangeText={setemail}
            placeholder={'School Email'}
          />
          <InputView
            eye
            login
            onFocus={() => setFocusId(1)}
            id={1}
            style={{ width: wp(80), marginTop: hp(4) }}
            autoFocus={true}
            returnKeyType='next'
            onSubmitEditing={() => doLogin('1')}
            focusId={focusId}
            errorId={errorId}
            errMsg={errMsg}
            value={password}
            secureText={() => setPassShow(!passShow)}
            secureTextEntry={passShow ? true : false}
            onChangeText={setpassword}
            placeholder={'Password'}
          />
          <Text onPress={() => { navigation.push('ForgotPassword') }} style={styles.forgotText}>Forgot Password?</Text>
          <TouchableOpacity style={styles.btnStyle} onPress={() => doLogin('final')} >
            <Text style={[styles.btnText, {}]}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.bottomText}>Dont have an account? <Text onPress={() => navigation.push('Signup')} style={{ color: AppColors.LIGHTGREEN }}>Create account</Text></Text>
        </View>
      </KeyboardAwareScrollView>
    </TouchableOpacity>
  );
}

export default Login;
