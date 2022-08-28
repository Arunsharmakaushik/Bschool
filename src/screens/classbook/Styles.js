import { StyleSheet,Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';
import Fonts from '../../assets/Fonts';
const Styles = StyleSheet.create({
  headerContainer:
  {
    backgroundColor: AppColors.APP_THEME,
    height: Platform.OS === 'android' ? hp(12) : hp(15),
    width: wp(100),
    justifyContent: Platform.OS === 'android' ? 'center' : 'flex-end',
    paddingHorizontal: hp(2),
    borderBottomWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    paddingTop: Platform.OS === 'android' ? hp(4) : hp(5),
    borderColor:'rgba(151, 151, 151, 0.4)'
  },
  footer: {
    padding: 10,
    paddingTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(100)
  },
  downIcon:
  { 
    right: hp(1.2),
     position: 'absolute',
      alignSelf: 'center'
     },
  headerText:
  {
    fontSize: wp(4.2),
    color: AppColors.WHITE,
    fontFamily: Fonts.APP_REGULAR_FONT
  },
  IconStyle:
  {
    height: hp(1.3),
    textAlign: 'right',
    width: hp(1.3)
  },
  SearchContainer:
  {
    flexDirection: 'row',
    height: hp(7),
    alignItems: 'center',
    paddingBottom: wp(1),
    fontFamily: Fonts.APP_REGULAR_FONT
  },
  SearchTextInput:
  {
    paddingLeft: 0,
    fontSize:hp(3.3),
    color: AppColors.WHITE,
    flexGrow: 1,
fontFamily:Fonts.APP_SEMIBOLD_FONT,
width:'80%'
  },
  subHeaderContainer:
  {
    height: hp(12),
    backgroundColor: AppColors.APP_THEME,
    justifyContent: 'space-between',
    paddingHorizontal: wp(1),
    alignItems: 'center',
    width: wp(100),
    flexDirection: 'row'
  },
  subHeaderItemView:
  {
    width: wp(38),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: hp(1.3),
    height: hp(5),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.WHITE,
  },
  subHeaderItemText:
  {
    color: AppColors.WHITE,
    fontSize: hp(2),
    fontFamily: Fonts.APP_REGULAR_FONT,
    fontFamily: Fonts.APP_REGULAR_FONT,
 
    width:'72%'
  },
  flatListContainer:
  {
    width: wp(100),
  },
  searchingView:
  { 
    flex: 1,
     height: hp(50),
     width:wp(100), 
     justifyContent: 'center',
   alignItems: 'center',
},
resultText:{ 
  fontSize: hp(2.5), 
  color: AppColors.WHITE,
  width:wp(92),
  textAlign:'center', 
  fontFamily: Fonts.APP_REGULAR_FONT
 },
  flatlistImageContainer:
  {
    width: wp(33.33),
    height: hp(24),
    justifyContent: 'flex-end',
    padding: hp(2),
    borderWidth: 1,
    borderColor: AppColors.WHITE,
    backgroundColor:AppColors.APP_THEME
  },

  flatlistTitleNameText:
  {
    color: AppColors.WHITE,
    fontSize:wp(3),
    bottom: wp(1),
    fontFamily: Fonts.APP_SEMIBOLD_FONT,
   },
  flatListProfileName:
  {
    color: AppColors.WHITE,
    fontSize: hp(1.3),
    fontFamily: Fonts.APP_REGULAR_FONT
  },
  crossIconContainer:
  {
    height: hp(4.5),
    width: hp(4.5),
    marginLeft: hp(0.2)
  },
  crossIcon:
  {
    height: hp(4),
    width: hp(4),
    marginLeft: hp(0.2)
  },
  downArrowstyle:
  {
    height: hp(2),
    width: hp(2),

  },
  sortIcon:
  {
    height: hp(2),
    width: hp(2.5)
  },
  filterIcon:
  {
    height: hp(2),
    width: hp(2.5)
  },
  modalContainer:
  {
    // paddingBottom: hp(5),
    borderTopLeftRadius: hp(4),
    borderTopRightRadius: hp(4),
    paddingHorizontal: hp(3),
    paddingTop: hp(2),
    position: 'absolute',
    bottom: 0,
    paddingBottom:hp(3),
    width: '100%',
    backgroundColor:AppColors.WHITE
  },

  topView:
  {
    height:hp(10),
    flexDirection:'row',
    width:wp(100),
    alignSelf:'center',
    alignItems: 'center',
    paddingHorizontal:wp(3),
    justifyContent: 'space-between',
  },
  filterText:
  {
    color: AppColors.INPUT,
    fontSize: hp(2.8),
    fontFamily: Fonts.APP_SEMIBOLD_FONT
  },
  clearText:
  {
    color: AppColors.PRIVACY_BORDER,
    fontSize: hp(2.4),
    fontFamily: Fonts.APP_MEDIUM_FONT,
    alignSelf:'center'
  },  
  cancelIcon:
  {
    height:hp(3.2),
    width:hp(3.2),
    alignSelf:'center',
    marginLeft:wp(3)
  }

});

export default Styles;
