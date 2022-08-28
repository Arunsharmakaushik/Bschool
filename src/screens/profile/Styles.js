import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';

const styles = StyleSheet.create({
    mainContainer: {
        height: hp('100%'),
        width: wp('100%'),
        backgroundColor: AppColors.WHITE
    },
    imageicon:
    {
        height: hp(3),
        width: hp(3),
        alignSelf: 'center',
        marginHorizontal: wp(3)
    },
    ImgTopView:
    {
        height: hp(20),
        alignSelf: 'center',
        width: hp(23),
        justifyContent: 'center',
        margin: hp(4),
        marginBottom: hp(2)
    },
    imageView:
    {
        height: hp(17),
        width: hp(17),
        alignSelf: 'center',
        borderRadius: hp(10),
        borderWidth: 1,
        overflow: 'hidden',
        borderColor: 'transparent'
    },
    attachView:
    {
        alignSelf: 'center',
        width: wp(90),
        backgroundColor: AppColors.LIGHT_GREY,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 0.0000001,
        marginBottom: hp(7),
        borderColor: AppColors.APP_THEME
    },
    uploadText:
    {
        alignSelf: 'center',
        fontSize: hp(2.2),
        textAlign: 'center',
        color: AppColors.APP_THEME,
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        padding: hp(2),
    },
    btnStyle: {

        marginTop: hp(2),
        width: wp(90),
        height: hp(6),
        borderRadius: hp(1),
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: AppColors.LINKEDIN_COLOR
    },
    in:
    {
        height: hp(3),
        alignSelf: 'center',
        width: hp(3),
        left: wp(4), position: 'absolute',
    },
    InCheckView:
    {
        height: hp(6),
        justifyContent: 'center',
        width: hp(5),
        backgroundColor: AppColors.LINKEDIN_COLOR,
        borderBottomWidth: 2,
        borderBottomColor: AppColors.GREY_TEXT_COLOR,
    },
    InCheck:
    {
        height: hp(3),
        alignSelf: 'center',
        width: hp(3),
        // backgroundColor:'red'
    },
    btnText:
    {
        color: AppColors.WHITE,
        textAlign: 'center',
        fontSize: hp(2),
        paddingVertical: hp(1.7),
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    btnMidText: {
        color: AppColors.LIGHT,
        marginTop: hp('2%'),
        textAlign: 'center'
    },
    linkedinName:
    {
        height: hp(6),
        color: AppColors.BORDER_COLOR,
        paddingHorizontal: 16,
        width: wp(70),
        borderWidth: 1.5,
        borderColor: AppColors.BORDER_COLOR,
        borderRadius: hp(2),
        alignSelf: 'center',
    },
    saveView:
    {
        backgroundColor: AppColors.APP_THEME,
        width: '100%',
        bottom: 0,
        position: 'absolute',
        height: hp(6),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'center'
    },
    modalView:
    {
        paddingVertical: hp(3),
        height: hp(30),
        width: wp(80),
        borderRadius: 20,
        backgroundColor: AppColors.WHITE
    },
    modalOuterView:
    {
        height: hp(100),
        width: wp(100),
        backgroundColor: 'rgba(56,56,56,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText:
    {
        color: 'red',
        alignSelf: 'center',
        paddingTop: 3

    },
    alertView: {
        height: hp(23),
        width: wp(100),
        bottom: 0,
        position: 'absolute',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopColor: 'transparent',
        borderTopWidth: 1,
        justifyContent: 'center',
        backgroundColor: AppColors.WHITE,
        alignSelf: 'center'
    },
    buttonText: {
        // width:'90%',
        alignSelf: 'center',
        paddingVertical: hp(1),
        fontSize: hp(2),
        margin: 10,
        textAlign: 'left',
        fontFamily: Fonts.APP_BOLD_FONT,
        color: AppColors.INPUT,
    },
    topView: {
        height: hp(100),
        flex: 1,
        width: wp(100),
        backgroundColor: AppColors.WHITE,

    },
    alertOuterView:
    {
        backgroundColor: "white",
        marginHorizontal: wp(5),
        alignSelf: 'center',
        paddingTop: hp(8),
        paddingHorizontal: wp(2.5),
        borderRadius: 15,
    },
    noBtn:
    {
        backgroundColor: AppColors.RED_TEXT,
        borderRadius: 20,
        marginTop: hp(5),
        width: wp(38),
        paddingVertical: hp(1),
        paddingHorizontal: wp(2.5),
        alignItems: "center",
        justifyContent: "center",
    },
    yesBtn:
    {
        backgroundColor: AppColors.APP_THEME,
        borderRadius: 20,
        marginTop: hp(5),
        paddingHorizontal: wp(2.5),
        width: wp(38),
        paddingVertical: hp(1),
        alignItems: "center",
        justifyContent: "center",
    },
    choiceText:
    {
        fontSize: hp(2.5), color: AppColors.WHITE,
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    btnView:
    {
        flexDirection: "row",
        paddingBottom: hp(2),
        justifyContent: "space-evenly",
    },
    outerView:
    {
        flex: 1,
        backgroundColor: "rgba(56,56,56,0.5)",
        justifyContent: 'center',
    },
    logoImageView: {
        width: wp(22),
        height: wp(22),
        marginHorizontal: wp(30),
        marginTop: -wp(28),
    },
    selectCountryText: {
        fontSize: hp(3),
        marginTop: hp(3),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        textAlign: "center",
    },
    sureText: {
        fontSize: hp(2.1),
        marginTop: hp(2),
        fontFamily: Fonts.APP_REGULAR_FONT,
        textAlign: "center",
        color: AppColors.GREY_TEXT,
    },

});

export default styles;