import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';

const Styles = StyleSheet.create({

    container: {
    height:hp(100) ,
        backgroundColor:AppColors.WHITE,
        justifyContent: 'center',
    },
    topImg:
    {
        height:hp(40),
        width:hp(40),
        marginVertical:hp(5),
        alignSelf:'center',
        backgroundColor:'red'
    },
    titleText:
    {
        alignSelf:'center',
        fontSize:hp(2.5),
        textAlign:'center',
        color:AppColors.APP_THEME,
        fontFamily:Fonts.APP_BOLD_FONT
    },
    desciptionText:
    {
        alignSelf:'center',
        fontSize:hp(1.9),
        width:wp(90),
        textAlign:'center',
        color:AppColors.GREY_TEXT,
        fontFamily:Fonts.APP_MEDIUM_FONT,
        marginTop:hp(3),
        marginBottom:hp(7)
    },

    btnview:
    {
alignSelf:'center',
backgroundColor:AppColors.APP_THEME,
height:hp(6.5),
width:wp(80),
justifyContent: 'center',
    },
    btnText:
    {
        alignSelf:'center',
        fontSize:hp(2),
        textAlign:'center',
        color:AppColors.WHITE,
        fontFamily:Fonts.APP_MEDIUM_FONT,
       
    }

})

export default Styles;