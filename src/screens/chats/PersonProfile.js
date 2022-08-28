import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Linking, TouchableOpacity, Modal, LogBox } from 'react-native';
import Styles from '../classbookDetails/Styles';
import CONSTANTS from '../../utils/Constants';
import Spinner from '../../components/Spinner';
import Actions from '../../webServices/Action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClient } from '../../utils';
import { IMAGE_URL } from '../../webServices/EndPoints';
import SimpleToast from 'react-native-simple-toast';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderView from '../../components/HeaderView';
import AppColors from '../../utils/AppColors';
import Carousel from 'react-native-anchor-carousel';
import GroupView from '../../components/GroupView';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChatContext } from '../../navigation/TabNavigator';
import { StreamChat } from 'stream-chat';
import ImageViewer from 'react-native-image-zoom-viewer';

const PersonProfile = (props) => {
    // const { setChannel } = useContext(ChatContext);
    const [loading, setLoading] = useState(true);
    const [allData, setAllData] = React.useState({});
    const [allGroups, setAllGroups] = useState([]);
    const { channel, setChannel } = useContext(ChatContext);
    const [zoomImage, setZoomImage] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])


    const postImg =
        selectedItem.image === '' ?
            [{ props: { source: Images.postPlaceholder }, url: '' }]
            :
            [{ props: { source: '' }, url: IMAGE_URL + selectedItem.profile_image }];

    // console.log(JSON.stringify(props.message))
    const MidView = (props) => {
        // let names = props.data.length;
        let jobName = ''
        if (props.job) {
            if (props.data != 'Not Found') {
                // console.log(props.data)
                props.data.map((res) => {
                    if (jobName === '') {
                        jobName = res.name;
                    } else {
                        jobName = jobName + ',' + res.name
                    }
                })
            }
            else {
                jobName = 'Not Found'
            }
        }
        // alert(props.interest)
        return (
            <View style={Styles.midViewContainer} >
                <Text style={Styles.midTitleText} >{props.title}</Text>
                {props.interest ?
                    props.data.length > 0 ?
                        <FlatList
                            style={Styles.flatView}
                            data={props.data}
                            numColumns={2}
                            keyExtractonr={(index) => index.toString()}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity style={[Styles.interestView, { width: item.name ? item.name.length >= 10 ? wp(38) : null : null }]} >
                                    <Text numberOfLines={1} style={Styles.interestText} >{item.name}</Text>
                                </TouchableOpacity>
                            }
                        />
                        :
                        <Text style={Styles.midTextData} >{'Not Found'}</Text>
                    :
                    <Text style={Styles.midTextData} >{props.job ? jobName : props.data}</Text>
                }
            </View>
        )
    }

    const getUsersList = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((res) => {
            if (res !== null) {
                Actions.GetUserList(res)
                    .then((response) => {
                        //   alert(props.userId)
                        if (response && response.data && response.data.status && response.data.status === 'success') {
                            let data = response.data.data;
                            let users = data.user.data;
                            //  alert(String(getClient().user.id))
                            users.map((res) => {
                                //    console.log(res.id)
                                if (String(res.id) === String(props.userId)) {
                                    // alert(JSON.stringify(res))
                                    // alert(JSON.stringify(res))
                                    console.log('response ' + JSON.stringify(res))
                                    // console.log("kkk " + JSON.stringify(res))
                                    setAllData(res);
                                    getData(res);
                                    // console.log(res.profile_image)
                                }
                            })
                            setLoading(false);
                        }
                        else {
                            setLoading(false);
                            console.log(response)
                            // SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        if (err && err.response && err.response.status) {
                            if (err.response.status === 401) {
                                refreshToken();
                                setLoading(false);

                            }
                            else if (err.response.status === 403) {
                                setLoading(false);
                                SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                                AsyncStorage.clear();
                                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                            }
                            setLoading(false);
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(err, SimpleToast.SHORT, SimpleToast.CENTER);
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
                        // console.log("refreshed " + JSON.stringify(response))
                        if (response && response.data && response.data.status && response.data.status === 'success') {
                            let data = response.data.data;
                            let token = data.token;
                            AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
                            AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
                            AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
                            if (props.userId === getClient().user.id) {
                                getDetails()
                            }
                            else {
                                getUsersList();
                            }
                            setLoading(false)
                        }
                        else {
                            setLoading(false)
                            console.log(response)
                            SimpleToast.showWithGravity("Response not found", SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
                    .catch((err) => {
                        setLoading(false)
                        console.log(err)
                        SimpleToast.showWithGravity(err, SimpleToast.SHORT, SimpleToast.CENTER);
                    })
            }
            else {
                setLoading(false)
            }
        })
    }

    const getDetails = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                let data = {
                    token: myToken
                }
                Actions.ProfileStatus(data)
                    .then((response) => {
                        // alert("data***** " + JSON.stringify(response.data));
                        if (response && response.data && response.data.status && response.data.status === 'success') {
                            let data = response.data.data;
                            setAllData(data.user);
                            setLoading(false);
                        }
                        else {
                            setLoading(false)
                            console.log(response)
                            SimpleToast.showWithGravity("Response not found", SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
                    .catch((err) => {
                        if (err && err.response && err.response.status) {
                            if (err.response.status === 401) {
                                refreshToken();
                                setLoading(false);

                            }
                            else if (err.response.status === 403) {
                                setLoading(false);
                                SimpleToast.showWithGravity(err, SimpleToast.SHORT, SimpleToast.CENTER);
                                AsyncStorage.clear();
                                props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                            }
                            else {
                                setLoading(false);
                                SimpleToast.showWithGravity(err, SimpleToast.SHORT, SimpleToast.CENTER);
                            }
                        }

                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }
        })
    }

    const connectToMember = (item) => {
        if (item.id) {
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
                    let res = channels.filter(x => x.data.name.includes(PERSON_NAME));
                    channels.map((resp) => {
                        if (resp.data.member_count === 2) {
                            let arr = resp.state.members;
                            const result = Object.keys(arr).map((key) => arr[key]);
                            if ((result[0].user.id === getClient().user.id && result[1].user.name === PERSON_NAME) || (result[1].user.id === getClient().user.id && result[0].user.name === PERSON_NAME)) {
                                filteredData.push(resp)
                            }
                        }
                    })
                    if (res.length > 0) {
                        props.classbook ? props.goBack() : null;
                        setLoading(false)
                        setChannel(res[0]);
                        props.navigation.navigate('ChatMessage')
                    }
                    else if (filteredData.length > 0) {
                        props.classbook ? props.goBack() : null;
                        setLoading(false)
                        setChannel(filteredData[0]);

                        props.navigation.navigate('ChatMessage')
                    }
                    else {
                        const channel = Client.channel('messaging', String(Math.floor(Math.random() * 1000) + 1) + String(item.id), {
                            name: PERSON_NAME,
                            image: item.profile_image,
                            members: [String(item.id), String(data.id)],
                            session: 8,
                        });
                        channel.create().then((response) => {
                            // console.log("##" + JSON.stringify(response));
                            if (response) {
                                props.classbook ? props.goBack() : null;
                                setLoading(false)
                                setChannel(channel);

                                props.navigation.navigate('ChatMessage')
                            }
                        })
                            .catch((err) => {
                                // console.log(err)
                                setLoading(false)
                                SimpleToast.showWithGravity('This user is not registered with this client', SimpleToast.SHORT, SimpleToast.CENTER);

                            })
                    }
                } else {
                    setLoading(false)
                }
            })
        }
    }

    const getData = async (data) => {
        setLoading(true);
        let chatClient = getClient();
        const channels = await chatClient.queryChannels({
            members: { $in: [String(data.id)] },
        });
        var listArray = []
        channels.map((data, index) => {
            if (data.data.member_count > 2) {
                let arr = data.state.members;
                const result = Object.keys(arr).map((key) => arr[key]);
                result.map((res) => {
                    if (res.user.id === getClient().user.id) {
                        listArray.push({ channel: data, name: data.data.name, image: data.data.image, unreadCount: data.state.unreadCount })
                    }
                })
            }
        })
        setAllGroups(listArray);
        setLoading(false);
    }

    useEffect(() => {
        // alert(userId)
        if (props.userId === getClient().user.id) {
            getDetails();
        }
        else {
            // getUsersList();
            getUserDetails();
        }
    }, ([]))


    const getUserDetails = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((res) => {
            if (res !== null) {
                Actions.GetUserDetails(res, props.userId)
                    .then((response) => {
                        if (response && response.data && response.data.status && response.data.status === 'success') {
                            let data = response.data.data;
                            let users = data.user;
                            setAllData(users);
                            getData(users);
                            setLoading(false);
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        if(err && err.response && err.response.status )
                        {
                            if ( err.response.status === 401) {
                                refreshToken();
                                setLoading(false);
    
                            }
                            else if (err.response.status === 403) {
                                setLoading(false);
                                SimpleToast.showWithGravity(err, SimpleToast.SHORT, SimpleToast.CENTER);
                                AsyncStorage.clear();
                                props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                            }
                            else
                            {
                                setLoading(false);
                                SimpleToast.showWithGravity(err, SimpleToast.SHORT, SimpleToast.CENTER);

                            }
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }
        })
    }


    const carouselRef = useRef(null);
    const newgroup = ({ item, index, focused }) => {
        return (
            <GroupView navigation={props.navigation} gotoNext={(item) => { setChannel(item); props.navigation.navigate('ChatMessage') }} getEvent item={item} index={index} />)
    }

    let UserResultsLength = Object.keys(allData).length;
    // console.log('ggg' +JSON.stringify(allData))
    return (
        <View flex={1}>
            <HeaderView white title='Profile' onLeftClick={() => { setZoomImage(false); props.goBack() }} />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, backgroundColor: AppColors.BACKGROUND_COLOR }}>
                {loading ? <Spinner /> : null}
                <View style={Styles.topView}>
                    <TouchableOpacity onPress={() => { setSelectedItem(allData); setZoomImage(true) }}>
                        <Image style={Styles.topImg} source={UserResultsLength > 0 ? allData.profile_image != null ? { uri: IMAGE_URL + allData.profile_image } : null : null} />
                    </TouchableOpacity>

                    {/* <Image style={Styles.topImg} source={UserResultsLength > 0 ? allData.profile_image != null ? { uri: IMAGE_URL + allData.profile_image } : null : null} /> */}
                    <Text style={Styles.personName}>{UserResultsLength > 0 ? allData.first_name + ' ' + allData.last_name : 'Not Found'}</Text>
                    {String(getClient().user.id) === String(allData.id) ?
                        null :
                        <TouchableOpacity onPress={() => { connectToMember(UserResultsLength > 0 ? allData : {}) }} style={Styles.sendMessageView} >
                            <Text style={Styles.btnText} >Send Message</Text>
                        </TouchableOpacity>
                    }
                </View>
                <View style={Styles.topView}>
                    <MidView title='Homestate' data={UserResultsLength > 0 ? allData.home_state : 'Not Found'} />
                    <MidView title='Previous Location' data={UserResultsLength > 0 ? allData.previous_state : 'Not Found'} />
                    <MidView title='School' data={UserResultsLength > 0 ? allData.school_name : 'Not Found'} />
                    <MidView title='Graduation' data={UserResultsLength > 0 ? allData.graduation_year : 'Not Found'} />
                </View>
                {
                    allData.bio != null || allData.help_other != null || allData.fun_fact != null
                        ?
                        <View style={Styles.topView}>
                            {
                                UserResultsLength > 0 && allData.bio != null ?
                                    <MidView title='Bio' data={allData.bio} />
                                    : null
                            }
                            {
                                UserResultsLength > 0 && allData.help_other != null ?
                                    <MidView title='How I can help others' data={allData.help_other} />
                                    : null
                            }
                            {
                                UserResultsLength > 0 && allData.fun_fact != null ?
                                    <MidView title='Fun Facts' data={allData.fun_fact} />
                                    : null
                            }
                        </View>
                        :
                        null
                }
                <View style={Styles.topView}>
                    <MidView job title='Previous Career' data={UserResultsLength > 0 ? allData.previousJobs.length > 0 ? allData.previousJobs : 'Not Found' : 'Not Found'} />
                    <MidView job title='Recruiting for' data={UserResultsLength > 0 ? allData.intended_jobs.length > 0 ? allData.intended_jobs : 'Not Found' : 'Not Found'} />
                </View>
                <View style={Styles.topView}>
                    <MidView interest title='Interest' data={UserResultsLength > 0 ? allData.interests.length > 0 ? allData.interests : [] : []} />
                </View>
                {allGroups.length > 0 ? <View style={Styles.topView}>
                    {/* {hideGroup ? */}
                    <View style={Styles.midLineContainer}>
                        <Text style={Styles.midText1}>Groups</Text>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('BottomTabNavigator', {
                                screen: "Chat", params: {
                                    screen: 'ChatScreen'
                                }
                            })
                        }} >
                            <Text style={Styles.midText2}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: wp(100), }}>
                        <Carousel
                            style={{ width: wp(100), }}
                            data={[...allGroups]}
                            renderItem={newgroup}
                            itemWidth={wp(43)}
                            containerWidth={wp(43)}
                            separatorWidth={0}
                            ref={carouselRef}
                            getItemLayout={() => { }}
                            itemContainerStyle={{ marginLeft: wp(2), }}
                            inActiveScale={0.9}
                            inActiveOpacity={0.9}
                            activeOpacity={1}
                            keyExtractor={(_item, index) => index.toString()}
                        />
                    </View>
                </View>
                    : null}

                {zoomImage ?
                    <Modal
                        animationType="slide"
                        visible={zoomImage}
                        transparent={true}
                        onRequestClose={() => {
                            setSelectedItem({});
                            setZoomImage(false);
                        }}
                        onDismiss={() => {
                            setSelectedItem({});
                            setZoomImage(false);
                        }}>
                        <View style={{
                            height: hp(100),
                            flex: 1,
                            width: wp(100),
                            backgroundColor: AppColors.WHITE,

                        }}>
                            <HeaderView title={selectedItem.first_name + (selectedItem.last_name ? ' ' + selectedItem.last_name : '')} onLeftClick={() => { setSelectedItem({}); setZoomImage(false) }} />
                            <ImageViewer enableSwipeDown={true} onSwipeDown={() => { setSelectedItem({}); setZoomImage(false); }}
                                imageUrls={postImg}
                            />
                        </View>
                    </Modal>
                    : null}
            </ScrollView>
        </View>
    );
}

export default PersonProfile;
