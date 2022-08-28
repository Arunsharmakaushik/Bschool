import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Modal, View, FlatList, ImageBackground, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Icon from 'react-native-vector-icons/AntDesign';
import Fonts from '../assets/Fonts';
import { AllGroupStyles } from '../screens/chats/Styles';
import AppColors from '../utils/AppColors';

export const MainView = (props) => {
    return (
        <TouchableOpacity onPress={() => { props.doExpand() ? props.doExpand():null }} style={[{ width: wp(100), alignSelf: 'center', flexDirection: 'row', paddingHorizontal: wp(3), paddingBottom: hp(1.4), paddingTop: hp(2.2), borderBottomWidth:  Platform.OS === 'android' ? 0.2 : 0.5, borderBottomColor: 'rgba(151, 151, 151, 0.4)' }]}>
            <Text style={AllGroupStyles.headingStyle}>{props.heading}</Text>
            {props.open ?
                <Icon name='caretdown' color={AppColors.PRIVACY_BORDER} size={hp(2.2)} style={{ right: wp(3), position: 'absolute', alignSelf: 'center' }} />
                : <Icon name='caretup' color={AppColors.PRIVACY_BORDER} size={hp(2.2)} style={{ right: wp(3), position: 'absolute', alignSelf: 'center' }} />
            }
        </TouchableOpacity>
    )
};

export const ExpandView = (props) => {
    return (
        <View width={wp(100)} paddingVertical={hp(2)}>
            <FlatList
                data={props.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <View style={Styles.selectionOuterView}>
                            <TouchableOpacity onPress={() => { props.selectData(item, index) }} style={[Styles.checkBoxView, { borderColor: item.selected ? AppColors.APP_THEME : AppColors.BORDER_COLOR }]}>
                                <View style={[Styles.innerCheckBox, { borderColor: item.selected ? AppColors.APP_THEME : AppColors.WHITE, backgroundColor: item.selected ? AppColors.APP_THEME : AppColors.WHITE }]}></View>
                            </TouchableOpacity>
                            <Text onPress={() => { props.selectData(item, index) }} style={[AllGroupStyles.headingStyle, {alignSelf:'center', fontFamily: Fonts.APP_MEDIUM_FONT }]}>{item.name}</Text>
                        </View>)
                }}
            />
        </View>
    )
}




const Styles = StyleSheet.create({

    checkBoxView:
    {
        height: hp(2.8),
        width: hp(2.8),
        borderWidth: 1.5,
        borderRadius: 6,
        marginRight: wp(4),
        justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden'
    },
    innerCheckBox: {
        height: hp(1.8),
        width: hp(1.8),
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'yellow',
        alignSelf: 'center'
    },
    selectionOuterView:
    {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        paddingVertical: 5,
        width: wp(100),
    },

})
