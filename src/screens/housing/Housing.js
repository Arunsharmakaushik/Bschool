import React, { useRef, useState, useContext } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import HeaderView from '../../components/HeaderView';
import AppColors from '../../utils/AppColors';
import Images from '../../assets/Images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Rating } from 'react-native-ratings';
import Fonts from '../../assets/Fonts';
import Styles, { roomStyles, siStyles } from './Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import { useEffect } from 'react';
import Actions from '../../webServices/Action';
import SimpleToast from 'react-native-simple-toast';
import Spinner from '../../components/Spinner';
import { EVENT_IMAGE_URL, IMAGE_URL, ITEM_IMAGE_URL } from '../../webServices/EndPoints';
import FastImage from 'react-native-fast-image'
import { StreamChat } from 'stream-chat';
import { getClient } from '../../utils';
import { ChatContext } from '../../navigation/TabNavigator';
import ReadMore from 'react-native-read-more-text';
import {SHARE_IMAGES_URL} from '../../webServices/EndPoints';

const ItemforSale = (props) => {
    const renderItems = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { props.navigation.navigate('SellingItemDetail', { id: item.id }) }} style={{ height: wp(46), alignItems: 'center', width: wp(32) }} >
                {item.item_images.length > 0 ?
                    <FastImage source={{ uri: ITEM_IMAGE_URL + item.item_images[0].image }} resizeMode={FastImage.resizeMode.cover} style={{ height: wp(32), width: wp(30), borderRadius: wp(1), }} />
                    :
                    <View style={{ height: wp(32), width: wp(30), borderRadius: wp(1), backgroundColor: AppColors.APP_THEME }} />
                }
                <Text style={{ width: wp(30) }} >{item.name}</Text>
                <Text style={{ width: wp(30), color: AppColors.APP_THEME, fontSize: hp(1.5) }} >${item.sell_price}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1, alignItems: "center", backgroundColor: AppColors.WHITE }}>
            <TouchableOpacity onPress={() => props.navigation.navigate('SellItem')} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: AppColors.WHITE, height: hp(10), width: wp(100) }}>
                <Text style={{ fontFamily: Fonts.APP_MEDIUM_FONT, color: AppColors.GREEN, fontSize: hp(2) }} >+ Sell Your Item</Text>
            </TouchableOpacity>
            <View style={{
                alignSelf: 'center',
                width: wp(90),
                borderRadius: hp(5),
                backgroundColor: AppColors.SEARCH_COLOR,
                alignItems: 'center',
                height: hp(7),
                flexDirection: 'row',
                marginBottom: hp(2)
            }}>
                <Image resizeMode="contain" source={Images.search} style={{
                    width: hp(2.7),
                    height: hp(2.7),
                    marginHorizontal: wp(4),
                    alignSelf: 'center'
                }} />
                <TextInput
                    value={props.searchTextInputValue}
                    onChangeText={props.onChangeText}
                    returnKeyType='done'
                    onSubmitEditing={props.onSubmit}
                    placeholder="Search for Topic or group.." style={
                        {
                            width: '80%',
                            alignSelf: 'center',
                            textAlign: 'left',

                        }} />
            </View>
            {
                props.totalItems.length > 0 ?
                    <View style={{ alignItems: 'flex-start', width: wp(96) }}>
                        <FlatList
                            nestedScrollEnabled={true}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                            style={{ marginTop: hp(1), height: hp(58) }}
                            data={props.totalItems}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItems}
                        />
                    </View>
                    : <View style={{ height: hp(40), justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ fontSize: hp(2.1), fontFamily: Fonts.APP_MEDIUM_FONT }} >No Result Found </Text>
                    </View>
            }
        </View>
    )
};


