import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';

const Styles = StyleSheet.create({
    imageContainer:
    {
        height: hp(20),
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    schoolText:
    {
        color: AppColors.APP_THEME,
        fontSize: hp(9),
        fontFamily: Fonts.APP_STYLE_FONT
    },
    imageStyle:
    {
        height: hp(13),
        width: wp(30),
        // backgroundColor:'red'
    },
    scrollViewContainer:
    {
        height: hp(10),
        width: wp(100),
        borderTopLeftRadius: hp(3),
        borderTopRightRadius: hp(3),
        backgroundColor: AppColors.WHITE
    },
    scrollViewStyle:
    {
        justifyContent: 'center',
        marginTop: hp(3)
    },
    scrollButtonContainer:
    {
        flexGrow: 1,
        padding: hp(1.5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    componentContainer:
    {
        height: hp(0.5),
        width: wp(12),
        backgroundColor: AppColors.APP_THEME
    },
});

export default Styles;

export const sellStyle = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: AppColors.WHITE
    },
    line:
    {
        marginVertical: hp(3),
        height: 0.8, width: wp(90),
        alignSelf: 'center',
        backgroundColor: AppColors.GREY_TEXT_COLOR
    },
    topImgSelectionView:
    {
        marginVertical: hp(3),
        height: wp(42),
        paddingLeft: wp(5),
        alignSelf: 'center',
    },
    addImg:
    {
        height: hp(3.5),
        alignSelf: 'center',
        width: hp(3.5)
    },
    addImgText:
    {
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(1.6),
        textAlign: 'center'
    },
    crossOuterView:
    {
        overflow: 'hidden',
        borderRadius: 20,
        height: hp(4),
        width: hp(4),
        position: 'absolute',
        right: 5,
        top: 5,
    },
    crossStyle:
    {
        height: hp(4),
        alignSelf: 'center',
        width: hp(4)
    },
    addImgView:
    {
        height: wp(42),
        width: wp(42),
        borderStyle: 'dashed',
        borderRadius: 1,
        borderWidth: 1.5,
        borderColor: AppColors.GREY_TEXT,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    imgStyle:
    {
        height: wp(42),
        width: wp(42),
        marginRight: wp(5),
    },
});




export const crStyle = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: AppColors.WHITE
    },
    listViewContainer:
    {
        flexDirection: 'row',
        marginTop: hp(2.2),
        alignItems: 'center',
        height: hp(6),
        marginHorizontal: wp(4),
    },
    listIcon:
    {
        height: hp(3),
        width: hp(3)
    },
    listText:
    {
        textAlign: 'left',
        flexGrow: 1,
        color: AppColors.GREY_TEXT,
        marginLeft: wp(10),
        fontSize: hp(2.2)
    },
    rentalText:
    {
        textAlign: 'left',
        color: AppColors.APP_THEME,
        marginTop: hp(2.5),
        marginHorizontal:wp(4),
        fontSize: hp(2.2),
        fontFamily:Fonts.APP_BOLD_FONT
    },
    touchListText:
    {
        flexGrow: 1,
        marginLeft: wp(8),
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(2),
        color: AppColors.GREEN
    },
    iconDrop: {
        height: hp(2),
        width: wp(3),
        alignItems: "flex-end",
    },
    discriptionTextInput: {
        marginLeft: wp(8),
        fontSize: hp(2),
        width: wp(77),
        fontFamily: Fonts.APP_MEDIUM_FONT,
        textAlignVertical:'top',
        height:'100%'
    },
    bottomButtonContainer:
    {
        width: wp(100),
        height: hp(8),
        marginTop: hp(2.2),
        position: 'absolute',
        bottom: 0,
        backgroundColor: AppColors.APP_THEME,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomButtonText:
    {
        fontSize: hp(2.4),
        color: AppColors.WHITE,
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    priceTextInput: {
        marginLeft: wp(8),
        fontSize: hp(2),
        flex: 1,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.INPUT
    },
    monthText:
    {
        color: AppColors.APP_THEME,
        fontSize: hp(2),
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    horizontalLine:
    {
        backgroundColor: AppColors.PRIVACY_BORDER,
        height: hp(0.2),
        opacity: 0.3,
        marginTop: hp(2.5),
        marginHorizontal: wp(4),
    },
    sliderContainer:
    {
        height: hp(5),
        marginHorizontal: wp(5)
    },
    midView:
    {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(3),
        marginHorizontal: wp(4)
    },
    rangeTextInput:
    {
        fontSize: hp(2),
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.INPUT, paddingBottom: hp(1)
    },
    rangeBottomLine:
    {
        width: '100%',
        opacity: 0.3,
        backgroundColor: AppColors.PRIVACY_BORDER,
        height: hp(0.2)
    },
    midLineView:
    {
        backgroundColor: AppColors.PRIVACY_BORDER,
        marginHorizontal: hp(3.8),
        height: hp(0.2),
        flexGrow: 1
    },
    markerView:
    {
        height: hp(4),
        width: hp(4),
        marginTop: hp(1),
        alignSelf: 'center',
        borderWidth: hp(0.3),
        borderRadius: hp(50),
        backgroundColor: AppColors.WHITE,
        borderColor: AppColors.GREEN
    },
    priceRangeText:
    {
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(2.1),
        marginTop: hp(2),
        color: AppColors.APP_THEME,
        textAlign: 'center'
    }

});


export const siStyles = StyleSheet.create({

    container:
    {
        flex: 1,
        // alignItems: 'center',
        // backgroundColor: AppColors.WHITE
    },
    swiperContainer:
    {
        height: hp(28),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.APP_THEME
    },
    backButton:
    {
        left: 0,
        position: 'absolute',
        zIndex: 1,
        height: hp(7),
        width: hp(7),
        paddingTop: Platform.OS === 'ios' ? hp(4) : hp(3),
    },
    backButtonStyle:
    {
        height: hp(3),
        width: hp(3),
        marginLeft: wp(5),
    },
    paginationStyleItems:
    {
        borderWidth: 0.7,
        borderColor: "#DADADA",
        marginHorizontal: hp(0.5),
        width: hp(1.5),
        height: hp(1.5)
    },
    swiperImage:
    {
        height: hp(30),
        width: wp(100),

    },
    outerView:
    {
        width: wp(100),
        backgroundColor: AppColors.WHITE,
        paddingHorizontal:wp(2),
        paddingVertical: hp(2),
        marginBottom: hp(2)
    },
    // topTextView:
    // {
    //     flexDirection: 'row',
    //     alignSelf: 'center',
    //     width: wp(90),
    //     paddingTop: 1,
    //     justifyContent: 'space-between',
    // },
    // topText:
    // {
    //     fontFamily: Fonts.APP_SEMIBOLD_FONT,
    //     fontSize: hp(1.9),
    //     color: AppColors.INPUT,
    // },
    topTextView:
    {
        flexDirection: 'row',  
        //  alignSelf: 'center',
        width:'95%',
        paddingTop: 1,
        justifyContent: 'space-between',
    },
    topText:
    {
        width:'80%',
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        fontSize: hp(1.9),
        color: AppColors.INPUT,
    },


    priceText:
    {
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(1.9),
        color: AppColors.APP_THEME,
    },
    cardText:
    {

        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(1.7),
        color: AppColors.LIGHT,
    },
    textView:
    {
        width: wp(90),
        alignSelf: 'center',
        fontSize: hp(1.7),
    },
    readMore:
    {
        color: AppColors.READ_COLOR,
        textAlign: 'right'
    },
    topView:{
        height: hp(100),
        flex: 1,
        width: wp(100),
        backgroundColor: AppColors.WHITE,
       
    },

});



export const roomStyles = StyleSheet.create({

    flatOuterView:
    {
        width: wp(99),
        // height: wp(50),
        paddingTop: hp(3)
    },
    topView:
    {
        flexDirection: 'row',
        // height: wp(22),
        width: wp(100),
        paddingHorizontal: wp(2)
    },
    profileView:
    {
        height: wp(23),
        width: wp(22),
        borderRadius: wp(1),
        backgroundColor: AppColors.APP_THEME
    },
    nametext:
    {
        fontSize: hp(2.3),
        height: wp(11),
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    noteText:
    {
        fontSize: hp(2),
        color: AppColors.PRIVACY_BORDER,
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    note:
    {
        fontSize: hp(1.9),
        color: AppColors.APP_THEME,
        marginTop: wp(1),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        // whiteSpace: "pre" 
        // width: wp(50),
        // backgroundColor:'red'
    },
    detailView:
    {
        marginTop: wp(2),
        padding: hp(2),
        flexDirection: 'row',
        // height: wp(16),
        width: wp(100),
        backgroundColor: AppColors.APP_THEME
    },
    priceView:
    {
        marginHorizontal:2,
        flex:1,
        // marginLeft: hp(1),
        // width: wp(33.5),
    },
    locationView:
    {
        flex:1,
        // marginLeft: hp(1),
        // width: wp(27),
    },
    msgView:
    {
        
        flexDirection: 'row',
        padding: 5,
        paddingVertical:10,
        // marginHorizontal: hp(1),
        // width: wp(31.5),
        // flex:1,
        borderWidth: 1.4,
        borderColor: AppColors.WHITE,
        borderRadius: hp(0.6),
        alignItems: 'center',
    },
    locationText:
    {
        color: AppColors.PRIVACY_BORDER,
        fontSize: wp(3.1),
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    commentImg:
    {
        height: hp(2),
        width: hp(2),
    },
    priceText:
    {
        color: AppColors.WHITE,
        fontSize: wp(3.5),
        fontFamily: Fonts.APP_MEDIUM_FONT,
    },
    msgText:
    {
        color: AppColors.WHITE,
        fontSize: hp(2),
        marginLeft: wp(2.5),
        fontFamily: Fonts.APP_MEDIUM_FONT

    },
    createReq:
    {
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.GREEN,
        fontSize: hp(2.2)
    },
    readMore:
    {
        color: AppColors.READ_COLOR,
        textAlign: 'right',
    }




})


