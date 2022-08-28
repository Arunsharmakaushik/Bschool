import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../assets/Fonts';
import AppColors from '../utils/AppColors';



const ContactInput = (props) => {
  return (
<TextInput  multiline={props.noEdit ? false : true} editable={props.noEdit ? false : true} numberOfLines={props.numberOfLines ? props.numberOfLines:null} placeholderTextColor={AppColors.GREY_TEXT_COLOR} placeholder={props.placeholder}  value={props.value} onChangeText={props.onChangeText} style={[Styles.textInputStyle,props.textStyle]}/>

  );
}
export default ContactInput;

const Styles = StyleSheet.create({

   
    textInputStyle:
    {
textAlign:'left',

marginVertical:hp(1),
width:wp(90),
alignSelf:'center',
paddingVertical:5,
// paddingHorizontal:10,
fontSize:hp(2.2),
color:AppColors.INPUT,
textAlignVertical:'top',
fontFamily:Fonts.APP_MEDIUM_FONT,
borderBottomWidth: 2,
borderBottomColor: AppColors.GREY_TEXT_COLOR,
    },

})