const FindARoomate = (props) => {


    const _renderTruncatedFooter = (handlePress) => {
        return (
            <Text style={[roomStyles.readMore, {}]} onPress={handlePress}>
                Read more
            </Text>
        );
    }

    const _renderRevealedFooter = (handlePress) => {
        return (
            <Text style={roomStyles.readMore} onPress={handlePress}>
                Read less
            </Text>
        );
    }

    const renderNotes = ({ item }) => {
        return (
            <View style={roomStyles.flatOuterView} >
                <View style={roomStyles.topView} >
                    <FastImage
                        style={roomStyles.profileView}
                        source={{ uri: item.profile_image != null ? IMAGE_URL + item.profile_image : '' }}
                    />

                    <View style={{ width: wp(75), paddingHorizontal: hp(2) }} >
                        <Text style={roomStyles.nametext} >{item.first_name + ' ' + item.last_name}</Text>
                        <Text style={roomStyles.noteText}>Notes</Text>
                        {item.note.length < 25 ?
                            <Text style={roomStyles.note}>{item.note.split('\n')}</Text>
                            :
                            <View style={{ width: wp(68) }}>
                                <ReadMore
                                    numberOfLines={1}
                                    renderTruncatedFooter={_renderTruncatedFooter}
                                    renderRevealedFooter={_renderRevealedFooter}>
                                    <Text style={roomStyles.note}>{item.note}</Text>
                                </ReadMore>
                            </View>

                        }
                    </View>
                </View>
                <View style={roomStyles.detailView}>
                    <View style={roomStyles.locationView} >
                        <Text style={roomStyles.locationText} >Location</Text>
                        <Text numberOfLines={2} style={roomStyles.priceText} >{item.location}</Text>
                    </View>
                    <View style={roomStyles.priceView} >
                        <Text style={roomStyles.locationText} >Monthly Price Range</Text>
                        <Text numberOfLines={2} style={roomStyles.priceText} >${item.min_price}-${item.max_price}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
                    <TouchableOpacity onPress={() => { props.connectToMember(item) }} style={roomStyles.msgView} >
                        <Image resizeMode="contain" source={Images.comment} style={roomStyles.commentImg} />
                        <Text style={roomStyles.msgText} >Message</Text>
                    </TouchableOpacity>
                    </View>
                   
                </View>

            </View>
        )
    }

    return (
        <View style={{ flex: 1, alignItems: "center", backgroundColor: AppColors.WHITE }} >
            <TouchableOpacity onPress={props.onRequestClick} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: AppColors.WHITE, height: hp(10), width: wp(100) }}>
                <Text style={roomStyles.createReq} >+ Create Request</Text>
            </TouchableOpacity>
            <FlatList
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{ height: hp(67) }}
                data={props.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderNotes}
            />

        </View>
    )
};

