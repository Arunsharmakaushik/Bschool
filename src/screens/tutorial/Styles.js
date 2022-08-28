import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';
const Styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#CEF1EE',
        height: hp(100)
    },
    dotStyle: {
        height: hp('1%'),
        width: wp('2%'),
        bottom: hp(22),
    },

    swiperInnerView: {
        height: hp('100%'),
        width: wp('100%')
    },
    bottomContainer:
    {
        height: hp(20),
        backgroundColor: AppColors.LITEGREEN,
        paddingHorizontal: hp(7),
    },
    getBtn: {
        backgroundColor: AppColors.APP_THEME,
        height: hp(7),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    getText: {
        color: AppColors.WHITE,
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    bottomLine: {
        alignItems: "center",
        paddingVertical: hp(2)
    },
    lineText: {
        color: AppColors.TEXTGRAY,
        fontFamily: Fonts.APP_MEDIUM_FONT
    }

});
export default Styles;