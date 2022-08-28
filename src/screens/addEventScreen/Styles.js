import { StyleSheet,Dimensions } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';
import Fonts from '../../assets/Fonts';
import { Platform } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    mainContainer:
    {
        flexGrow: 1,
        backgroundColor: AppColors.WHITE
    },
    footer: {
        padding: 10,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(100)
      },
    modalView:
    {
        paddingVertical: hp(3),
        height: hp(30),
        width: wp(80),
        borderRadius: 20,
        backgroundColor: AppColors.WHITE
    },
    linkedinName:
    {
        height: hp(6),
        color: AppColors.BORDER_COLOR,
        paddingHorizontal: 16,
        width: wp(70),
        borderWidth: 1.5,
        borderColor: AppColors.BORDER_COLOR,
        borderRadius: hp(2),
        alignSelf: 'center',
    },
    saveView:
    {
        backgroundColor: AppColors.APP_THEME,
        width: '100%',
        bottom: 0,
        position: 'absolute',
        height: hp(6),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'center'
    },
    uploadText:
    {
        alignSelf: 'center',
        fontSize: hp(2.2),
        textAlign: 'center',
        color: AppColors.APP_THEME,
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
        padding: hp(2),
    },
    modalOuterView:
    {
        height: hp(100),
        width: wp(100),
        backgroundColor: 'rgba(56,56,56,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
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
    switchIconContainer: {
        width: hp(8),
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    switchIconStyle:
    {
        height: hp(5.5),
        textAlign: 'right',
        width: hp(5.5)
    },
    verticleLine:
    {
        height: hp(4),
        width: hp(0.35),
        marginHorizontal: hp(2),
        backgroundColor: AppColors.GREY_TEXT_COLOR
    },
    inputTextView:
    {
        color: AppColors.INPUT,
        height: hp(6),
        paddingVertical: hp(1),
        fontSize: hp(2.5),
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    midView:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(5),
        width: wp(92),
        marginHorizontal: wp(4)
    },
    midViewText:
    {
        flexGrow: 1,
        fontSize: hp(2.2),
        color:AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    arrowIcon:
    {
        height: hp(1.5),
        width: wp(3)
    },
    midViewRightText:
    {
        flexGrow: 1,
        fontSize: wp(4),
        textAlign: 'right',
        color: AppColors.GREEN
    },
    arrowIconContainer:
    {
        width: wp(12),
        alignItems: "flex-end"
    },

    timersView:
    {
        width: wp(92),
        alignSelf:'center',
        marginTop:hp(1),
        marginBottom: -hp(2.2),
    },
    startView:
    {
        flexDirection:'row',
         marginVertical:hp(1)
    },
    timeText:
    {
        textAlign: 'left',
        color: AppColors.INPUT,
        fontFamily:Fonts.APP_MEDIUM_FONT,
        marginLeft: wp(8.5),
        fontSize: hp(2.2),
    },
    selectedTime:
    {
        
    color: AppColors.GREY_TEXT,
    fontFamily:Fonts.APP_MEDIUM_FONT,
    fontSize: wp(4.2),

    },
    listViewContainer:
    {
        flexDirection: 'row',
        marginTop: hp(2.2),
        alignItems: 'center',
        height: hp(5),
        width: wp(92),
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
    touchListTextView:
    {
        flexGrow: 1,
        marginLeft: wp(8)
    },
    touchListText:
    {
        color: AppColors.LIGHTGREEN,
        fontFamily:Fonts.APP_MEDIUM_FONT,
        fontSize: hp(2.2)
    },
    bottomButtonContainer:
    {
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
    labelStyle:
    {
        flexGrow: 1,
        fontSize: wp(4),
        textAlign: 'center',
        color: AppColors.LIGHTGREEN
    },
    dropdownContainer:
    {
        height: hp(5),
        width: wp(60)
    },
    dropdownStyle:
    {
        borderWidth: 0,
        flexGrow: 1
    },
    modalInnerView: {
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
    modalMainText: {
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        textAlign: 'left',
        fontSize: hp('2%'),
        paddingVertical: hp(1),
        fontWeight: 'bold',
        paddingLeft: wp(5),
        paddingVertical: hp(2)
    },
    modalSelectText:{
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,
        textAlign: 'left',
        fontSize: hp('2%'),
        paddingVertical: hp(1)
    },
    
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
export default styles;


export const firstRoutStyle = StyleSheet.create({
    descriptionText:
    {
        paddingHorizontal: wp(4),
        marginTop: hp(4),
        fontSize: hp(2),
        color: "#6B7F89",
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    descriptionTextStyle:
    {
        paddingLeft: wp(4),
        paddingRight: wp(20),
        marginTop: hp(1),
        fontSize: hp(2.3),
        color: AppColors.BLACK,
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    horizontalLines:
    {
        backgroundColor: "#979797",
        height: wp(0.45),
        marginTop: hp(5),
        flexGrow: 1,
        opacity: 0.1
    },
    locationText:
    {
        paddingHorizontal: wp(4),
        marginTop: hp(2),
        fontSize: hp(2),
        color: "#6B7F89",
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    mapContainer:
    {
        paddingHorizontal: wp(4),
        height: hp(18),
        marginTop: hp(1)
    },
    attendingText:
    {
        paddingHorizontal: wp(4),
        marginTop: hp(2),
        fontSize: hp(2),
        color: "#6B7F89",
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    tinyImageInList:
    {
        borderRadius: wp(20),
        height: hp(3.8),
        width: hp(3.8)
    },
    rightTextAttending:
    {
        color: AppColors.GREY_TEXT,
        fontSize: hp(2),
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    bottomLineContainer:
    {
        paddingHorizontal: wp(4),
        alignItems: 'center',
        marginVertical: hp(1.5),
        flexDirection: 'row'
    },
    checkboxStyles:
    {
        borderRadius: wp(20),
        height: hp(2.5),
        width: hp(2.5),
    },
    bottomLine:
    {
        color: AppColors.GREY_TEXT,
        fontSize: hp(2),
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    bottomButtonContainer:
    {
        width: wp(100),
        height: hp(8),
        marginTop: hp(1.2),
        backgroundColor: AppColors.APP_THEME,
        alignItems: 'center',
        justifyContent: 'center', 
    },
    bottomButtonText:
    {
        fontSize: hp(2.4),
        color: AppColors.WHITE,
        fontFamily: Fonts.APP_MEDIUM_FONT
    },

})

export const secondRoutStyle = StyleSheet.create({
    mainContainer:
    {
        paddingHorizontal: hp(1.5),
        paddingVertical: hp(2),
        flexDirection: 'row',
        backgroundColor:AppColors.SEARCH_COLOR
    },
    commentorImage:
    {
        borderRadius: wp(20),
        height: hp(6),
        width: hp(6),
    },
    commentContainer:
    {
        width: wp(70),
        marginLeft: hp(2),
        backgroundColor:AppColors.SEARCH_COLOR

    },
    commentorName:
    {
        color: "#008583",
        fontSize: hp(2.1),
        fontFamily: Fonts.APP_SEMIBOLD_FONT
    },
    commentTime:
    {
        color: AppColors.LIGHT,
        fontSize: hp(1.8),
        fontFamily: Fonts.APP_MEDIUM_FONT
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
        backgroundColor:AppColors.SEARCH_COLOR
    },
    TextView:
    {
        width:wp(100),
        height:hp(10),
        justifyContent: 'center',
        alignSelf:'center',
        flexDirection:'row',
        bottom:hp(2),position:'absolute',
       elevation:4 ,
       zIndex:2,
       backgroundColor:AppColors.WHITE,
    //    borderTopWidth:1,
    //    borderTopColor:AppColors.APP_THEME

    },
    textInputStyle:
    {
        width:'85%',
        height:'100%',
        backgroundColor:AppColors.WHITE,
        color:AppColors.INPUT,
        fontFamily:Fonts.APP_MEDIUM_FONT,
        fontSize:hp(2),
        textAlign:'left',
        padding:5,
        paddingLeft:wp(3)

    },
    sendVIew:
    {
        justifyContent:'center',
        width:'15%',
        height:'100%',
        backgroundColor:AppColors.WHITE,
    },
    sendImg:
    {
        height:hp(4),
        width:hp(4),
        alignSelf:'center'
    },
    tabBar:
    {
        flexDirection:'row',
       width:wp(100)  ,
       height:hp(8),
       justifyContent: 'center', 
    
    },
    tabContentView:
    {
        width:'50%',
        height:'100%',
       justifyContent:'center',
        borderBottomWidth:2,
    },
    tabContent:
    {
        textAlign:'center',
        alignSelf:'center',
        fontFamily:Fonts.APP_MEDIUM_FONT,
        fontSize:hp(2),
    },
    commentText:
    {
        color: AppColors.INPUT,
        fontSize: hp(2.1),
        fontFamily: Fonts.APP_MEDIUM_FONT
    }
    
})

export const Styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: AppColors.WHITE,
        height:hp(100)
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
    priceText:
    {
        fontSize: hp(2.3),
        color: AppColors.APP_THEME
    },
    horizontalLine:
    {

        backgroundColor: "#979797",
        height: wp(0.45),
        flexGrow: 1,
        opacity: 0.1,
        marginTop: hp(1.3),

    },
    indicatorStyle:
    {
        height: 2,
        backgroundColor: AppColors.APP_THEME
    },
    dateTextStyle:
    {
        fontSize: hp(2.3),
        color: AppColors.APP_THEME,
        fontFamily:Fonts.APP_SEMIBOLD_FONT
    },
    verticalLine:
    {
        backgroundColor: "#979797",
        height: hp(10),
        width: wp(0.5),
        opacity: 0.15

    },
    midTextContainer:
    {
        width:'85%',
        justifyContent:'center',
        paddingHorizontal: hp(1.5),
        marginVertical:hp(0.5)

    },
    eventNameStyle:
    {
        fontSize: hp(2.2),
        color: AppColors.INPUT,
        fontFamily: Fonts.APP_MEDIUM_FONT,

    },
    eventLocationStyle:
    {
         fontSize: hp(1.9),
        color: "#1D2321",
        alignSelf:'flex-start',
        opacity: 0.5,
        marginTop: hp(0.2),

        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    tabBarStyle:
    {
        width: wp(28),
        color: AppColors.APP_THEME,
        fontSize: wp(3.5),
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: Fonts.APP_MEDIUM_FONT
    },
    backButtonStyle:
    {
        height: hp(3),
        width: hp(3),
        marginLeft: wp(5),
    },
    swiperContainer:
    {
        height: hp(28),
        justifyContent: 'center',
        alignItems: 'center'
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
    eventDetailsConatiner:
    {
        paddingLeft: hp(2),
        paddingRight: hp(2.5)
    },

    midContainer:
    {
        alignItems: 'center',
        justifyContent:'center',
        flexDirection: 'row'
    },

    child:
    {
        width,
        justifyContent: 'center'
    },
    text:
    {
        fontSize: width * 0.5,
        textAlign: 'center'
    },
    scene:
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
   
});