export default function Housing({ navigation, props }) {
    const [count, setcount] = useState(0);
    const [mySchool, setMySchool] = React.useState('');
    const [searchSaleItemText, setSearchSaleItemText] = useState('');
    const { setChannel } = useContext(ChatContext);
    const [tabArray, settabArray] = useState([{ title: 'Items for Sale' }, { title: 'Find a Roommate' }])
    const [totalItems, setTotalItems] = React.useState([]);
    const [loading, setLoading] = useState(false);
    const [housingLogo,setHousingLogo] = useState('');
    const [roomateData, setRoomateData] = React.useState([]);

    useEffect(() => {
        AsyncStorage.multiGet([CONSTANTS.SELECTED_SCHOOL,CONSTANTS.HOUSING_LOGO]).then((response) => {
            if (response !== null) {
                setMySchool(response[0][1]);
                setHousingLogo(response[1][1].replace(' ',''));
// console.log('jhh '+SHARE_IMAGES_URL+response[1][1]);
            }
        })
        setLoading(true);
        getTotalSellingItem();
        getRoomateData();
    }, ([]));

    const getRoomateData = () => {

        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                Actions.GetRoommateData(myToken)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            setLoading(false);
                            let data = response.data.data;
                            let alldata = data.roommates ? data.roommates.data : [];
                            setRoomateData([...alldata]);
                            console.log('res ' + JSON.stringify(alldata))
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        //    alert(err)
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                           loading?null: refreshToken('', '');
                        }
                        else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false);
                            console.log("err " + JSON.stringify(err))
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }
        })
    }

    const getTotalSellingItem = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                Actions.GetSellingItemList(myToken)
                    .then((response) => {
                        // console.log('jhcvjdh '+JSON.stringify(response))
                        if (response.data.status === 'success') {
                            setLoading(false);
                            let data = response.data.data;
                            let alldata = data.items ? data.items.data : [];
                            setTotalItems([...alldata]);
                            console.log('res ' + JSON.stringify(alldata))
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            refreshToken('selling', '');
                        }
                        else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false);
                            console.log("err " + JSON.stringify(err))
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }
        })
    }

    const refreshToken = (status, value) => {
        // alert(status)
        AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.ACCESS_TOKEN]).then((res) => {
            if (res !== null) {
                let data = {
                    token: res[0][1],
                    oldToken: res[1][1]
                }
                Actions.Refresh_Token(data)
                    .then((response) => {
                        console.log("refreshed " + JSON.stringify(response))
                        if (response.data.status === 'success') {
                            let data = response.data.data;
                            let token = data.token;
                            AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
                            AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
                            AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
                            if (status === 'selling') {
                                getTotalSellingItem();
                                getRoomateData();
                            }
                            else if (status === 'search') {
                                getSerachList(value);
                            }
                            else {
                                getRoomateData();
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err.response.data)
                        SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                    })
            }
            else
            {
              setLoading(false)
            }
        })
    }
    const getSerachList = (searchValue) => {
        if (searchValue.length > 0) {
            AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
                if (myToken !== null) {
                    setLoading(true);
                    Actions.GetSearchItemList(myToken, searchValue)
                        .then((response) => {
                            if (response.data.status === 'success') {
                                setLoading(false);
                                let data = response.data.data;
                                if (data.length != 0) {

                                    let alldata = data.items.data;
                                    setTotalItems([...alldata]);
                                    console.log("res " + JSON.stringify(alldata))
                                }
                                else {
                                    setTotalItems([]);

                                }

                            }
                            else {
                                setLoading(false);
                                SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                            }
                        })
                        .catch((err) => {
                            if (err&&err.response&&err.response.status&& err.response.status === 401) {
                                refreshToken('search', searchValue);
                            } 
                            else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                                setLoading(false);
                                SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                                AsyncStorage.clear();
                                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                            }
                            else {
                                setLoading(false);
                                console.log("err " + JSON.stringify(err))
                                SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                            }
                        })
                }
            })
        }
    }

    const setListafterOnchange = (text) => {
        if (text === '') {
            getTotalSellingItem();

        }
    }

    function changeData() {

        if (count == 0)
            return (
                <ItemforSale searchTextInputValue={searchSaleItemText} onSubmit={() => getSerachList(searchSaleItemText)} onChangeText={(text) => { setSearchSaleItemText(text), setListafterOnchange(text) }} totalItems={[...totalItems]} navigation={navigation} />
            )
        if (count == 1)
            return (
                <FindARoomate connectToMember={(item) => { connectToMember(item) }} data={roomateData} onRequestClick={() => { navigation.push('CreateRequest') }} />
            )
    }

    const connectToMember = (item) => {
        const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
        let PERSON_NAME = item.first_name + (item.last_name ? ' ' + item.last_name : '')
        setLoading(true);
        AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then(async (response) => {
            if (response !== null) {
                let data = JSON.parse(response[1][1]);
                const userTokken = response[0][1];
                const user = {
                    id: String(data.id),
                    name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
                };
                await chatClient.connectUser(user, userTokken)

                let Client = getClient();
                const channels = await Client.queryChannels({
                    members: { $in: [String(Client.user.id)] },
                });
                let filteredData = [];
                let res = channels.filter(x => x.data.name.includes(PERSON_NAME))
                channels.map((res) => {

                    if (res.data.member_count === 2) {
                        let arr = res.state.members;
                        const result = Object.keys(arr).map((key) => arr[key]);

                        if ((result[0].user.id === getClient().user.id && result[1].user.name === PERSON_NAME) || (result[1].user.id === getClient().user.id && result[0].user.name === PERSON_NAME)) {
                            filteredData.push(res)
                        }
                    }
                })

                if (res.length > 0) {
                    setLoading(false)
                    setChannel(res[0]);
                    navigation.navigate('ChatMessage')
                }

                else if (filteredData.length > 0) {
                    // alert(JSON.stringify(filteredData))
                    setLoading(false)
                    setChannel(filteredData[0]);
                    navigation.navigate('ChatMessage')
                }
                else {

                    const channel = chatClient.channel('messaging', String(Math.floor(Math.random() * 1000) + 1) + String(item.user_id), {
                        name: PERSON_NAME,
                        image: item.profile_image,
                        members: [String(item.user_id), String(data.id)],
                        session: 8,
                    });
                    channel.create().then((response) => {
                        console.log("##" + JSON.stringify(response));
                        if (response) {
                            setLoading(false)
                            setChannel(channel);
                            navigation.navigate('ChatMessage')
                        }
                    })
                        .catch((err) => {
                            setLoading(false)
                            SimpleToast.showWithGravity('This user is not registered with this client', SimpleToast.SHORT, SimpleToast.CENTER);

                        })
                }
            } else {
                setLoading(false)
            }
        })
    }


    return (
        <View flex={1}>
            <HeaderView black onLeftClick={() => navigation.goBack()} title={CONSTANTS.MYSCHOOL + " School"} />


            <KeyboardAwareScrollView scrollEnabled={count === 1 ? true : false} nestedScrollEnabled={true} style={{ flex: 1 }}>
                {loading ? <Spinner /> : null}
                <View style={Styles.imageContainer} >
                   {housingLogo ===''?null: <Image resizeMode="contain" style={Styles.imageStyle} source={{uri:SHARE_IMAGES_URL+housingLogo}} />
 }
  {/* <Text style={Styles.schoolText}>{CONSTANTS.MYSCHOOL.charAt(0).toUpperCase()}</Text> */}
                </View>
                <View style={Styles.scrollViewContainer} >
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={Styles.scrollViewStyle}  >
                        {
                            tabArray.map((data, index) => {
                                return (
                                    <TouchableOpacity onPress={() => setcount(index)} style={Styles.scrollButtonContainer} >
                                        <Text style={{ fontSize: hp(2.1), opacity: count == index ? 1 : 0.2, color: count == index ? AppColors.APP_THEME : AppColors.BLACK, fontFamily: Fonts.APP_SEMIBOLD_FONT }} >{data.title}</Text>
                                        {count == index ? <View style={Styles.componentContainer} ></View> : null}
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                {
                    changeData()
                }
            </KeyboardAwareScrollView>
        </View>
    );

}