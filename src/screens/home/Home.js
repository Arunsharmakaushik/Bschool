import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, Image, ImageBackground, FlatList, RefreshControl, TouchableOpacity, Modal, Keyboard, ScrollView, TextInput, StatusBar, BackHandler, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Images from '../../assets/Images';
import Styles from './Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppColors from '../../utils/AppColors';
import Actions from '../../webServices/Action';
import CONSTANTS from '../../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleToast from 'react-native-simple-toast';
import Spinner from '../../components/Spinner';
import { IMAGE_URL, POST_IMAGE_URL, SCHOOL_URL } from '../../webServices/EndPoints'
import { timeSince, setClient, getClient } from '../../utils';
import CommentsView from './CommentsView';
import GroupView from '../../components/GroupView';
import ReplyView from '../../components/ReplyView';
import CommentSection from '../../components/CommentSection';
import Carousel from 'react-native-anchor-carousel';
import HeaderView from '../../components/HeaderView';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StreamChat } from 'stream-chat';
import Rox from 'rox-react-native';
import { ChatContext } from '../../navigation/TabNavigator';
import FastImage from 'react-native-fast-image';
import Fonts from '../../assets/Fonts';
import branch from 'react-native-branch' // <- import branch 
import { isInternetConnected } from '../../utils/CheckNetStatus';
import { useFocusEffect } from '@react-navigation/core';

