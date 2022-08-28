import React, { useState, useEffect, useContext, useRef, useReducer } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, BackHandler, } from 'react-native';
import Images from '../../assets/Images';
import Styles from './Styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Home from '../home/Home';
import Chat from '../chats/Chat';
import CONSTANTS from '../../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Classbook from '../classbook/Classbook';
import Events from '../events/Events';
import {  ThemeContext } from '../../navigation/TabNavigator';
import RBSheet from "react-native-raw-bottom-sheet";
import { useFocusEffect } from '@react-navigation/core';

const More = ({navigation,route}) => {
  const [hide, setHide] = useState(false);
  const [routeName, setRouteName] = useState('');
  const sheetRef = useRef();
  const { setShow, show } = useContext(ThemeContext);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // sheetRef.current.open()
      AsyncStorage.getItem(CONSTANTS.FIXED_ROUTE_NAME).then((res) => {
        if (res !== null) {
          setRouteName(res)
        }
      })
      setHide(false);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.getItem(CONSTANTS.FIXED_ROUTE_NAME).then((res) => {
      if (res !== null) {
        setRouteName(res)
      }
    })
  }, ([]));


  let rn = routeName;

  return (
    <View style={Styles.container}>
      {rn === 'Home' ?
        <Home noLoad navigation={navigation} />
        :
        rn === 'Chat' ?
          <Chat navigation={navigation} />
          :
          rn === 'Events' ?
            <Events route={route} noLoad navigation={navigation} />
            :
            rn === 'ClassbookStack' ?
              <Classbook noLoad navigation={navigation} />
              : null
      }

      {!show ? null : <TouchableOpacity activeOpacity={1.0} style={Styles.mainView} onPress={() =>{ setShow(!show)}}>
        <ImageBackground source={Images.verticleShape} resizeMode='stretch' style={Styles.outerShape} >
          
        <TouchableOpacity onPress={() => navigation.push('UploadPost')} style={[Styles.innerView, { marginBottom: hp(1) }]} >
            <Image resizeMode='contain' style={Styles.imgView} source={Images.uploadIcon} />
            <Text style={Styles.textStyles} >Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.push('Housing') }} style={[Styles.innerView, { marginBottom: hp(1) }]} >
            <Image resizeMode='contain' style={Styles.imgView} source={Images.housing} />
            <Text style={Styles.textStyles} >Housing</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.push('Setting')} style={[Styles.innerView, { marginBottom: hp(1) }]} >
            <Image resizeMode='contain' style={Styles.imgView} source={Images.setting} />
            <Text style={Styles.textStyles} >Settings</Text>
          </TouchableOpacity>
          
          {/* <TouchableOpacity onPress={() => navigation.push('Setting')} style={[Styles.innerView, { marginBottom: hp(1) }]} >
            <Image resizeMode='contain' style={Styles.imgView} source={Images.setting} />
            <Text style={Styles.textStyles} >Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.push('Housing') }} style={[Styles.innerView, { marginBottom: hp(1) }]} >
            <Image resizeMode='contain' style={Styles.imgView} source={Images.housing} />
            <Text style={Styles.textStyles} >Housing</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => { }} style={Styles.innerView} >
            <Image resizeMode='contain' style={Styles.imgView} source={Images.travel} />
            <Text style={Styles.textStyles} >Travel</Text>
          </TouchableOpacity> */}
          
          <View style={Styles.overlappedView} />
        </ImageBackground>
      </TouchableOpacity>
      }

 {/* <RBSheet
 ref={sheetRef}
// ref={ref => {
//             this.RBSheet = ref;
//           }}
          // height={hp(10)}
          closeOnPressMask={true}
          openDuration={250}
          customStyles={{
            container: {
              backgroundColor:'transparent',
              justifyContent: "center",
              alignItems: "center",
              height:hp(10),
              width:wp(20),
              alignSelf:'flex-end'
            },
            wrapper:
            {
              // backgroundColor:'pink',
              backgroundColor:'transparent',
              height:hp(10),
              width:wp(20),
              alignSelf:'flex-end'
            }
          }}
        > */}
          {/* <TouchableOpacity onPress={()=>{setHide(!hide)}} style={{height:'100%',width:'100%'}} /> */}
          {/* </RBSheet> */}
          {/* <View
                  pointerEvents="none"
                style={{position:'absolute',zIndex:200,elevation:200,top:0,bottom:0,left:0,right:0,backgroundColor:'red'}}  >

          </View> */}
    </View>
  );
}

export default More;
