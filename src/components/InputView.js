import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Modal, FlatList, StyleSheet, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import AppColors from '../utils/AppColors';
import Images from '../assets/Images';
import Fonts from '../assets/Fonts';
import Icon from 'react-native-vector-icons/AntDesign';
import LocationModal from './LocationModal';
import Spinner from './Spinner';
import { BallIndicator } from 'react-native-indicators';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
        <View style={[{ width: wp('90%'), height: props.id === props.errorId ? hp('9%') : hp('6.5%'), margin: 5, marginVertical: hp(2), alignSelf: 'center', backgroundColor: props.login ? AppColors.WHITE : AppColors.WHITE, }, props.style,]}>
          <View style={[Styles.outerView, { borderBottomColor:  props.value !== '' || props.focusId === props.id ? AppColors.LIGHTGREEN  : AppColors.GREY_TEXT_COLOR, flexDirection: props.eye || props.Button ? 'row' : 'column', backgroundColor: props.focusId === props.id ? props.login ? AppColors.LITEGREEN : AppColors.APP_THEME_INPUT : 'transparent', width: ('100%'), height: hp(6), borderColor: props.id === props.errorId && props.errMsg != '' ? 'red' : props.focusId === props.id ? AppColors.APP_THEME : AppColors.GREY_TEXT_COLOR, }, props.innerStyle]}>
            {props.value !== '' || props.focusId === props.id ?
              <Text  numberOfLines={ props.bio?1:1} style={{ fontSize: hp(2), fontFamily: Fonts.APP_MEDIUM_FONT, color: props.login ? AppColors.LIGHTGREEN : AppColors.APP_THEME, position: 'absolute', marginTop: -hp(2.6), backgroundColor: props.login ? AppColors.WHITE : AppColors.WHITE, }}>
                {props.placeholder}
              </Text>
              :
              props.value === '' ?
                <Text numberOfLines={ props.bio?2:1} style={{ fontSize: props.location ? wp(3.8) : hp(2), color: props.placeholderTextColor ? props.placeholderTextColor : AppColors.INPUT, fontFamily: Fonts.APP_MEDIUM_FONT, position: 'absolute', marginTop: hp('1.7%'), backgroundColor: props.login ? AppColors.WHITE : 'white', paddingLeft: 3, paddingRight: 5 }}>
                  {props.placeholder}
                </Text> :
                null
            }
            <TextInput
              ref={props.ref}
              editable={props.location || props.noEdit ? false : true}
              autoFocus={props.focusId === props.id ? true : false}
              secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
              keyboardType={props.keyboardType ? props.keyboardType : null}
              value={props.value}
              autoCapitalize={props.autoCapitalize ? props.autoCapitalize : ''}
              returnKeyType={props.returnKeyType ? props.returnKeyType : 'next'}
              onSubmitEditing={props.onSubmitEditing ? props.onSubmitEditing : null}
              onFocus={() => props.onFocus()}
              placeholderTextColor={AppColors.BLACK}
              numberOfLines={props.numberOfLines ? props.numberOfLines : null}
              maxLength={props.maxLength ? props.maxLength : null}
              onChangeText={(text) => props.onChangeText(text)}
              style={[Styles.textinputStyle, { width: props.location ? '70%' : '80%', fontSize: hp(2), textAlignVertical: props.description ? 'top' : 'center' }, props.inputStyle]}
            />
            {props.eye ?
              <TouchableOpacity onPress={() => props.secureText()} style={{ right: 0, position: 'absolute', alignSelf: 'center' }}>
                <Image resizeMode='contain' source={props.secureTextEntry ? Images.open_eye : Images.close_eye} style={{ alignSelf: 'center', height: hp(3), width: hp(3) }} />
              </TouchableOpacity>
              : props.location ?
                <TouchableOpacity onPress={() => { props.onFocus(); props.setShowLocation() }} style={{ right: 0, position: 'absolute', alignSelf: 'center' }}>
                  <Text style={Styles.locationText}>Choose Location</Text>
                </TouchableOpacity>
                : null}
          </View>
          {props.id === props.errorId ?
            <Text style={{ color: 'red', fontSize: hp('1.8%'), fontWeight: 'bold' }}>{props.errMsg}</Text> : null}
        </View>
      }
    </ >
  );
};
export default InputView;

