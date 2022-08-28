import { StyleSheet, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';
import Fonts from '../../assets/Fonts';

const Styles = StyleSheet.create({
  container:
  {
    flex: 1,
  },
  imageBackground:
  {
    height: hp(40),
    width: '100%',
    backgroundColor: AppColors.APP_THEME
  },

  imageBackground2:
  {
    height: hp(40),
    width: '100%',
    backgroundColor:AppColors.TRANSPARENT_COLOR
  },
  backArrow:
  {
    overflow: 'hidden',
    marginHorizontal: hp(3),
    marginTop: Platform.OS == 'ios' ? hp(4) : hp(3)
  },
  backArrowImage:
  {
    height: hp(2.5),
    width: hp(3.5)
  },
  upperbackgroundBottom:
  {
    paddingHorizontal: hp(2.2),
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: hp(4.5),
  },
  upperbottomView:
  {
    flexDirection: 'row',
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(90)
  },
  nameText:
  {
    fontSize: wp(4.8),
    flexGrow: 1,
    width: wp(45),
    textAlign: 'left',
    color: AppColors.WHITE,
    marginRight: wp(2),
    fontFamily: Fonts.APP_MEDIUM_FONT,
  },
  headingText:
  {
    fontSize: wp(4.8),
    textAlign: 'center',
    color: AppColors.WHITE,
    alignSelf: 'center',
    fontFamily: Fonts.APP_MEDIUM_FONT,
  },
  messageBtnContainer:
  {
    borderRadius: hp(1),
    width: wp(43),
    borderWidth: 1,
    borderColor: AppColors.WHITE,
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText:
  {
    fontSize: wp(4.1),
    color: AppColors.WHITE,
    fontFamily: Fonts.APP_REGULAR_FONT
  },
  midContainer:
  {
    marginTop: hp(1),
    backgroundColor: AppColors.WHITE,
    width: '100%',
    paddingVertical: hp(3)
  },
  messageBottomBtn: {
    marginTop: hp(4),
    width: wp(95),
    height: hp(7),
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.APP_THEME
  },
  bottomBtnIcon: {
    height: hp(3),
    alignSelf: 'center',
    width: hp(3),
    left: wp(4), position: 'absolute',
  },
  bottomBtnText: {
    color: AppColors.WHITE,
    textAlign: 'center',
    fontSize: hp(2.2),
    paddingVertical: hp(2),
    fontFamily: Fonts.APP_REGULAR_FONT
  },
  linkdinBtnContainer: {
    marginTop: hp(1),
    marginBottom: hp(3),
    width: wp(95),
    height: hp(7),
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.LINKEDIN_COLOR
  },
  midViewContainer:
  {
    marginHorizontal: hp(2.5),
    paddingVertical: hp(0.8)
  },
  midTitleText:
  {
    color: '#8C9DA1',
    fontSize: hp(1.7),
    fontFamily: Fonts.APP_REGULAR_FONT,
    marginBottom:Platform.OS==='ios'? 5:0
  },
  midTextData:
  {
    fontSize: hp(2),
    fontFamily: Fonts.APP_MEDIUM_FONT,
  },
  topView:
  {
    padding: hp(2),
    width: wp(100),
    backgroundColor: AppColors.WHITE,
    marginBottom: hp(2)
  },
  topImg:
  {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  personName: {
    color: AppColors.APP_THEME,
    fontFamily: Fonts.APP_MEDIUM_FONT,
    fontSize: hp(2.5),
    padding: hp(1),
    textAlign: 'center'
  },
  sendMessageView: {
    height: hp(6),
    width: wp(90),
    alignSelf: 'center',
    backgroundColor: AppColors.GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1.2)
  },
  interestView:
  {
    paddingVertical: hp(0.8),
    paddingHorizontal: hp(3),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.APP_THEME,
    marginRight: hp(1.5),
    marginLeft: 0,
    borderRadius: hp(4),
    marginBottom:5
  },
  interestText:
  {
    color: AppColors.LIGHTGREEN,
    fontSize: hp(2.2),
    fontFamily: Fonts.APP_MEDIUM_FONT,
    textAlign: 'center',
  },
  flatView:
  {
    width: wp(82),
    alignSelf: 'center',
    marginTop: hp(1)
  },
  midLineContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    marginVertical: hp(1.5),
    alignItems: 'center',
    paddingHorizontal: wp(5)
  },
  midText1: {
    fontFamily: Fonts.APP_SEMIBOLD_FONT,
    fontSize: hp(2.5),
    color: AppColors.INPUT,
    flexGrow: 1,
  },
  midText2: {
    fontSize: hp(1.8),
    fontFamily: Fonts.APP_REGULAR_FONT,
    fontWeight: '500',
    color: AppColors.APP_THEME,
    flexGrow: 1,
    textAlign: 'right'
  },
});

export default Styles;
