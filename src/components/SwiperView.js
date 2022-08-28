import React from 'react';
import { StyleSheet, View, Image } from 'react-native'
import { Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../assets/Fonts';
import { isiPhoneX } from '../utils';
import AppColors from '../utils/AppColors';

const SwiperView = props => {
    return (
        <View>
            <View style={{paddingBottom:hp(3),paddingTop:isiPhoneX() ?hp(2.5): hp(2)}} >
            <Image source={props.source} resizeMode={props.first ?'stretch' :props.spread?'cover':'contain'} style={styles.imageStyle} ></Image>
            </View>
            <View >
                <Text style={styles.titleText}>{props.title}</Text>
                <Text style={styles.discriptionText}>{props.discription}</Text>
            </View>
        </View>


    )
};
export default SwiperView;

const styles = StyleSheet.create({

    imageStyle:
    {
        width: wp(100),
        height: hp(52),
        justifyContent: 'flex-end',

    },

    titleText: {
        fontSize: hp('2.7%'),
        color: AppColors.APP_THEME,
        textAlign: 'center',
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    discriptionText: {
        marginTop: hp(1.5),
        alignSelf: 'center',
        fontSize: hp('2.1%'),
        textAlign: 'center',
        color: AppColors.TEXTGRAY,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        width: wp('82%')
    },

});
