import React, { useContext, useEffect, useState, useRef } from 'react';
import { LogBox, Platform, Animated, SafeAreaView, View, Image, ScrollView, Dimensions, FlatList, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { StreamChat } from 'stream-chat';
import { useHeaderHeight } from '@react-navigation/stack';
import { ChatContext } from '../../navigation/TabNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import Styles, { AllGroupStyles, GroupStyles } from './Styles';
import { Channel, Chat, MessageInput, MessageList, MessageSimple, Streami18n, SendButton, TypingIndicator, MessageReplies } from 'stream-chat-react-native';
import { InputBox } from '../../components/InputBox';
import StreamColors from '../../components/StreamColors';
import { MessagesMark } from '../../components/MessagesMark';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getClient, isiPhoneX } from '../../utils';
import AppColors from '../../utils/AppColors';
import HeaderView from '../../components/HeaderView';
import Images from '../../assets/Images';
import { IMAGE_URL } from '../../webServices/EndPoints';
import Actions from '../../webServices/Action';
import Spinner from '../../components/Spinner';
import SimpleToast from 'react-native-simple-toast';
import { ImageBackground } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Button from '../../components/Button';
import { Thread } from 'stream-chat-react-native';
import Share from 'react-native-share';

const ChatMessage = React.memo(({ navigation, route }) => {
  const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
  const headerHeight = useHeaderHeight();
  const { channel, setChannel } = useContext(ChatContext);
  const ourChannel = channel;
  const [initialValue, setInitialValue] = useState('');
  const [userId, setUserId] = useState('');
  const [showGroupView, setShowGroupView] = useState(false);
  const [memberImages, setMemberImages] = useState([]);
  const [sharedImages, setSharedImages] = useState([]);
  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [favouritActive, setfavouritActive] = useState(false);
  const [chatLoad, setChatLoad] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [threadSheet, setThreadSheet] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [zoomImage, setZoomImage] = useState(false);
  const [bottomSheetRef, setbottomSheetRef] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState([]);
  const [textToSearch, setTextToSearch] = React.useState('');
  const [searchedData, setSearchedData] = React.useState({});
  const [wantToSearch, setWantToSearch] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [CHANNEL_NAME, setChannelName] = useState('');
  const [CHANNEL_IMAGE, setChannelImage] = useState('');
  const [showPinned, setShowPinned] = useState(false);
  const [showNotification, setshowNotification] = useState(false);
  const [nextChatLoad, setnextChatLoad] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowGroupView(false);
      setbottomSheetRef(true);
      checkNotification();
      setShowAll(false);
    });

    if (channel.data.member_count === 2) {
      let arr = channel.state.members;
      const result = Object.keys(arr).map((key) => arr[key]);
      result.map((res) => {
        if (res.user.id != getClient().user.id) {
          setChannelName(res.user.name);
          setChannelImage(res.user.image);
        }
      })
    }

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params) {
      if (route.params.from === 'Events') {
        (async () => {
          let client = getClient();
          const myChannel = client.channel('messaging', channel.id, {
            name: channel.name,
          });
          let data = route.params.data;
          let detail = 'id:' + route.params.event_id + ',name:' + data.name + ',detail:' + data.detail + ',startTime:' + data.startTime + ',endTime:' + data.endTime
          await myChannel.sendMessage({
            text: "New Event Created: " + detail
            // textType:route.params.detail
          })
        })();
      }
    }

    checkNotification();
    if (channel.data.member_count === 2) {
      let arr = channel.state.members;
      const result = Object.keys(arr).map((key) => arr[key]);
      result.map((res) => {
        if (res.user.id != getClient().user.id) {
          setChannelName(res.user.name);
          setChannelImage(res.user.image);
        }
      })
    }
  }, ([]))

  useEffect(() => {
    getPinnedMsgs()
  }, [(showPinned)])

  useEffect(() => {
    setTimeout(() => {
      setChatLoad(false);
    }, 1500);

    let sharedImages = [];
    if (channel.state.messages.length > 0) {
      channel.state.messages.map((res) => {
        if (res.attachments.length > 0) {
          res.attachments.map((response) => {
            if (response.image_url) {
              let item = {
                created_at: res.created_at,
                type: 'image',
                image: response.image_url
              }
              sharedImages.push(item);
            }
            else if (response.mime_type) {
            }
          })
        }
      })
      const sortedArray = sharedImages.sort((a, b) => a.created_at < b.created_at);
      setSharedImages([...sortedArray]);
    }
  }, []);

  const getPinnedMsgs = () => {
    setShowPinned(false);
    (async () => {
      let CC = getClient();
      const channels = await CC.queryChannels({
        members: { $in: [String(CC.user.id)] },
      });
      channels.map((res) => {
        if (res.id === channel.id) {
          let pinnedText = [];
          if (res.state.messages.length > 0) {
            res.state.messages.map((res) => {
              if (res.deleted_at) {
              }
              else {
                if (res.pinned) {
                  let maindata = channel.data;
                  let attachmentData = res.attachments;
                  if (attachmentData.length > 0) {
                    attachmentData.map((response) => {
                      let data = {
                        image: maindata.created_by.image,
                        created_at: res.pinned_at,
                        name: maindata.name,
                        message: res.text,
                        reactionCount: Object.keys(res.reaction_counts).length,
                        reactions: res.latest_reactions,
                        attachments: response.image_url
                      }
                      pinnedText.push(data)
                    })
                  }
                  else {
                    let data = {
                      image: maindata.created_by.image,
                      created_at: res.pinned_at,
                      name: maindata.name,
                      message: res.text,
                      reactionCount: Object.keys(res.reaction_counts).length,
                      reactions: res.latest_reactions,
                    }
                    pinnedText.push(data)
                  }
                } else {
                  setLoading(false)
                }
              }
            })
            setPinnedMessages(pinnedText);
          }
        }
      })
    })()
  }

  const checkChannelFavourite = () => {
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        let data = {
          token: myToken
        }
        Actions.FavouriteList(data)
          .then((response) => {
            if (response.data.status === 'success') {
              let data = response.data.data;
              data.favChannels.data.map((data, index) => {
                if (data.channel_id === channel.id) {
                  setfavouritActive(true)
                }
              })
            }
          })
          .catch((err) => {
            console.log(JSON.stringify(err))
          })
      }
    })
  }

  useEffect(() => {
    let arr = [];
    arr = channel.state.members;
    const result = Object.keys(arr).map((key) => arr[key]);
    let filteredArr = result.filter(x => x.user_id != getClient().user.id);
    setMemberImages(filteredArr);
    console.log("LOLO" + JSON.stringify(filteredArr))
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then((response) => {
      if (response !== null) {
        let data = JSON.parse(response[1][1]);
        const userTokken = response[0][1];
        const user = {
          id: String(data.id),
          name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
        };
        setUserId(user.id);
        const setupClient = () => {
          chatClient.setUser(user, userTokken);
        };
        setupClient();
      }
    })
    checkChannelFavourite();
  }, []);

  const chatStyles = StreamColors();

  const MyChannel = () => {
    return (
      <View style={{ flex: 1, }}>
        {pinnedMessages.length > 0 ?
          <View style={Styles.pinnedStyle}>
            <View style={[Styles.pinnedImage, { marginLeft: wp(4), marginRight: wp(2) }]}>
              <Image resizeMode='contain' source={Images.user} style={Styles.pinnedImage} />
            </View>
            <View alignSelf='center'>
              <Text style={Styles.pinHeading}>Pinned Message</Text>
              <Text numberOfLines={1} style={Styles.pinnedMsg}>{pinnedMessages.length > 0 ? pinnedMessages[pinnedMessages.length - 1].message != '' ? pinnedMessages[pinnedMessages.length - 1].message : 'An Image' : ''}</Text>
            </View>
            <TouchableOpacity style={[Styles.pinCross, { marginRight: wp(4) }]} onPress={() => { setPinnedMessages([]) }}>
              <Image resizeMode='contain' source={Images.white_cross} style={Styles.pinCross} />
            </TouchableOpacity>
          </View>
          : null}
        <MessageList
          TypingIndicator={() => {
            let arr = channel.state.typing;
            const result = Object.keys(arr).map((key) => arr[key]);
            let myId = getClient().user.id;
            let userId = result.length > 0 ? result[0].user.id : 0
            return (
              myId === userId ? null
                :
                <View style={Styles.typingView}>
                  <View style={Styles.typingImgView} >
                    {result.length > 0 && result[0].user.image === null ?
                      <Text style={{ color: 'white' }}>{result[0].user.name.charAt(0).toUpperCase()}</Text> :
                      <Image resizeMode='cover' source={{ uri: result.length > 0 ? IMAGE_URL + result[0].user.image : '' }} style={Styles.imgView} />}
                  </View>
                  <Text style={Styles.typingName}>{result.length > 0 ? result[0].user.name : ''}<Text style={{ fontWeight: '200' }}> is typing...</Text></Text>
                </View>
            )
          }}

          onListScroll={(scroll) => { console.log(scroll) }}
          Message={props => (
            chatLoad ? null :
              <MessagesMark
                navigation={navigation}
                setShowPinned={setShowPinned}
                textToSearch={''}
                ownMessage={props.isMyMessage(props.message)}
                {...props}
              />
          )}
          onThreadSelect={(thread) => {
            setSelectedMessage(thread);
            setThreadSheet(true);
          }}
        />

        <MessageInput
          compressImageQuality={0.7}
          additionalTextInputProps={{
            placeholderTextColor: 'grey',
            placeholder:
              channel && channel.data.name
                ? 'Send Message...'
                : 'Message',
          }}
          Input={(props) =>
            <InputBox props={props} open={open} settoTrue={() => setOpen(true)} setOpen={() => { setOpen(false) }} />
          }
        />

        <Modal animationType="slide"
          style={{ flex: 1 }}
          contentContainerStyle={{ backgroundColor: AppColors.SEARCH_COLOR, flexGrow: 1 }}
          visible={threadSheet} //showPopup
          transparent={true}
        >
          <View backgroundColor={AppColors.WHITE} flex={1}>
            <Chat client={chatClient}>
              <HeaderView title={selectedMessage.text} onLeftClick={() => { setThreadSheet(false) }} />
              {Platform.OS === 'ios' ?
                <Channel keyboardVerticalOffset={-hp(7)} client={chatClient} channel={channel} thread={selectedMessage}>
                  <View style={{ display: 'flex', height: '100%', paddingTop: 5, paddingBottom: hp(9) }}>
                    <Thread thread={selectedMessage}
                      additionalMessageInputProps={{
                        Input: props => (
                          <InputBox noemoji props={props} open={open} settoTrue={() => setOpen(true)} setOpen={() => { setOpen(false) }} />
                        ),
                        additionalTextInputProps: {
                          placeholderTextColor: '#979A9A',
                          placeholder:
                            'Send Message.....'
                        },
                      }} />
                  </View>
                </Channel>
                :
                <Channel client={chatClient} channel={channel} thread={selectedMessage}>
                  <View style={{ display: 'flex', height: '100%', paddingTop: 5, paddingBottom: hp(9) }}>
                    <Thread
                      thread={selectedMessage}
                      additionalMessageInputProps={{
                        Input: props => (
                          <InputBox noemoji props={props} open={open} settoTrue={() => setOpen(true)} setOpen={() => { setOpen(false) }} />
                        ),
                        additionalTextInputProps: {
                          placeholderTextColor: '#979A9A',
                          placeholder:
                            'Send Message.....'
                        },
                      }}
                    />
                  </View>
                </Channel>
              }
            </Chat>
          </View>
        </Modal>
      </View>
    )
  }

  const markAsFavourite = () => {
    setShowPopup(false);
    setLoading(true);
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        let formdata = new FormData();
        formdata.append("channel_id", channel.id);
        let data =
        {
          data: formdata,
          token: myToken
        }
        Actions.Favourite(data)
          .then((response) => {
            setLoading(false);
            if (response.data.status === 'success') {
              setLoading(false);
              // if (favouritActive) {
              //   SimpleToast.showWithGravity(channel.id + ' Removed from Favorite', SimpleToast.SHORT, SimpleToast.CENTER)
              //   setfavouritActive(!favouritActive);
              // } else {
              //   SimpleToast.showWithGravity(channel.id + ' Marked as Favorite', SimpleToast.SHORT, SimpleToast.CENTER)
              //   setfavouritActive(!favouritActive);
              // }

              if (favouritActive) {
                SimpleToast.showWithGravity(CHANNEL_NAME != '' ? CHANNEL_NAME + ' Removed from Favorite' : channel.data.name + ' Removed from Favorite', SimpleToast.SHORT, SimpleToast.CENTER)
                setfavouritActive(!favouritActive);
              } else {
                SimpleToast.showWithGravity(CHANNEL_NAME != '' ? CHANNEL_NAME + ' Marked as Favorite' : channel.data.name + ' Marked as Favorite', SimpleToast.SHORT, SimpleToast.CENTER)
                setfavouritActive(!favouritActive);
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
            else {
              setLoading(false);
              console.log("catch" + JSON.stringify(err))
            }
          })
      }
    })
  }

  const refreshToken = () => {
    AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.ACCESS_TOKEN]).then((res) => {
      if (res !== null) {
        let data = {
          token: res[0][1],
          oldToken: res[1][1]
        }
        Actions.Refresh_Token(data)
          .then((response) => {
            if (response.data.status === 'success') {
              let data = response.data.data;
              let token = data.token;
              AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
              AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
              AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
              markAsFavourite();
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

  function leaveGroup() {
    setLoading(true)
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        let data = {
          token: myToken
        }
        Actions.FavouriteList(data)
          .then((response) => {
            if (response.data.status === 'success') {
              let data = response.data.data;
              if (data.favChannels.data.length > 0) {
                data.favChannels.data.map((data, index) => {
                  if (data.channel_id === channel.id) {
                    console.log(data.channel_id)
                    markAsFavourite();
                    setfavouritActive(false)
                    channel.removeMembers([userId]);
                    setLoading(false);
                    navigation.goBack()
                  }
                  else {
                    channel.removeMembers([userId]);
                    setLoading(false);
                    navigation.goBack();
                  }
                })
              }
              else {
                channel.removeMembers([String(userId)]);
                setLoading(false);
                navigation.goBack()
              }
            } else {
              setLoading(false)
              console.log('error')
            }
          })
          .catch((err) => {
            setLoading(false)
            console.log("check catch" + JSON.stringify(err))
          })
      }
    })
  }

  const shareGroup = async () => {
    // let client = getClient();
    // let channel = await client.queryChannels({
    //   type: 'messaging',
    //   members: { $in: ['160'] },
    //   invite: 'pending'
    //  })
    let client = getClient();
    // alert(client.user.id);
    // console.log(JSON.stringify(channel.state.members))
    // const invite = client.channel('messaging', channel.id, {
    //   name: channel.name,
    //   members: ['157', '160', '162','165'],
    //   invites: ['165'],
    // });
    // await invite.create()
    // .then((res => {
    //   console.log('res ',JSON.stringify(res));
    // })).catch((err) => {
    //   console.log('err ' + err)
    // })
    // I'm inviting you to join my Onlynewusergroup please click on link to join https://www.mybschool.com
    // Share.open({
    //   message: "I'm inviting you to join my channel "+ channel.id+" please click on link to join https://www.mybschool.com/"+channel.id
    // })
    // .then(result => console.log(result))
    // .catch(errorMsg => console.log(errorMsg)); 
  }

  const checkNotification = () => {
    AsyncStorage.getItem(CONSTANTS.MUTE_NOTIFICATION).then((res) => {
      // alert(res)
      if (res !== null) {
        setshowNotification(res === '11' ? true : false)
      }
    })
  }

  const muteNotification = () => {
    AsyncStorage.getItem(CONSTANTS.MUTE_NOTIFICATION).then((res) => {
      if (res !== null) {
        if (res === '00') {
          AsyncStorage.setItem(CONSTANTS.MUTE_NOTIFICATION, '11');
          setshowNotification(true);
          SimpleToast.showWithGravity('Notification is off', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else {
          AsyncStorage.setItem(CONSTANTS.MUTE_NOTIFICATION, '00');
          setshowNotification(false);
          SimpleToast.showWithGravity('Notification is on', SimpleToast.SHORT, SimpleToast.CENTER);
        }
      }
    })
  }

  const AllParticipant = () => {
    return (
      <Modal
        animationType="slide"
        visible={showAll}
        transparent={true} >
        <View style={[Styles.popAllModalInnerView]} >
          <HeaderView white title="All Members" onLeftClick={() => { setShowAll(false) }} />
          <View style={Styles.allModalHorLine} ></View>
          <View flex={1}>
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={3}
              data={[...memberImages]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) =>
                <TouchableOpacity onPress={() => { navigation.navigate('MemberProfile', { USERID: item.user_id }), setShowAll(false) }}>
                  <ImageBackground style={Styles.allParticipantModal} source={{ uri: IMAGE_URL + item.user.image }} >
                    <Text numberOfLines={1} style={Styles.allModalHeadText}>
                      {item.user.name}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
      </Modal>
    )
  }
  const FavouriteView = () => {
    return (
      <Modal
        animationType="slide"
        // contentContainerStyle={{backgroundColor:'red',flex:1}}
        visible={showPopup} //showPopup
        transparent={true} >
        <TouchableOpacity onPress={() => { setShowPopup(false) }} style={{ height: hp(100), width: wp(100), backgroundColor: 'rgba(56,56,56,0.6)', justifyContent: 'center', alignSelf: 'center', }}  >
          <View style={[Styles.popModalInnerView, { height: channel.data.member_count > 2 ? hp(57) : hp(50) }]} >
            {loading ? <Spinner /> : null}
            {channel.data.member_count > 2 ?
              <View style={[Styles.popModalHeader, { marginTop: hp(2) }]}>
                <Text style={[Styles.popModalHeaderText]} >Favorite this Chat</Text>
                <TouchableOpacity onPress={() => { markAsFavourite() }} >
                  <Image source={favouritActive ? Images.heart : Images.heart_off} resizeMode="contain" style={Styles.favIconStyle} ></Image>
                </TouchableOpacity>
              </View>
              : <View height={hp(3)} />}
            <View style={[Styles.popModalHeader, { height: hp(4.5), }]}>
              <Text style={[Styles.popModalHeaderText, { color: AppColors.INPUT }]} >Mute Notifications</Text>
              <TouchableOpacity onPress={() => { muteNotification() }}>
                <Image source={showNotification ? Images.Switchon : Images.Switchoff} resizeMode="contain" style={Styles.switchIconStyle} ></Image>
              </TouchableOpacity>
            </View>
            <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.navigate('ChatDescription', { 'title': 'Website Links' }) }} link listName='Website Links' image={Images.link} />
            <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.navigate('ChatDescription', { 'title': 'Tags' }) }} listName='Tags' image={Images.tag} />
            <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.navigate('ChatDescription', { 'title': 'Popular' }) }} listName='Popular Message' image={Images.favorite} />
            <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.navigate('ChatDescription', { 'title': 'Pinned' }) }} listName='Pinned Message' image={Images.pin} />
            {/* <PopListView onPress={() => { getCount()}} listName='Pinned Message' image={Images.pin} /> */}
            {channel.data.member_count > 2 ?
              <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.push('Events', { from: 'chat', name: channel.data.name, channel: channel }) }} listName='Calendar' image={Images.calender} />
              : null
            }
            <PopListView onPress={() => shareGroup()} listName='Share Chat' image={Images.share} />
            <TouchableOpacity onPress={() => leaveGroup()} style={Styles.popupbottomView} >
              <Text style={Styles.bottombuttonText} >Leave Chat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  const ListOfChannels = () => {
    return (
      <>

        <SafeAreaView marginTop={Platform.OS === 'android' ? 0 : isiPhoneX() ? hp(1) : hp(1)} flex={1}  >
          <Chat client={chatClient} style={chatStyles} i18nInstance={new Streami18n({
            language: 'en',
          })}>
            {
              Object.keys(searchedData).length > 0 ?
                <Channel channel={searchedData} >
                  <MyChannel />
                </Channel>
                :
                <Channel channel={channel} >
                  <MyChannel />
                </Channel>
            }
          </Chat>
        </SafeAreaView>
      </ >
    )
  }

  const MainClassView = () => {
    return (
      <View>
        {
          !bottomSheetRef ?
            <ImageBackground style={{
              top: 0, position: 'absolute', zIndex: 100, paddingTop: Platform.OS === 'android' ? hp(2) : isiPhoneX() ? hp(4) : hp(3), alignSelf: 'center',
              justifyContent: 'center',
              flexDirection: 'row', width: wp(100), height: Platform.OS === 'android' ? hp(20) : hp(22), backgroundColor: AppColors.LIGHTGREEN
            }} source={{ uri: CHANNEL_IMAGE ? IMAGE_URL + CHANNEL_IMAGE : channel.data.image }} resizeMode='cover' >
            </ImageBackground>
            : null

        }

        <View style={{ flex: 1 }}>
          {nextChatLoad ? <Spinner /> : null}
          <FavouriteView />
          <View paddingVertical={hp(2)} marginTop={Platform.OS === 'android' ? hp(19.5) : isiPhoneX() ? hp(22) : hp(22)} backgroundColor={AppColors.WHITE} width={wp(100)}>
            <Button title='More' style={{ width: wp(90), height: hp(6), alignSelf: 'center', borderRadius: 8 }} continue={() => { setShowPopup(true) }} /></View>
          <View style={{ backgroundColor: AppColors.WHITE, width: wp(100), marginTop: hp(1.5), }}>
            <Text style={Styles.partTextStyle}>Participants</Text>
            <View style={{ width: wp(92), alignItems: 'flex-start', marginBottom: hp(2), alignSelf: 'center', }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                style={Styles.newMessageContainer}
                horizontal={true}
                data={[...memberImages]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                  index === 3 ?
                    <TouchableOpacity onPress={() => setShowAll(true)} style={{ height: hp(4.5), width: hp(4.5), margin: 5, justifyContent: 'center', alignItems: 'center', borderColor: 'transparent', borderRadius: 50, backgroundColor: AppColors.APP_THEME }}>
                      <Text style={{ color: 'white' }}>{memberImages.length - 3}+</Text>
                    </TouchableOpacity>
                    :
                    index <= 3 ?
                      <TouchableOpacity onPress={() => navigation.push('MemberProfile', { USERID: item.user_id })} style={{ height: hp(4.5), width: hp(4.5), margin: 5, justifyContent: 'center', alignItems: 'center', borderColor: 'transparent', borderRadius: 50, backgroundColor: AppColors.APP_THEME }}>
                        {item.user.image === null ?
                          <Text style={{ color: 'white' }}>{item.user.name.charAt(0).toUpperCase()}</Text> :
                          <Image resizeMode='cover' source={{ uri: IMAGE_URL + item.user.image }} style={{ height: hp(4.5), alignSelf: 'center', width: hp(4.5), borderColor: 'transparent', borderRadius: 50, }} />}
                      </TouchableOpacity>
                      : null
                }
              />
            </View>
            {channel.data.member_count > 2 ?
              <TouchableOpacity style={GroupStyles.adminChangeView} onPress={() => { setShowGroupView(false), navigation.push('InvitePerson', { 'fromChat': true, 'channel': channel }) }}>
                <TouchableOpacity onPress={() => { setShowGroupView(false), navigation.push('InvitePerson', { 'fromChat': true, 'channel': channel }) }}>
                  <Image resizeMode='cover' source={Images.greenAdd} style={[GroupStyles.addImg, { marginBottom: 0 }]} />
                </TouchableOpacity>
                <Text style={[GroupStyles.addText, { marginLeft: wp(5), }]}>Add Participant</Text>
              </TouchableOpacity>
              : null}
          </View>
        </View>
      </View>
    )
  }

  const PopUpView = () => {
    return (
      <>
        {Platform.OS === 'android' ?
          <View style={{ backgroundColor: AppColors.SEARCH_COLOR, bottom: 0, position: 'absolute', height: hp(90) }}>
            <ListOfChannels />
          </View>
          :
          <View style={{ backgroundColor: AppColors.SEARCH_COLOR, bottom: 0, position: 'absolute', height: hp(90) }}>
            <ListOfChannels />
          </View>
        }
      </ >
    )
  }

  const connectToMember = (item) => {
    // alert(JSON.stringify(item))

    if (item.user_id) {
      const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
      let PERSON_NAME = item.user.name
      setnextChatLoad(true);
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
            setnextChatLoad(false)
            setChannel(res[0]);
            setShowGroupView(false);
            setbottomSheetRef(true);
            checkNotification();
            navigation.navigate('ChatMessage')
          }

          else if (filteredData.length > 0) {
            setnextChatLoad(false)
            setChannel(filteredData[0]);
            setShowGroupView(false);
            setbottomSheetRef(true);
            checkNotification();
            navigation.navigate('ChatMessage')
          }
          else {
            const channel = Client.channel('messaging', String(Math.floor(Math.random() * 1000) + 1) + String(item.user_id), {
              name: PERSON_NAME,
              image: item.user.image,
              members: [String(item.user.id), String(data.id)],
              session: 8,
            });
            channel.create().then((response) => {
              // console.log("##" + JSON.stringify(response));
              if (response) {
                setnextChatLoad(false)
                setChannel(channel);
                setShowGroupView(false);
                setbottomSheetRef(true);
                checkNotification();
                navigation.navigate('ChatMessage')
              }
            })
              .catch((err) => {
                // console.log(err)
                setnextChatLoad(false)
                SimpleToast.showWithGravity('This user is not registered with this client', SimpleToast.SHORT, SimpleToast.CENTER);

              })
          }
        } else {
          setnextChatLoad(false)
        }
      })
    }
  }


  const searchTextMessages = async (text) => {
    setTextToSearch(text)
  }

  return (
    <SafeAreaView style={{ top: isiPhoneX() ? -3 : 0, position: 'absolute', flex: 1, marginTop: Platform.OS === 'android' ? 0 : -hp(5) }}>
      {!bottomSheetRef ?
        <>
          <View style={{
            top: 0, position: 'absolute', zIndex: 100, paddingTop: Platform.OS === 'android' ? hp(1.7) : isiPhoneX() ? hp(9) : hp(1.7), alignSelf: 'center',
            justifyContent: 'center',
            flexDirection: 'row', width: wp(100), height: Platform.OS === 'android' ? hp(12) : hp(20), backgroundColor: 'transparent'
          }}>
            {wantToSearch ?
              <View style={[AllGroupStyles.searchViewContainer, { width: wp(94), marginTop: isiPhoneX() ? -hp(1.5) : -hp(18), height: hp(6), marginBottom: 0, }]}>
                <Image resizeMode="contain" source={Images.search} style={AllGroupStyles.searchIcon} />
                <TextInput returnKeyType='search' value={textToSearch} onChangeText={(text) => searchTextMessages(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={[AllGroupStyles.searchTextinput, {}]} />
                <TouchableOpacity onPress={() => { setTextToSearch(''); setSearchedData({}); setChannel(channel); setWantToSearch(false) }}>
                  <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
                </TouchableOpacity>
              </View>
              :
              <>
                <TouchableOpacity style={{ height: hp(3), width: hp(3) }} onPress={() => { navigation.goBack() === undefined ? navigation.reset({ index: 0, routes: [{ name: 'BottomTabNavigator' }] }) : setbottomSheetRef(false); navigation.goBack() }}>
                  <Image style={{ height: hp(3), width: hp(3), }} resizeMode='contain' source={Images.white_back} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { channel.data.member_count < 3 ? navigation.replace('MemberProfile', { USERID: memberImages[0].user_id }) : null, setShowAll(false) }} style={{ width: wp(77) - hp(4) }}>
                  <Text style={{ color: AppColors.WHITE, fontSize: hp(2.5), fontWeight: 'bold', paddingLeft: wp(4), }}>{CHANNEL_NAME != '' ? CHANNEL_NAME : channel.data.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setbottomSheetRef(false); navigation.push('SearchView', { 'channel': channel }) }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
                  <Image resizeMode='contain' style={{ alignSelf: 'center', height: hp(2.5), width: hp(2.5) }} source={Images.search_white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowPopup(true) }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
                  <Image resizeMode='contain' style={{ alignSelf: 'center' }} source={Images.whiteDots} />
                </TouchableOpacity>
              </ >
            }
          </View>
          <ScrollView keyboardShouldPersistTaps={'always'} style={{ height: hp(100), }} contentContainerStyle={{ flexGrow: 1, }}>
            <MainClassView />
            <View style={{ backgroundColor: AppColors.WHITE }}>
              <View style={[AllGroupStyles.searchViewContainer, { marginTop: hp(1) }]}>
                <Image resizeMode="contain" source={Images.search} style={AllGroupStyles.searchIcon} />
                <TextInput returnKeyType='search' onFocus={() => { setbottomSheetRef(false); navigation.push('SearchView', { 'channel': channel }), setWantToSearch(false); setTextToSearch('') }} defaultValue={wantToSearch ? null : textToSearch} onChangeText={(text) => { wantToSearch ? null : setTextToSearch(text) }} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={AllGroupStyles.searchTextinput} />
                {textToSearch ?
                  <TouchableOpacity onPress={() => { setTextToSearch(''); setSearchedData({}); setChannel(channel); }}>
                    <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
                  </TouchableOpacity>
                  : null}
              </View>
            </View>
            {
              sharedImages.length > 0 ?
                textToSearch.length > 0 ? null :
                  <View style={GroupStyles.sharedImages}>
                    <View style={GroupStyles.midLineContainer}>
                      <Text style={GroupStyles.midText1}>Gallery</Text>
                      <TouchableOpacity style={{ width: hp(10) }} onPress={() => { navigation.push('GridGallery', { 'title': CHANNEL_NAME != '' ? CHANNEL_NAME : channel.data.name, 'sharedImages': sharedImages }) }} >
                        <Text style={GroupStyles.midText2}>See All</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      style={Styles.newMessageContainer}
                      horizontal={true}
                      data={[...sharedImages]}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) =>
                        <TouchableOpacity onPress={() => { setSelectedItem(item); setZoomImage(true) }}>
                          <Image resizeMode='cover' style={{ height: wp(38), width: wp(38), alignSelf: 'center', marginLeft: wp(5) }} source={{ uri: item.image }} />
                        </TouchableOpacity>
                      } />
                  </View>
                : null}
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { setbottomSheetRef(true); setWantToSearch(false) }}>
              <Image resizeMode='cover' style={[Styles.dropDown, { marginTop: -hp(4) }]} source={!bottomSheetRef ? Images.up : Images.down} />
            </TouchableOpacity>
            {!bottomSheetRef ?
              <TouchableOpacity onPress={() => { setbottomSheetRef(true); setWantToSearch(false) }} style={{ height: hp(80) }} >
                {/* <View style={{ backgroundColor: AppColors.SEARCH_COLOR, height: textToSearch.length > 0 ? hp(50) : hp(80), paddingBottom: Platform.OS === 'ios' ? hp(10) : hp(4) }}> */}
                <Chat client={chatClient} style={chatStyles} i18nInstance={new Streami18n({
                  language: 'en',
                })}>
                  <Channel keyboardVerticalOffset={Platform.OS === 'ios' ? hp(20) : hp(4.5)} channel={channel} >
                    <MessageList
                      additionalFlatListProps={{ scrollEnabled: false, contentContainerStyle: { opacity: 0.4, backgroundColor: 'white' } }}

                      // TypingIndicator={() => {
                      //   let arr = channel.state.typing;
                      //   const result = Object.keys(arr).map((key) => arr[key]);
                      //   let myId = getClient().user.id;
                      //   let userId = result.length > 0 ? result[0].user.id : 0
                      //   return (
                      //     myId === userId ? null
                      //       :
                      //       <View style={Styles.typingView}>
                      //         <View style={Styles.typingImgView} >
                      //           {result.length > 0 && result[0].user.image === null ?
                      //             <Text style={{ color: 'white' }}>{result[0].user.name.charAt(0).toUpperCase()}</Text> :
                      //             <Image resizeMode='cover' source={{ uri: result.length > 0 ? IMAGE_URL + result[0].user.image : '' }} style={Styles.imgView} />}
                      //         </View>
                      //         <Text style={Styles.typingName}>{result.length > 0 ? result[0].user.name : ''}<Text style={{ fontWeight: '200' }}> is typing...</Text></Text>
                      //       </View>
                      //   )
                      // }}

                      Message={props => (
                        <MessagesMark
                          hideView
                          setbottomSheetRef={setbottomSheetRef}
                          setWantToSearch={setWantToSearch}
                          setShowPinned={setShowPinned}
                          textToSearch={textToSearch}
                          ownMessage={props.isMyMessage(props.message)}
                          {...props}
                        />
                      )}
                      onThreadSelect={(thread) => { setbottomSheetRef(true); setWantToSearch(false) }}
                    />
                    {/* <MessageInput
                      compressImageQuality={0.7}
                      additionalTextInputProps={{
                        placeholderTextColor: 'grey',
                        placeholder:
                          channel && channel.data.name
                            ? 'Send Message...'
                            : 'Message',
                      }}
                      Input={(props) =>
                        <InputBox props={props} open={open} settoTrue={() => setOpen(true)} setOpen={() => { setOpen(false) }} />} /> */}
                  </Channel>
                </Chat>
                {/* </View> */}
              </TouchableOpacity>
              : null}
            <FavouriteView />
            <AllParticipant />
          </ScrollView>
        </ >
        :
        <MainClassView />
      }
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
          <View style={{ height: hp(100), flex: 1, width: wp(100), backgroundColor: AppColors.WHITE, }}>
            <HeaderView title={CHANNEL_NAME != '' ? CHANNEL_NAME : channel.data.name} onLeftClick={() => { setSelectedItem({}); setZoomImage(false) }} />
            <ImageViewer enableSwipeDown={true} onSwipeDown={() => { setSelectedItem({}); setZoomImage(false); }} imageUrls={[{ url: selectedItem.image }]} />
          </View>
        </Modal>
        : null}
      <Modal
        animationType="none"
        visible={bottomSheetRef} //showPopup
        transparent={true}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          height: hp(100),
          backgroundColor: 'red',
          width: wp(100)
        }}>
        {chatLoad ? <Spinner /> : null}
        <View style={{
          top: 0, position: 'absolute', zIndex: 100, paddingTop: Platform.OS === 'android' ? hp(2) : isiPhoneX() ? hp(4) : hp(3), alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'row', width: wp(100), height: Platform.OS === 'android' ? hp(8) : hp(10), backgroundColor: 'transparent'
        }}>
          {wantToSearch ? <View style={[AllGroupStyles.searchViewContainer, { width: wp(94), marginTop: isiPhoneX() ? -hp(0.8) : -hp(3), height: hp(6), marginBottom: 0, backgroundColor: AppColors.APP_THEME }]}>
            <Image resizeMode="contain" source={Images.search} style={AllGroupStyles.searchIcon} />
            <TextInput returnKeyType='search' value={textToSearch} onChangeText={(text) => searchTextMessages(text)} placeholderTextColor={AppColors.WHITE} placeholder="Search Chat" style={[AllGroupStyles.searchTextinput, { color: AppColors.WHITE }]} />
            <TouchableOpacity onPress={() => { setTextToSearch(''); setSearchedData({}); setChannel(channel); setWantToSearch(false) }}>
              <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
            </TouchableOpacity>
          </View>
            :
            <>
              <ImageBackground style={{
                top: 0, position: 'absolute', zIndex: 100, paddingTop: Platform.OS === 'android' ? hp(2) : isiPhoneX() ? hp(4) : hp(3), alignSelf: 'center',
                justifyContent: 'center',
                flexDirection: 'row', width: wp(100), height: Platform.OS === 'android' ? hp(8) : hp(10), backgroundColor: AppColors.LIGHTGREEN
              }} source={{ uri: CHANNEL_IMAGE ? IMAGE_URL + CHANNEL_IMAGE : channel.data.image }} resizeMode='cover' >
                <TouchableOpacity style={{ height: hp(4), width: hp(4), }} onPress={() => { navigation.goBack() === undefined ? navigation.reset({ index: 0, routes: [{ name: 'BottomTabNavigator' }] }) : setbottomSheetRef(false); navigation.goBack(); setWantToSearch(false) }}>
                  <Image style={{ height: hp(3), width: hp(3), }} resizeMode='contain' source={Images.white_back} />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: wp(77) - hp(4) }}>
                  <Text style={{ color: AppColors.WHITE, fontSize: hp(2.5), fontWeight: 'bold', paddingLeft: wp(4), }}>{CHANNEL_NAME != '' ? CHANNEL_NAME : channel.data.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setbottomSheetRef(false); navigation.push('SearchView', { 'channel': channel }) }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
                  <Image resizeMode='contain' style={{ alignSelf: 'center', height: hp(2.5), width: hp(2.5) }} source={Images.search_white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setbottomSheetRef(false); setWantToSearch(false); setShowPopup(true) }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
                  <Image resizeMode='contain' style={{ alignSelf: 'center' }} source={Images.whiteDots} />
                </TouchableOpacity>
              </ImageBackground>
            </ >
          }
        </View>
        <TouchableOpacity style={{ alignItems: 'center', height: hp(5.5), width: hp(9.5), zIndex: 1000, position: 'absolute', top: Platform.OS === 'android' ? hp(5.5) : isiPhoneX() ? hp(7.5) : hp(7.5), alignSelf: 'center' }} onPress={() => { setTextToSearch(''), setbottomSheetRef(false); setWantToSearch(false) }}>
            <Image resizeMode='cover' style={[Styles.dropDown, { height: hp(5.5), width: hp(5.5), }]} source={!bottomSheetRef ? Images.up : Images.down} />
          </TouchableOpacity>
        <PopUpView />
      </Modal>
    </SafeAreaView >
  )
});

const PopListView = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={Styles.popListContainer}>
      <View style={{ marginRight: hp(5) }} >
        <Image source={props.image} resizeMode="contain" style={[{ height: hp(3), width: hp(3) }]} ></Image>
      </View>
      <Text style={Styles.popListIcons} >{props.listName}</Text>
    </TouchableOpacity>
  )
}

export default ChatMessage;
