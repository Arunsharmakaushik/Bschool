import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';

const Styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: AppColors.WHITE
    },

    ImgView: {
        marginVertical: hp(2),
        height: hp(25),
        width: hp(25),
        alignSelf: 'center'
    },

    mainText: {
        color: AppColors.BLACK,
        fontSize: hp(2.5),
        textAlign: 'center',
        fontWeight: '700',
        fontFamily: Fonts.APP_MEDIUM_FONT,
    },
    descText:
    {
        color: AppColors.DESCRIPTION_TEXT,
        width: wp(90),
        marginVertical: hp(2),
        alignSelf: 'center',
        fontFamily: Fonts.APP_REGULAR_FONT,
        fontWeight:'500',
        fontSize: hp(2),
        textAlign: 'center',
        marginBottom: hp(3)
    },

})

export default Styles;