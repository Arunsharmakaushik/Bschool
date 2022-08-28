import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Fonts from '../../assets/Fonts';
import Images from '../../assets/Images';
import HeaderView from '../../components/HeaderView';
import InputView, { InputPickerView } from '../../components/InputView';
import AppColors from '../../utils/AppColors';
import { contactStyles } from './Styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import ContactInput from '../../components/ContactInput';
import Button from '../../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import Actions from '../../webServices/Action';
import SimpleToast from 'react-native-simple-toast';
import Spinner from '../../components/Spinner';

const ContactUs = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [allData, setAllData] = useState([]);
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [message, setMessage] = useState('');
  const [focusId, setFocusId] = useState('');
  const [errorId, setErrorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {

    AsyncStorage.getItem(CONSTANTS.EMAIL).then((res) => {
      if (res !== null) {
        setEmail(res);
      }
    })

    getTopics();
  }, ([]))

  const getTopics = () => {
    setLoading(true)
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        Actions.GetTopics(myToken)
          .then((response) => {
            if (response.data.status === 'success') {
          setLoading(false);
          let data = response.data;
          let mainData=data.data.topics ? data.data.topics.data:[];
          let arr=[];
              mainData.map((res) => {
                let item = {
                  id: res.id,
                  value: res.name,
                  name: res.name,
                  created_at: res.created_at,
                  updated_at: res.updated_at
                }
                arr.push(item)
              })
              setAllData([...arr]);
            }
            else {
              setLoading(false);
              SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
            }
          })
          .catch((err) => {
            if (err&&err.response&&err.response.status&& err.response.status === 4011) {
              refreshToken('get');
            } 
            else if (err&&err.response&&err.response.status&& err.response.status ===403) {
              setLoading(false);
              SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
              AsyncStorage.clear();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
            else {
              setLoading(false);
              console.log(JSON.stringify(err.response))
              SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
            }
          })
      }
    })
  }


  const addTopic=()=>{
if(!category){
  SimpleToast.showWithGravity('Please select Category', SimpleToast.SHORT, SimpleToast.CENTER);
}
else if(!message){
  SimpleToast.showWithGravity('Please add message', SimpleToast.SHORT, SimpleToast.CENTER);
}
else{
setLoading(true);
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        let formdata = new FormData();
        formdata.append("topic_id", categoryId)
        formdata.append("message", message)
        
        let data={
          token:myToken,
          data:formdata
        }
        // alert(JSON.stringify(data))
        Actions.AddTopic(data)
          .then((response) => {
            if (response.data.status === 'success') {
          setLoading(false);
          SimpleToast.showWithGravity('Thank you for contacting us! We will get back to you soon', SimpleToast.SHORT, SimpleToast.CENTER)
             navigation.goBack();
            }
            else {
              setLoading(false);
              SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
            }
          })
          .catch((err) => {
            if (err&&err.response&&err.response.status&& err.response.status === 401) {
              refreshToken('topic');
            } 
            else if (err&&err.response&&err.response.status&& err.response.status ===403) {
              setLoading(false);
              SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
              AsyncStorage.clear();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
            else {
              setLoading(false);
              console.log(JSON.stringify(err))
              SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
            }
          })
      }
    })
  }
}

  const refreshToken = (status) => {
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
              if(status==='get')
              {getTopics();
              }
              else{
                addTopic()
              }
            }
          })
          .catch((err) => {
            console.log(err.response.data)
            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
          })
      }
      else
      {
        setLoading(false)
      }
    })
  }

  return (
    <KeyboardAwareScrollView style={{ flex: 1,backgroundColor:AppColors.APP_THEME }} contentContainerStyle={contactStyles.container}>
      <HeaderView white title={'Contact Us'} onLeftClick={() => { navigation.goBack() }} />
     {loading ? <Spinner />:null}
      <ContactInput
        noEdit
        placeholder='Email'
        numberOfLines={1}
        textStyle={{ height: hp(6), marginTop: hp(4) }}
        value={email}
        onChangeText={(text) => { setEmail(text) }}
      />


      <InputPickerView
        style={{ marginTop: hp(3), }}
        returnKeyType='next'
        onSubmitEditing={() => props.doSignup('0')}
        onFocus={() => setFocusId(1)}
        focusId={focusId}
        id={1}
        mainText={'Category'}
        errorId={errorId}
        onSelect={(item) => { setCategory(item.value) ,setCategoryId(item.id)}}
        errMsg={errMsg}
        data={[...allData]}
        value={category}
        placeholder={'Select Category'}
      />

      <ContactInput
        textStyle={{ height: hp(20), marginTop: hp(1), paddingBottom: 20, paddingHorizontal: 0 }}
        placeholder='Type your message here ....'
        numberOfLines={8}
        value={message}
        onChangeText={(text) => { setMessage(text) }}
      />

      <Button title={'Submit'} style={{ bottom: 0, position: 'absolute' }} continue={() => { addTopic()}} />

    </KeyboardAwareScrollView>
  )
}
export default ContactUs;
