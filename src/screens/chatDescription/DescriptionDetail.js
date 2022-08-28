
import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, TextInput } from 'react-native';
import Styles from './Styles';
import AppColors from '../../utils/AppColors';
import Images from '../../assets/Images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import { AllGroupStyles } from '../chats/Styles';

export const DescriptionView = (props) => {
    const [textToSearch, setTextToSearch] = useState('');
    const [searchedData, setSearchedData] = useState([]);

    const onSearch = (text) => {
        setTextToSearch(text)
        if (text.length > 0) {
            let newData = props.data.filter(x => String(x.link.toLowerCase()).includes(text.toLowerCase()));
            setSearchedData(newData);
            // alert(JSON.stringify(newData))
        }
        else {
            setSearchedData([]);
        }
    }

    return (
        <>
            <View style={AllGroupStyles.searchViewContainer}>
                <Image resizeMode="contain" source={Images.greenSearch} style={AllGroupStyles.searchIcon} />
                <TextInput value={textToSearch} onChangeText={(text) => onSearch(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={AllGroupStyles.searchTextinput} />
                {textToSearch ?
                    <TouchableOpacity onPress={() => { setTextToSearch('') }}>
                        <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
                    </TouchableOpacity>
                : null}
            </View>
            <View style={[Styles.scene,]}>
                <View style={{ paddingBottom: hp(2), height: hp(65), }}>
                   {textToSearch.length>0 && searchedData.length === 0 ? 
                   <Text style={[Styles.linkText,{alignSelf:'center'}]}>No data Found</Text>
            :      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={textToSearch.length > 0 ? searchedData : props.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => CustomPreview(item, index, props.data, props.status)}
                    />
                   }
                </View>
            </View>
        </ >
    )
}


const CustomPreview = (item, index, data, status) => {
    let showDate = index === 0 ? true : item.date !== data[index - 1].date ? true : false;
    let newdate = item.date;
    let currentdate = new Date();
    var newDateDiff = moment(moment(item.date).format('DD-MM-YYYY'), 'DD-MM-YYYY');
    var todayDiff = moment(moment(currentdate).format('DD-MM-YYYY'), 'DD-MM-YYYY');
    var isToday = moment(newdate).format('DD-MM-YYYY') === moment(currentdate).format('DD-MM-YYYY') ? true : false;
    let diff = todayDiff.diff(newDateDiff, 'days');
    let thisMonth = (moment(newdate).format('YYYY') === moment(item.date).format('YYYY')) && (moment(newdate).format('MM') === moment(item.date).format('MM')) ? true : false;

    return (
        status === 'first' && isToday ?
            <DescrptionDetail res={item} showDate={showDate} />
            :
            (status === 'second') && (diff <= 7) ?
                <DescrptionDetail res={item} showDate={showDate} />
                :
                (status === 'third') && thisMonth ?
                    <DescrptionDetail res={item} showDate={showDate} />
                    :
                    (status === 'fourth') ?
                        <DescrptionDetail res={item} showDate={showDate} />
                        :
                        null
    )
}

const DescrptionDetail = (props) => {
    let showDate = props.showDate;
    let item = props.res;
    return (
        <View style={Styles.flatInnerView}>
            {showDate ? <Text style={Styles.dateText}>{item.date}</Text> : null}
            <View style={Styles.detailView}>
                <Image source={{uri:item.image!=null?item.image:'https://static.thenounproject.com/png/60319-200.png'}} resizeMode='contain' style={Styles.previewImage} />
                <View style={Styles.textView}>
                    <Text style={Styles.headingText}>{item.heading}</Text>
                    <Text numberOfLines={1} style={Styles.linkText}>{item.link}</Text>
                </View>
            </View>
        </View>
    )

}