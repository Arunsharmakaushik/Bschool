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
    flatListStyle:
    {
        height: hp('88%'),
        width: wp('100%'),
        backgroundColor: AppColors.WHITE,
    },
    gridImageStyle:
    {
        width: wp("33.33%"),
        height: hp('18%'),
        justifyContent: 'flex-end',
        padding: hp('2%'),
        borderWidth: 1,
        borderColor: AppColors.WHITE,
    },
    tabView:
    {
        width: wp(100),
        height: 0,

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
    scene: {
        width: wp(100),
        height: hp(76),

    },

});
export default Styles;
