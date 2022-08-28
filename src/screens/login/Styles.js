import { Platform, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import { isiPhoneX } from '../../utils';
import AppColors from '../../utils/AppColors';
const styles = StyleSheet.create({
    mainContainer: {
        height: hp('100%'),
        width: wp('100%')
    },
    imageStyle: {
        width: '100%',
        height: '75%',
        alignSelf: 'center',
    },
    bschoolImageSTyle:
    {
        width: '35%',
        height:'15%',
        marginBottom:10,
        alignSelf: 'center',
    },
    in:
    {
        height: hp(3),
        alignSelf: 'center',
        width: hp(3),
        left: wp(5), position: 'absolute',
    },
    titleContainer: {
        height: hp('38%'),
        width: wp('100%'),
        backgroundColor:'#CEF1EE',
        paddingTop:isiPhoneX()?hp(3.5):hp(1.2),
    },
    welcomeText: {
        fontSize: hp(3.5),
        marginTop: hp(1),
        
        textAlign: 'center',
        color: AppColors.APP_THEME,
        fontFamily: Fonts.APP_SEMIBOLD_FONT

    },
    titleSubText: {
        fontSize: hp('2%'),
        height: hp('3%'),
        color: AppColors.LIGHT,
        marginBottom: hp(2),
        fontFamily: Fonts.APP_REGULAR_FONT
    },
    forgotText: {
        color: AppColors.LIGHTGREEN,
        height: hp('3%'),
        fontSize: hp(1.9),
        textAlign: 'right',
        width: wp(80),
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    btnStyle: {

        marginTop: hp('4%'),
        width: wp('80%'),
        height: hp('7%'),
        borderRadius: hp(1),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: AppColors.APP_THEME,
    },
    btnText:
    {
        color: AppColors.WHITE,
        textAlign: 'center',
        fontSize: hp(2),
        fontFamily:Fonts.APP_MEDIUM_FONT
    },
    btnMidText: {
        color: AppColors.LIGHT,
        marginTop: hp('2%'),
        textAlign: 'center'
    },
    // bottomContainer: {
    //     height: hp('90%'),
    //     position: 'absolute',
    //     bottom: 0,
    //     backgroundColor: AppColors.WHITE,
    //     borderTopEndRadius: 30,
    //     borderTopLeftRadius: 30,
    //     alignItems: 'center',
    //     width: wp('100%')
    // },
    bottomText: {
        fontSize: hp(2),
        textAlign: 'center',
        marginTop: hp(1.5),
        marginBottom: hp(5),
        color: AppColors.LIGHT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        alignSelf:'center'
    },

});
export default styles;