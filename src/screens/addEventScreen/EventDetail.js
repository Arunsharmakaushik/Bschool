import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Text, Keyboard, FlatList, TextInput, View } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Images from '../../assets/Images';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AppColors from '../../utils/AppColors';
import Fonts from '../../assets/Fonts';
import { EVENT_IMAGE_URL, IMAGE_URL } from '../../webServices/EndPoints';
import { Styles, firstRoutStyle, secondRoutStyle } from './Styles';
import Actions from '../../webServices/Action';
import Spinner from '../../components/Spinner';
import SimpleToast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import SecondRoute from './SecondTab';
import { Platform } from 'react-native';

const EventDetail = ({ navigation, route }) => {
    const [index, setIndex] = useState(0);
    const [sentAccepted, setsentAccepted] = useState(0);
    const [selectedTab, setSelctedTab] = useState(1);
    const [loading, setLoading] = useState(false);
    const [eventDetail, setEventDetail] = useState({});
    const { EVENT_ID } = route.params;
    const [AllComments, setAllComments] = useState([])

    useEffect(() => {
        getEventDetails();
        getComments();
    }, ([]))

    const getEventDetails = () => {
        setLoading(true);
        // alert(EVENT_ID)
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((res) => {
            if (res !== null) {
                let token = res;
                Actions.GetEventDetail(token, EVENT_ID)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            let data = response.data.data;
                            console.log("??????hvkfjgvkfjdgvk " + JSON.stringify(data))
                            setEventDetail(data);

                            setLoading(false);
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        console.log('errrrr ' + JSON.stringify(err))
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            refreshToken('eventDetail');
                        }
                        else if (err&&err.response&&err.response.status&& err.response.status === 403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false);
                            // SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }
        })
    }

    const addComment = (text) => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((res) => {
            if (res !== null) {
                let formdata = new FormData();
                formdata.append("event_id", EVENT_ID)
                formdata.append("comment", text)
                let data = {
                    token: res,
                    data: formdata
                }
                Actions.DoEventComment(data)
                    .then((response) => {
                        // console.log("??????hereDOCOMMENTR " + JSON.stringify(response.data))
                        if (response.data.status === 'success') {
                            Keyboard.dismiss();
                            getComments();
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        console.log('err ' + JSON.stringify(err))
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            setLoading(false);
                            refreshToken(text);
                        }
                        else if (err&&err.response&&err.response.status&& err.response.status === 403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }
        })
    }

    const getComments = () => {
        setLoading(true)
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((res) => {
            if (res !== null) {
                Actions.GetEventComments(res, EVENT_ID)
                    .then((response) => {
                        // console.log("??????here " + JSON.stringify(response))
                        if (response&&response.data&&response.data.status&&response.data.status === 'success') {
                            let data = response.data.data;
                            let comments = data.comments.data;
                            setAllComments(comments);
                            setLoading(false);
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            setLoading(false);

                        }
                        else if (err&&err.response&&err.response.status&& err.response.status === 403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }
        })
    }

    const refreshToken = (state) => {
        AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.SELECTED_SCHOOL, CONSTANTS.ACCESS_TOKEN]).then((res) => {
            if (res !== null) {
                let data = {
                    token: res[0][1],
                    oldToken: res[2][1]
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
                            if (state === 'join') {
                                JoinEvent();
                            }
                            else if (state === 'eventDetail') {
                                getEventDetails();
                                getComments();
                            }
                            else {
                                addComment(state);
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err.response.data)
                        // SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                    })
            }
            else
            {
              setLoading(false)
            }
        })
    }

    const sendMessage = (text) => {
        if (text === '') {
            SimpleToast.showWithGravity('Please add Comment to send', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else {
            addComment(text);
        }
    }

    const MainView = () => {
        return (
            < >
                <View style={secondRoutStyle.tabBar}>
                    <TouchableOpacity style={[secondRoutStyle.tabContentView, { borderBottomColor: selectedTab === 1 ? AppColors.APP_THEME : 'transparent', }]}>
                        <Text onPress={() => { setSelctedTab(1) }} style={[secondRoutStyle.tabContent, { color: selectedTab === 1 ? AppColors.APP_THEME : AppColors.INPUT }]}>About Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[secondRoutStyle.tabContentView, { borderBottomColor: selectedTab === 2 ? AppColors.APP_THEME : 'transparent', }]}>
                        <Text onPress={() => { setSelctedTab(2) }} style={[secondRoutStyle.tabContent, { color: selectedTab === 2 ? AppColors.APP_THEME : AppColors.INPUT }]}>Discussion</Text>
                    </TouchableOpacity>
                </View>
                {
                    selectedTab === 1
                        ?
                        <FirstRoute /> :
                        <SecondRoute sendMessage={(text) => { sendMessage(text) }} AllComments={AllComments} />}
            </ >
        )
    }

    const JoinEvent = () => {
        setLoading(true);
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((res) => {
            if (res !== null) {
                let formdata = new FormData();
                formdata.append("event_id", EVENT_ID)
                formdata.append("email_event_status", sentAccepted ? 1 : 0)
                let data = {
                    token: res,
                    data: formdata
                }
                Actions.JoinEvent(data)
                    .then((response) => {
                        console.log("??????cdc " + JSON.stringify(response.data))
                        if (response.data.status === 'success') {
                            setLoading(false);
                            navigation.goBack();
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        console.log('err ' + JSON.stringify(err))
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            setLoading(false);
                            refreshToken('join');
                        }
                        else if (err&&err.response&&err.response.status&& err.response.status === 403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }
        })
    }

    function FirstRoute() {
        return (
            Object.keys(eventDetail).length === 0 ? null :
                <View style={{ height: hp(52) }} >
                    <ScrollView >
                        {eventDetail.description != null || eventDetail.description !== '' ?
                            <>
                                <Text style={firstRoutStyle.descriptionText} >Description</Text>
                                <Text style={firstRoutStyle.descriptionTextStyle} >
                                    {eventDetail.description}
                                </Text>
                            </ >
                            : null
                        }
                        {eventDetail.latitude != null || eventDetail.longitude != null ?
                            <View>
                                <View style={firstRoutStyle.horizontalLines} >
                                </View>
                                <Text style={firstRoutStyle.locationText} >Location</Text>
                              
                                    <View style={firstRoutStyle.mapContainer}>
                                        <MapView
                                            style={{ flex: 1 }}
                                            zoomEnabled={true}
                                            region={{
                                                latitude: parseFloat(eventDetail.latitude !== null ? eventDetail.latitude : 1.33),
                                                longitude: parseFloat(eventDetail.longitude !== null ? eventDetail.longitude : 2.44),
                                                latitudeDelta: 0.1,
                                                longitudeDelta: 0.1
                                            }}
                                        >
                                        </MapView>
                                    </View>
                                   
                                <View style={firstRoutStyle.horizontalLines} ></View>
                            </View> : null}
                        {eventDetail.participants.length > 0 ?
                            <>
                                <Text style={firstRoutStyle.attendingText} >Attending</Text>
                                <View style={{ paddingHorizontal: wp(4), alignItems: 'center', marginTop: hp(1), flexDirection: 'row' }} >
                                    {
                                        eventDetail.participants.map((items, index) => {
                                            if (index < 3) {
                                                return (
                                                    <Image resizeMode='cover' style={{
                                                        borderRadius: wp(20),
                                                        height: hp(3),
                                                        width: hp(3),
                                                        marginLeft: hp(0.2)
                                                    }} source={items.profile_image != null ? { uri: IMAGE_URL + items.profile_image } : Images.user} />
                                                )
                                            }
                                        })
                                    }
                                    {
                                        eventDetail.participants.length > 3 ?
                                            <Text style={firstRoutStyle.rightTextAttending} > +{eventDetail.participants.length - 3} Other Join This Event</Text>
                                            : null
                                    }
                                </View>
                                <View style={[firstRoutStyle.horizontalLines, { marginTop: hp(3) }]} ></View>
                            </ > : null}
                        {/* </View> */}
                    </ScrollView >
                    {eventDetail.is_joined === '1' || eventDetail.is_joined === 1 ? null :
                        eventDetail.event_status === "0" ?
                            <View>
                                <View style={[firstRoutStyle.bottomLineContainer,]}>
                                    <TouchableOpacity style={[{
                                        borderWidth: 1,
                                        height: hp(2.5),
                                        width: hp(2.5),
                                        borderRadius: hp(0.5),
                                        marginRight: hp(1),
                                        justifyContent: 'center',
                                        borderColor: true ? AppColors.APP_THEME : AppColors.BORDER_COLOR
                                    }]} onPress={() => setsentAccepted(!sentAccepted)}>
                                        {sentAccepted ?
                                            <Image resizeMode='contain' style={firstRoutStyle.checkboxStyles} source={Images.checkbox} />
                                            : null}
                                    </TouchableOpacity>
                                    <Text style={firstRoutStyle.bottomLine} > Send Event information to my email</Text>
                                </View>
                                <TouchableOpacity onPress={() => JoinEvent()} style={[firstRoutStyle.bottomButtonContainer]}>
                                    <Text style={firstRoutStyle.bottomButtonText}>
                                        RSVP For Event
                    </Text>
                                </TouchableOpacity>
                            </View>
                            : null
                    }
                </View>
        )
    }

    return (
        <View style={Styles.container}>
            {loading ? <Spinner /> : null}
            <TouchableOpacity onPress={() => navigation.goBack()} style={Styles.backButton}>
                <Image resizeMode='contain' source={Images.white_back} style={Styles.backButtonStyle} />
            </TouchableOpacity>
            <View style={Styles.swiperContainer} >
                <SwiperFlatList
                    paginationStyle={{ marginBottom: hp(2) }}
                    paginationStyleItem={Styles.paginationStyleItems}
                    paginationDefaultColor={'transparent'}
                    paginationActiveColor={'white'}
                    index={0}>
                    <Image resizeMode="cover"
                        style={Styles.swiperImage}
                        source={{ uri: EVENT_IMAGE_URL + eventDetail.image }}></Image>
                </SwiperFlatList>
            </View>
            <View style={Styles.midContainer}>
                <View style={Styles.eventDetailsConatiner} >
                    <Text style={{ fontSize: hp(2.1), color: AppColors.INPUT, fontFamily: Fonts.APP_MEDIUM_FONT }} >{moment(eventDetail.start_date).format('MMM')}</Text>
                    <Text style={Styles.dateTextStyle}> {moment(eventDetail.start_date).format('DD')}</Text>
                </View>
                <View style={Styles.verticalLine} >
                </View>
                <View style={Styles.midTextContainer}>
                    <Text numberOfLines={4} style={Styles.eventNameStyle} >{eventDetail.title}</Text>
                    <Text style={Styles.eventLocationStyle} >{eventDetail.location}</Text>
                </View>
            </View>
            <View style={Styles.horizontalLine} ></View >
            {Platform.OS === 'ios' ?
                <KeyboardAwareScrollView keyboardShouldPersistTaps='always' style={{ height: hp(60) }} contentContainerStyle={{ height: hp(60) }}>
                    <MainView />
                </KeyboardAwareScrollView>
                :
                <View height={hp(60)}>
                    <MainView />
                </View>
            }
        </View>
    )
}

export default EventDetail;
