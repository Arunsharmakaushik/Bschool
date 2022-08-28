import React from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native'
import Styles from './Styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import Button from '../../components/Button';
import HeaderView from '../../components/HeaderView';
import { CodeField, Cursor, useBlurOnFulfill, } from 'react-native-confirmation-code-field';
import Spinner from '../../components/Spinner';


const VerifyView = (props) => {
  let value = props.value;
  const ref = useBlurOnFulfill({ value, cellCount: props.CELL_COUNT });

  return (
    <View style={Styles.container}>
      <HeaderView onLeftClick={() => { props.back() }} />
      {props.loading ? <Spinner /> : null}
      <View style={[Styles.cardStyle,{height:Platform.OS==='ios'?hp(86): hp(82)}]}>
        <Text style={[Styles.mainText, { paddingLeft: wp(5) }]}>Verify Code</Text>
        <Text style={[Styles.descText, { paddingHorizontal: wp(5) }]}>We sent a verification code to your .edu email. Please check your email and enter the code below.</Text>
        <CodeField
          ref={ref}
          value={props.value}
          onChangeText={(value) => { props.setValue(value) }}
          cellCount={props.CELL_COUNT}
          rootStyle={Styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[Styles.cell, isFocused && Styles.focusCell]}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <Text style={[Styles.descText, { textAlign: 'center', fontSize: hp(1.8) }]}>Didn't receive Your code?</Text>
        <TouchableOpacity onPress={() => { props.resendOtp() }}><Text style={[Styles.mainText, { textAlign: 'center', fontSize: hp(2) }]}>Resend Code</Text>
        </TouchableOpacity>
      </View>
      <Button title='Verify Code' continue={() => { props.continue() }} />
    </View>
  )
}

export default VerifyView;
