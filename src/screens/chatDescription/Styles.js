import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';

const Styles = StyleSheet.create({
    container:
    {
        flex: 1,
        alignItems: 'center',
        backgroundColor: AppColors.WHITE
    },
    scene: {
        width: wp(100),
        height: hp(85),


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
        width: wp(25)
    },
    tabView:
    {
        width: wp(100),
        height: 0,

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
        fontFamily: Fonts.APP_REGULAR_FONT,
        color: AppColors.INPUT

    },
    flatInnerView:
    {
        width: wp(90),
        // backgroundColor:'pink',
        alignSelf: 'center',
        // height:hp(10),
        marginBottom: hp(2)
    },
    dateText:
    {
        color: AppColors.LIGHT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(1.6),
        paddingVertical: hp(0.8),
        paddingHorizontal: hp(1.8),
        alignSelf: 'center',
        borderColor: 'transparent',
        borderRadius: 15,
        backgroundColor: AppColors.DATE_BACKGROUND_COLOR
    },
    previewImage:
    {
        height: hp(6.8),
        width: hp(7.5),
        borderRadius: 5,
    },
    detailView:
    {
        flexDirection: 'row',
        width: wp(90),
        justifyContent: 'center',
        paddingTop: 5
    },
    textView:
    {
        width: wp(90) - hp(7),
        paddingHorizontal: hp(1),
    },
    headingText:
    {
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        fontSize: wp(3.5),
    },
    typeText:
    {
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: wp(3.5),
        paddingTop: 3,
    },
    linkText:
    {
        color: AppColors.APP_THEME,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: wp(3.5),
        paddingTop: 2,
    },
    taggedView:
    {
        justifyContent: null,
        alignSelf: 'center',
        marginBottom: hp(2.5),
        flexDirection: 'row',
        width: wp(90),
    },
    taggedImgView:
    {
        height: hp(5),
        width: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        position: 'absolute',
        borderColor: 'transparent',
        borderRadius: 50,
        backgroundColor: AppColors.LIGHTGREEN
    },
    imageView:
    {
        height: hp(5),
        alignSelf: 'center',
        width: hp(5),
        borderColor: 'transparent',
        borderRadius: 50,
    },
    nameText:
    {
        width: '100%',
        fontSize: hp(2),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        color: AppColors.LIGHTGREEN,
        textAlign: `left`,
        left: wp(13),
    },
    timeText:
    {
        color: AppColors.LIGHT,
        fontSize: hp(1.5),
        fontFamily: Fonts.APP_MEDIUM_FONT,
    }
});
export default Styles;
