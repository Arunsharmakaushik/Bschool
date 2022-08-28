import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../assets/Fonts';
import AppColors from '../utils/AppColors';



const Button = (props) => {
  return (
    <TouchableOpacity style={[Styles.btnView, props.style]} onPress={() => { props.continue() }}>
      <Text style={Styles.btnText}>{props.title ? props.title : 'Continue'}</Text>
    </TouchableOpacity>

  );
}
export default Button;

const Styles = StyleSheet.create({
  btnView:
  {
    width: wp(100),
    borderColor: AppColors.APP_THEME,
    backgroundColor: AppColors.APP_THEME,
    height: hp(7.5),
    justifyContent: 'center',
    // bottom: 0,
    // position: 'absolute',
  },
  btnText:
  {
    color: AppColors.WHITE,
    fontSize: hp('2.5%'),
    fontFamily: Fonts.APP_MEDIUM_FONT,
    alignSelf: 'center',
    textAlign: 'center',

  }

})