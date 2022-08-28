import React, { useContext, useEffect, useState, useRef } from 'react';
import { LogBox, Platform, Animated, SafeAreaView, View, Image, ScrollView, Dimensions, FlatList, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { StreamChat } from 'stream-chat';
import { useHeaderHeight } from '@react-navigation/stack';
import { ChatContext } from '../../navigation/TabNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import Styles, { AllGroupStyles, GroupStyles } from './Styles';
import { Channel, Chat, MessageInput, MessageList, MessageSimple, Streami18n, SendButton } from 'stream-chat-react-native';
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
import moment from 'moment';

const ChatMessage = React.memo(({ navigation, route }) => {
  const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
  const headerHeight = useHeaderHeight();
  const { channel, setChannel } = useContext(ChatContext);
  const [initialValue, setInitialValue] = useState('');
  const [userId, setUserId] = useState('');
  const [showGroupView, setShowGroupView] = useState(false);
  const [memberImages, setMemberImages] = useState([]);
  const [sharedImages, setSharedImages] = useState([]);
  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [favouritActive, setfavouritActive] = useState(false);
  const [chatLoad, setChatLoad] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [threadSheet, setThreadSheet] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [zoomImage, setZoomImage] = useState(false);
  const [bottomSheetRef, setbottomSheetRef] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState([]);
  const [textToSearch, setTextToSearch] = React.useState('');
  const [searchedData, setSearchedData] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowGroupView(false);
      setbottomSheetRef(true);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => {
      setChatLoad(false)
    }, 1500);
    let sharedImages = [];
    if (channel.state.messages.length > 0) {
      channel.state.messages.map((res) => {
        if (res.attachments.length > 0) {
          res.attachments.map((response) => {
            let item = {
              created_at: res.created_at,
              image: response.image_url
            }
            sharedImages.push(item);
          })
        }
      })
      const sortedArray = sharedImages.sort((a, b) => a.created_at < b.created_at);
      setSharedImages([...sortedArray]);
    }
  }, []);

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
    setMemberImages(result);
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
        <MessageList
          Message={props => (
            chatLoad ? null : <MessagesMark
              ownMessage={props.isMyMessage(props.message)}
              {...props}
            />

          )}
          onThreadSelect={(thread) => {
            setSelectedMessage(thread);
            // threadSheet.current.open();
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
            // <View marginBottom={hp(2)}>
            <InputBox props={props} open={open} settoTrue={() => setOpen(true)} setOpen={() => { setOpen(false) }} />
            // </View>
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
              {Platform.OS === 'ios' ? <Channel keyboardVerticalOffset={-hp(7)} client={chatClient} channel={channel} thread={selectedMessage}>
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
        let data = {
          data: formdata,
          token: myToken
        }
        Actions.Favourite(data)
          .then((response) => {
            setLoading(false);
            if (response.data.status === 'success') {
              setLoading(false);

              if (favouritActive) {
                SimpleToast.showWithGravity(channel.id + ' Removed from Favorite', SimpleToast.SHORT, SimpleToast.CENTER)
                setfavouritActive(!favouritActive);
              } else {
                SimpleToast.showWithGravity(channel.id + ' Marked as Favorite', SimpleToast.SHORT, SimpleToast.CENTER)
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
    AsyncStorage.getItem(CONSTANTS.REFRESH_TOKEN).then((myToken) => {
      if (myToken !== null) {
        let data = {
          token: myToken
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


  const FavouriteView = () => {
    return (
      <Modal
        animationType="slide"
        // contentContainerStyle={{backgroundColor:'red',flex:1}}
        visible={showPopup} //showPopup
        transparent={true} >
        <TouchableOpacity onPress={() => { setShowPopup(false) }} style={{ height: hp(100), width: wp(100), backgroundColor: 'rgba(56,56,56,0.6)', justifyContent: 'center', alignSelf: 'center', }}  >
          <View style={Styles.popModalInnerView} >
            {loading ? <Spinner /> : null}
            <View style={[Styles.popModalHeader, { marginTop: hp(2) }]}>
              <Text style={[Styles.popModalHeaderText]} >Favorite this Chat</Text>
              <TouchableOpacity onPress={() => { markAsFavourite() }} >
                <Image source={favouritActive ? Images.heart : Images.heart_off} resizeMode="contain" style={Styles.favIconStyle} ></Image>
              </TouchableOpacity>
            </View>
            <View style={[Styles.popModalHeader, { height: hp(4.5), }]}>
              <Text style={[Styles.popModalHeaderText, { color: AppColors.INPUT }]} >Mute Notifications</Text>
              <TouchableOpacity onPress={() => setShowPopup(!showPopup)}>
                <Image source={showPopup ? Images.Switchon : Images.Switchoff} resizeMode="contain" style={Styles.switchIconStyle} ></Image>
              </TouchableOpacity>
            </View>
            <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.push('ChatDescription', { 'title': 'Website Links' }) }} link listName='Website Links' image={Images.link} />
            <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.push('ChatDescription', { 'title': 'Tags' }) }} listName='Tags' image={Images.tag} />
            <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.push('ChatDescription', { 'title': 'Popular' }) }} listName='Popular Message' image={Images.favorite} />
            <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.push('ChatDescription', { 'title': 'Pinned' }) }} listName='Pinned Message' image={Images.pin} />
            {/* <PopListView onPress={() => { getCount()}} listName='Pinned Message' image={Images.pin} /> */}

            <PopListView onPress={() => { setChannel(channel), setShowPopup(false), navigation.push('Events') }} listName='Calendar' image={Images.calender} />
            <PopListView onPress={() => alert('Share Group')} listName='Share Group' image={Images.share} />
            <TouchableOpacity onPress={() => leaveGroup()} style={Styles.popupbottomView} >
              <Text style={Styles.bottombuttonText} >Leave Group</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  const ListOfChannels = () => {
    return (
      <>
        {/* <HeaderView style={{ top:Platform.OS==='ios' ?0: -hp(3.5) }} right white onRightClick={() => { setShowPopup(true) }} rightSrc={Images.whiteDots} onLeftClick={() => { navigation.goBack() }} title={channel.data.name} /> */}
        <TouchableOpacity style={{ alignItems: 'center', zIndex: 100, position: 'absolute', top: Platform.OS === 'android' ? -hp(1.5) : isiPhoneX() ? -hp(1.5) : -hp(1.5), alignSelf: 'center' }} onPress={() => { setbottomSheetRef(false) }}>
          <Image resizeMode='cover' style={[Styles.dropDown, { height: hp(5.5), width: hp(5.5) }]} source={bottomSheetRef ? Images.up : Images.down} />
        </TouchableOpacity>
        <SafeAreaView marginTop={Platform.OS === 'android' ? 0 : isiPhoneX() ? hp(1) : hp(1)} flex={1}  >
          <Chat client={chatClient} style={chatStyles} i18nInstance={new Streami18n({
            language: 'en',
          })}>
            <Channel channel={channel} >
              <MyChannel />
            </Channel>
          </Chat>
        </SafeAreaView>
      </ >
    )
  }

  const MainClassView = () => {
    return (
      <View>
        <ImageBackground style={{
          top: 0, position: 'absolute', zIndex: 100, paddingTop: Platform.OS === 'android' ? hp(2) : isiPhoneX() ? hp(4) : hp(3), alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'row', width: wp(100), height: Platform.OS === 'android' ? hp(20) : hp(22), backgroundColor: AppColors.LIGHTGREEN
        }} source={{ uri: channel.data.image }} resizeMode='cover'>
          {!bottomSheetRef ? null :
            <View style={{ flexDirection: 'row' }} >
              <TouchableOpacity style={{ height: hp(3), width: hp(3), }} onPress={() => { navigation.goBack() }}>
                <Image style={{ height: hp(3), width: hp(3), }} resizeMode='contain' source={Images.white_back} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: wp(77) - hp(4) }}>
                <Text style={{ color: AppColors.WHITE, fontSize: hp(2.5), fontWeight: 'bold', paddingLeft: wp(4), }}>{channel.data.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { alert('search') }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
                <Image resizeMode='contain' style={{ alignSelf: 'center', height: hp(2.5), width: hp(2.5) }} source={Images.search_white} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setShowPopup(true) }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
                <Image resizeMode='contain' style={{ alignSelf: 'center' }} source={Images.whiteDots} />
              </TouchableOpacity>
            </View>
          }
        </ImageBackground>

        {/* <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == "ios" ? "padding" : null} > */}
        <View style={{ flex: 1 }}>
          <FavouriteView />
          <View paddingVertical={hp(2)} marginTop={Platform.OS === 'android' ? hp(19.5) : isiPhoneX() ? hp(22) : hp(19)} backgroundColor={AppColors.WHITE} width={wp(100)}>
            <Button title='More' style={{ width: wp(90), height: hp(6), alignSelf: 'center', borderRadius: 8 }} continue={() => { setShowPopup(true) }} /></View>

          <View style={{ backgroundColor: AppColors.WHITE, width: wp(100), marginTop: hp(1.5), }}>
            <Text style={Styles.partTextStyle}>Participants</Text>
            <View style={{ width: wp(92), alignItems: 'flex-start', marginBottom: hp(2), alignSelf: 'center', }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                // contentContainerStyle={{ alignItems: 'center', paddingBottom: hp(2) }}
                style={Styles.newMessageContainer}
                horizontal={true}
                data={[...memberImages]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                  index === 3 ?
                    <View style={{ height: hp(4.5), width: hp(4.5), margin: 5, justifyContent: 'center', alignItems: 'center', borderColor: 'transparent', borderRadius: 50, backgroundColor: AppColors.APP_THEME }}>
                      <Text style={{ color: 'white' }}>{memberImages.length - 4}+</Text>
                    </View>
                    :
                    index <= 3 ?
                      <View style={{ height: hp(4.5), width: hp(4.5), margin: 5, justifyContent: 'center', alignItems: 'center', borderColor: 'transparent', borderRadius: 50, backgroundColor: AppColors.APP_THEME }}>
                        {item.user.image === null ?
                          <Text style={{ color: 'white' }}>{item.user.name.charAt(0).toUpperCase()}</Text> :
                          <Image resizeMode='cover' source={{ uri: IMAGE_URL + item.user.image }} style={{ height: hp(4.5), alignSelf: 'center', width: hp(4.5), borderColor: 'transparent', borderRadius: 50, }} />}
                      </View>
                      : null
                }
              />
            </View>
            <TouchableOpacity style={GroupStyles.adminChangeView} onPress={() => { setShowGroupView(false), navigation.push('InvitePerson', { 'fromChat': true, 'channel': channel }) }}>
              <TouchableOpacity onPress={() => { setShowGroupView(false), navigation.push('InvitePerson', { 'fromChat': true, 'channel': channel }) }}>
                <Image resizeMode='cover' source={Images.greenAdd} style={[GroupStyles.addImg, { marginBottom: 0 }]} />
              </TouchableOpacity>
              <Text style={[GroupStyles.addText, { marginLeft: wp(5), }]}>Add Participant</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={AllGroupStyles.searchViewContainer}>
          <Image resizeMode="contain" source={Images.search} style={AllGroupStyles.searchIcon} />
          <TextInput returnKeyType='search' value={textToSearch} onChangeText={(text) => setTextToSearch(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={AllGroupStyles.searchTextinput} />
          {textToSearch ?
            <TouchableOpacity onPress={() => { setTextToSearch(''); setSearchedData([]) }}>
              <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
            </TouchableOpacity>
            : null}
        </View>

        {
          sharedImages.length > 0 ?
            <View style={GroupStyles.sharedImages}>
              <View style={GroupStyles.midLineContainer}>
                <Text style={GroupStyles.midText1}>Gallery</Text>
                <TouchableOpacity style={{ width: hp(10) }} onPress={() => { navigation.push('GridGallery', { 'title': channel.data.name, 'sharedImages': sharedImages }) }} >
                  <Text style={GroupStyles.midText2}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                // contentContainerStyle={{ alignItems: 'center', paddingBottom: hp(2) }}
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
        <TouchableOpacity style={{ alignItems: 'center', }} onPress={() => { setbottomSheetRef(true) }}>
          <Image resizeMode='cover' style={[Styles.dropDown, { marginTop: -hp(4) }]} source={bottomSheetRef ? Images.up : Images.down} />
        </TouchableOpacity>
        {/* </KeyboardAvoidingView> */}
        {!bottomSheetRef ?
          <View style={{ backgroundColor: AppColors.SEARCH_COLOR, height: hp(80), paddingBottom: hp(10) }}>
            <Chat client={chatClient} style={chatStyles} i18nInstance={new Streami18n({
              language: 'en',
            })}>
              <Channel keyboardVerticalOffset={Platform.OS === 'ios' ? hp(20) : hp(4.5)} channel={channel} >
                <MessageList
                  Message={props => (
                    <MessagesMark
                      ownMessage={props.isMyMessage(props.message)}
                      {...props}
                    />
                  )}
                  onThreadSelect={(thread) => {
                    setSelectedMessage(thread);
                    setThreadSheet(true);
                  }}
                />
                {/* </ScrollView> */}
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

                  } />
              </Channel>
            </Chat>

          </View>
          // </ScrollView>
          : null}

        {/* </KeyboardAvoidingView> */}
      </View>
      // {/* </View> */}
    )
  }

  const PopUpView = () => {
    return (
      <>
        {Platform.OS === 'android' ?
          //  <View  height={hp(80)} backgroundColor={AppColors.SEARCH_COLOR} flex={1}> 
          <View style={{ backgroundColor: AppColors.SEARCH_COLOR, bottom: 0, position: 'absolute', height: hp(93) }}>
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


  const scrollEvent = (event) => {
    {/* if(event.nativeEvent.contentOffset.y > hp(40)) {
     alert('Hoi')
   }
 console.log(event.nativeEvent.contentOffset.y) */}
  }



  // alert(bottomSheetRef)
  return (
    <SafeAreaView style={{ top: 0, position: 'absolute', flex: 1, marginTop: Platform.OS === 'android' ? 0 : -hp(5) }}>
      {/* {!bottomSheetRef ? */}

      {!bottomSheetRef ?
        <>
          <View style={{
            top: 0, position: 'absolute', zIndex: 100, paddingTop: Platform.OS === 'android' ? hp(1.7) : isiPhoneX() ? hp(9) : hp(1.7), alignSelf: 'center',
            justifyContent: 'center',
            flexDirection: 'row', width: wp(100), height: Platform.OS === 'android' ? hp(25) : hp(20), backgroundColor: 'transparent'
          }}>
            <TouchableOpacity style={{ height: hp(3), width: hp(3) }} onPress={() => { navigation.goBack() }}>
              <Image style={{ height: hp(3), width: hp(3), }} resizeMode='contain' source={Images.white_back} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: wp(77) - hp(4) }}>
              <Text style={{ color: AppColors.WHITE, fontSize: hp(2.5), fontWeight: 'bold', paddingLeft: wp(4), }}>{channel.data.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { alert('search') }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
              <Image resizeMode='contain' style={{ alignSelf: 'center', height: hp(2.5), width: hp(2.5) }} source={Images.search_white} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setShowPopup(true) }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
              <Image resizeMode='contain' style={{ alignSelf: 'center' }} source={Images.whiteDots} />
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps={'always'} onScroll={scrollEvent} style={{ height: hp(100), }} contentContainerStyle={{ flexGrow: 1, }}>
            <MainClassView />
            <FavouriteView />
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
            <HeaderView title={channel.data.name} onLeftClick={() => { setSelectedItem({}); setZoomImage(false) }} />
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
          // marginBottom:hp(2),
          // backgroundColor: AppColors.SEARCH_COLOR,
          // backgroundColor:'red',
          width: wp(100)
        }}>
        {chatLoad ? <Spinner /> : null}
        {/* {Platform.OS === 'ios' ?
              <TouchableOpacity flexDirection='row' height={hp(20)} backgroundColor='transparent'>
                <Text onPress={() => { setbottomSheetRef(false); navigation.goBack() }} style={{
                  paddingTop: Platform.OS === 'android' ? hp(2) : isiPhoneX() ? hp(9) : hp(3),
                  width: wp(15), height: hp(5), backgroundColor: 'transparent'
                }} />
                <Text onPress={() => { alert('search') }} style={{
                  right: wp(13), position: 'absolute', paddingTop: Platform.OS === 'android' ? hp(2) : isiPhoneX() ? hp(9) : hp(3),
                  width: wp(8), height: hp(5), backgroundColor: 'transparent'
                }} />
                <Text onPress={() => {
                  setTimeout(() => {
                    setShowPopup(true)
                  }, 500); setbottomSheetRef(false);
                }} style={{
                  right: 0, position: 'absolute', paddingTop: Platform.OS === 'android' ? hp(2) : isiPhoneX() ? hp(9) : hp(3),
                  width: wp(10), height: hp(5), backgroundColor: 'transparent'
                }} />
              </TouchableOpacity>
              : */}
        <View style={{
          top: 0, position: 'absolute', zIndex: 100, paddingTop: Platform.OS === 'android' ? hp(2) : isiPhoneX() ? hp(4) : hp(3), alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'row', width: wp(100), height: Platform.OS === 'android' ? hp(8) : hp(10), backgroundColor: 'transparent'
        }}>

          {/* <TouchableOpacity style={{ height: hp(3), width: hp(3) }} onPress={() => { navigation.goBack() }}>
                  <Image style={{ height: hp(3), width: hp(3), }} resizeMode='contain' source={Images.white_back} />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: wp(77) - hp(4) }}>
                  <Text style={{ color: AppColors.WHITE, fontSize: hp(2.5), fontWeight: 'bold', paddingLeft: wp(4), }}>{channel.data.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { alert('search') }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
                  <Image resizeMode='contain' style={{ alignSelf: 'center', height: hp(2.5), width: hp(2.5) }} source={Images.search_white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowPopup(true) }} style={{ height: hp(4), width: hp(4), justifyContent: 'center', }} >
                  <Image resizeMode='contain' style={{ alignSelf: 'center' }} source={Images.whiteDots} />
                </TouchableOpacity> */}


          <View style={[AllGroupStyles.searchViewContainer, { marginTop: 0, height: hp(6) }]}>
            <Image resizeMode="contain" source={Images.search} style={AllGroupStyles.searchIcon} />
            <TextInput returnKeyType='search' value={textToSearch} onChangeText={(text) => setTextToSearch(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={AllGroupStyles.searchTextinput} />
            {textToSearch ?
              <TouchableOpacity onPress={() => { setTextToSearch(''); setSearchedData([]) }}>
                <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
              </TouchableOpacity>
              : null}
          </View>


        </View>
        <PopUpView />
        <FavouriteView />
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
