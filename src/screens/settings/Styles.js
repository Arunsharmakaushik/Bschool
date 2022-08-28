import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';


const Styles = StyleSheet.create({

    container:
    {
        flex: 1,
        alignItems: 'center',
        // zIndex:500
    },
    settingView:
    {
        width: wp(100),
        height: hp(7),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5)
    },
    textStyle:
    {
        fontSize: hp(2.2),
        color: AppColors.SETTING_TEXT_COLOR,
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        width: '70%',
    },
    buttonText:
    {
        fontSize: hp(2),
        color: AppColors.APP_THEME,
        width: '30%',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        textAlign: 'right'
    },
    imageView:
    {
        height: hp(2.2),
        width: hp(2.2),
    }

});
export default Styles;


export const sellStyle = StyleSheet.create({
    container:
    {
        // flex: 1,
        height:'100%',
        backgroundColor: AppColors.WHITE
    },
    line:
    {
        marginVertical: hp(1.5),
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
    soldOutView:
    {
        alignSelf: 'center',
        width: wp(57),
        height: hp(5.5),
        justifyContent: 'center',
        borderColor: AppColors.APP_THEME,
        borderWidth: 2,
        borderRadius: 50
    },

    deleteItem:
    {
        alignSelf: 'center',
        width: wp(57),
        height: hp(5.5),
        justifyContent: 'center',
        borderColor: AppColors.RED,
        borderWidth: 2,
        borderRadius: 50,
        backgroundColor: AppColors.RED,
        marginBottom: hp(1)
    },
    soldOutTxt:
    {
        color: AppColors.APP_THEME,
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        fontSize: hp(2.2),
        alignSelf: 'center',
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


export const contactStyles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: AppColors.WHITE
    },
});

export const refStyles = StyleSheet.create({
    container:
    {
        flexGrow: 1,
        backgroundColor: AppColors.WHITE,
        zIndex:500, 
    },
    topView:
    {
        backgroundColor: AppColors.BACKGROUND_COLOR,
        width: wp(90),
        alignSelf: 'center',
        marginTop: hp(2),
        borderRadius: 3
    },
    topGreenView:
    {
        backgroundColor: AppColors.APP_THEME,
        width: wp(90),
        alignSelf: 'center',
        marginTop: hp(2),
        borderRadius: 3,
    },
    refText:
    {
        color: AppColors.LIGHTGREEN,
        fontSize: hp(2.2),
        textAlign: 'center',
        padding: hp(2),
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    refGreenText:
    {
        color: AppColors.GREY_TEXT_COLOR,
        fontSize: hp(2.2),
        textAlign: 'center',
        paddingTop: hp(2),
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    codeView:
    {
        height: hp(7),
        width: wp(80),
        backgroundColor: AppColors.WHITE,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 5
    },
    btnView:
    {
        marginTop: hp(2),
        marginBottom: hp(3),
        flexDirection: 'row',
        width: wp(80), alignSelf: 'center',
        justifyContent: 'center',
    },
    btnShape:
    {
        width: '47.5%',
        borderColor: AppColors.LIGHTGREEN,
        borderWidth: 1.5,
        justifyContent: 'center',
        height: hp(5)

    },
    flatbtn:
    {
        width: wp(30),
        right: 0, position: 'absolute',
        alignSelf: 'center',
        marginRight: 10,
        borderColor: AppColors.LIGHTGREEN,
        borderWidth: 1.5,
        justifyContent: 'center',
        height: hp(5)
    },
    btnText:
    {
        color: AppColors.LIGHTGREEN,
        fontSize: hp(2.1),
        alignSelf:'center',
        textAlign: 'center',
        paddingHorizontal: hp(2),
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    detailText:
    {
        marginTop: hp(2),
        marginBottom: hp(3),
        width: wp(80),
        alignSelf: 'center',
        color: AppColors.GREY_TEXT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(1.7),
        textAlign: 'center'
    },
    whiteBox:
    {
        alignSelf: 'center', marginBottom: hp(3),
        borderColor: AppColors.GREY_TEXT_COLOR,
        width: '47.5%',
        borderWidth: 1.5,
        justifyContent: 'center',
        height: hp(5)
    },
    flatView:
    {
        width: wp(90),
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: hp(2)
    },
    flatOuterView:
    {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
       paddingVertical:hp(1),
       borderBottomColor:AppColors.BACKGROUND_COLOR,
       borderBottomWidth:1,
        alignItems: 'center',

    },
    optionView:
    {
       
        flexDirection: 'row',
        paddingHorizontal: 10,
       paddingVertical:hp(1),
       borderBottomColor:AppColors.BACKGROUND_COLOR,
       borderBottomWidth:1,
        alignItems: 'center',
        height: hp(7),
        width: wp(80),
        backgroundColor: AppColors.WHITE,
        alignSelf: 'center',
        borderRadius: 5
    },
    nameText:
    {
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(2),
        textAlign: 'left',
        marginLeft: wp(2),
        width:'45%',
    },
    imgView:
    {
        height: hp(6),
        width: hp(6),
        borderRadius: 100,
        borderColor: 'transparent',
        backgroundColor: 'white',
        marginVertical: hp(1),
    },
    cardView:
    {
        height: hp(35),
        width: wp(80),
        alignSelf: 'center',
        top: hp(7),
        position: 'absolute',
        borderRadius:4,
        zIndex: 500,
        // elevation: 5,
        backgroundColor: AppColors.WHITE
    },
    optionimg:
    {
        height: hp(3.2),
        width: hp(3.2),
        borderRadius: 100,
        borderColor: 'transparent',
        alignSelf:'center',
        marginVertical: hp(1),  
    },
    arrowStyle:
    {
        height: hp(1.5),
        width: hp(1.5),
        right:wp(5),position:'absolute',
        alignSelf:'center'
    },
    iconStyles:
    {
        height: hp(3.2),
        width: hp(3.2),
        right:wp(5),position:'absolute',
        alignSelf:'center' 
    }
})
