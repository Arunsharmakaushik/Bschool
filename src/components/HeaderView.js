import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform ,StatusBar} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../assets/Fonts';
import Images from '../assets/Images';
import { isiPhoneX } from '../utils';
import AppColors from '../utils/AppColors';

const HeaderView = (props) => {
  return (
    <View style={[styles.headerView, {justifyContent:props.group? 'flex-start':'center', backgroundColor:props.login?AppColors.LITEGREEN: props.white ? AppColors.APP_THEME : AppColors.WHITE,height:Platform.OS=='ios' && props.white ? hp(10):hp(8) },props.style]}>
   
    {props.noLeft?null: <TouchableOpacity onPress={() => props.onLeftClick()} style={styles.leftView}>
        <Image resizeMode='contain' source={props.white ? Images.white_back : Images.back} style={styles.imageView} />
      </TouchableOpacity>
}

{props.chat?
<TouchableOpacity onPress={()=>{props.onClickTitle?props.onClickTitle():null}} style={styles.groupImg}>
  <Image source={{uri:props.source}} resizeMode='cover' style={styles.groupImage}/>
</TouchableOpacity>

:null} 

   {props.title ?
        <Text numberOfLines={1} style={[styles.titleText,{marginLeft:props.group?wp(16):0, color: props.white ? AppColors.WHITE : AppColors.APP_THEME}]}>{props.title}</Text>
        : null}
        {props.edit?
        <Text onPress={()=>props.onEdit()} style={[styles.editText,{paddingTop:  Platform.OS==='ios' && props.white ? hp(4) :Platform.OS==='ios'?hp(3): hp(2),color: props.white ? AppColors.WHITE : AppColors.APP_THEME}]}>{props.rightText}</Text>
        :null}
        {props.right?
          <TouchableOpacity onPress={() => props.onRightClick()} style={styles.rightView}>
        <Image resizeMode='contain' source={props.rightSrc ? props.rightSrc:Images.whiteAdd} style={styles.rightImageView} />
      </TouchableOpacity>       
       :null}


    </View>
  );
}
export default HeaderView;
const styles = StyleSheet.create({
  headerView: {
    width: wp(100),
    height: hp(8),
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: isiPhoneX() ? hp(4) : hp(2),
    backgroundColor: AppColors.WHITE,
    flexDirection: 'row',
  },
  titleText:
  {
    width:wp(70),
    alignSelf: 'center',
    fontSize: hp(2.5),
    textAlign: 'center',
    color: AppColors.APP_THEME,
    fontFamily: Fonts.APP_BOLD_FONT,
    paddingTop:  isiPhoneX() || Platform.OS==='android' ?0:hp(2),
 },
  groupImg:{
    // marginTop:Platform.OS==='ios' ? hp(7) : hp(3),
  left:hp(7),position:'absolute',top:Platform.OS==='ios' ? hp(4.5) : hp(2.6),
  height:hp(4.5),width:hp(4.5),borderRadius:50,
  backgroundColor:AppColors.APP_THEME_INPUT,
  alignSelf:'center',borderColor:'transparent'
  },
  groupImage:
  {
    alignSelf:'center',
    height:hp(4.5),width:hp(4.5),
    borderRadius:50,borderColor:'transparent'
  },
  editText:
  {
    alignSelf: 'center',
    fontSize: hp(2.2),
    textAlign: 'center',
    right:wp(5),position:'absolute',
    color: AppColors.APP_THEME,
    fontFamily: Fonts.APP_SEMIBOLD_FONT,
    
  },
  imageView:
  {
    height: hp(3),
    width: hp(3),
    marginLeft: wp(5),
  },
  leftView:
  {
    left: 0,
    position: 'absolute',
    height: hp(7),
    width: hp(7),
    paddingTop: Platform.OS==='ios' ? hp(4) : hp(3),
    
 
  },
  rightView:
  {
    right: 0,
    position: 'absolute',
    height: hp(7),
    width: hp(7),
    paddingTop: Platform.OS==='ios' ? hp(4) : hp(3),
  },
  rightImageView:
  {
    height: hp(2.5),
    width: hp(2.5),
    alignSelf:'center'
  },
})
