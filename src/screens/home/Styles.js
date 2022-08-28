import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';

const Styles = StyleSheet.create({

    topView:{
        height: hp(100),
        flex: 1,
        width: wp(100),
        backgroundColor: AppColors.WHITE,
       
    },
    mainContainer: {
        backgroundColor: AppColors.WHITE
    },
    headerContainer: {
        height: hp(21),
        width: wp('100%'),
        justifyContent: 'center'
    },
    footer: {
        padding: 10,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(100)
      },
    headerLogoImage: {
        overflow: 'hidden',
        marginHorizontal: wp(4),
        height: hp(8), width: hp(8),
        borderRadius: wp(100),
        borderColor: AppColors.GREY_TEXT,
        borderWidth: 0.5
    },
    headerTitle: {
        fontSize: hp(3.4),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        color: AppColors.WHITE
    },
    headerTagLine: {
        fontSize: hp(1.7),
        fontFamily: Fonts.APP_REGULAR_FONT,
        textAlign: 'left',
        paddingTop: 3,
        color: AppColors.WHITE,
        fontWeight:'400'
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
        color:AppColors.BLACK

    },
     midLineContainer: {
        flexDirection: 'row',
        flexGrow: 1,
        marginVertical: hp(1.5),
        alignItems: 'center',
        paddingHorizontal: wp(5)
    },
    midText1: {
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        fontSize: hp(2.5),
        color: AppColors.INPUT,
        flexGrow: 1,
    },
    midText2: {
        fontSize: hp(1.8),
        fontFamily: Fonts.APP_REGULAR_FONT,
        fontWeight:'500',
        color: AppColors.APP_THEME,
        flexGrow: 1,
        textAlign: 'right'
    },
   
    newMessageContainer: {
        width: wp(100),
        left: wp(1),
        marginTop: hp(2),
    },
    newMessageImage: {
        height: hp(6),
        width: hp(6),
        marginHorizontal: wp(1.7),
        borderRadius: 200,
        borderColor: AppColors.WHITE,
        borderWidth: 1,
        backgroundColor: 'pink'
    },
    active:
    {
        height: hp(1.2),
        width: hp(1.2),
        backgroundColor: 'red',
        position: 'absolute',
        top: hp(0.5),
        borderRadius: 50,
        right: hp(1)
    },
    postContainer: {
        width: wp(100),
        marginTop: hp(2),
        borderWidth: 1,
        borderColor: AppColors.LIGHT_GREY,
        alignItems: 'center',
        backgroundColor:AppColors.WHITE
        
    },
    postHeader: {
        height: hp(10),
        width: wp(100),
        padding: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
    },
    postHeaderImage: {
        height: hp(6),
        width: hp(6),
        borderRadius: 200,
        borderColor: AppColors.BLUE_BUTTON,
        borderWidth: 2
    },
    postUserDetailContainer: {
        alignSelf: 'center',
        paddingHorizontal: wp(2),
        justifyContent: 'center',
    },
    postUserName: {
        fontSize: hp(2),
        textAlign: 'left',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.INPUT
    },
    postTimeText: {
        textAlign: 'left',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.GREY_TEXT
    },
    postdotIconContainer: {
        right: 0, position: 'absolute',
        marginRight: wp(3)
    },
    dotIconStyle: {
        color: AppColors.GREY_TEXT,
        height: hp(5),
        width: wp(9)
    },
    postDiscription: {
        marginBottom: hp(1),
        width: wp(100),
        paddingHorizontal: wp(5),
        paddingBottom: hp(1),
        fontFamily: Fonts.APP_REGULAR_FONT,
        color: AppColors.BLACK,
        fontSize: hp(2)
    },
    postMidImage: {
        height: hp(30),
        width: wp(100),
    },
    postBottomContainer: {
        flexGrow: 1,
        paddingHorizontal: wp(5),
        height: hp(7.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    postLikeContainer: {
        width: '50%',
        flexDirection: 'row',
        height: hp(10),
        alignItems: 'center',
        // justifyContent: 'center',
    },
    postLikeIcon: {
        height: hp(2.8),
        width: hp(2.8),
        alignSelf: 'center',
    },
    postLikeCount: {
        color: AppColors.LIGHT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(1.8),
        marginLeft: 10,
    },
    commentsView:{
        // height: hp(40),
        backgroundColor: AppColors.LIGHT_GREY,
        width: wp(100),
        paddingBottom: 10,
    },
    commentSection:{
        width: wp(95),
        alignSelf: 'center',
        paddingVertical: hp(1.5),
        flexDirection: 'row',
    },
    nameText:{
        fontSize: hp(2),
        textAlign: 'left',
        alignSelf: 'center',
        paddingLeft: 5,
        color: AppColors.LIGHTGREEN,
        fontFamily: Fonts.APP_MEDIUM_FONT, paddingRight: wp(3)
    },
    timeText:{
        fontSize: hp(1.5),
        alignSelf: 'center',
        textAlign: 'left',
        color: AppColors.GREY_TEXT,
        fontFamily: Fonts.APP_MEDIUM_FONT,

    },
    commentText:{
        width: wp(70),
        paddingLeft: 5,
        textAlign: 'left',
        paddingTop: 3,
        fontWeight:'500',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.INPUT,
        fontSize: hp(1.7)

    },
    showMore:{
        fontSize: hp(1.6),
        marginVertical: hp(2),
        paddingVertical: hp(0.8),
        alignSelf: 'center',
        textAlign: 'left',
        color: '#8e9da4',
        overflow:'hidden',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        backgroundColor: '#eff1ef',
        borderRadius: 15,
        paddingHorizontal: hp(2)
    },
    replyView:{
        width: wp(95),
        backgroundColor: 'transparent',
        borderRadius: 30,
        borderWidth: 0.8,
        borderColor: AppColors.BLACK,
        alignItems: 'center',
        // justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
       
    },
    replyText:{
        paddingHorizontal: wp(3),
        width: wp(82),
        textAlign: 'left',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.GREY_TEXT,
        fontSize: hp(2),
        paddingVertical:hp(1),
        alignSelf:'center',
    },
    send:{
        height: hp(3.2),
        width: hp(3.2),
        alignSelf: 'center',
        margin: hp(1)
    }

});
export default Styles;