const Home = ({ navigation, noLoad }) => {
    const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
    const scrollRef = useRef();
    const viewRef = useRef();
    const [newMessageImages, setnewMessageImages] = useState([])
    const [GroupImage, setGroupImage] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [replyMessage, setreplyMessage] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [loading, setLoading] = useState(true);
    const [allData, setAllData] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [calculatedHeight, setHeight] = useState({});
    const [textToSearch, setTextToSearch] = useState('');
    const [searchedPost, setSearchedPost] = useState([]);
    const [accessToken, setAccessToken] = useState('');
    const [zoomImage, setZoomImage] = useState(false);
    const [hideGroup, sethideGroups] = useState(false);
    const [thread, setThread] = useState()
    const [id, setid] = useState('');
    const [name, setname] = useState('');
    const [userToken, setuserToken] = useState('');
    const [allDataUsers, setAllDataUsers] = useState({});
    const [canRefresh, setCanRefresh] = useState(false);
    const { channel, setChannel } = useContext(ChatContext);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const configurationFetchedHandler = fetcherResults => {
        // console.log("cccccc " + fetcherResults.hasChanges)
        sethideGroups(fetcherResults.hasChanges)
    };

    useEffect(() => {
        AsyncStorage.setItem(CONSTANTS.FIXED_ROUTE_NAME, 'Home');
        settheRox();
    }, ([]))

    const settheRox = async () => {
        const flags = {
            // distinctId: 'letsTest',
            // version: '1.0',
            configurationFetchedHandler: configurationFetchedHandler
        };
        await Rox.setup(CONSTANTS.ROX_KEY, flags);
    }
    useFocusEffect(
        React.useCallback(() => {
          isInternetConnected().then(isConnected => {
            if (!isConnected) {
              alert('Your Internet is off')
              setTimeout(() => {
                BackHandler.exitApp();
              }, 3000);
            }
          })
        }, [])
      );
    useEffect(() => {
        noLoad ? setLoading(false) : null;
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                setAccessToken(myToken);
                getUserPosts(myToken);
                getDetails(myToken);
                // setTheUser();
            }
        })
    }, []);

    const getList = (myToken) => {
        Actions.GetUserList(myToken)
            .then((response) => {
                if (response&&response.data&&response.data.status&&response.data.status === 'success') {
                    let data = response.data.data;
                    let users = data.user.data;
                    let newData = [];
                    users.map((item, index) => {
                        let obj = item;
                        obj.checkId = index;
                        obj.selected = false;
                        newData.push(obj)
                    })
                    setNewMesaagesUser(users);
                    // console.log(">>>>>>>>???Public" + JSON.stringify(users))
                    setLoading(false);
                    setCanRefresh(false);
                }
                else {
                    setLoading(false);
                    setCanRefresh(false);
                    SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                }
            })
            .catch((err) => {
                if (err&&err.response&&err.response.status&& err.response.status === 401) {
                    refreshToken('', {});
                } 
                else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                    setLoading(false);
                    SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                    AsyncStorage.clear();
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                }
                else {
                    setLoading(false);
                    // alert('hh'+JSON.stringify(err))
                    // SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                }
            })
    }

    const setNewMesaagesUser = (allUsers) => {
        noLoad ? setLoading(false) : setLoading(true);
        const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
        AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then(async (response) => {
            // console.log(JSON.stringify(response))
            if (response !== null) {
                let data = JSON.parse(response[1][1]);
                const userTokken = response[0][1];
                const user = {
                    id: String(data.id),
                    name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
                };
                chatClient.setUser(user, userTokken);
                setClient(chatClient);
                let eee = await chatClient.queryChannels({
                    type: 'messaging',
                    members: { $in: [String(data.id)] },
                    // invite: 'pending'
                })

                const channels = await chatClient.queryChannels({
                    members: { $in: [String(data.id)] },
                    // type: 'messaging',
                });
                var listArray = []
                var filterListArray = []
                let anotherId = '';
                let anotherName = '';
                channels.map((data, index) => {
                    if (data.data.member_count < 3) {
                        let arr = data.state.members;
                        const result = Object.keys(arr).map((key) => arr[key]);
                        result.map((res) => {
                            if (res.user.id != getClient().user.id) {
                                anotherId = res.user.id;
                                anotherName = res.user.name
                                //   console.log("??"+anotherId)
                                // alert(anotherImg)
                            }
                        })
                        listArray.push({ channel: data, anotherId: anotherId, name: anotherName, image: data.data.image, unreadCount: data.state.unreadCount })
                    }
                })

                allUsers.map((item) => {
                    listArray.map((items) => {
                        if (item.id == items.anotherId) {
                            filterListArray.push({ channel: items.channel, name: items.name, image: item.profile_image, unreadCount: items.unreadCount })
                        }
                    })
                })

                setnewMessageImages(filterListArray);
                setLoading(false);
            }
            else
            {
                setLoading(false)

            }
        })
    }

    const setTheUser = () => {
        noLoad ? setLoading(false) : setLoading(true);
        const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
        AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS', CONSTANTS.FCM_TOKEN]).then(async (response) => {
            // console.log(JSON.stringify(response))
            if (response !== null) {
                let data = JSON.parse(response[1][1]);
                const userTokken = response[0][1];
                const user = {
                    id: String(data.id),
                    name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
                };
                chatClient.setUser(user, userTokken);
                setClient(chatClient);
             await chatClient.addDevice(response[2][1],
                    Platform.OS === 'ios' ? 'apn' : 'firebase'
                ) // ,String(data.id))

               
                const channels = await chatClient.queryChannels({
                    members: { $in: [String(data.id)] },
                });

                var listArray = []
                channels.map((data, index) => {
                    // console.log(data)
                    if (data.data.member_count > 2) {
                        listArray.push({ channel: data, name: data.data.name, image: data.data.image, unreadCount: data.state.unreadCount })
                    }
                })
                setGroupImage(listArray);
                setLoading(false);
            }
            else
            {
                setLoading(false)
            }
        })
    }
    
   
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            
            noLoad ? setLoading(false) : null;
            AsyncStorage.setItem(CONSTANTS.FIXED_ROUTE_NAME, 'Home');
            AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
                if (myToken !== null) {
                    console.log('accessToken', myToken)
                    setAccessToken(myToken);
                    getDetails(myToken);
                    getList(myToken);
                    settheRox();
                }
            })
        });
        return unsubscribe;
    }, [navigation]);

    // get user detail
    const getDetails = (myToken) => {
        if (myToken != '') {
            let data = { token: myToken }
            Actions.ProfileStatus(data)
                .then((response) => {
                
                    if (response&&response.data&&response.data.status&&response.data.status === 'success') {
                        setLoading(false);
                        setCanRefresh(false);
                        let data = response.data.data;
                        let user = data.user;
                        // alert(JSON.stringify());
                        setAllData(data.user);
                        // alert(data.user.id);
                        branch.setIdentity(String(data.user.id));
                        AsyncStorage.setItem('USER_DETAILS', JSON.stringify(data.user));
                        AsyncStorage.setItem(CONSTANTS.SELECTED_SCHOOL, user.school_name);
                        AsyncStorage.setItem(CONSTANTS.SELECTED_SCHOOLID, String(user.school));
                        AsyncStorage.setItem(CONSTANTS.EMAIL, user.email);
                        AsyncStorage.setItem(CONSTANTS.REFERRAL_LINK, data.user.referral_link != null ? data.user.referral_link : '');
                        AsyncStorage.setItem(CONSTANTS.HOUSING_LOGO, user.school_image != null ? user.school_image : '');

                        let sch = String(user.school_name);
                        if (sch.includes('(')) 
                        {
                            let arr = sch.split(' ');
                            arr.map((res) => {
                                if (res.includes('(')) {
                                    CONSTANTS.MYSCHOOL = String(res.replace('(', '').replace(')', ''));
                                }
                            })
                        }
                        else 
                        {
                            CONSTANTS.MYSCHOOL = String(user.school_name);
                        }
                        setTheUser();
                    }
                })
                .catch((err) => {
                    if (err&&err.response&&err.response.status&& err.response.status === 401) {
                        loading ? null : refreshToken('', {});
                    } 
                    else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                        setLoading(false);
                        SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                        AsyncStorage.clear();
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                    else {
                        setLoading(false);
                        setCanRefresh(false);
                    }
                })
        }
    }

    const refreshToken = (state, itemToLike) => {
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
                            setAccessToken(token.access_token);
                            AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
                            AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
                            AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
                            if (state === 'like') {
                                likeUnlike(itemToLike.item, itemToLike.index);
                            } else {
                                getDetails(token.access_token);
                                getList(token.access_token);
                            }
                        }
                        else {
                            setLoading(false)
                        }
                    })
                    .catch((err) => {
                        setLoading(false)
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

    // get posts
    const getUserPosts = (myToken) => {
        if (myToken != '') {
            let data = { token: myToken }
            Actions.GetPosts(data)
                .then((response) => {
                    // alert(JSON.stringify(response.data))
                    setUserPosts(response.data.data);
                    console.log("##posts" + JSON.stringify(response.data.data))
                })
                .catch((err) => {
                    console.log(JSON.stringify(err))
                    setLoading(false);
                    setCanRefresh(false);
                    // SimpleToast.showWithGravity('Something went wrong'+err, SimpleToast.SHORT, SimpleToast.CENTER);
                })
        }
    }

    const likeUnlike = (item, index) => {
        if (accessToken != '') {
            let dataToSend;
            if (item.likedByMe) {
                let data = userPosts;
                let newitem = data[index];
                newitem.likedByMe = false;
                setUserPosts([...data])
                dataToSend = {
                    token: accessToken,
                    id: item.id,
                    data: { status: 0 }
                }
            }
            else {
                let data = userPosts;
                let newitem = data[index];
                newitem.likedByMe = true;
                setUserPosts([...data]);
                dataToSend = {
                    token: accessToken,
                    id: item.id,
                    data: { status: 1 }
                }
            }
            Actions.Like(dataToSend)
                .then((response) => {
                    console.log("Response " + JSON.stringify(response))
                    if (response&&response.data&&response.data.status&&response.data.status === 'success') {
                        getUserPosts(accessToken);
                    }
                    else {
                        SimpleToast.showWithGravity(response.data.message, SimpleToast.SHOR, SimpleToast.CENTERT)
                    }
                })
                .catch((err) => {
                    if (err&&err.response&&err.response.status&& err.response.status === 401) {
                        let itm = { item: item, index: index };
                        refreshToken('like', itm);
                    } 
                    else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                        setLoading(false);
                        SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                        AsyncStorage.clear();
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                    else {
                        setLoading(false)
                        SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);

                    }
                })
        }
    }

    const getComments = (item, pagenum) => {
        // alert(pagenum)
        page > 1 ? setIsLoading(true) : setIsLoading(false);
        setSelectedItem(item)
        if (accessToken != '') {
            let data = { token: accessToken, id: item.id, page: pagenum }
            Actions.Get_Comments(data)
                .then((response) => {
                    if (response.data.status === 'success') {
                        let data = response.data.data;
                        console.log("Response comment " + JSON.stringify(data))
                        if (showMore && allComments.length > 0) {
                            if (allComments.length <= data[0].total) {
                                let arrr = allComments;
                                let mainArr = arrr.concat(data[0].data);
                                let newArrayList = [];
                                mainArr.forEach(obj => {
                                    if (!newArrayList.some(o => o.id === obj.id)) {
                                        newArrayList.push({ ...obj });
                                    }
                                });
                                console.log('bb ' + JSON.stringify(allComments))
                                setAllComments([...newArrayList]);
                                setIsLoading(false);
                            }
                        } else {
                            setAllComments(data.length > 0 ? data[0].data : []);
                            setShowComments(!showComments);
                            setSelectedId(item.id);
                            setIsLoading(false)
                        }
                        setIsLoading(false)
                    }
                    else {
                        SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                    }
                })
                .catch((err) => {
                    console.log("err Response " + JSON.stringify(err.response.data))
                    SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                })
        }
    }

    let sortedObj = [];
    if (allComments.length > 0) {
        sortedObj = allComments.sort(function (a, b) {
            return new Date(a.created_at) - new Date(b.created_at);
        });
    }

    const loadData = () => {
        setPage(page + 1);
        setIsLoading(true);
        getComments(selectedItem, page + 1)
    }

    const do_Reply = (item, comment) => {
        let reply = comment;
        if (accessToken != '') {
            let data = { token: accessToken, id: item.id, data: { comment: reply } }
            Actions.Do_Comment(data)
                .then((response) => {
                    if (response.data.status === 'success') {
                        let data = response.data.data;
                        setShowComments(false);
                        setLoading(false);
                        setIsLoading(false);
                        setreplyMessage('');
                        setAllComments([]);
                        setPage(1);
                        getComments(item, 1);
                        getUserPosts(accessToken);
                        console.log("Comment reply " + JSON.stringify(data));
                    }
                    else {
                        SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                    }
                })
                .catch((err) => {
                    console.log("err Response " + JSON.stringify(err.response.data))
                    SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                })
        }
    }

    const modalReply = (reply) => {
        do_Reply(selectedItem, reply)
    }

    const searchText = (text) => {
        setSelectedId('');
        setreplyMessage('');
        setTextToSearch(text);
        setShowComments(false);
        if (text.length > 1) {
            if (accessToken != '') {
                let data = { token: accessToken, text: text }
                Actions.Search(data)
                    .then((response) => {
                        setSearchedPost(response.data.data);
                    })
                    .catch((err) => {
                        console.log("err Response " + JSON.stringify(err.response.data))
                        SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                    })
            }
        }
        else { setSearchedPost([]) }
    }

    const getH = () => {
        viewRef.current.measure((fx, fy, width, height, px, py) => {
            // scrollRef.current?.scrollTo({ y: Number(py) + Number(height) + Number(calculatedHeight), animated: true })
        })
    }

    const postImg =
        selectedItem.image === '' ?
            [{ props: { source: Images.postPlaceholder }, url: '' }]
            :
            [{ props: { source: '' }, url: POST_IMAGE_URL + selectedItem.image }]

    const postView = ({ item, index }) => {
        // var res1 = item.user.first_name.charAt(0);
        // var res2 = item.user.last_name.charAt(0);
        // var res = res1 + res2

        return (
            <View style={Styles.postContainer} >
                <View style={Styles.postHeader}>
                <TouchableOpacity onPress={()=> {item.added_by? navigation.push('MemberProfile',{ USERID: item.user_id}): null}} >
                                <FastImage  source={item.added_by? { uri: IMAGE_URL + item.user.profile_image } : { uri: SCHOOL_URL +item.user.school_image }} style={Styles.postHeaderImage} />
                </TouchableOpacity>
                    {/* {
                        item.user.profile_image != null ?
                            <TouchableOpacity onPress={() => { item.added_by ? navigation.push('MemberProfile', { USERID: item.user_id }) : null }} >
                                <FastImage source={item.user.profile_image != null ? { uri: IMAGE_URL + item.user.profile_image } : Images.steve} style={Styles.postHeaderImage} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => { item.added_by ? navigation.push('MemberProfile', { USERID: item.user_id }) : null }} style={[Styles.postHeaderImage, { justifyContent: 'center', alignItems: 'center' }]} >
                                <Text style={{ fontFamily: Fonts.APP_MEDIUM_FONT, fontSize: hp(2.4) }} >{res}</Text>
                            </TouchableOpacity>
                    } */}
                    <View style={Styles.postUserDetailContainer}>
                        <Text style={Styles.postUserName} >{item.user.first_name + (item.user.last_name ? ' ' + item.user.last_name : '')}</Text>
                        <Text style={Styles.postTimeText} >{timeSince(item.created_at)}</Text>
                    </View>
                    {/*
                <View style={Styles.postdotIconContainer}>
                <Image resizeMode="contain" source={Images.dots} style={Styles.dotIconStyle} />
                </View>
                */}
                </View>
                <Text style={Styles.postDiscription} >{item.description}</Text>
                <TouchableOpacity onPress={() => { setSelectedItem(item); setZoomImage(true) }}>
                    {item.image === '' ?
                        <FastImage  source={Images.postPlaceholder} style={Styles.postMidImage} />
                        :
                        <FastImage  source={{ uri: POST_IMAGE_URL + item.image }} style={Styles.postMidImage} />
                    }
                </TouchableOpacity>
                <View style={Styles.postBottomContainer}>
                    <TouchableOpacity style={Styles.postLikeContainer} onPress={() => { likeUnlike(item, index) }}>
                        <TouchableOpacity style={[Styles.postLikeIcon]} onPress={() => { likeUnlike(item, index) }}>
                            <FastImage resizeMode={FastImage.resizeMode.contain} source={item.likedByMe ? Images.heart : Images.heart_off} style={[Styles.postLikeIcon, {}]} />
                        </TouchableOpacity>
                        <Text style={Styles.postLikeCount} >{item.likesCount < 2 ? item.likesCount + ' Like' : item.likesCount + ' Likes'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setPage(1); selectedId !== item.id ? getComments(item, 1) : (setShowComments(false), setSelectedId('')) }} style={[Styles.postLikeContainer, { justifyContent: 'flex-end' }]}>
                        <FastImage resizeMode={FastImage.resizeMode.contain} source={Images.comment} style={[Styles.postLikeIcon, {}]} />
                        <Text style={[Styles.postLikeCount, {}]} >{item.commentCount < 2 ? item.commentCount + ' Comment' : item.commentCount + ' Comments'}</Text>
                    </TouchableOpacity>
                </View>
                {selectedId === item.id ?
                    <View ref={viewRef} style={Styles.commentsView} onLayout={(event) => setHeight(event.nativeEvent.layout.height)}>
                        {sortedObj.map((item, index) => {
                            return (index >= (sortedObj.length - 3) ? <CommentSection navigation={navigation} item={item} /> : null)
                        })}
                        {sortedObj.length > 3 ? <Text onPress={() => { showMore ? setShowMore(false) : setShowMore(true) }} style={Styles.showMore}>{showMore ? 'Show less...' : 'Show more...'}</Text> : null}
                        <ReplyView replyMessage={replyMessage} do_Reply={(item, replyMessage) => do_Reply(item, replyMessage)} setreplyMessage={setreplyMessage} item={item} />
                    </View>
                    : null}
            </View>
        )
    }

    const carouselRef = useRef(null);
    const newgroup = ({ item, index, focused }) => {
        return (
            <GroupView navigation={navigation} gotoNext={(item) => { setChannel(item); navigation.navigate('ChatMessage') }} getEvent item={item} index={index} />)
    }

    const doRefresh = () => {
        setCanRefresh(true);
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                settheRox();
                setAccessToken(myToken);
                getUserPosts(myToken);
                getDetails(myToken);
                getList(myToken)
            }
        })
    }

    return (
        <KeyboardAwareScrollView
            refreshControl={
                <RefreshControl
                    refreshing={canRefresh}
                    onRefresh={() => { doRefresh() }}
                    title="Loading..."
                />
            }
            showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'
            style={{ backgroundColor: userPosts.length === 0 ? AppColors.WHITE : AppColors.APP_THEME }}
            contentContainerStyle={{ alignItems: 'center', backgroundColor: AppColors.WHITE }}>
            <StatusBar backgroundColor={AppColors.APP_THEME} />
            <ScrollView contentContainerStyle={{ backgroundColor: AppColors.WHITE }} onScroll={(event) => { }} onContentSizeChange={(contentWidth, contentHeight) => { showComments ? getH() : null }}
                ref={scrollRef} style={Styles.mainContainer}>
                <ImageBackground source={Images.topShape} resizeMode='stretch' style={Styles.headerContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => navigation.push('Profile')}>
                            <FastImage source={allData.profile_image ? { uri: IMAGE_URL + allData.profile_image } : Images.user}
                                style={Styles.headerLogoImage} />
                        </TouchableOpacity>
                        <View >
                            <Text style={Styles.headerTitle} >Hello {allData.first_name ? allData.first_name : ''},</Text>
                            <Text style={Styles.headerTagLine} >Welcome back to BSchool</Text>
                        </View>
                    </View>
                </ImageBackground>
                {loading ? <Spinner /> : null}
                <View style={Styles.searchViewContainer}>
                    <FastImage resizeMode={FastImage.resizeMode.contain} source={Images.search} style={Styles.searchIcon} />
                    <TextInput value={textToSearch} returnKeyType='search' onChangeText={(text) => searchText(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search for Topic or group.." style={Styles.searchTextinput} />
                    {textToSearch ?
                        <TouchableOpacity onPress={() => { setTextToSearch(''), setSearchedPost([]) }}>
                            <FastImage resizeMode={FastImage.resizeMode.contain} source={Images.cross} style={[Styles.searchIcon, { marginLeft: wp(2), }]} />
                        </TouchableOpacity>
                        : null}
                </View>
                {GroupImage.length > 0 ?
                    <View backgroundColor={AppColors.SEARCH_COLOR} paddingBottom={hp(2)}>
                        {/* {hideGroup ? */}
                        <View style={Styles.midLineContainer}>
                            <Text style={Styles.midText1}>Groups</Text>
                            {GroupImage.length > 2 ?
                                <TouchableOpacity onPress={() => navigation.navigate('Chat')} >
                                <Text style={Styles.midText2}>See All</Text>
                                </TouchableOpacity>
                                : null}
                        </View>
                        {/* : null } */}
                        {/* {hideGroup ? */}
                        <View style={{ width: wp(100), }}>
                            {textToSearch.length > 1 && GroupImage.filter((item) => item.name.toLowerCase().includes(textToSearch.toLowerCase())).length === 0 ?
                                <View style={{ height: hp(10), justifyContent: 'center', alignItems: 'center' }} >
                                    <Text style={{ fontSize: hp(2.1), color: AppColors.APP_THEME, fontFamily: Fonts.APP_MEDIUM_FONT }} >No Group Found </Text>
                                </View>
                                :
                                <Carousel
                                    style={{ width: wp(100), }}
                                    data={textToSearch.length > 1 ? GroupImage.filter((item) => item.name.toLowerCase().includes(textToSearch.toLowerCase())) : [...GroupImage]}
                                    renderItem={newgroup}
                                    itemWidth={wp(43)}
                                    containerWidth={wp(43)}
                                    separatorWidth={0}
                                    ref={carouselRef}
                                    getItemLayout={() => alert('gg')}
                                    itemContainerStyle={{ marginLeft: wp(2), }}
                                    inActiveScale={0.9}
                                    inActiveOpacity={0.9}
                                    activeOpacity={1}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            }
                        </View>
                        {/* : null} */}
                    </View>
                    : null}
                {newMessageImages.length > 0 ?
                    <View style={Styles.midLineContainer}>
                        <Text style={Styles.midText1}>New Messages</Text>
                        {newMessageImages.length > 5 ?
                            <TouchableOpacity onPress={() => navigation.navigate('Chat')} >
                            <Text style={Styles.midText2}>See All</Text>
                            </TouchableOpacity>
                            : null}
                    </View>
                    : null}
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', paddingBottom: hp(2) }}
                    style={Styles.newMessageContainer}
                    horizontal={true}
                    data={[...newMessageImages]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => {
                            setChannel(item.channel); navigation.navigate('ChatMessage')
                        }}>
                            <FastImage source={item.image != null ? { uri: IMAGE_URL + item.image } : Images.user} style={Styles.newMessageImage} />
                            {/* {item.unreadCount > 0 ? <View style={Styles.active}></View> : null} */}
                        </TouchableOpacity>
                    }
                />
                {textToSearch !== '' && searchedPost.length == 0 ?
                    <View style={{ height: hp(40), justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ fontSize: hp(2.1), color: AppColors.APP_THEME, fontFamily: Fonts.APP_MEDIUM_FONT }} >No Result Found </Text>
                    </View>
                    :
                    <FlatList
                        style={{ backgroundColor: AppColors.SEARCH_COLOR }}
                        data={searchedPost.length > 0 ? searchedPost : userPosts}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={postView}
                    />
                }
                {showMore ?
                    <CommentsView navigation={navigation} selectedItem={selectedItem} isLoading={isLoading} loadData={() => loadData()} send={(reply) => modalReply(reply)} allComments={[...sortedObj]} onClose={() => { setShowMore(false) }} />
                    : null}
            </ScrollView>
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
                    <View style={Styles.topView}>
                        <HeaderView title={selectedItem.user.first_name + (selectedItem.user.last_name ? ' ' + selectedItem.user.last_name : '')} onLeftClick={() => { setSelectedItem({}); setZoomImage(false) }} />
                        <ImageViewer enableSwipeDown={true} onSwipeDown={() => { setSelectedItem({}); setZoomImage(false); }}
                            imageUrls={postImg}
                        />
                    </View>
                </Modal>
                : null}
        </KeyboardAwareScrollView>
    );
}

export default Home;
