import React from 'react';
import { View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import { BallIndicator } from 'react-native-indicators';
import AppColors from '../utils/AppColors';


const Spinner = (props) => {

    return (
        <View style={{zIndex:100,elevation:100,position:'absolute', justifyContent: 'center',alignItems:'center',height:hp('100%'),width:wp('100%'), backgroundColor:'transparent' }}>
         <BallIndicator style={{alignSelf:'center'}} size={50} color={props.white?AppColors.WHITE: AppColors.APP_THEME} />
        </View>
    );
};
export default Spinner;

