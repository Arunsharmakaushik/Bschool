import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SimpleToast from 'react-native-simple-toast';
import Fonts from '../assets/Fonts';
import Images from '../assets/Images';
import AppColors from '../utils/AppColors';

const ReplyView = (props) => {
    return (
        <View style={[Styles.replyView, { height: props.replyMessage.length > 50 ? hp(12) : null, backgroundColor: AppColors.WHITE }]}>
            <TextInput onSubmitEditing={() => { props.replyMessage ? props.do_Reply(props.item, props.replyMessage) : SimpleToast.showWithGravity('Please enter some text', SimpleToast.SHORT,SimpleToast.CENTER) }} returnKeyType='done' blurOnSubmit={true} placeholderTextColor={AppColors.GREY_TEXT} onChangeText={props.setreplyMessage} value={props.replyMessage} multiline={true} placeholder='Write comment here...' style={Styles.replyText}></TextInput>
            <TouchableOpacity onPress={() => { props.replyMessage ? props.do_Reply(props.item, props.replyMessage) : SimpleToast.showWithGravity('Please enter some text', SimpleToast.SHORT,SimpleToast.CENTER) }}>
                <Image source={Images.send} style={Styles.send} resizeMode='contain' />
            </TouchableOpacity>
        </View>
    );
}

export default ReplyView;

const Styles = StyleSheet.create({
    replyView: {
        width: wp(95),
        backgroundColor: 'transparent',
        borderRadius: 30,
        borderWidth: 0.8,
        borderColor: AppColors.BLACK,
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
    },
    replyText: {
        paddingHorizontal: wp(3),
        width: wp(82),
        textAlign: 'left',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.GREY_TEXT,
        fontSize: hp(2),
        paddingVertical: hp(1),
        alignSelf: 'center',
    },
    send: {
        height: hp(3.2),
        width: hp(3.2),
        alignSelf: 'center',
        margin: hp(1)
    }
})
