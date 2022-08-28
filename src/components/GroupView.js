import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, } from 'react-native';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../assets/Fonts';
import AppColors from '../utils/AppColors';
import { DEFAULT_GROUP_IMG } from '../webServices/EndPoints';

const GroupView = (props) => 
{
  let item = props.item;
  let navigation= props.navigation;
  return (
    <TouchableOpacity style={[Styles.groupImagesContainer, { backgroundColor: AppColors.WHITE }]} onPress={() => {props.gotoNext(item.channel)}} >
     <FastImage source={{ uri:item.image === null ? DEFAULT_GROUP_IMG: item.image }} style={Styles.groupImagesStyle} />
      <Text style={Styles.universityTextStyle} >{item.name}</Text>
      {item.unreadCount>
      0?<View style={Styles.redview}>
        <Text style={Styles.redDotView} >{item.unreadCount}</Text>
      </View>
      :null}
    </TouchableOpacity>
  );
}
export default GroupView;

const Styles = StyleSheet.create({
  groupImagesContainer: {
    borderRadius: 10,
    height: hp(25),
    marginHorizontal: wp(1),
    alignItems: 'center',
    margin: 2,
    shadowColor: AppColors.GREY_TEXT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1.0,
    elevation: Platform.OS === 'android' ? 5 : 20

  },
  groupImagesStyle: {
    width: wp(35),
    margin: hp(1.8),
    height: hp(18),
    borderRadius: hp(1),
    backgroundColor: AppColors.APP_THEME_INPUT
  },
  universityTextStyle: {
    textAlign: 'center',
    fontSize: hp(1.6),
    fontFamily: Fonts.APP_MEDIUM_FONT,
    width: '90%', height: '10%'
  },
  redview:
  {
    height: hp(3.5),
    position: 'absolute',
    right: 3,
    top: 3,
    width: hp(3.5),
    backgroundColor: '#FF6262',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 100,
    justifyContent: 'center'
  },
  redDotView: {
    textAlign: 'center',
    color: AppColors.WHITE,
    fontSize: hp(1.6)
  },
})