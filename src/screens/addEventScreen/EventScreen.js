import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderView from '../../components/HeaderView';
import Images from '../../assets/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './Styles';
import AppColors from '../../utils/AppColors';
import Actions from '../../webServices/Action';
import Spinner from '../../components/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import Fonts from '../../assets/Fonts';
import CONSTANTS from '../../utils/Constants';
import LocationModal from '../../components/LocationModal';
import { IMAGE_URL } from '../../webServices/EndPoints';
import moment from 'moment';
import SimpleToast from 'react-native-simple-toast';
import AddPerson from './AddPerson';
import { Platform } from 'react-native';
import { ChatContext } from '../../navigation/TabNavigator';
import DatePicker from 'react-native-date-picker'
import { getClient } from '../../utils';

const EventScreen = ({ navigation, route }) => {
    const currentDate = new Date();
    const [imageUri, setimageUri] = useState({});
    const [isSwitchOn, setisSwitchOn] = useState(false);
    const [eventName, seteventName] = useState('')
    const [discriptionText, setdiscriptionText] = useState('')
    const [open, setOpen] = useState(false);
    const [selectedUniText, setselectedUniText] = useState("")
    const [selectedschoolId, setselectedschoolId] = useState(0)
    const [selectedCategoryText, setselectedCategoryText] = useState("")
    const [selectedCategoryId, setselectedCategoryId] = useState('')
    const [personsToAdd, showPersonsToadd] = useState(false);
    const [selectedLocationText, setselectedLocationText] = useState("")
    const [selectedLinkText, setselectedLinkText] = useState("")
    const [universityArray, setuniversityArray] = useState([]);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [categoryArray, setcategoryArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [selectedIds, setselectedIds] = useState('');
    const [longitude, setLongitude] = useState(0);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedData, setSelectedData] = React.useState([]);
    const [selectedData2, setSelectedData2] = React.useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');
    const [mySchool, setMySchool] = React.useState('');
    const [mode, setMode] = useState('date');
    const { setChannel } = useContext(ChatContext);

    function getTimeStamp(input) {
        var parts = input.trim().split(' ');
        var date = parts[0].split('-');
        var time = (parts[1] ? parts[1] : '00:00:00').split(':');
        // NOTE:: Month: 0 = January - 11 = December.
        var d = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
        return d.getTime() / 1000;
    }

    useEffect(() => {
        if (route.params) {
            route.params.data.map((item) => {
                let data = selectedData;
                data.push(item);
                setSelectedData([...data]);
                console.log(">>>>>" + JSON.stringify(selectedData[0].id))
                let datas = selectedData;
                let selectedIdss = '';
                datas.map((res) => {
                    if (selectedIdss === '') {
                        selectedIdss = res.id;
                    } else {
                        selectedIdss = selectedIdss + ',' + res.id;
                    }
                })
                setselectedIds(selectedIdss)
            })
        }
    }, []);

    const saveData = (data) => {
        setSelectedData([]);
        setSelectedData2([])
        if (data.length > 0) {
            data.map((item) => {
                let data = selectedData;
                data.push(item);
                setSelectedData([...data]);
                setSelectedData2([...data]);
                console.log(">>>>>" + JSON.stringify(selectedData[0].id))
                let datas = selectedData;
                let selectedIdss = '';
                datas.map((res) => {
                    if (selectedIdss === '') {
                        selectedIdss = res.id;
                    } else {
                        selectedIdss = selectedIdss + ',' + res.id;
                    }
                })
                setselectedIds(selectedIdss);
                showPersonsToadd(false);
            })
        } else {
            setselectedIds('')
            showPersonsToadd(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        if (route.params) {
            if (route.params.from === 'chat') {
                setselectedUniText('Private'),
                    setselectedschoolId(1),
                    setselectedCategoryId(0),
                    setselectedCategoryText('n');
                    setOpen(false);
                    let channel = route.params.channel;
                    let arr = [];
                    arr = channel.state.members;
                    const result = Object.keys(arr).map((key) => arr[key]);
                    let newData = [];
                   let mainData =result.filter(x => x.user_id != getClient().user.id)
                   mainData.map((item, index) => {
                            let obj = {}
                            obj.checkId = index;
                            obj.selected = false;
                            obj.id = item.user.id;
                            obj.created_at = item.user.created_at;
                            obj.email = item.user.email;
                            obj.school_name = '';
                            obj.first_name = item.user.name;
                            obj.profile_image = item.user.image
                            newData.push(obj)
                    })
                    setSelectedData([...newData]);
                    let datas = newData;
                    let selectedIdss = '';
                    datas.map((res) => {
                        if (selectedIdss === '') {
                            selectedIdss = res.id;
                        } else {
                            selectedIdss = selectedIdss + ',' + res.id;
                        }
                    })
                    // alert(selectedIdss)
                    setselectedIds(selectedIdss)
            }
        }
        AsyncStorage.getItem(CONSTANTS.SELECTED_SCHOOL).then((school) => {
            if (school !== null) {
                setMySchool(school);
            }
        })
        getMemberListToken();
    }, ([]));

    const checkEventFields = () => {
        var numberOfDays = Math.round((selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24));
        if (Object.keys(imageUri).length == 0) {
            SimpleToast.showWithGravity('Please select image', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (!eventName) {
            SimpleToast.showWithGravity('Please enter event name', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (!isSwitchOn && selectedUniText === '') {
            SimpleToast.showWithGravity('Please Select Type', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (selectedUniText === 'Private' && selectedIds === '') {
            SimpleToast.showWithGravity('Event is private Please select Participants', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (selectedCategoryId === '') {
            SimpleToast.showWithGravity('Please Select Category', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (!selectedStartTime) {
            SimpleToast.showWithGravity('Please select the start date for event', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (!selectedEndTime) {
            SimpleToast.showWithGravity('Please select the end date for event', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (numberOfDays < 0) {
            SimpleToast.showWithGravity('Please check the end date of event', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        // else if (selectedLocationText === "") {
        //     SimpleToast.showWithGravity('Please select Location', SimpleToast.SHORT, SimpleToast.CENTER);
        // }
        // else if (selectedLinkText === '') {
        //     SimpleToast.showWithGravity('Please Add Link', SimpleToast.SHORT, SimpleToast.CENTER);
        // }
        else {
            createEvent();
        }
    }

    const createEvent = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                setLoading(true);
                var date = moment(selectedStartDate).format('YYYY-MM-DD');;
                var time = moment(selectedStartTime).format('hh:mm:ss A');
                var startTimeStamp = moment(date + time, 'YYYY-MM-DDLT');
                var startTimeFormat = startTimeStamp.format('YYYY-MM-DD HH:mm:ss');
                var date2 = moment(selectedEndDate).format('YYYY-MM-DD');;
                var time2 = moment(selectedEndTime).format('hh:mm:ss A');
                var endTimeStamp = moment(date2 + time2, 'YYYY-MM-DDLT');
                var endTimeFormat = endTimeStamp.format('YYYY-MM-DD HH:mm:ss');
                let formdata = new FormData();
                formdata.append("image", Object.keys(imageUri).length > 0 ? imageUri : '')
                formdata.append("name", eventName)
                formdata.append("category_id", selectedCategoryId)
                formdata.append("description", discriptionText)
                formdata.append("location", selectedLocationText)
                formdata.append("latitude", latitude)
                formdata.append("longitude", longitude)
                formdata.append("user_ids", selectedIds != '' ? selectedIds : '')
                formdata.append("link", selectedLinkText)
                formdata.append("utc_start_timestamp", startTimeStamp / 1000)
                formdata.append("utc_end_timestamp", endTimeStamp / 1000)
                formdata.append("start_datetime", String(startTimeFormat))
                formdata.append("end_datetime", String(endTimeFormat))
                formdata.append("event_type", selectedschoolId)
                const maindata = { data: formdata, token: myToken };
                
                Actions.PostEvents(maindata)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            let data = response.data.data;
                            setLoading(false);
                            SimpleToast.showWithGravity('Event Created Succesfully', SimpleToast.SHORT, SimpleToast.CENTER);
                            if (route.params) {
                                if (route.params.from === 'chat') {
                                    setChannel(route.params.channel);
                                    navigation.replace('ChatMessage', { from: 'Events', event_id: data.event_id, data: { name: eventName, detail: discriptionText, startTime: startTimeFormat, endTime: endTimeFormat } });
                                }
                            } else {
                                navigation.goBack();
                            }
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            setLoading(false);
                            refreshToken(true);
                            console.log('error')
                        }
                        else if (err&&err.response&&err.response.status&& err.response.status === 403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            console.log(">>>>????" + JSON.stringify(err.response.data))
                            setLoading(false);
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                })
            }
        })
    }

    const getMemberListToken = () => {
        setLoading(true)
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((token) => {
            getCategoryList(token);
        })
    }
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDate = (date) => {
        if (selectedView === 'start') {
            setSelectedStartDate(date);
            setSelectedStartTime(date);
        }
        else {
            setSelectedEndDate(date);
            setSelectedEndTime(date);
        }
    }

    const getCategoryList = (myToken) => {
        Actions.GetCategory(myToken)
            .then((response) => {
                if (response.data.status === 'success') {
                    console.log("??????" + JSON.stringify(response.data.data))
                    let data = response.data.data;
                    let category = data.category.data;
                    let newData = [];
                    category.map((item, index) => {
                        let obj = item;
                        obj.checkId = index;
                        obj.selected = false;
                        newData.push(obj)
                    })
                    setcategoryArray(newData);
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
                    refreshToken(false);
                    console.log('error')
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

    const refreshToken = (status) => {
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
                            status == true ? createEvent() : getCategoryList(token.access_token);
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

    function addImage() {
        const options = {
            storageOptions: {
                skipBackup: true,
                compressImageMaxWidth: 300,
                compressImageMaxHeight: 300,
                compressImageQuality: 0.8,
                path: 'images'
            },
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
        };
        ImagePicker.openPicker(options)
            .then(response => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    let date = Date.now()
                    console.log("RRR" + JSON.stringify(response))
                    const file = {
                        name: "Image" + date + ".jpg",
                        type: response.mime,
                        uri: Platform.OS === "android" ? response.path : response.path.replace("file://", ""),
                    }
                    setimageUri(file)
                }
            })
    }

    const SelectCategory = () => {
        return (
            <Modal animationType="slide" visible={open2} onRequestClose={() => { setOpen2(false) }} transparent={true}>
                <TouchableOpacity activeOpacity={1.0} onPress={() => setOpen2(false)} style={{ flex: 1, backgroundColor: 'rgba(56,56,56,0.5)' }}>
                    <View style={styles.modalInnerView} >
                        <Text style={styles.modalMainText} >Select Category</Text>
                        <FlatList
                            data={categoryArray}
                            style={{ paddingHorizontal: hp(2) }}
                            keyExtractor={(index) => index.toString()}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => { setselectedCategoryText(item.name), setselectedCategoryId(item.id), setOpen2(false) }} style={{ width: '90%', alignSelf: 'center', margin: 5 }} >
                                    <Text style={styles.modalSelectText} >{item.name}</Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    const SelectLink = () => {
        const [LinkText, setLinkText] = useState("");
        return (
            <Modal
                animationType="slide"
                visible={open4}
                transparent={true}
                onRequestClose={() => {
                    setOpen4(false);
                }}
                onDismiss={() => {
                    setOpen4(false);
                }}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={true} contentContainerStyle={{ height: hp(100), width: wp(100), backgroundColor: 'rgba(56,56,56,0.5)', justifyContent: 'center', alignSelf: 'center' }} enableOnAndroid={true} enableAutomaticScroll scrollEnabled resetScrollToCoords={{ x: 0, y: 0 }} >
                    <TouchableOpacity activeOpacity={1} onPress={() => setOpen4(false)} style={styles.modalOuterView}>
                        <View style={styles.modalView}>
                            <Text style={[styles.uploadText, { padding: 0, marginBottom: hp(6) }]}>Link Details</Text>
                            <TextInput
                                style={styles.linkedinName}
                                value={LinkText}
                                onChangeText={(text) => setLinkText(text)}
                                placeholderTextColor={AppColors.BORDER_COLOR}
                                placeholder="Enter Link"
                            />
                            <TouchableOpacity style={styles.saveView} onPress={() => { setselectedLinkText(LinkText), setOpen4(false) }}>
                                <Text style={[styles.uploadText, { color: AppColors.WHITE, padding: 0, }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </Modal>
        )
    }

    const setSch=()=>{
        // let sch = mySchool;
        // if (sch.includes('(')) {
        //     let arr = sch.split(' ');
        //     arr.map((res) => {
        //         if (res.includes('(')) {
        //             setselectedUniText(res.replace('(', '').replace(')', ''));
        //         }
        //     })
        // }
        // else {
        //    setselectedUniText(user.school_name);
        // }
        setselectedUniText(mySchool);
       setselectedIds(''), 
                        setselectedschoolId(2), setSelectedData([]), setOpen(false)

    }

    const SelectUniversity = () => {
        return (
            <Modal animationType="slide" visible={open} onRequestClose={() => { setOpen(false) }} transparent={true}>
                <TouchableOpacity activeOpacity={1.0} onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(56,56,56,0.5)' }}>
                    <View style={styles.modalInnerView} >
                        <Text style={styles.modalMainText} >Select Type</Text>
                        <TouchableOpacity onPress={() => { setselectedUniText('Public'), setselectedschoolId(0), setselectedIds(''), setSelectedData([]), setOpen(false) }} style={{ width: '90%', alignSelf: 'center', margin: 5 }} >
                            <Text style={styles.modalSelectText} >{'Public'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setselectedUniText('Private'), setselectedschoolId(1), setOpen(false) }} style={{ width: '90%', alignSelf: 'center', margin: 5 }} >
                            <Text style={styles.modalSelectText} >{'Private'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setSch() }} style={{ width: '90%', alignSelf: 'center', margin: 5 }} >
                            <Text style={styles.modalSelectText} >{mySchool}  School</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    return (
        personsToAdd ?
            <AddPerson route={route} data={selectedData2} back={() => showPersonsToadd(false)} invite={(data) => saveData(data)} /> :
            <View flex={1}>
            <HeaderView white onLeftClick={() => navigation.goBack()} title="Events" />
 
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: AppColors.APP_THEME }} contentContainerStyle={styles.mainContainer} >
                {loading ? <Spinner /> : null}
                <TouchableOpacity onPress={() => addImage()} style={styles.imageContainer}  >
                    {imageUri.uri ?
                        <Image resizeMode='cover' style={{ height: '100%', width: '100%' }} source={{ uri: imageUri.uri }} />
                        :
                        <View style={{ alignItems: 'center' }} >
                            <Image resizeMode="contain" style={styles.imageStyle} source={Images.imagePicker} />
                            <Text style={{ fontSize: hp(2), color: AppColors.GREY_TEXT }} >Add Image</Text>
                        </View>
                    }
                </TouchableOpacity>
                <View style={styles.textInputContainer}>
                    <TextInput value={eventName} placeholder="Event Name" onChangeText={(text) => seteventName(text)} style={styles.inputTextView} />
                </View>
               
               {route.params && route.params.from ==='chat' ? null:
            
                   <View style={[styles.midView, { marginTop: hp(1) }]}>
                    <Text style={styles.midViewText} >All Schools</Text>
                    <TouchableOpacity onPress={() => { setselectedUniText(''), setselectedschoolId(0), setisSwitchOn(!isSwitchOn) }} style={styles.switchIconContainer} >
                        <Image resizeMode="contain" style={styles.switchIconStyle} source={!isSwitchOn ? Images.switch_off : Images.switch_on} />
                    </TouchableOpacity>
                </View>
               }

               {isSwitchOn ? null :
                route.params && route.params.from ==='chat' ? null:
               <View style={[styles.midView, {
                   ...Platform.select({
                       ios: {
                           zIndex: 11
                       }
                   }),
               }]}>
                   <Text style={styles.midViewText} >Open To</Text>
                   <TouchableOpacity style={{ flexDirection: "row",alignItems: 'center' ,width:wp(68)}} onPress={() => { if (route.params) { if (route.params.from === 'chat') { } } else { setOpen(true) } }}>
                       {selectedUniText !== "" ?
                           <Text numberOfLines={selectedUniText ==='Public' || selectedUniText ==='Private' ?  null:1}  style={{ fontSize: hp(2.2),width:wp(63),textAlign:'right', marginRight: hp(2), color: AppColors.APP_THEME, fontFamily: Fonts.APP_MEDIUM_FONT }}>
                        {selectedUniText}
                           </Text>
                           :
                           <Text style={{ fontSize: hp(2.2),textAlign:'right',width:wp(63), marginRight: hp(2), color: AppColors.APP_THEME, fontFamily: Fonts.APP_MEDIUM_FONT }}>
                               Select Type
                </Text>
                       }
                       <Image resizeMode="contain" style={{
                           height: hp(2),
                           width: wp(3),
                           right:0,position:'absolute',
                           transform: [open ? { rotate: '180deg' } : { rotate: '0deg' }]
                       }} source={Images.dropdown} />
                   </TouchableOpacity>
               </View>
                
                    }
                  
                        
                    {route.params && route.params.from ==='chat' ? null:
                      <View style={[styles.midView, {
                    ...Platform.select({
                        ios: {
                            zIndex: 10
                        }
                    }),
                }]}>
                    <Text style={styles.midViewText} >Category</Text>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: 'center' }} onPress={() => setOpen2(true)}>
                        {selectedCategoryText !== "" ?
                            <Text style={{ fontSize: hp(2.2), marginRight: hp(2), color: AppColors.APP_THEME, fontFamily: Fonts.APP_MEDIUM_FONT }}>
                                {selectedCategoryText}
                            </Text>
                            :
                            <Text style={{ fontSize: hp(2.2), marginRight: hp(2), color: AppColors.APP_THEME, fontFamily: Fonts.APP_MEDIUM_FONT }}>
                                Select Category
                     </Text>
                        }
                    </TouchableOpacity>
                    <Image resizeMode="contain" style={{
                        height: hp(2),
                        width: wp(3),
                        transform: [open2 ? { rotate: '180deg' } : { rotate: '0deg' }]
                    }} source={Images.dropdown} />
                </View>
                    }
                <View style={styles.timersView}>
                    <TouchableOpacity onPress={() => {
                        setSelectedView('start');
                        setSelectedStartTime(''); 
                        setSelectedStartDate(''); 
                        showDatePicker();
                    }}  >
                        <View flexDirection='row' marginTop={hp(1.5)}>
                            <Image resizeMode="contain" style={styles.listIcon} source={Images.timeLock} />
                            <Text style={styles.timeText}>Start Time and date</Text>
                        </View>
                        <View style={[styles.startView, { width: wp(78), marginLeft: wp(14), justifyContent: 'space-between' }]}>
                            <Text style={[styles.selectedTime, { width: '75%' }]}>{selectedStartDate ? moment(selectedStartDate).format('dddd MMM DD, YYYY') : ''}</Text>
                            <Text style={[styles.selectedTime, { width: '25%', textAlign: 'right', }]}>{selectedStartTime ? moment(selectedStartTime).format('hh:mmA') : ''}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (selectedStartTime === '') { SimpleToast.showWithGravity('Please Select Start Time First', SimpleToast.SHORT, SimpleToast.CENTER) } else {
                            setSelectedView('end');
                            setSelectedEndTime('');
                            setSelectedEndDate('');
                            showDatePicker();

                        }
                    }}  >
                        <View flexDirection='row' marginTop={hp(1.5)}>
                            <Image resizeMode="contain" style={styles.listIcon} source={Images.timeLock} />
                            <Text style={styles.timeText}>End Time and date</Text>
                        </View>
                        <View style={[styles.startView, { width: wp(78), marginLeft: wp(14), justifyContent: 'space-between' }]}>
                            <Text style={[styles.selectedTime, { width: '75%' }]}>{selectedEndDate ? moment(selectedEndDate).format('dddd MMM DD, YYYY') : ''}</Text>
                            <Text style={[styles.selectedTime, { width: '25%', textAlign: 'right', }]}>{selectedEndTime ? moment(selectedEndTime).format('hh:mmA') : ''}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.listViewContainer, {  marginTop :Platform.OS==='ios' ?selectedEndTime!=''?hp(3):hp(2.2)  :hp(2.2),height: discriptionText.length > 35 ? null : hp(5.5) }]}>
                    <Image resizeMode="contain" style={[styles.listIcon, { top: Platform.OS === 'ios' ? hp(0.8) : hp(1.7), alignSelf: 'flex-start' }]} source={Images.entypotext} />
                    <TextInput
                        value={discriptionText}
                        multiline={true}
                        blurOnSubmit={true}
                        numberOfLines={4}
                        scrollEnabled={false}
                        returnKeyType='done'
                        placeholder="Short Decription"
                        
                        onChangeText={(text) => setdiscriptionText(text)}
                        style={{
                            marginLeft: wp(8),
                            fontSize: hp(2.2),
                            width: wp(77),
                            height: '100%',
                            flex:1,
                            textAlignVertical: 'top',
                            fontFamily: Fonts.APP_MEDIUM_FONT
                        }}
                    />
                </View>
                <ListView black title={selectedLocationText !== "" ? selectedLocationText : 'Select Location'} image={Images.location} onPress={() => {setOpen3(true)}} />
                {selectedUniText === 'Private' ?
                    <>
                        {selectedData.length > 0 ?
                            <>
                            {route.params && route.params.from ==='chat'
                            ?
                            <Text style={styles.touchListText, {paddingLeft:wp(5),marginVertical:hp(1.5), fontFamily: Fonts.APP_SEMIBOLD_FONT, fontSize: hp(2.2), color:AppColors.GREEN }} >Participants</Text>
                            :null}
                            <FlatList
                                style={{ width: wp(90), marginHorizontal:route.params && route.params.from ==='chat' ? hp(2): hp(5) }}
                                data={selectedData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                            <Image resizeMode='cover' source={item.profile_image != null ? { uri: IMAGE_URL + item.profile_image } : Images.user} style={{
                                                height: hp(5),
                                                width: hp(5),
                                                borderRadius: 50,
                                                borderColor: 'transparent',
                                                margin: 5,
                                                alignSelf: 'center',
                                                marginRight: wp(5)
                                            }} />
                                            <Text style={{
                                                fontSize: hp(2),
                                                color: AppColors.APP_THEME,
                                                alignSelf: 'center',
                                                fontFamily: Fonts.APP_MEDIUM_FONT
                                            }}>{item.first_name + (item.last_name ? ' ' + item.last_name : '')}</Text>
                                        </View>
                                    )
                                }}
                            /> 
                            </ >
                            : null}
                            {route.params && route.params.from ==='chat' ? null:
                        <ListView title='+Add Participants' image={Images.users} onPress={() => { if (selectedUniText === '') { SimpleToast.showWithGravity('Please Select Type First', SimpleToast.SHORT, SimpleToast.CENTER) } else { setSelectedData([]); showPersonsToadd(true) } }} />}
                    </ > : null}
                <ListView bottom title={selectedLinkText !== "" ? selectedLinkText : 'Add Link'} image={Images.link} onPress={() => setOpen4(true)} />
                <TouchableOpacity onPress={() => { loading ? null : checkEventFields() }} style={styles.bottomButtonContainer}>
                    <Text style={styles.bottomButtonText}>
                        Create Event
                </Text>
                </TouchableOpacity>
               
                {open ? <SelectUniversity /> : null}
                {open2 ? <SelectCategory /> : null}
                {open4 ? <SelectLink /> : null}

                <Modal animationType="slide" visible={isDatePickerVisible} transparent={true}>
                    <TouchableOpacity onPress={() => { hideDatePicker() }} activeOpacity={1.0} style={{ backgroundColor: 'white', height: hp(100), backgroundColor: 'rgba(56,56,56,0.5)' }}>
                        <View style={{ justifyContent: 'center', borderBottomColor: AppColors.GREY_TEXT_COLOR, borderBottomWidth: 1, marginTop: hp(63), width: wp(100), height: hp(7), backgroundColor: AppColors.WHITE }}>
                            <Text onPress={() => {
                                hideDatePicker();
                                if (selectedView === 'start') {
                                    if (selectedStartDate === '') { setSelectedStartDate(currentDate); setSelectedStartTime(currentDate) }
                                } else {
                                    if (selectedEndDate === '') { setSelectedEndDate(currentDate); setSelectedEndTime(currentDate) }
                                }
                            }}
                                style={{ color: AppColors.APP_THEME, fontSize: hp(2.5), fontFamily: Fonts.APP_SEMIBOLD_FONT, alignSelf: 'flex-end', paddingHorizontal: wp(4) }}>Done</Text>
                        </View>
                        <DatePicker
                            style={{ backgroundColor: AppColors.WHITE, width: wp(100), height: hp(30), }}
                            date={selectedView === 'start' ? selectedStartDate === '' ? currentDate : selectedStartDate : selectedEndDate === '' ? selectedStartDate : selectedEndDate}
                            mode='datetime'
                            minimumDate={selectedView === 'start' ? currentDate : selectedStartDate}
                            onDateChange={handleDate}
                        />
                    </TouchableOpacity>
                </Modal>

               {open3? <LocationModal setEvent={(state)=>{alert(state)}}  code onClose={() => {setOpen3(false)}} onSelectLocation={(text, lat, long) => { setselectedLocationText(text), setLatitude(lat), setLongitude(long), setOpen3(false) }} />:null}
            </KeyboardAwareScrollView>
            </View>
    );
}

export default EventScreen;

const ListView = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={[styles.listViewContainer, { marginBottom: props.bottom ? hp(2.2) : hp(0.1),}]}>
            <Image resizeMode="contain" style={styles.listIcon} source={props.image} />
            <View style={styles.touchListTextView} >
                {
                    <Text style={styles.touchListText, { fontFamily: Fonts.APP_MEDIUM_FONT, fontSize: hp(2.2), color: props.black ? AppColors.INPUT : AppColors.GREEN }} >{props.title}</Text>
                }
            </View>
        </TouchableOpacity>
    )
}
