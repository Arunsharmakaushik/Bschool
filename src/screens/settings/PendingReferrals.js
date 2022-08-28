import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderView from '../../components/HeaderView';
import Images from '../../assets/Images';
import Fonts from '../../assets/Fonts';
import FastImage from 'react-native-fast-image';
import { refStyles } from './Styles';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import AppColors from '../../utils/AppColors';
// import DropDownPicker from 'react-native-dropdown-picker';

const PendingReferrals = ({ navigation }) => {
    const [open, setOpen] = useState(false);
const [giftCards]=useState([{id:0, name: 'Amazon' }, {id:1, name: 'Venmo' }, {id:2, name: 'Chick fill a' },
{id:3, name: 'Cashapp' }, {id:4, name: 'Starbuck' }]);
const [choice, setChoice] = useState(giftCards[0].name);

    const renderItem = ({ item, index }) => {
        return (
            <View style={refStyles.flatOuterView}>
                <FastImage style={refStyles.imgView} />
                <Text style={refStyles.nameText}>{'Rachel Wade'}</Text>
                <TouchableOpacity style={refStyles.flatbtn}>
                    <Text style={refStyles.btnText}>Remind</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const successItem = ({ item, index }) => {
        return (
            <View style={refStyles.flatOuterView}>
                <FastImage style={refStyles.imgView} />
                <Text style={refStyles.nameText}>{'Rachel Wade'}</Text>
                <Image resizeMode='contain' style={refStyles.iconStyles} source={Images.user} />

            </View>
        )
    }

    const renderOption = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => {setOpen(false),setChoice(item.name)}} style={refStyles.flatOuterView}>
                <FastImage style={refStyles.optionimg} />
                <Text style={refStyles.nameText}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1 }} >
            <HeaderView white title='Pending Referrals' onLeftClick={() => { navigation.goBack() }} />
            <ScrollView scrollEnabled={open ? false:true} nestedScrollEnabled={true} style={{ flex: 1 }} contentContainerStyle={refStyles.container}>
                <View style={refStyles.topView}>
                    <Text style={refStyles.refText}>Succesfull Referrals</Text>
                    <Text numberOfLines={2} style={[refStyles.detailText, {marginTop:-hp(1)}]}>your referrals has been success</Text>
                </View>

                <View style={[refStyles.flatView]}>
                    <FlatList
                        data={['', '', '']}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={successItem}
                    />
                </View>
                <View style={refStyles.topView}>
                    <Text style={refStyles.refText}>Pending Referrals</Text>
                    <Text numberOfLines={2} style={[refStyles.detailText, {marginTop:-hp(1)}]}>Remember B School is confined to current MBA students only</Text>
                </View>
                <View style={refStyles.flatView}>
                    <FlatList
                        data={['', '', '']}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                </View>

            </ScrollView>
        </View>
    )

}
export default PendingReferrals;
