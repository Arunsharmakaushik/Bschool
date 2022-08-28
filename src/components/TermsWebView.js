import React from 'react';
import { View, Text, Platform, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import HeaderView from './HeaderView';
import AutoHeightWebView from 'react-native-autoheight-webview';

const TermsWebView = (props) => {
  return (
    <View style={{ height: hp(100), width: wp(100), backgroundColor: 'transparent' }}>
      <HeaderView title='Terms and Conditions' onLeftClick={() => { props.back() }} />
      <AutoHeightWebView
        onLoad={() => console.log('on load')}
        onLoadStart={() => console.log('on load Start')}
        onLoadEnd={() => console.log('end')}
        style={{ alignSelf: 'center', width: Dimensions.get('window').width - 10, marginTop: 20 }}
        onSizeUpdated={size => console.log("w " + size.width)}
        customScript={`document.body.style.background = 'transparent';`}
        customStyle={
          `
                * {
                  font-family: 'Times New Roman';
                }
                p {
                  font-size: 14px;
                }
              `}
        scalesPageToFit={Platform.OS === 'android' ? true : false}
        source={{ html: props.showTerm }}
        viewportContent={'width=device-width, user-scalable=no'}
      /></View>
  );
};
export default TermsWebView;

