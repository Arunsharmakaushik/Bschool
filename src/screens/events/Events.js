import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import Images from '../../assets/Images';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';
import styles from './Styles';
import { Calendar } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import Fonts from '../../assets/Fonts';
import moment from 'moment';
import Actions from '../../webServices/Action';
import Spinner from '../../components/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import SimpleToast from 'react-native-simple-toast';
import { EVENT_IMAGE_URL, IMAGE_URL } from '../../webServices/EndPoints';
import { BallIndicator } from 'react-native-indicators';

const Events = ({ navigation, noLoad, route }) => {
    const [selectedDay, setSelectedDay] = useState({});
    const [selectedDayss, setSelectedDayss] = useState({});
    const [open, setOpen] = useState(false);
    const currentDate = new Date();
    const [selectedUniText, setselectedUniText] = useState("");
    const [selectedUniId, setSelectedUniId] = useState('');
    const [loading, setLoading] = useState(true);
    const [universityArray, setuniversityArray] = useState([]);
    const [eventArray, seteventArray] = useState([]);
    const [eventdata, setEventData] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [onEndReached, setOnEndReached] = useState(false);

    const loadData = () => {
        setIsLoading(true);
        setPage(page + 1);
        getSchoolList(page + 1);
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            noLoad ? setLoading(false) : null;
            getSchoolList(1);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        AsyncStorage.setItem(CONSTANTS.FIXED_ROUTE_NAME, 'Events');
        noLoad ? setLoading(false) : null;
        getSchoolList(1);
    }, ([]));

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            noLoad ? setLoading(false) : null;
            AsyncStorage.setItem(CONSTANTS.FIXED_ROUTE_NAME, 'Events');
        })
        return unsubscribe;
    }, [navigation]);

    const getEventlist = (schoolId, selectedDatee, state) => {
        //  alert(state)
        // seteventArray([]);
        // setSelectedDayss({});
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                noLoad ? setLoading(false) : setLoading(true);
                let formdata = new FormData();
                formdata.append("school_id", schoolId === '' ? '' : schoolId);
                formdata.append("date", selectedDatee);
                const maindata = { data: formdata, token: myToken };
                Actions.GetSchoolEventList(maindata)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            let data = response.data.data;
                            let eventdatas = data.event_dates;
                            setEventData([...eventdatas]);
                            let users = data.events.data;
                            console.log('Event Datess' + schoolId + ' ' + JSON.stringify(data.event_dates))
                            seteventArray(users);
                            if (state) {
                                let nm = String(moment(currentDate).format('YYYY-MM-DD'));
                                let date = { nm: { selected: true, marked: true, selectedColor: AppColors.APP_THEME } }
                                date = renameKey(date, 'nm', nm);
                                setSelectedDay(date);
                                let b = { ...date };
                                if (eventdatas.length > 0) {
                                    eventdatas.map((res) => {
                                        let nm = res.start_date;
                                        let date2 = {}
                                        if (nm === moment(currentDate).format('YYYY-MM-DD')) {
                                            date2 = { nm: { selected: true, marked: true, dotColor: AppColors.APP_THEME, selectedColor: AppColors.APP_THEME } }
                                        }
                                        else {
                                            date2 = { nm: { marked: true, dotColor: AppColors.APP_THEME, activeOpacity: 0 } }
                                        }
                                        date2 = renameKey(date2, 'nm', nm);
                                        b = { ...b, ...date2 }
                                    })
                                    setSelectedDayss({ ...b });
                                }
                                else {
                                    setSelectedDayss(b);
                                }
                            }
                            setLoading(false);
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        console.log("error" + JSON.stringify(err));
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            refreshToken();
                            setLoading(false);
                        } 
                        else if (err&&err.response&&err.response.status&& err.response.status ===403) {
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

    const refreshToken = () => {
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
                            getSchoolList(1);
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

    const getSchoolList = (pageNum) => {
        Actions.GetSchoolNames(pageNum).then((response) => {
            noLoad ? setLoading(false) : setLoading(true);
            if (response.data) {
                let data = response.data.data;
                if (universityArray.length > 0) {
                    // alert(universityArray.length+' hh '+response.data.total)
                    if (universityArray.length <= response.data.total) {
                        // let previousData = ;
                        let arrr = universityArray;
                        let arr = [];

                        let item = {};
                        data.map((value) => {
                            item = { id: value.id, universityName: value.name }
                            arr.push(item)
                        })
                        let mainArr = arrr.concat(arr);
                        setuniversityArray([...mainArr]);
                        setIsLoading(false);
                        setLoading(false);
                    } setIsLoading(false);
                    setLoading(false);
                }
                else {
                    let arr = [];
                    let item2 = { id: '', universityName: 'All Events', }
                    arr.push(item2)
                    let item = {};
                    data.map((value) => {
                        item = { id: value.id, universityName: value.name }
                        arr.push(item)
                    })
                    setuniversityArray([...arr]);
                    getEventlist('', moment(currentDate).format('YYYY-MM-DD'), true);
                    setLoading(false);
                }
            }
        })
            .catch((err) => {
                if (err&&err.response&&err.response.status&& err.response.status === 401) {
                    refreshToken();
                }
                else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                    setLoading(false);
                    SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                    AsyncStorage.clear();
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                }
                else{
                setLoading(false);
                alert(err.message)
                }
            })
    }

    const renameKey = (object, key, newKey) => {
        const clone = (obj) => Object.assign({}, obj);
        const clonedObj = clone(object);
        const targetKey = clonedObj[key];
        delete clonedObj[key];
        clonedObj[newKey] = targetKey;
        return clonedObj;
    };

    function selectedDate(day) {
        setSelectedDayss({});
        // alert(JSON.stringify(selectedDayss))
        seteventArray([]);
        let nm = String(day.dateString);
        let date = {
            nm: { selected: true, marked: true, dotColor: AppColors.APP_THEME, selectedColor: AppColors.APP_THEME }
        }
        date = renameKey(date, 'nm', nm);
        setSelectedDay(date);
        let b = { ...date };
        if (eventdata.length > 0) {
            eventdata.map((res) => {
                let nm2 = res.start_date;
                let date2 = {};
                if (nm2 === nm) {
                    date2 = { nm2: { selected: true, marked: true, dotColor: AppColors.APP_THEME, selectedColor: AppColors.APP_THEME } }
                }
                else {
                    date2 = { nm2: { marked: true, dotColor: AppColors.APP_THEME, activeOpacity: 0 } }
                }
                date2 = renameKey(date2, 'nm2', nm2);
                b = { ...b, ...date2 }
            })
            console.log("???>>>>222" + JSON.stringify(b));
            setSelectedDayss(b);
        }
        else {
            setSelectedDayss(b);
        }

        getEventlist(selectedUniId, Object.keys(date)[0], false);
    }

    const renderEventsList = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.push('EventDetail',
                    {
                        EVENT_ID: item.id,
                    })
            }}
                style={styles.eventViewContainer} >
                <View style={styles.dateLineView} >
                    <Text style={{ fontSize: hp(2), color: '#6B7F89', fontFamily: Fonts.APP_SEMIBOLD_FONT }} >{moment(item.start_date).format('MMM')}</Text>
                    <View style={styles.dateInCircleView} >
                        <Text style={{ color: AppColors.WHITE }} >{moment(item.start_date).format('D')}</Text>
                    </View>
                    <View style={styles.verticalLineView} ></View>
                </View>
                <View style={styles.eventImageContainer} >
                    <Image resizeMode='cover' style={[styles.eventImage]} source={item.image != null ? { uri: EVENT_IMAGE_URL + item.image } : Images.users} />
                </View>
                <View style={styles.eventDetailView} >
                    <Text numberOfLines={2} style={styles.eventNameText}  >
                        {item.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.eventLocationText}>{item.location}</Text>
                    <Text style={[styles.eventDateText]} >{moment(item.start_date).format('MMM Do')} - {moment(item.end_date).format('Do YYYY')}</Text>
                    <View style={{ flexDirection: 'row' }} >
                        {
                            item.participants.map((items, index) => {
                                if (index < 3) {
                                    return (
                                        <Image resizeMode='cover' style={styles.tinyImageInList} source={items.profile_image != null ? { uri: IMAGE_URL + items.profile_image } : Images.user} />
                                    )
                                }
                            })
                        }
                        {
                            item.participants.length > 3 ?
                                <View style={styles.tinyCircleViewInList} >
                                    <Text style={{ color: AppColors.WHITE, fontSize: hp(1.3) }} >+{item.participants.length - 3}</Text>
                                </View>
                                : null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderFooter = () => {
        return (
            //Footer View with Load More button
            <View style={styles.footer}>
                {isLoading ?
                    <BallIndicator style={{ alignSelf: 'center' }} size={20} color={AppColors.APP_THEME} />
                    : null}
            </View>
        );
    };

    const setTheSchool = (item) => {
        setOpen(false);
        //  setselectedUniText(item.universityName), 
        let sch = item.universityName;
        if (sch.includes('(')) {
            let arr = sch.split(' ');
            arr.map((res) => {
                if (res.includes('(')) {
                    setselectedUniText(res.replace('(', '').replace(')', ''));
                }
            })
        }
        else {
            setselectedUniText(item.universityName);
        }
        setSelectedDayss({}),
            setSelectedUniId(item.id),
            getEventlist(item.id, Object.keys(selectedDay)[0], true);
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} style={styles.mainScrollContainer} >
            {loading ? <Spinner /> : null}
            <View style={styles.headerContainer}>
                {/* <View style={styles.headerInnerContainer} >
                    <View style={{ flexGrow: 1 }}>
                        <Text style={styles.headerText} >{route.params ? route.params.name : 'Event'}</Text>
                        <Text style={styles.headerDateText} >{moment(currentDate).format('YYYY-MM-DD')}</Text>
                    </View>
                    <TouchableOpacity style={styles.headerButtonContainer} onPress={() => {
                        if (route.params) {
                            navigation.replace('EventScreen', { from: 'chat', data: [], channel: route.params.channel })
                        } else { navigation.push('EventScreen') }
                    }} >
                        <Text style={styles.headerButtonText} >Add Event</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={styles.headerInnerContainer} >
                    <View style={{ width: '65%', paddingRight: 10 }}>
                        <Text numberOfLines={2} style={[styles.headerText]} >{route.params ? route.params.name : 'Event'}</Text>
                        <Text style={[styles.headerDateText]} >{moment(currentDate).format('YYYY-MM-DD')}</Text>
                    </View>
                    <TouchableOpacity style={styles.headerButtonContainer} onPress={() => {
                        if (route.params) {
                            navigation.replace('EventScreen', { from: 'chat', data: [], channel: route.params.channel })
                        } else { navigation.push('EventScreen') }
                    }} >
                        <Text style={[styles.headerButtonText]} >Add Event</Text>
                    </TouchableOpacity>
                </View>

                {route.params ? null : <TouchableOpacity style={styles.headerDropDown} onPress={() => setOpen(true)} >
                    {selectedUniText ?
                        <Text numberOfLines={1} style={styles.headerDropDownText} >{selectedUniText}</Text>
                        :
                        <Text numberOfLines={1} style={styles.headerDropDownText} >All Events</Text>
                    }
                    <Image resizeMode="contain" style={{ height: hp(2.6), width: hp(2.6), marginHorizontal: 5, transform: [open ? { rotate: '180deg' } : { rotate: '0deg' }] }} source={Images.whiteArrowDown} />
                </TouchableOpacity>
                }
            </View>
            <View style={styles.calendarContainer}>
                <Calendar
                    // current={moment(currentDate).format('YYYY-MM-DD')}
                    onDayPress={(day) => { setSelectedDayss({}); selectedDate(day) }}
                    monthFormat={'MMM yyyy'}
                    renderArrow={(direction) => (
                        <View style={styles.calenderView}>
                            <Image resizeMode="contain"
                                style={styles.calenderImg}
                                source={direction === 'left' ? Images.greyLeftForward : Images.greyRightForward} />
                        </View>
                    )}
                    markedDates={{ ...selectedDayss }}
                    firstDay={1}
                />
            </View>
            <View style={[styles.eventListContainer, { backgroundColor: eventArray.length > 0 ? AppColors.WHITE : 'transparent' }]}>
                {
                    eventArray.length > 0 ?
                        <>
                            <View style={styles.horizontalViewList} ></View>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                data={[...eventArray]}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderEventsList}
                            />
                        </ >
                        :
                        loading ? null :
                            <Text style={styles.noData} >No Events Found</Text>
                }
            </View>
            <Modal animationType="slide" visible={open} onRequestClose={() => { setOpen(false) }} transparent={true}>
                <TouchableOpacity activeOpacity={1.0} onPress={() => { setOpen(false) }} style={{ flex: 1, backgroundColor: AppColors.TRANSPARENT_COLOR }}>
                    <View style={styles.modalInnerView} >
                        <Text style={styles.modalMainText} >Select University</Text>
                        <FlatList
                            data={[...universityArray]}
                            style={{ paddingHorizontal: hp(2) }}
                            keyExtractonr={(index) => index.toString()}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => { setTheSchool(item) }} style={{ width: '90%', alignSelf: 'center', margin: 5, borderBottomWidth: 1, borderBottomColor: item.universityName === 'All Events' ? AppColors.BORDER_COLOR : 'transparent' }} >
                                    <Text style={[styles.modalSelectText,]} >{item.universityName}</Text>
                                </TouchableOpacity>}
                            ListFooterComponent={renderFooter}
                            initialNumToRender={15}
                            keyExtractor={(item, index) => index.toString()}
                            maxToRenderPerBatch={2}
                            onEndReachedThreshold={0.1}
                            onMomentumScrollBegin={() => { setOnEndReached(false) }}
                            onEndReached={() => {
                                if (!onEndReached) {
                                    setOpen(true)
                                    loadData();   // on end reached
                                    setOnEndReached(true)
                                }
                            }
                            }
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
}

export default Events;
