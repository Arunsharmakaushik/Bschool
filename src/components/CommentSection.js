import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from '../assets/Fonts';
import Images from '../assets/Images';
import AppColors from '../utils/AppColors';
import moment from 'moment';
import { timeSince } from '../utils';
import { IMAGE_URL } from '../webServices/EndPoints';

const CommentSection = (props) => {
    let item= props.item;
    return (
        <View style={Styles.commentSection}>
            <TouchableOpacity onPress={()=>{props.navigation.push('MemberProfile',{ USERID: item.user_id})}}>
        <Image source={item.user.profile_image ? {uri:IMAGE_URL + item.user.profile_image}  : Images.user} style={Styles.newMessageImage} />
     </TouchableOpacity>
        {/* <Image source={Images.steve} style={Styles.newMessageImage} /> */}
        <View>
            <View flexDirection='row'>
                <Text style={Styles.nameText}>{item.user.first_name + (item.user.last_name ? ' ' + item.user.last_name : '')}</Text>
                <Text style={Styles.timeText}>{timeSince(item.created_at)}</Text>
            </ View>
            <Text style={Styles.commentText}>{item.comment}</Text>
        </View>
    </View>
    );
}
export default CommentSection;

const Styles = StyleSheet.create({
    commentSection:{
        width: wp(95),
        alignSelf: 'center',
        paddingVertical: hp(1.5),
        flexDirection: 'row',
    },
    nameText:{
        fontSize: hp(2),
        textAlign: 'left',
        alignSelf: 'center',
        paddingLeft: 5,
        color: AppColors.LIGHTGREEN,
        fontFamily: Fonts.APP_MEDIUM_FONT, paddingRight: wp(3)
    },
    timeText:{
        fontSize: hp(1.5),
        alignSelf: 'center',
        textAlign: 'left',
        color: AppColors.GREY_TEXT,
        fontFamily: Fonts.APP_MEDIUM_FONT,

    },
    commentText:{
        width: wp(70),
        paddingLeft: 5,
        textAlign: 'left',
        paddingTop: 3,
        fontWeight:'500',
        fontFamily: Fonts.APP_MEDIUM_FONT,
        color: AppColors.INPUT,
        fontSize: hp(1.7)

    },
    newMessageImage: {
        height: hp(6),
        width: hp(6),
        marginHorizontal: wp(1.7),
        borderRadius: 200,
        borderColor: AppColors.WHITE,
        borderWidth: 1,
        backgroundColor: 'pink'
    },
})