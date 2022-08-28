import React, { useState } from 'react';
import { View, Text, Image, Platform, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import InputView from '../../components/InputView';
import Images from '../../assets/Images';
import styles from './Styles';
import Actions from '../../webServices/Action';
import Spinner from '../../components/Spinner';
import SimpleToast from 'react-native-simple-toast';
import CONSTANTS from '../../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/Button';
import VerifyView from '../signup/VerifyView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppColors from '../../utils/AppColors';
import HeaderView from '../../components/HeaderView';

const ForgotPassword = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [email, setEmail] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [focusId, setFocusId] = useState('');
  const [password, setpassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [errorId, setErrorId] = useState('');
  const [codeValue, setCodeValue] = useState('');
  const [confirmPassShow, setConfirmPassShow] = useState(true);
  const [passShow, setPassShow] = useState(true);

  const send = () => {
    setErrMsg('');
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email === '') {
      setFocusId(0);
      setErrMsg('Please enter Email');
    }
    else if (reg.test(email) === false) {
      setFocusId(0);
      setErrMsg('Please enter valid Email');
    }
    else {
      setLoading(true);
      let data =
        { 'email': email }
      Actions.Resend_Otp(data)
        .then((response) => {
          setLoading(false);
          if (response.data.status === 'success') {
            setLoading(false);
            SimpleToast.showWithGravity('OTP sent', SimpleToast.SHORT, SimpleToast.CENTER);
            setCompletedSteps(1);
          }
          else {
            setLoading(false);
            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(JSON.stringify(err.response.data));
          SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
        })
    }
  }

  const setNewPass = () => {
    if (password === '') {
      setErrorId(1);
      setFocusId(1);
      setErrMsg('Please enter password');
    }
    else if (password.length < 6) {
      setErrorId(1);
      setFocusId(1);
      setErrMsg('Password length must be 6');
    }
    else if (conPassword === '') {
      setErrorId(2);
      setFocusId(2);
      setErrMsg('Please re-type your password');
    }
    else if (password !== conPassword) {
      setErrorId(2);
      setFocusId(2);
      setErrMsg('Password not matched');
    }
    else {
      setErrMsg('');
      AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
        if (myToken !== null) {
          setLoading(true);
          let data = { 'password': password }
          let maindata = {
            data: data,
            token: myToken
          }
          Actions.Update(maindata)
            .then((response) => {
              console.log("res " + JSON.stringify(response.data))
              if (response.data.status === 'success') {
                setLoading(false);
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
                SimpleToast.showWithGravity('Password changed successsfully', SimpleToast.SHORT, SimpleToast.CENTER);
              }
              else {
                setLoading(false);
                SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
              }
            })
            .catch((err) => {
              if (err.response.status === 400) {
                setLoading(false);
               SimpleToast.showWithGravity("New Password should not be same as Old Password.", SimpleToast.SHORT, SimpleToast.CENTER);
                
              } 
              else {
                setLoading(false);
                SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
              }
            })
        }
      })
    }
  }

  const verifyOtp = () => {
    if (codeValue.length < 4) {
      SimpleToast.showWithGravity("Wrong OTP", SimpleToast.SHORT, SimpleToast.CENTER);
    } else {
      setLoading(true);
      let data =
      {
        'email': email,
        'otp': codeValue,
        "type": '2'
      }
      console.log(data)
      Actions.Email_Verify(data)
        .then((response) => {
          console.log("final " + JSON.stringify(response))
          if (response.data.status === 'success') {
            setLoading(false);
            let data = response.data.data;
            let token = data.token;
            AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
            setCompletedSteps(3);
            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
          }
          else {
            setLoading(false);
            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(JSON.stringify(err.response.data.message))
          SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
        })
    }
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={AppColors.APP_THEME} />
      {completedSteps === 0 ?
        <HeaderView title='Forgot Password' onLeftClick={() => { navigation.goBack() }} /> : null}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false} contentContainerStyle={Platform.OS === 'ios' ? styles.mainContainer : null}
        enableOnAndroid={true} enableAutomaticScroll
        scrollEnabled resetScrollToCoords={{ x: 0, y: 0 }}>

        {loading ? <Spinner /> : null}
        {completedSteps === 2 ?
          <VerifyView resendOtp={() => { send()}} loading={loading} back={() => { navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }} CELL_COUNT={4} value={codeValue} continue={() => { { verifyOtp() } }} setValue={(v) => setCodeValue(v)} />
          :
          <>
            <Image resizeMode='contain' style={[styles.ImgView, { marginTop: completedSteps === 0 ? hp(2) : hp(8), }]} source={completedSteps === 0 ? Images.illustration1 : completedSteps === 1 ? Images.illustration2 : Images.illustration3} />
            <Text style={styles.mainText}>{completedSteps === 0 ? 'Forgot your password?' : completedSteps === 1 ? 'Check your email' : 'Create New Password'}</Text>
            <Text style={styles.descText}>{completedSteps === 0 ? 'Enter your registered email below to receive password reset instruction' : completedSteps === 1 ? 'We have sent a password recovery instruction to your email' : 'Your new password must be different from previously used passwords.'}</Text>
            {completedSteps === 0 ?

              <>

                <InputView
                  onFocus={() => setFocusId(0)}
                  id={0}
                  autoFocus={true}
                  returnKeyType='next'
                  onSubmitEditing={() => send()}
                  focusId={focusId}
                  errorId={0}
                  errMsg={errMsg}
                  autoCapitalize='none'
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder={'Enter Email-Address'} />

                <Button style={{ width: wp(90), height: hp(6), borderRadius: hp(1), position: 'relative', alignSelf: 'center' }} title={'Send'} continue={() => { send() }} />
              </ > :
              completedSteps === 1 ?
                <Button style={{ width: wp(90), marginTop: hp(30), height: hp(6), borderRadius: hp(1), alignSelf: 'center' }} title={'Ok'} continue={() => { setCompletedSteps(2) }} />
                :
                <>
                  <InputView
                    onFocus={() => setFocusId(1)}
                    id={1}
                    eye
                    autoFocus={true}
                    returnKeyType='next'
                    onSubmitEditing={() => setNewPass()}
                    focusId={focusId}
                    errorId={errorId}
                    errMsg={errMsg}
                    value={password}
                    onChangeText={setpassword}
                    placeholder={'Enter Password'}
                    secureText={() => setPassShow(!passShow)}
                    secureTextEntry={passShow ? true : false} />

                  <InputView
                    onFocus={() => setFocusId(2)}
                    id={2}
                    eye
                    autoFocus={true}
                    returnKeyType='next'
                    onSubmitEditing={() => setNewPass()}
                    focusId={focusId}
                    errorId={errorId}
                    errMsg={errMsg}
                    value={conPassword}
                    onChangeText={setConPassword}
                    placeholder={'Enter Password to confirm'}
                    secureText={() => setConfirmPassShow(!confirmPassShow)}
                    secureTextEntry={confirmPassShow ? true : false}
                  />
                  <Button style={{ marginTop: hp(2), width: wp(90), height: hp(6), borderRadius: hp(1), position: 'relative', alignSelf: 'center' }} title={'Create'} continue={() => { setNewPass() }} />
                </ >
            }

          </ >}

      </KeyboardAwareScrollView>
      {completedSteps === 0 ? <Text onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })} style={[styles.mainText, { bottom: hp(2.5), alignSelf: 'center', fontSize: hp(2) }]}>Back to Login</Text> : null}

    </View>
  );
}

export default ForgotPassword;
