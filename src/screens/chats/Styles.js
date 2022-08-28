import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import { isiPhoneX } from '../../utils';
import AppColors from '../../utils/AppColors';

const Styles = StyleSheet.create({
    allParticipantModal:
    {
        width: wp(33.33),
        height: hp(20),
        justifyContent: 'flex-end',
        padding: hp(2),
        borderWidth: 1,
        borderColor: AppColors.WHITE,
        backgroundColor: AppColors.APP_THEME
    },
    allModalHorLine:
    {
        width: '100%',
        height: hp(0.2),
        backgroundColor: AppColors.GREY_TEXT
    },
    allModalHeadText:
    {
        color: AppColors.WHITE,
        fontSize: wp(3),
        bottom: wp(1),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
    },
    popAllModalInnerView:
    {
        // padding: hp(0),
        // paddingBottom: 10,
        // height: hp(100),
        width: wp(100),
        flex:1,
        alignSelf: 'center',
        backgroundColor: AppColors.WHITE,
    },
    container:
    {
        flex: 1,
        alignItems: 'center',
        backgroundColor: AppColors.WHITE
    },
    textStyle:
    {
        fontSize: 20,
        color: AppColors.APP_THEME,
        fontWeight: 'bold',
    },
    dropDown:
    {
        height: hp(8),
        width: hp(8),
        elevation: 5,
        borderRadius: 50,
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

    tabView:
    {
        width: wp(100),
        height: 0,

    },
    scene: {
        width: wp(100),
        height: hp(76),

    },
    labelStyle:
    {
        width: wp(28),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        fontSize: wp(3.2),
        alignSelf: 'center',
        textAlign: 'center',
    },
    tabStyle:
    {
        width: wp(33.3)
    },
    messageList:
    {
        flexDirection: 'row',
        borderBottomColor: '#EBEBEB',
        borderBottomWidth: 1,
        padding: 10,
    },
    nameView:
    {
        flexDirection: 'row', width: wp(82),
        paddingLeft: 10,
        alignSelf: 'center',
        paddingRight: 5,
        justifyContent: 'space-between',


    },
    msgText:
    {
        fontSize: hp(1.5),
        color: AppColors.LIGHT,
        fontWeight: '500',
        fontFamily: Fonts.APP_MEDIUM_FONT,

    },
    mainMsgText:
    {
        fontSize: hp(1.5),
        color: AppColors.LIGHT,
        fontWeight: '500',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        width: wp(72),
    },
    nameText:
    {

        fontSize: hp(1.8),
        color: AppColors.INPUT,
        fontWeight: '500',
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    countView: {
        height: hp(2.5),
        width: hp(2.5),
        backgroundColor: AppColors.LIGHTGREEN,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    countText:
    {
        color: AppColors.WHITE,
        fontSize: hp(1.4),

    },
    groupImg:
    {
        height: hp(25),
        width: wp(100),
        alignSelf: 'center'
    },

    modalView:
    {
        paddingVertical: hp(3),
        height: hp(30),
        width: wp(100),
        backgroundColor: AppColors.WHITE
    },
    modalOuterView:
    {
        height: hp(100),
        width: wp(100),
        backgroundColor: 'rgba(56,56,56,0.5)',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    partTextStyle:
    {
        fontSize: hp(2),
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        padding: wp(5),
        paddingBottom: wp(3)
    },
    popModalInnerView:
    {
        width: wp(100),
        // padding: hp(2),
        alignSelf: 'center',
        backgroundColor: AppColors.WHITE,
        borderWidth: 0.5,
    },
    popModalHeader:
    {
        alignItems: 'center',
        height: hp(5),
        marginHorizontal: wp(5),
        width: wp(90),
        flexDirection: 'row'
    },
    popModalHeaderText:
    {
        flexGrow: 1,
        fontSize: hp(2.1),
        color: AppColors.RED_TEXT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontWeight: '500'
    },
    favIconStyle:
    {
        height: hp(3.5),
        width: hp(3.5)
    },
    switchIconStyle:
    {
        height: hp(4),
        width: hp(5)
    },
    popupbottomView:
    {
        bottom: hp(0),
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(100),
        height: hp(8),
        borderTopWidth: hp(0.05),
        position: 'absolute'
    },
    bottombuttonText:
    {
        fontSize: hp(2.35),
        color: AppColors.RED_TEXT
    },
    popListContainer:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2.5),
        marginHorizontal: wp(3),
        width: wp(94),
        flexDirection: 'row',
    },
    popListIcons:
    {
        width: wp(40),
        fontSize: hp(2),
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    mainContainer: {
        height: hp('100%'),
        width: wp('100%'),
        backgroundColor: AppColors.WHITE,
        alignItems: 'center'
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
    pinnedStyle:
    {
        width: wp(100),
        height: hp(8),
        backgroundColor: AppColors.APP_THEME,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: isiPhoneX() ? -hp(1) : 0
    },
    pinnedImage:
    {
        height: hp(3),
        width: hp(3.5),
        borderLeftColor: AppColors.LIGHTGREEN,
        borderLeftWidth: 2,
        overflow: 'hidden'
    },
    pinHeading:
    {
        paddingTop: 10,
        fontSize: hp(1.7),
        color: AppColors.WHITE,
        textAlign: 'left',
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    pinnedMsg:
    {
        fontSize: hp(1.6),
        color: AppColors.LIGHT,
        textAlign: 'left',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        width: wp(70)
    },
    pinCross:
    {
        height: hp(2.5),
        width: hp(2.5),
        overflow: 'hidden',
        right: 0, position: 'absolute',
        alignSelf: 'center',
    },
    typingView:
    {
        flexDirection: 'row',
        width: wp(90),
        alignSelf: 'center',
    },
    typingImgView:
    {
        height: hp(3),
        width: hp(3),
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: 'red',
        borderColor: 'red', borderWidth: 1
    },
    imgView:
    {
        height: hp(3),
        width: hp(3),
        alignSelf: 'center',
        borderColor: 'transparent',
        borderRadius: 50,
    },
    typingName:
    {
        paddingLeft: 10,
        color: 'black',
        fontWeight: 'bold'
    }

});
export default Styles;

export const GroupStyles = StyleSheet.create({
    container:
    {
        flex: 1,
        alignItems: 'center',
        backgroundColor: AppColors.WHITE
    },
    topImageVIew:
    {
        height: hp(20),
        width: wp(90),
        marginTop: hp(3),
        alignSelf: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderRadius: 0.0000001,
        borderWidth: 1,
        borderColor: AppColors.BORDER_COLOR
    },
    topImage:
    {
        height: hp(20),
        width: wp(90),
        alignSelf: 'center',
    },
    addImg:
    {
        alignSelf: 'center',
        marginBottom: hp(2),
        height: hp(4.5),
        width: hp(4.5),
        overflow: 'hidden',
    },
    addText:
    {
        fontSize: hp(2),
        color: AppColors.APP_THEME,
        alignSelf: 'center',
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    adminChangeView:
    {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp(90), backgroundColor: AppColors.WHITE,
        alignSelf: 'center',
        marginBottom: hp(2)
    },

    adminText:
    {
        fontSize: hp(1.6),
        color: AppColors.BORDER_COLOR,
        alignSelf: 'center',
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    checkBox:
    {
        right: wp(1), position: 'absolute',
        borderWidth: 1,
        height: hp(2),
        width: hp(2),
        justifyContent: 'center',
    },
    checkBoxImg:
    {
        height: hp(1.6),
        width: hp(1.6),
        alignSelf: 'center'
    },
    headingText:
    {
        marginVertical: hp(3),
        fontSize: hp(2.3),
        width: wp(90),
        alignSelf: 'center',
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    privacyView:
    {
        flexDirection: 'row',
    },
    privacyOuterView:
    {
        height: hp(18),
        width: wp(29.5),
        justifyContent: 'center',
        borderWidth: 1.5
    },
    privacyText:
    {
        fontSize: hp(2),
        alignSelf: 'center', textAlign: 'center',
        color: AppColors.INPUT,
        marginTop: hp(2.5),
        fontFamily: Fonts.APP_MEDIUM_FONT,
        height: '30%',
        marginBottom: hp(1.8),
        width: '98%'
    },
    privacydescription:
    {

        fontSize: wp(3.2),
        alignSelf: 'center',
        textAlign: 'center',
        paddingHorizontal: 4, height: '43%',
        color: AppColors.BORDER_COLOR,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        width: '100%',
    },
    personImage:
    {
        height: hp(5),
        width: hp(5),
        borderRadius: 50,
        borderColor: 'transparent',
        margin: 5,
        alignSelf: 'center',
        marginRight: wp(5)
    },

    midLineContainer: {
        flexDirection: 'row',
        backgroundColor: AppColors.WHITE,
        paddingVertical: hp(1.5),
        alignItems: 'center',
        paddingHorizontal: wp(5),
        // marginTop: hp(2),
    },
    sharedImages:
    {
        width: wp(100),
        marginTop: hp(2),
        backgroundColor: AppColors.WHITE,
        paddingBottom: hp(2)

    },
    midText1: {
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        fontSize: hp(2.2),
        color: AppColors.INPUT,
        flexGrow: 1,
    },
    midText2: {
        fontSize: hp(1.8),
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontWeight: '500',
        color: AppColors.APP_THEME,
        flexGrow: 1,
        textAlign: 'right'
    },

})

export const AllGroupStyles = StyleSheet.create({
    container:
    {
        flex: 1
    },
    searchViewContainer: {
        marginTop: hp(3),
        alignSelf: 'center',
        width: wp(90),
        borderRadius: hp(5),
        backgroundColor: AppColors.SEARCH_COLOR,
        alignItems: 'center',
        height: hp(7),
        flexDirection: 'row',
        marginBottom: hp(2)
    },
    searchIcon: {
        width: hp(2.8),
        height: hp(2.8),
        marginHorizontal: wp(3),
        alignSelf: 'center'
    },
    searchTextinput: {
        width: '73%',
        alignSelf: 'center',
        textAlign: 'left',
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        color: AppColors.BLACK

    },
    forwardStyle:
    {
        right: 0,
        position: 'absolute',
        alignSelf: 'center',
        height: hp(3),
        width: hp(3)
    },
    outerView:
    {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center'
    },
    headingStyle:
    {
        textAlign: 'left',
        fontSize: hp(2.2),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        color: AppColors.INPUT
    },
    countStyle:
    {
        textAlign: 'left',
        fontSize: hp(1.7),
        paddingTop: 3,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.INPUT
    },
    flatView:
    {
        width: '100%',
        height: hp(18),
        marginBottom: hp(1),
        marginTop: 5,
        borderRadius: 7,
        // justifyContent: 'center',
        backgroundColor: AppColors.GREY_TEXT_COLOR
    },
    imgView:
    {
        width: wp(90),
        height: hp(18),
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 5
    },
    redview:
    {
        height: hp(3),
        position: 'absolute',
        right: -7,
        top: -7,
        overflow: 'hidden',
        width: hp(3),
        backgroundColor: '#28B29F',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 100,
        justifyContent: 'center'
    },

    redDotView: {
        textAlign: 'center',
        color: AppColors.WHITE,
        fontSize: hp(1.6)
    },
    flatText:
    {
        position: 'absolute',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: hp(2),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        color: AppColors.WHITE,
        marginTop: hp(6)
    },
    nodataTest:
    {
        color: AppColors.INPUT,
        alignSelf: 'center',
        fontSize: hp(2),
        fontFamily: Fonts.APP_MEDIUM_FONT
    }

})