export const InputPickerView = (props) => {
  const [open, setOpen] = useState(false);
  const [sTop, setTop] = useState(50);
  const [onEndReached, setOnEndReached] = useState(false);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={{ width: '90%', alignSelf: 'center', margin: 5 }} onPress={() => { setOpen(false), props.onSelect(item) }}>
      <Text style={Styles.text}>{item.value}</Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={Styles.footer}>
        {props.isLoading ?
          <BallIndicator style={{ alignSelf: 'center' }} size={20} color={props.white ? AppColors.WHITE : AppColors.APP_THEME} />
          : null}
      </View>
    );
  };

  const loadData = () => {
    setOpen(true);
    props.loadMoreData();
  }

  return (
    <View onLayout={(event) => { setTop(event.nativeEvent.layout.y + hp(10)); console.log(JSON.stringify(event.nativeEvent.layout)) }} style={[{ width: wp('90%'), height: props.id === props.errorId ? hp('9%') : hp('6.5%'), margin: 5, marginVertical: hp(1.5), alignSelf: 'center', backgroundColor: AppColors.WHITE, }, props.style,]}>
      <View style={[Styles.outerView, { backgroundColor: props.focusId === props.id ? AppColors.APP_THEME_INPUT : 'transparent', width: ('100%'), height: hp(6), borderColor: props.id === props.errorId && props.errMsg != '' ? 'red' : props.focusId === props.id ? AppColors.APP_THEME : AppColors.GREY_TEXT_COLOR }]}>
        {props.value !== '' || props.focusId === props.id ?
          <Text style={{ fontSize: hp(2), color: AppColors.APP_THEME, position: 'absolute', marginTop: -hp(2.6), backgroundColor: AppColors.WHITE, fontWeight: 'bold',fontFamily:Fonts.APP_MEDIUM_FONT }}>
            {props.placeholder}
          </Text>
          :
          props.value === '' ?
            <Text style={{ fontSize: hp(2), color: AppColors.INPUT, fontWeight: '400', position: 'absolute', marginTop: hp('1.7%'), backgroundColor: 'white', paddingRight: 5 ,fontFamily:Fonts.APP_MEDIUM_FONT}}>
              {props.placeholder}
            </Text> : null
        }
        <TouchableOpacity onPress={() => {
          if (props.noEdit === true) { }
          else {
            setOpen(true)
            if (props.grade || props.location) { props.clearSearch() }
          }
        }} style={[Styles.textinputStyle, { width: '100%', flexDirection: 'row', marginTop: -hp(1.1), height: hp(6.5), fontSize: hp(2), backgroundColor: 'transparent', }]}>
          <Text numberOfLines={1} style={[Styles.text, {paddingRight:wp(8), fontSize: hp(2), alignSelf: 'center', marginTop: hp(0.5) }]}>{props.value}</Text>
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
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'rgba(56,56,56,0.5)' }} contentContainerStyle={{ flexGrow: 1, backgroundColor: 'rgba(56,56,56,0.5)' }} enableOnAndroid={true} enableAutomaticScroll scrollEnabled resetScrollToCoords={{ x: 0, y: 0 }} >
          <TouchableOpacity activeOpacity={1.0} onPress={() => setOpen(false)} style={{ height: hp(100), width: wp(100), backgroundColor: 'rgba(56,56,56,0.5)' }}>

            <View style={[props.pickerStyle, { bottom: 0, position: 'absolute', backgroundColor: AppColors.WHITE, height: props.location || props.grade ? hp(80) : props.data.length > 5 ? hp(30) : hp(30), width: wp(100), padding: 10, borderTopLeftRadius: hp(4), borderTopRightRadius: hp(4), alignSelf: 'center' }, Platform.OS === 'ios' ? Styles.shadowIos : Styles.shadowAnd]}>
              <Text style={[Styles.text, { fontWeight: 'bold', paddingLeft: wp(5), paddingVertical: hp(2) }]}>Select {props.mainText}</Text>
              {props.location ?
                <View style={Styles.locationInputContainer}>
                  <Image source={Images.search} style={Styles.searchIcon} />
                  <TextInput
                    style={{
                      height: hp(6),
                      color: AppColors.BLACK,
                      paddingHorizontal: 16,
                      width: wp(70),
                    }}
                    onSubmitEditing={() => { setOpen(false), props.onSubmitEditing() }}
                    value={props.searchText}
                    onChangeText={(text) => { props.onChangeText(text) }}
                    placeholder= {props.mainText === 'Undergrad'?'University Name' : "Enter location"}
                    placeholderTextColor={AppColors.BLACK}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      // alert('ggg')
                      props.onChangeText('')
                      props.clearSearch()
                    }}>
                    <Image resizeMode='contain' source={Images.cross} style={Styles.locationCancelIcon} />
                  </TouchableOpacity>
                </View>

                : null}
              {props.location || props.grade ?

                <FlatList
                  data={props.data}
                  renderItem={renderItem}
                  ListFooterComponent={renderFooter}
                  initialNumToRender={15}
                  keyExtractor={(item, index) => index.toString()}
                  maxToRenderPerBatch={2}
                  onEndReachedThreshold={0.1}
                  onMomentumScrollBegin={() => { setOnEndReached(false) }}
                  onEndReached={() => {
                    if (!onEndReached) {
                      loadData();   // on end reached
                      setOnEndReached(true)
                    }
                  }
                  }
                />
                :
                <FlatList
                  data={props.data}
                  renderItem={renderItem}
                />
              }
            </View>

          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  );
};

const Styles = StyleSheet.create({
  outerView: {
    borderBottomWidth: 1.2,
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
    marginTop: hp(2)
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
  },

  locationInputContainer: {
    height: hp(6),
    backgroundColor: AppColors.APP_THEME_INPUT,
    borderRadius: 8,
    marginVertical: hp(0.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: wp(90),
    alignSelf: 'center'
  },
  searchIcon: {
    height: wp(4),
    width: wp(4)
  },
  locationCancelIcon: {
    height: wp(4),
    width: wp(4)
  },
  footer: {
    padding: 10,
    paddingTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(100)
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
