import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, TextInput } from 'react-native';
import Styles from './Styles';
import AppColors from '../../utils/AppColors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import { ExpandableListView } from 'react-native-expandable-listview';
import { IMAGE_URL } from '../../webServices/EndPoints';
import Fonts from '../../assets/Fonts';
import { DescriptionView } from './DescriptionDetail';
import Images from '../../assets/Images';
import { SafeAreaView } from 'react-native';
import { AllGroupStyles } from '../chats/Styles';

const SecondStage = (props) => {
    const [textToSearch, setTextToSearch] = useState('');
    const [searchedData, setSearchedData] = useState([]);

    const onSearchTag = (text) => {
        setTextToSearch(text)
        if (text.length > 0) {
            let data = props.status === 'first' ? props.todayContents : props.status === 'second' ? props.weekContents : props.status === 'third' ? props.monthContents : props.totalContents;
            let newData = data.filter(x => String(x.name.toLowerCase()).includes(text.toLowerCase()));
            setSearchedData(newData);
        }
        else {
            setSearchedData([]);
        }
    }

    const onSearchPopular = (text, data) => {
        setTextToSearch(text)
        if (text.length > 0) {
            let newData = data.filter(x => String(x.message.toLowerCase()).includes(text.toLowerCase()));
            setSearchedData(newData);
        }
        else {
            setSearchedData([]);
        }
    }


    return (
        <SafeAreaView>
            <View>
                {props.title === 'Tags' ?
                    <>

                        <View style={AllGroupStyles.searchViewContainer}>
                            <Image resizeMode="contain" source={Images.greenSearch} style={AllGroupStyles.searchIcon} />
                            <TextInput value={textToSearch} onChangeText={(text) => onSearchTag(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={AllGroupStyles.searchTextinput} />
                            {textToSearch ?
                                <TouchableOpacity onPress={() => { setTextToSearch(''); }}>
                                    <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
                                </TouchableOpacity>
                                : null}
                        </View>
                        {textToSearch.length > 0 && searchedData.length === 0 ?
                            <Text style={[Styles.linkText, { alignSelf: 'center' }]}>No data Found</Text>
                            :
                            <View style={[Styles.scene, { backgroundColor: AppColors.WHITE, paddingTop: hp(2) }]}>
                                {props.sharedTag.length > 0 ?
                                    <ExpandableListView
                                        data={props.status === 'first' ? textToSearch.length > 0 ? searchedData : props.todayContents : props.status === 'second' ? textToSearch.length > 0 ? searchedData : props.weekContents : props.status === 'third' ? textToSearch.length > 0 ? searchedData : props.monthContents : textToSearch.length > 0 ? searchedData : props.totalContents}
                                        itemContainerStyle={{ backgroundColor: 'transparent', width: wp(95), alignSelf: 'center' }}
                                        onInnerItemClick={() => { }}
                                    />
                                    : null}
                            </View>
                        }
                    </ >
                    :
                    props.title === 'Popular'
                        ?
                        <>
                            <View style={AllGroupStyles.searchViewContainer}>
                                <Image resizeMode="contain" source={Images.greenSearch} style={AllGroupStyles.searchIcon} />
                                <TextInput value={textToSearch} onChangeText={(text) => onSearchPopular(text, props.popularMessage)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={AllGroupStyles.searchTextinput} />
                                {textToSearch ?
                                    <TouchableOpacity onPress={() => { setTextToSearch(''); }}>
                                        <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
                                    </TouchableOpacity>
                                    : null}
                            </View>
                            {textToSearch.length > 0 && searchedData.length === 0 ?
                                <Text style={[Styles.linkText, { alignSelf: 'center' }]}>No data Found</Text>
                                :
                                <View style={{ paddingBottom: hp(2), height: hp(65), paddingVertical: hp(2.5) }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        style={{ paddingVertical: hp(2.5) }}
                                        data={textToSearch.length > 0 ? searchedData.sort((b,a) => new moment(a.created_at).format('YYYYMMDD') - new moment(b.created_at).format('YYYYMMDD')) : props.popularMessage.sort((b,a) => new moment(a.created_at).format('YYYYMMDD') - new moment(b.created_at).format('YYYYMMDD'))}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => PopularView(item, index, props.channel, props.status, textToSearch.length > 0 ? searchedData : props.popularMessage,)}
                                    />
                                </View>
                            }
                        </ >
                        :
                        props.title === 'Pinned'
                            ?
                            <>
                                <View style={AllGroupStyles.searchViewContainer}>
                                    <Image resizeMode="contain" source={Images.greenSearch} style={AllGroupStyles.searchIcon} />
                                    <TextInput value={textToSearch} onChangeText={(text) => onSearchPopular(text, props.pinnedMessage)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={AllGroupStyles.searchTextinput} />
                                    {textToSearch ?
                                        <TouchableOpacity onPress={() => { setTextToSearch(''); }}>
                                            <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
                                        </TouchableOpacity>
                                        : null}
                                </View>
                                {textToSearch.length > 0 && searchedData.length === 0 ?
                                    <Text style={[Styles.linkText, { alignSelf: 'center' }]}>No data Found</Text>
                                    :
                                    <View style={{ paddingBottom: hp(2), height: hp(65), paddingVertical: hp(2.5) }}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={textToSearch.length > 0 ? searchedData.sort((b,a) => new moment(a.created_at).format('YYYYMMDD') - new moment(b.created_at).format('YYYYMMDD')) : props.pinnedMessage.sort((b,a) => new moment(a.created_at).format('YYYYMMDD') - new moment(b.created_at).format('YYYYMMDD'))}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => PopularView(item, index, props.channel, props.status, textToSearch.length > 0 ? searchedData : props.pinnedMessage)}
                                        />
                                    </View>
                                }
                            </ >
                            :
                            <>

                                <DescriptionView data={props.sharedLink} status={props.status} />
                            </ >
                }
            </View>
        </SafeAreaView>
    );
}


const PopularView = (item, index, channel, status, alldata) => {
    let newdate = item.created_at;
    let olddate = index <= 0 ? '' : alldata[index - 1].created_at;
    let show = moment(newdate).format('DD-MM-YYYY') === moment(olddate).format('DD-MM-YYYY') ? false : true;
    let currentdate = new Date();

    var newDateDiff = moment(moment(item.created_at).format('DD-MM-YYYY'), 'DD-MM-YYYY');
    var todayDiff = moment(moment(currentdate).format('DD-MM-YYYY'), 'DD-MM-YYYY');
    var isToday = moment(newdate).format('DD-MM-YYYY') === moment(currentdate).format('DD-MM-YYYY') ? true : false;
    let diff = todayDiff.diff(newDateDiff, 'days');
    let thisMonth = (moment(newdate).format('YYYY') === moment(item.created_at).format('YYYY')) && (moment(newdate).format('MM') === moment(item.created_at).format('MM')) ? true : false;
    return (
        status === 'first' && isToday ?
            <DetailView show={show} item={item} index={index} />
            :
            (status === 'second') && (diff <= 7) ?
                <DetailView show={show} item={item} index={index} />
                :
                (status === 'third') && thisMonth ?
                    <DetailView show={show} item={item} index={index} />
                    :
                    (status === 'fourth') ?
                        <DetailView show={show} item={item} index={index} />
                        : null
    )
}

const DetailView = (props) => {
    let show = props.show;
    let item = props.item;
    return (
        <>

            {show ? <Text style={[Styles.dateText, { marginBottom: 10 }]}>{moment(item.created_at).format('MMM DD, yyyy')}</Text> : null}
            <View style={[{ justifyContent: null, alignSelf: 'center', marginBottom: hp(2.5), flexDirection: 'row', width: wp(90), height: item.message === '' && item.attachments != '' ? hp(20) : null }]}>
                <View style={{ height: hp(5), width: hp(5), justifyContent: 'center', alignItems: 'center', left: 0, position: 'absolute', borderColor: 'transparent', borderRadius: 50, backgroundColor: AppColors.LIGHTGREEN }}>
                    {item.image === null ?
                        <Text style={{ color: 'white' }}>{item.name.charAt(0).toUpperCase()}</Text> :
                        <Image resizeMode='cover' source={{ uri: IMAGE_URL + item.image }} style={{ height: hp(5), alignSelf: 'center', width: hp(5), borderColor: 'transparent', borderRadius: 50, }} />}
                </View>
                <View width={wp(78)} >
                    <Text
                        style={{ width: '100%', fontSize: hp(2), fontFamily: Fonts.APP_SEMIBOLD_FONT, color: AppColors.LIGHTGREEN, textAlign: `left`, left: wp(13), }}>
                        {item.name}
                        <Text style={{ color: AppColors.LIGHT, fontSize: hp(1.5), fontFamily: Fonts.APP_MEDIUM_FONT, }}>     {moment(item.created_at).format('hh:mm A')}</Text>
                    </Text>
                    {item.message === '' && item.attachments != '' ?
                        <Image source={{ uri: item.attachments }} resizeMode='contain' style={{ height: hp(15), width: wp(50), }} />
                        : <Text style={[Styles.typeText, { marginLeft: wp(13), width: wp(62), }]}>{item.message}</Text>}
                </View>
                <View width={wp(14)} marginTop={5} justifyContent={'flex-end'} flexDirection='row' >
                    {item.reactions.map((res, index) => {
                        let name = '';
                        EMOJIES.map((item) => {
                            if (item.name === res.type) {
                                name = item.emoji
                            }
                        })
                        return (
                            index <= 2 ?
                                <Text style={{ left: -2, fontSize: hp(1.5), }}>{name}</Text> : null
                        )
                    })}
                    <Text style={{ color: AppColors.LIGHT, fontSize: hp(1.6), fontFamily: Fonts.APP_MEDIUM_FONT, }}>{item.reactionCount}</Text>
                </View>
            </View>
        </ >
    )
}

let EMOJIES = [{ name: 'happy', emoji: '😂' }, { name: 'sad', emoji: '😔' }, { name: 'angry', emoji: '😠' }, { name: 'heart', emoji: '❤️' }, { name: 'wow', emoji: '😮' }, { name: 'like', emoji: '👍' }]

export default SecondStage;
