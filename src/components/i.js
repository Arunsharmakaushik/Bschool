import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Modal, FlatList, StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import AppColors from '../utils/AppColors';
import Images from '../assets/Images';
import Fonts from '../assets/Fonts';
import Icon from 'react-native-vector-icons/AntDesign';
import LocationModal from './LocationModal';

const supportedOrientations = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
];

const InputView = (props) => {
  return (
    <>
      {props.showLocation
        ?
        <LocationModal state={props.state} onClose={() => props.close()} onSelectLocation={(text) => props.onChangeText(text)} />
        :
        null}
      <View style={[{ width: wp('90%'), height: props.id === props.errorId ? hp('9%') : hp('6.5%'), margin: 5, marginVertical: hp(2), alignSelf: 'center', backgroundColor: AppColors.WHITE, }, props.style,]}>
        <View style={[Styles.outerView, { flexDirection: props.eye || props.Button ? 'row' : 'column', backgroundColor: props.focusId === props.id ? AppColors.APP_THEME_INPUT : 'transparent', width: ('100%'), height: hp(6), borderColor: props.id === props.errorId && props.errMsg != '' ? 'red' : props.focusId === props.id ? AppColors.APP_THEME : AppColors.GREY_TEXT_COLOR, },props.innerStyle]}>
          {props.value !== '' || props.focusId === props.id ?
            <Text style={{ fontSize: hp(2), color: AppColors.APP_THEME, position: 'absolute', marginTop: -hp(2.6), backgroundColor: AppColors.WHITE, }}>
              {props.placeholder}
            </Text>
            :
            props.value === '' ?
              <Text numberOfLines={1} style={{ fontSize:props.location? wp(3.8):hp(2), color: props.placeholderTextColor ?  props.placeholderTextColor : AppColors.INPUT, fontFamily: Fonts.APP_MEDIUM_FONT, position: 'absolute', marginTop: hp('1.7%'), backgroundColor: 'white', paddingLeft: 3, paddingRight: 5 }}>
                {props.placeholder}
              </Text> :
              null
          }
          <TextInput
            ref={props.ref}
            editable={props.location||props.noEdit ? false : true}
            autoFocus={props.focusId === props.id ? true : false}
            secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
            keyboardType={props.keyboardType ? props.keyboardType : null}
            value={props.value}
            autoCapitalize={props.autoCapitalize ? props.autoCapitalize : ''}
            returnKeyType={props.returnKeyType ? props.returnKeyType : 'next'}
            onSubmitEditing={props.onSubmitEditing ? props.onSubmitEditing : null}
            onFocus={() => props.onFocus()}
            placeholderTextColor={AppColors.BLACK}
            numberOfLines={props.numberOfLines?props.numberOfLines:null}
            maxLength={props.maxLength ? props.maxLength : null}
            onChangeText={(text) => props.onChangeText(text)}
            style={[Styles.textinputStyle, {width:props.location?'70%':'80%', fontSize: hp(2), textAlignVertical:  props.description ? 'top' : 'center' },props.inputStyle]}
          />
          {props.eye ?
            <TouchableOpacity onPress={() => props.secureText()} style={{ right: 0, position: 'absolute', alignSelf: 'center' }}>
              <Image resizeMode='contain' source={props.secureTextEntry ? Images.close_eye : Images.open_eye} style={{ alignSelf: 'center', height: hp(3), width: hp(3) }} />
            </TouchableOpacity>
            : props.location ?
              <TouchableOpacity onPress={()=>{props.onFocus() ;props.setShowLocation()}} style={{ right: 0, position: 'absolute', alignSelf: 'center' }}>
                <Text style={Styles.locationText}>Choose Location</Text>
              </TouchableOpacity>
              : null}

        </View>

        {props.id === props.errorId ?
          <Text style={{ color: 'red', fontSize: hp('1.8%'), fontWeight: 'bold' }}>{props.errMsg}</Text> : null}
      </View>
    </ >
  );
};
export default InputView;


