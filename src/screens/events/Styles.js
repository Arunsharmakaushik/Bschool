import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';

const styles = StyleSheet.create({
    mainScrollContainer:
    {
        flex: 1,
    },
    footer: {
        padding: 10,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(100)
      },
    headerContainer:
    {
        backgroundColor: AppColors.APP_THEME,
        height: hp(30),
        width: wp(100)
    },
    headerInnerContainer:
    {
        // alignItems: 'center',
        // paddingHorizontal: wp(5),
        // height: hp(10),
        // marginTop: hp(4),
        // flexDirection: 'row'

        alignItems: 'center',
        justifyContent:'center',
        paddingHorizontal: wp(5),
        paddingVertical:10,
        marginTop: hp(4),
        flexDirection: 'row'
    },
    headerText:
    {
        fontSize: hp(3.8),
        color: AppColors.WHITE
    },
    headerDateText:
    {
        fontSize: hp(2),
        width: wp(40),
        color: AppColors.GREY_TEXT
    },
    headerButtonContainer:
    {
        // backgroundColor: '#1F726D',
        // width: hp(18),
        // height: hp(4.5),
        // justifyContent: 'center'

        backgroundColor: '#1F726D',
        // width: hp(18),
        width: '35%',
        height: hp(4.5),
        justifyContent: 'center'
    },
    headerButtonText:
    {
        textAlign: 'center',
        fontSize: wp(3.6),
        color: AppColors.WHITE
    },
    headerDropDown:
    {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: AppColors.WHITE,
        borderRadius: hp(20),
        paddingHorizontal: hp(1.5),
        justifyContent: 'space-between',
        height: hp(5),
        width: wp(35),
        margin: wp(5)
    },
    headerDropDownText:
    {
        fontSize: hp(2.2),
        color: AppColors.WHITE,
        width:'77%'
    },
    headerDropDownIcon:
    {
        height: hp(2.6),
        width: hp(2.6),
        marginHorizontal: 5
    },
    calendarContainer:
    {
        width: wp(90),
        marginTop: -hp(5),
        borderRadius: hp(2),
        elevation: 2,
        marginHorizontal: wp(5),
    },
    eventListContainer: {
        marginTop: hp(5),
        alignItems: 'center',
        // 
        flexGrow: 1,
        borderTopRightRadius: hp(3),
        borderTopLeftRadius: hp(3),
        width: wp(100),
    },
    horizontalViewList:
    {
        width: wp(20),
        height: hp(0.3),
        marginBottom: hp(3.5),
        backgroundColor: AppColors.GREY_TEXT_COLOR,
        marginTop: hp(1.5),
    },
    eventViewContainer:
    {
        height: hp(17),
        paddingHorizontal: hp(2),
        flexDirection: 'row'
    },
    dateLineView: {
        height: hp(18),
        alignItems: 'center',
        width: wp(15)
    },
    dateInCircleView:
    {
        marginTop: hp(0.5),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(5),
        width: hp(5),
        backgroundColor: AppColors.APP_THEME,
        borderRadius: hp(20),
        textAlign: 'center'
    },
    verticalLineView:
    {
        height: hp(9),
        width: wp(0.2),
        marginTop: hp(0.4),
        backgroundColor: AppColors.GREY_TEXT
    },
    eventImageContainer:
    {
        height: hp(13),
        marginLeft: hp(1.5),
        width: hp(13)
    },
    eventImage:
    {
        height: hp(13.5),
        width: hp(13.5),
        borderRadius: hp(1)
    },
    eventDetailView:
    {
        height: hp(13),
        marginLeft: hp(1.8),
        alignItems: 'flex-start',
        width: wp(45),
    
    },
    eventNameText:
    {  
        fontSize: hp(2.1),
        color: AppColors.APP_THEME,
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
    },
    eventLocationText:
    {   
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        fontSize: hp(1.7)
    },
    eventDateText:
    {   
        color: AppColors.INPUT,
        marginBottom: hp(0.8),
        fontSize: hp(1.6),
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    tinyImageInList:
    {
        borderRadius: wp(20),
        height: hp(3),
        width: hp(3),
        marginLeft: hp(0.2)
    },
    tinyCircleViewInList:
    {
        marginLeft: hp(0.3),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.APP_THEME,
        borderRadius: wp(20),
        height: hp(2.7),
        width: hp(2.7)
    },
    modalInnerView: {
        paddingBottom: hp(5),
        borderTopLeftRadius: hp(4),
        borderTopRightRadius: hp(4),
        paddingHorizontal: hp(3),
        paddingTop: hp(2),
        position: 'absolute',
        bottom: 0,
        width: '100%', height:hp(45),
        backgroundColor: AppColors.WHITE
    },
    modalMainText: {
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        textAlign: 'left',
        fontSize: hp('2%'),
        paddingVertical: hp(1),
        fontWeight: 'bold',
        paddingLeft: wp(5),
        paddingVertical: hp(2),
       
    },
    modalSelectText: {
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        textAlign: 'left',
        fontSize: hp('2%'),
        paddingVertical: hp(1)
    },
    calenderView:
    {
        height: hp(3.8),
        width: hp(3.8),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 200
    },
    calenderImg:
    {
        height: hp(2.7),
        width: hp(2.7),
        borderRadius: 200
    },

    noData:
    {
        
        alignSelf: 'center',
        paddingVertical: hp(3),
        width: wp(100),
        textAlign:'center',
        color: AppColors.APP_THEME,
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        fontSize: hp(2),
    },

});
export default styles;
