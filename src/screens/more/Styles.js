import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';


const Styles = StyleSheet.create({

    container:
    {
        flex: 1,
        alignItems: 'center',
    },
    mainView:
    {
        top: 0,
        position: 'absolute',
        zIndex: 10,
        height: hp(90), width: wp(100),
        backgroundColor: AppColors.TRANSPARENT_COLOR,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    outerShape:
    {
        // height: hp(),
        paddingVertical: hp(4),
        paddingHorizontal: wp(1),
        width: wp(18),
        alignItems: 'center',
        bottom:Platform.OS==='android' ?hp(4): hp(2),
        right: 2,
        position: 'absolute',
        borderRadius: wp(10),
        zIndex: 2,
    },
    innerView:
    {
        height: hp(9),
        width: wp(16),
        alignItems: "center",
        justifyContent: "center",
    },
    imgView:
    {
        height: hp(3.5),
        width: hp(3.5)
    },
    textStyles:
    {
        color: AppColors.WHITE,
        top: hp(1)
    }

});
export default Styles;