export const InputPickerView = (props) => {
  const [open, setOpen] = useState(false);
  const [sTop, setTop] = useState(50);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ width: '90%', alignSelf: 'center', margin: 5 }} onPress={() => { setOpen(false), props.onSelect(item) }}>
      <Text style={Styles.text}>{item.value}</Text>
    </TouchableOpacity>
  );

  return (
    <View onLayout={(event) => { setTop(event.nativeEvent.layout.y + hp(10)); console.log(JSON.stringify(event.nativeEvent.layout)) }} style={[{ width: wp('90%'), height: props.id === props.errorId ? hp('9%') : hp('6.5%'), margin: 5, marginVertical: hp(1.5), alignSelf: 'center', backgroundColor: AppColors.WHITE, }, props.style,]}>
      <View style={[Styles.outerView, { backgroundColor: props.focusId === props.id ? AppColors.APP_THEME_INPUT : 'transparent', width: ('100%'), height: hp(6), borderColor: props.id === props.errorId && props.errMsg != '' ? 'red' : props.focusId === props.id ? AppColors.APP_THEME : AppColors.GREY_TEXT_COLOR }]}>
        {props.value !== '' || props.focusId === props.id ?
          <Text style={{ fontSize: hp(2), color: AppColors.APP_THEME, position: 'absolute', marginTop: -hp(2.6), backgroundColor: AppColors.WHITE, fontWeight: 'bold', }}>
            {props.placeholder}
          </Text>
          :
          props.value === '' ?
            <Text style={{ fontSize: hp(2), color: AppColors.INPUT, fontWeight: '400', position: 'absolute', marginTop: hp('1.7%'), backgroundColor: 'white', paddingRight: 5 }}>
              {props.placeholder}
            </Text> : null
        }
        <TouchableOpacity onPress={() =>{if(props.noEdit === true){ }
 else{setOpen(true)}}} style={[Styles.textinputStyle, { width: '100%', flexDirection: 'row', marginTop: -hp(1.1), height: hp(6.5), fontSize: hp(2), backgroundColor: 'transparent', }]}>
          <Text style={[Styles.text, { fontSize: hp(2), alignSelf: 'center', marginTop: hp(0.5) }]}>{props.value}</Text>
          {open ?
            <Icon name='up' size={hp(2.2)} style={{ right: 0, position: 'absolute', alignSelf: 'center' }} />
            :
            <Icon name='down' size={hp(2.2)} style={{ right: 0, position: 'absolute', alignSelf: 'center' }} />
          }
        </TouchableOpacity>
      </View>
      {props.id === props.errorId ?
        <Text style={{ color: 'red', fontSize: hp('1.8%'), fontWeight: 'bold' }}>{props.errMsg}</Text> : null}
      <Modal
        visible={open}
        transparent={true}
        onRequestClose={() => { setOpen(false) }}
        supportedOrientations={supportedOrientations}>
        <TouchableOpacity activeOpacity={1.0} onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(56,56,56,0.5)' }}>
          <View style={[props.pickerStyle, { bottom: 0, position: 'absolute', backgroundColor: AppColors.WHITE, height: props.data.length > 5 ? hp(30) : hp(30), width: wp(100), padding: 10, borderTopLeftRadius: hp(4), borderTopRightRadius: hp(4), alignSelf: 'center' }, Platform.OS === 'ios' ? Styles.shadowIos : Styles.shadowAnd]}>
            <Text style={[Styles.text, { fontWeight: 'bold', paddingLeft: wp(5), paddingVertical: hp(2) }]}>Select {props.mainText}</Text>
            <FlatList
              data={props.data}
              renderItem={renderItem}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};




const Styles = StyleSheet.create({
  outerView: {
    borderBottomWidth: 2,
    borderBottomColor: AppColors.GREY_TEXT_COLOR,
    alignSelf: 'center',
  },
  textinputStyle: {
    height: '100%',
    width: '80%',
    color: AppColors.INPUT,
    fontFamily: Fonts.APP_MEDIUM_FONT,
    textAlign: 'left',
    fontSize: hp('2%'),
  },
  text:
  {
    color: AppColors.INPUT,
    fontFamily: Fonts.APP_MEDIUM_FONT,
    textAlign: 'left',
    fontSize: hp('2%'),
    paddingVertical: hp(1)
  },
  locationText:
  {
    color: AppColors.APP_THEME,
    textAlign: 'right',
    fontSize: hp('1.8%'),
    fontWeight: '400',
    // backgroundColor:'red',
    marginTop:hp(2)
  },
  shadowIos: {
    shadowColor: AppColors.APP_THEME,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1.0,
    elevation: 20
  },
  shadowAnd: {
    // its for android 
    elevation: 20,
    // width:wp(90),
    shadowColor: AppColors.BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 5.0,

  }

});