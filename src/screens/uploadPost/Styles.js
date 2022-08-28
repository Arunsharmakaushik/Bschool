import { StyleSheet} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';

const Styles = StyleSheet.create({
    mainContainer:
    {
        flexGrow: 1,
        backgroundColor: AppColors.WHITE
    },
    mainContainerInner:
    {
        flex: 1,
        backgroundColor: AppColors.APP_THEME
    },
    footer: {
        padding: 10,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(100)
      },
      innerCheckBox: {
        height: hp(1.8),
        width: hp(1.8),
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'yellow',
        alignSelf: 'center'
    },
    checkBoxView:
    {
        height: hp(2.8),
        width: hp(2.8),
        borderWidth: 1.5,
        borderRadius: 6,
        marginRight: wp(4),
        justifyContent: 'center',
         alignItems: 'center',
        overflow: 'hidden',
    },
    selectionOuterView:
    {
        flexDirection: 'row',
        paddingVertical: 5,
        width: wp(100),
        alignItems:'center',
        // backgroundColor:'red'
    },

    listIcon:
    {
        height: hp(3),
        width: hp(3)
    },
    midViewText:
    {
        flexGrow: 1,
        fontSize: hp(2.2),
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    modalSelectText: {
        color: AppColors.INPUT,
        textAlign: 'left',
        fontSize: hp('2%'),
        paddingVertical: hp(1),
        width:'70%',
        alignSelf:'center',
         fontFamily: Fonts.APP_MEDIUM_FONT
    },
    selectTypeText:
    {
        fontSize: hp(2.2),
        color: AppColors.APP_THEME,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        textAlign:'right',
        marginRight:wp(2.5),
        alignSelf:'center',
        // backgroundColor:'red',
        // marginRight:0,
         width: hp(20)
    },
    textInput:
    {
        marginLeft: wp(5),
        fontSize: hp(2.2),
        width: wp(77),
        // height: '100%',
        // textAlignVertical: 'top',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        // backgroundColor:'red'
    },
    dropIcon:
    {
        height: hp(2),
        width: wp(3),
    },
    midView:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(5),
        width: wp(92),
        marginTop: hp(2.5),
        marginHorizontal: wp(4)
    },
    selectType:
    {
        flexDirection: "row",
        alignItems: 'center',
    },
    bottomButtonContainer:
    {
        position: "absolute",
        bottom: 0,
        width: wp(100),
        height: hp(8),
        marginTop: hp(2.2),
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
    imageContainer:
    {
        justifyContent: "center",
        alignItems: "center",
        height: hp(22),
        width: wp(92),
        margin: wp(4),
        borderStyle: 'dashed',
        borderRadius: 0.0000001,
        borderWidth: 1,
        borderColor: AppColors.BORDER_COLOR,
    },
    modalInnerView:
    {
        height: hp(50),
        paddingBottom: hp(5),
        borderTopLeftRadius: hp(4),
        borderTopRightRadius: hp(4),
        paddingHorizontal: hp(3),
        paddingTop: hp(2),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: AppColors.WHITE
    },
    modalMainText:
    {
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        textAlign: 'left',
        fontSize: hp('2%'),
        paddingVertical: hp(1),
        fontWeight: 'bold',
        paddingLeft: wp(5),
        paddingVertical: hp(2)
    },
    imageStyle:
    {
        height: wp(7),
        width: wp(7)
    },
    textInputContainer:
    {
        width: wp(92),
        borderBottomWidth: 1,
        borderColor: AppColors.GREY_TEXT_COLOR,
        marginHorizontal: wp(4),
        marginTop: hp(2)
    },
    inputTextView:
    {
        color: AppColors.INPUT,
        height: hp(6),
        paddingVertical: hp(1),
        fontSize: hp(2.5),
        fontFamily: Fonts.APP_MEDIUM_FONT

    },
    listViewContainer:
    {
        flexDirection: 'row',
        marginTop: hp(2),
        alignItems: 'center',
        height: hp(5),
        width: wp(92),
        marginHorizontal: wp(4),
        // paddingBottom: hp(0.5),
        borderBottomWidth: 1, borderColor: AppColors.GREY_TEXT_COLOR,
    },
    modalContainer:
    {
        flex: 1,
        backgroundColor: AppColors.TRANSPARENT_COLOR
    },
    schoolText:
    {
        width: '90%',
        alignSelf: 'center',
        margin: 5,
        justifyContent:'space-between',
        flexDirection:'row',alignItems:'center'
    },

})
export default Styles;
