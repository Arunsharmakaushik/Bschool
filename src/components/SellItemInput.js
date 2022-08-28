import React, { useEffect, useState } from 'react';
import { Image,StyleSheet, TextInput,Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Fonts from '../assets/Fonts';
import AppColors from '../utils/AppColors';

const SellItemInput = (props) => {
    return (
        <View style={[SellStyle.inputViewStyle,{
            height:props.detail?hp(8): hp(7),marginBottom:props.detail?hp(1):hp(2.5),borderBottomColor:props.detail? 'transparent': AppColors.GREY_TEXT_COLOR,width:props.detail? wp(90): props.icon?wp(45):wp(90),alignSelf:props.icon?'flex-start':'center',marginLeft:props.icon?wp(5):0}]}>
            {props.icon ?
            <Image source={props.icon} resizeMode='contain' style={SellStyle.iconStyle} />
        :null}
        {props.price ?<Text style={SellStyle.textStyle}>  $</Text>:null}
            <TextInput blurOnSubmit  maxLength={props.price ? 10:null} keyboardType={props.keyboardType ? props.keyboardType :'default'} multiline={true} numberOfLines={props.detail ? 8 :1} value={props.value} placeholder={props.placeholder} placeholderTextColor={AppColors.GREY_TEXT} style={[SellStyle.textInputStyle,{paddingHorizontal:wp(2), width:props.price ?'75%': props.detail ?'92%': '100%',}]} onChangeText={props.onChangeText} />
        </View>
    )
}
export default SellItemInput;


const SellStyle = StyleSheet.create({

    inputViewStyle:
    {
        width: wp(90),
        alignSelf: 'center',
        borderBottomWidth: 0.8,
     
        flexDirection: 'row',
    },
    textInputStyle:
    {
       
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(2),
        alignSelf: 'center',
    },

    textStyle:
    {
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(2.5),
        alignSelf: 'center',
    },
    iconStyle:
    {
        height: hp(3),
        width: hp(3),
        alignSelf: 'center',
    }

});
