import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppColors.APP_THEME
    },
    animStyle: {

        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 40,
    },
    textschool :{
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold'
      }
})