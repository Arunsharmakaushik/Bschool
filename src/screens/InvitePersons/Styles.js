import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';


const Styles = StyleSheet.create({

    container:
    {
        flex: 1,
        alignItems: 'center',
        backgroundColor:AppColors.WHITE
    },
    textStyle:
    {
        fontSize: 20,
        color: AppColors.APP_THEME,
        fontWeight: 'bold',
    },
    footer: {
        padding: 10,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(100)
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
        width: hp(3),
        height: hp(3),
        marginHorizontal: wp(3),
        alignSelf: 'center',
    },
    searchTextinput: {
        width: '73%',
        alignSelf: 'center',
        textAlign: 'left',
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        color: AppColors.BLACK

    },
    outerImg:
    {
        height: hp(5),
        width: hp(5),
        alignSelf:'center',
        justifyContent:'center',
    },
    personImage:
    {
        height: hp(5.3),
        width: hp(5.3),
        borderRadius: 100,
        overflow:'hidden',
        borderColor: 'transparent',
        margin: 5,
        alignSelf: 'center',
        marginRight: wp(5),

    },
    nameText:
    {
        fontSize: hp(2.1),
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    addressText:
    {
        fontSize: hp(1.6),
        color: AppColors.PRIVACY_BORDER,
        fontFamily: Fonts.APP_MEDIUM_FONT,
    },
    checkBox:
    {
        marginRight: wp(4),
        borderWidth: 1,
        height: hp(2.2),
        width: hp(2.2),
        alignSelf: 'center',
        justifyContent: 'center',
    },
    checkBoxImg:
    {
        height: hp(2),
        width: hp(2),
        alignSelf: 'center'
    },
    flatOuterView:
    {
        flexDirection: 'row',
        marginBottom: hp(3),
        paddingLeft:wp(3)
    },

    cutImage:
    {
        top:-3,right:-5,
        position:'absolute',
        justifyContent:'center',overflow:'hidden'

    },
    cutImg:
    {
        height:hp(2.2),
        width: hp(2.2),alignSelf:'center',
        overflow:'hidden'
    }

});
export default Styles;
