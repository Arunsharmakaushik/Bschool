import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';
import { Platform } from 'react-native';


const Styles = StyleSheet.create({
    container:
    {
        height: hp('100%'),
        width: wp('100%'),
        flex: 1,
        backgroundColor: AppColors.WHITE
    },
    btnText: {
        alignSelf: 'center'
    },
    topView: {
        width: wp(100),
        height: hp(35),
    },
    topText: {
        color: AppColors.WHITE,
        fontSize: hp(4),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        paddingVertical: hp(2),
        textAlign: 'center',
    },
    cameraIcon: {
        right: 0,
        bottom: 0,
        position: 'absolute',
        height: hp(4),
        width: hp(4),
        margin: hp(0.5)
    },
    imgPickView:
    {
        marginTop: hp(-9),
        alignSelf: 'center',
        height: hp(16),
        width: hp(16),
        borderRadius: 500
    },
    imgView:
    {
        overflow: 'hidden',
        alignSelf: 'center',
        height: hp(16),
        width: hp(16),
        borderRadius: 500
    },
    clickStyle:
    {
        right: 0,
        top: 0,
        position: 'absolute',
        height: hp(4),
        width: hp(4),
        justifyContent: 'center',
        backgroundColor: AppColors.APP_THEME,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3
    },
    clickIcon:
    {
        alignSelf: 'center',
        height: hp(2.5),
        width: hp(2.5),
    },

    mainText:
    {
        color: AppColors.APP_THEME,
        fontSize: hp('3%'),
        textAlign: 'left',
        padding: 10,
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        paddingLeft: 0,


    },
    descText:
    {
        color: AppColors.LIGHT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp('1.9%'),
        textAlign: 'left',
    },


    cardStyle: {
        height: Platform.OS === 'ios' ? hp(91) : hp(87),
        alignSelf: 'center',
        width: wp(100),

    },

    listText: {
        color: AppColors.WHITE,
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: wp(3.5),
    },
    outerView:
    {
        width: wp(28),
        margin: wp(1),
        borderRadius: 5,
        height: hp('16%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',

        borderColor: AppColors.APP_THEME,
        borderWidth: 1

    },
    flatView: {
        marginTop: hp(1),
        height: hp('65%'),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    termsView:
    {
        flexDirection: 'row',
        width: wp(90),
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: hp(2),
        marginBottom: hp(8)
    },
    termText:
    {
        color: AppColors.LIGHT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(1.8),
        textAlign: 'left',
        textDecorationLine: 'underline',
        textDecorationColor: AppColors.APP_THEME,
        paddingLeft: wp(5)
    },
    checkBox:
    {

        borderWidth: 1,
        height: hp(3),
        width: hp(3),
        justifyContent: 'center',
    },
    checkBoxImg:
    {
        height: hp(2.2),
        width: hp(2.2),
        alignSelf: 'center'
    },
    codeFieldRoot:
    {
        marginVertical: hp(5),
        justifyContent: 'center',
    },
    cell:
    {

        borderRadius: 5,
        height: hp(8),
        width: hp(6.5),
        paddingVertical: hp(2),
        backgroundColor: AppColors.APP_THEME_INPUT,
        margin: 5,
        overflow: 'hidden',
        fontSize: hp(3),
        textAlign: 'center',
    },
    focusCell: {

        borderColor: '#000',
        alignSelf: 'center'
    },
    inputOuterView:
    {
        width: wp(90),
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: AppColors.GREY_TEXT_COLOR,
        paddingBottom:Platform.OS==='ios'?15:0,
        marginBottom:Platform.OS==='ios'?hp(2):hp(1.5),
        
    },

    textinputStyle: {
        width: '100%',
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_REGULAR_FONT,
        textAlign: 'left',
        fontSize: hp('2%'),
    },

});

export default Styles;