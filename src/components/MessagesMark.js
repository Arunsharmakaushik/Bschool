import React, { useRef, useState, useContext, useEffect } from 'react';
import { MessageSimple } from 'stream-chat-react-native';
import { View, Text, Image, Modal, FlatList, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppColors from '../utils/AppColors';
import { MessageFooter } from './MessageFooter';
import moment from 'moment';
import { EVENT_IMAGE_URL, IMAGE_URL, THUMBNAIL_URL } from '../webServices/EndPoints';
import RBSheet from "react-native-raw-bottom-sheet";
import Images from '../assets/Images';
import { TouchableOpacity } from 'react-native';
import { StreamChat } from 'stream-chat';
import CONSTANTS from '../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatContext } from '../navigation/TabNavigator';
import SimpleToast from 'react-native-simple-toast';
import { Channel, Chat, Thread } from 'stream-chat-react-native';
import HeaderView from './HeaderView';
import { Platform } from 'react-native';
import Fonts from '../assets/Fonts';
import { InputBox } from './InputBox';
import PersonProfile from '../screens/chats/PersonProfile';
import Clipboard from '@react-native-community/clipboard';
import { getClient, isiPhoneX } from '../utils';
import VideoPlayer from 'react-native-video-player';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from './Spinner';
import Actions from '../webServices/Action';

export const MessagesMark = ({ navigation, setShowPinned, setbottomSheetRef, setWantToSearch, hideView, textToSearch, ownMessage, ...props }) => {
  const { message, isMyMessage, groupStyles } = props;
  const refRBSheet = useRef();
  const threadSheet = useRef();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [joinedByMe, setJoinedByMe] = React.useState(0);
  const [showDelete, setShowDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = useState([]);
  const [sentAccepted, setsentAccepted] = useState(0);
  const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
  const { channel } = useContext(ChatContext);
  const [showEventDetail, setShowEventDetail] = React.useState(false);
  const [choice, setChoice] = React.useState(1);
  const [eventData, setEventData] = React.useState({});
  const [ImGoing, setIamGoing] = React.useState(false);

  const pinTheMessage = async (status) => {
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then((response) => {
      if (response !== null) {
        let data = JSON.parse(response[1][1]);
        const userTokken = response[0][1];
        const user = {
          id: String(data.id),
          name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
        };
        const setupClient = async () => {
          await chatClient.connectUser(user, userTokken)
        };
        setupClient();
        let imageAttachments = [];
        imageAttachments.push(selectedMessage.attachments.length > 0 ? { image_url: String(selectedMessage.attachments[0].image_url) } : null);
        const message = {
          id: selectedMessage.id,
          pin_expires: null,
          pinned: status ? false : true,
          pinned_by: getClient().user.id,
          attachments: imageAttachments
        }
        const message1 = {
          id: selectedMessage.id,
          pin_expires: null,
          pinned: status ? false : true,
          pinned_by: getClient().user.id,
          text: selectedMessage.text
        }
        const pinSelectedMsg = async () => {
          await chatClient.pinMessage(selectedMessage.attachments.length > 0 ? message : message1, null).then((res) => {
            if (res.message) {
              setShowPinned(true);
              SimpleToast.showWithGravity(status ? 'Message Unpinned' : 'Message Pinned', SimpleToast.SHORT, SimpleToast.CENTER)
            }
          })
        };

        const UnpinSelectedMsg = async () => {
          await chatClient.unpinMessage(selectedMessage.attachments.length > 0 ? message : message1, null).then((res) => {
            if (res.message) {
              setShowPinned(true);
              SimpleToast.showWithGravity(status ? 'Message Unpinned' : 'Message Pinned', SimpleToast.SHORT, SimpleToast.CENTER)
            }
          })
        };

        if (status === true) {
          UnpinSelectedMsg();
        }
        else {
          pinSelectedMsg();
        }
      }
    })
  }

  const deleteTheMessage = async () => {
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then(async (response) => {
      if (response !== null) {
        let data = JSON.parse(response[1][1]);
        const userTokken = response[0][1];
        const user = {
          id: String(data.id),
          name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
        };
        const setupClient = async () => {
          await chatClient.setUser(user, userTokken);
        };
        setupClient();
        await chatClient.deleteMessage(selectedMessage.id);
      }
    })
  }

  const checkPinning = () => {
    // alert(message.pinned)
    if (message.pinned === true) {
      refRBSheet.current.close();
      pinTheMessage(true)
    }
    else {
      refRBSheet.current.close();
      pinTheMessage(false)
    }
  }

  let msg = message.text.toLowerCase();
  let messageObj = {};

  if (message.text.includes('New Event Created:')) {
    var params = message.text.replace('New Event Created: ', '');
    var KeyVal = params.split(",");
    var i;
    for (i in KeyVal) {
      KeyVal[i] = KeyVal[i].split(":");
      messageObj[KeyVal[i][0]] = KeyVal[i][1];
    }
  }

  const getEventDetail = (id) => {
    if (id != undefined) {
      AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((res) => {
        if (res !== null) {
          let token = res;
          Actions.GetEventDetail(token, id)
            .then((response) => {
              if (response.data.status === 'success') {
                let data = response.data.data;
                setEventData(data);
                let myEmail = getClient().user.email;
                if (data.participants.length > 0) {
                  data.participants.map((item) => {
                    if (item.email === myEmail) {
                      // alert(JSON.stringify(item))
                      setJoinedByMe(item.is_joined === 1 && item.is_going === 0 ? 3 : item.is_going)
                    }
                  })
                }
                setLoading(false);
              }
              else {
                setLoading(false);
                SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
              }
            })
            .catch((err) => {
              if (err.response.status === 401) {
                refreshToken()
              } else {
                setLoading(false);
                SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
              }
            })
        }
      })
    }
    else {
      setLoading(false);
    }
  }

  const GoingInEvent = (id, status) => {
    setLoading(true);
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((res) => {
      if (res !== null) {
        Actions.GoingInEvent(res, id, status)
          .then((response) => {
            console.log("??????cdc " + JSON.stringify(response.data))
            if (response.data.status === 'success') {
              setLoading(false);
              getEventDetail(messageObj.id);
              setJoinedByMe(status)
            }
            else {
              setLoading(false);
              SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
            }
          })
          .catch((err) => {
            console.log('err ' + JSON.stringify(err))
            if (err.response.status === 401) {
              setLoading(false)
            } else {
              setLoading(false);
              SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
            }
          })
      }
    })
  }

  const refreshToken = () => {
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
              getEventDetail(messageObj.id);
            }
          })
          .catch((err) => {
            console.log(err.response.data)
            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
          })
      }
    })
  }

  const JoinEvent = (id) => {
    setLoading(true);
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((res) => {
      if (res !== null) {
        let formdata = new FormData();
        formdata.append("event_id", id)
        formdata.append("email_event_status", sentAccepted ? 1 : 0)
        let data = {
          token: res,
          data: formdata
        }
        Actions.JoinEvent(data)
          .then((response) => {
            console.log("??????cdc " + JSON.stringify(response.data))
            if (response.data.status === 'success') {
              getEventDetail(id);
            }
            else {
              setLoading(false);
              SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
            }
          })
          .catch((err) => {
            console.log('err ' + JSON.stringify(err))
            if (err.response.status === 401) {
              setLoading(false)
            }
            else {
              setLoading(false);
              SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
            }
          })
      }
    })
  }

  return (
    message.deleted_at ?
      null :
      (textToSearch.length > 0 && message.text.includes(textToSearch)) || textToSearch.length == 0 ?
        <TouchableOpacity onPress={() => { hideView ? setbottomSheetRef(true) : null }} >
          {/* {console.log('kk ',message)} */}
          {(groupStyles[0] === `top` || groupStyles[0] === `single` || textToSearch.length > 0) && (
            <View flexDirection='row'>
              <TouchableOpacity onPress={() => { hideView ? setbottomSheetRef(true) : setOpenDetail(true) }} style={{ height: hp(5), width: hp(5), justifyContent: 'center', alignItems: 'center', top: 2, position: 'absolute', borderColor: 'transparent', borderRadius: 50, backgroundColor: AppColors.LIGHTGREEN }}>
                {message.user.image === null ?
                  <Text style={{ color: 'white' }}>{message.user.name.charAt(0).toUpperCase()}</Text> :
                  <Image resizeMode='cover' source={{ uri: IMAGE_URL + message.user.image }} style={{ height: hp(5), alignSelf: 'center', width: hp(5), borderColor: 'transparent', borderRadius: 50, }} />}
              </TouchableOpacity>
              <Text
                onPress={() => { hideView ? setbottomSheetRef(true) : setOpenDetail(true) }}
                style={{ fontSize: hp(2), marginBottom: hp(1), fontFamily: Fonts.APP_SEMIBOLD_FONT, color: AppColors.LIGHTGREEN, textAlign: `left`, left: wp(13), }}>
                {message.user.name}
                <Text style={{ color: AppColors.LIGHT, fontSize: hp(1.5), fontFamily: Fonts.APP_MEDIUM_FONT, }}> {moment(message.created_at).format('hh:mm A')}</Text>
              </Text>
            </View>
          )}

          {message.text.includes('New Event Created:')
            ?
            <View style={{ padding: 20, marginBottom: hp(2), marginLeft: wp(12), backgroundColor: 'rgba(128,128,128,0.2)', width: wp(80), overflow: 'hidden', borderColor: 'transparent', borderWidth: 1, borderRadius: 5 }} >
              <View style={{ borderWidth: 2, borderColor: AppColors.LIGHTGREEN, borderTopWidth: 10, borderTopColor: AppColors.LIGHTGREEN, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: hp(8), width: hp(7) }}>
                <Text style={{ color: AppColors.LIGHTGREEN, fontSize: hp(2.7), fontFamily: Fonts.APP_REGULAR_FONT }}>{moment(messageObj.startTime).format('DD')}</Text>
                <Text style={{ color: AppColors.LIGHTGREEN, fontSize: hp(1.8), fontFamily: Fonts.APP_BOLD_FONT }}>{moment(messageObj.startTime).format('MMM')}</Text>
              </View>
              <Text numberOfLines={3} style={{ width: '100%', paddingTop: hp(2), marginBottom: hp(1), textAlign: 'center', color: AppColors.BLACK, fontSize: hp(1.8), fontFamily: Fonts.APP_SEMIBOLD_FONT }}>{messageObj.name}</Text>
              <Text numberOfLines={3} style={{ width: '100%', marginBottom: hp(1), textAlign: 'center', color: AppColors.GREY_TEXT, fontSize: hp(1.8), fontFamily: Fonts.APP_SEMIBOLD_FONT }}>{messageObj.detail}</Text>
              <TouchableOpacity onPress={() => { hideView ? setbottomSheetRef(true) : getEventDetail(messageObj.id); setLoading(true); setShowEventDetail(true) }} style={{ marginTop: hp(1), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: hp(15), height: hp(5), borderColor: AppColors.LIGHTGREEN, borderWidth: 2 }}>
                <Text style={{ color: AppColors.LIGHTGREEN, fontSize: hp(1.8), fontFamily: Fonts.APP_BOLD_FONT }}>View Event</Text>
              </TouchableOpacity>
            </View>
            :
            message.attachments.length > 0 && message.attachments[0].mime_type && message.attachments[0].mime_type === 'video/mp4'
              ?
              <MessageSimple
                {...props}
                onPress={() => { hideView ? setbottomSheetRef(true) : null }}
                onLongPress={(message, e) => {
                  if (getClient().user.id === message.user.id) {
                    setShowDelete(true);
                    setSelectedMessage(message)
                    refRBSheet.current.open();
                  } else {
                    setSelectedMessage(message)
                    refRBSheet.current.open();
                  }
                }}
                MessageFooter={hideView ? null : MessageFooter}
                forceAlign="left"
                ReactionList={null}
                FileAttachment={() => {
                  return (
                    <VideoThumbnail hideView={hideView ? 1 : 0} setbottomSheetRef={setbottomSheetRef} message={message} uri={message.attachments[0].asset_url} />
                  )
                }}
                style={{
                  message: {
                    content: {
                      textContainer: {
                        css: {
                          backgroundColor: ownMessage
                            ? AppColors.GREY_TEXT
                            : AppColors.APP_THEME,
                        },
                      },
                      markdown: {
                        text: {
                          color: ownMessage ? AppColors.WHITE : AppColors.BLACK,
                        },
                      }
                    },
                  },
                }}
              />
              :
              message.attachments.length > 0 && message.attachments[0].type === 'video'
                ?
                <MessageSimple
                  {...props}
                  onPress={() => { hideView ? setbottomSheetRef(true) : null }}
                  onLongPress={(message, e) => {
                    if (getClient().user.id === message.user.id) {
                      setShowDelete(true);
                      setSelectedMessage(message)
                      refRBSheet.current.open();
                    } else {
                      setSelectedMessage(message)
                      refRBSheet.current.open();
                    }
                  }}
                  MessageContent={() => {
                    return (
                      <YoutubeLinkView hideView={hideView ? 1 : 0} setbottomSheetRef={setbottomSheetRef} message={message} uri={message.attachments[0].asset_url} />
                    )
                  }}
                  showAvatar={false}
                  MessageText={null}
                  MessageFooter={hideView ? null : MessageFooter}
                  forceAlign="left"
                  ReactionList={null}
                  style={{
                    message: {
                      content: {
                        textContainer: {
                          css: {
                            backgroundColor: ownMessage
                              ? AppColors.GREY_TEXT
                              : AppColors.APP_THEME,
                          },
                        },
                        markdown: {
                          text: {
                            color: ownMessage ? AppColors.WHITE : AppColors.BLACK,
                          },
                        }
                      },
                    },
                  }}
                />
                :
                hideView ?
                  <MessageSimple
                    {...props}
                    additionalTouchableProps={{ onPress: () => hideView ? setbottomSheetRef(true) : null }}

                    onPress={() => { hideView ? setbottomSheetRef(true) : null }}
                    onLongPress={(message, e) => {
                      if (hideView) {
                        setbottomSheetRef(true)
                      }
                      else if (getClient().user.id === message.user.id) {
                        setShowDelete(true);
                        setSelectedMessage(message)
                        refRBSheet.current.open();
                      } else {
                        setSelectedMessage(message)
                        refRBSheet.current.open();
                      }
                    }}

                    canEditMessage={true}
                    MessageAvatar={() =>
                    (
                      <Text style={{ width: wp(12.5) }}></Text>
                    )}
                    MessageFooter={hideView ? null : MessageFooter}
                    forceAlign="left"
                    ReactionList={null}
                    style={{
                      message: {
                        content: {
                          textContainer: {
                            css: {
                              backgroundColor:
                                ownMessage
                                  ? AppColors.GREY_TEXT
                                  : AppColors.APP_THEME,
                            },
                          },
                          markdown: {
                            text: {
                              color: ownMessage ? AppColors.WHITE : AppColors.BLACK,
                            },
                          },
                        },
                      },
                    }}
                  />
                  :
                  <MessageSimple
                    {...props}
                    onPress={() => { hideView ? setbottomSheetRef(true) : null }}
                    onLongPress={(message, e) => {
                      if (hideView) {
                        setbottomSheetRef(true)
                      }
                      else if (getClient().user.id === message.user.id) {
                        setShowDelete(true);
                        setSelectedMessage(message)
                        refRBSheet.current.open();
                      } else {
                        setSelectedMessage(message)
                        refRBSheet.current.open();
                      }
                    }}

                    canEditMessage={true}

                    MessageAvatar={() =>
                    (
                      <Text style={{ width: wp(12.5) }}></Text>
                    )}
                    MessageFooter={hideView ? null : MessageFooter}
                    forceAlign="left"
                    ReactionList={null}
                    style={{
                      message: {
                        content: {
                          textContainer: {
                            css: {
                              backgroundColor:
                                ownMessage
                                  ? AppColors.GREY_TEXT
                                  : AppColors.APP_THEME,
                            },
                          },
                          markdown: {
                            text: {
                              color: ownMessage ? AppColors.WHITE : AppColors.BLACK,
                            },
                          },
                        },
                      },
                    }}
                  />
          }

          <RBSheet
            ref={refRBSheet}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: "center",
                height: showDelete ? hp(32) : hp(27)
              }
            }}
          >
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
              setTimeout(() => {
                props.openReactionPicker()
              }, 2000)
              refRBSheet.current.close();
            }}>
              <Image source={Images.emoji} resizeMode='contain' style={{ height: hp(2.5), paddingHorizontal: 20, width: hp(2.5), alignSelf: 'center' }} />
              <Text style={{ alignSelf: 'center', fontSize: hp(2.5), marginLeft: 10, fontFamily: Fonts.APP_REGULAR_FONT, paddingVertical: 10 }}>Add Reaction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { checkPinning() }}>
              <Image source={Images.pin} resizeMode='contain' style={{ height: hp(2.5), paddingHorizontal: 20, width: hp(2.5), alignSelf: 'center' }} />
              <Text style={{ alignSelf: 'center', fontSize: hp(2.5), paddingVertical: 10, fontFamily: Fonts.APP_REGULAR_FONT, marginLeft: 10 }}>{message.pinned === true ? 'Unpin Message' : 'Pin Message'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
              setTimeout(() => {
                threadSheet.current.open()
              }, 2000); refRBSheet.current.close();
            }}>
              <Image source={Images.user} resizeMode='contain' style={{ height: hp(2.5), paddingHorizontal: 20, width: hp(2.5), alignSelf: 'center' }} />
              <Text style={{ alignSelf: 'center', fontSize: hp(2.5), paddingVertical: 10, fontFamily: Fonts.APP_REGULAR_FONT, marginLeft: 10 }}>Reply</Text>
            </TouchableOpacity>
            {/* getClient().user.id */}
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { refRBSheet.current.close(); Clipboard.setString(selectedMessage.text); }}>
              <Image source={Images.pin} resizeMode='contain' style={{ height: hp(2.5), paddingHorizontal: 20, width: hp(2.5), alignSelf: 'center' }} />
              <Text style={{ alignSelf: 'center', fontSize: hp(2.5), paddingVertical: 10, fontFamily: Fonts.APP_REGULAR_FONT, marginLeft: 10 }}>Copy to Clipboard</Text>
            </TouchableOpacity>
            {showDelete ?
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { refRBSheet.current.close(); deleteTheMessage() }}>
                <Image source={Images.pin} resizeMode='contain' style={{ height: hp(2.5), paddingHorizontal: 20, width: hp(2.5), alignSelf: 'center' }} />
                <Text style={{ alignSelf: 'center', fontSize: hp(2.5), paddingVertical: 10, fontFamily: Fonts.APP_REGULAR_FONT, marginLeft: 10 }}>Delete Message</Text>
              </TouchableOpacity>
              : null}
          </RBSheet>
          <RBSheet
            ref={threadSheet}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: "center",
                height: hp(60),
              }
            }}
          >
            <View flex={1}>
              <Chat client={chatClient}>
                <HeaderView title={selectedMessage.text} onLeftClick={() => { threadSheet.current.close() }} />
                {Platform.OS === 'ios' ?
                  <Channel keyboardVerticalOffset={-hp(15)} client={chatClient} channel={channel} thread={selectedMessage}>
                    <View style={{ display: 'flex', height: '100%', paddingTop: 5, paddingBottom: hp(8), }}>
                      <Thread thread={selectedMessage}
                        additionalMessageListProps={{
                          TypingIndicator: () => { return null }
                        }}
                        additionalMessageInputProps={{
                          additionalTextInputProps: {
                            placeholderTextColor: '#979A9A',
                            placeholder:
                              'Send Message.....'
                          },
                        }}
                        Input={(props) =>
                          <InputBox noemoji props={props} open={open} settoTrue={() => setOpen(true)} setOpen={() => { setOpen(false) }} />
                        }
                      />

                    </View>
                  </Channel>
                  :
                  <Channel client={chatClient} channel={channel} thread={selectedMessage}>
                    <View style={{ display: 'flex', height: '100%', paddingTop: 5, paddingBottom: hp(9) }}>
                      <Thread
                        thread={selectedMessage}
                        additionalMessageListProps={{
                          TypingIndicator: () => { return null }
                        }}
                        additionalMessageInputProps={{
                          additionalTextInputProps: {
                            placeholderTextColor: '#979A9A',
                            placeholder:
                              'Send Message.....'
                          },
                        }}

                        Input={(props) =>
                          <InputBox noemoji props={props} open={open} settoTrue={() => setOpen(true)} setOpen={() => { setOpen(false) }} />
                        }
                      />
                    </View>
                  </Channel>
                }
              </Chat>
            </View>
          </RBSheet>

          <Modal animationType="slide"
            style={{ flex: 1 }}
            contentContainerStyle={{ backgroundColor: AppColors.SEARCH_COLOR, flexGrow: 1 }}
            visible={openDetail} //showPopup
            transparent={true}>
            <View backgroundColor={AppColors.WHITE} style={{ backgroundColor: 'pink' }} flex={1}>
              <PersonProfile navigation={navigation} message={message} userId={message.user.id} goBack={() => setOpenDetail(false)} />
            </View>
          </Modal>

          <Modal animationType="slide"
            style={{ flex: 1 }}
            contentContainerStyle={{ backgroundColor: AppColors.SEARCH_COLOR, flexGrow: 1 }}
            visible={showEventDetail} //showPopup
            transparent={true} >
            <View flex={1}>
              <View style={{ height: Platform.OS == 'ios' ? hp(10) : hp(8), paddingTop: isiPhoneX() ? hp(4) : hp(2), width: wp(100), backgroundColor: AppColors.APP_THEME, justifyContent: 'center', }}><Text style={{ paddingHorizontal: wp(5), color: AppColors.WHITE, fontSize: hp(2.2), fontFamily: Fonts.APP_REGULAR_FONT }} onPress={() => { setShowEventDetail(false) }}>Close</Text></View>
              <ScrollView backgroundColor={AppColors.WHITE} flex={1} contentContainerStyle={{ flexGrow: 1, backgroundColor: AppColors.LIGHT_GREY }}>
                {loading ? <Spinner /> : null}
                {eventData.id
                  ?
                  <>
                    <View style={{ marginTop: hp(2), padding: 20, marginBottom: hp(2), alignSelf: 'center', backgroundColor: 'rgba(128,128,128,0.2)', width: wp(90), overflow: 'hidden', borderColor: 'transparent', borderWidth: 1, borderRadius: 5 }} >
                      <View style={{ borderWidth: 2, borderColor: AppColors.LIGHTGREEN, borderTopWidth: 10, borderTopColor: AppColors.LIGHTGREEN, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: hp(8), width: hp(7) }}>
                        <Text style={{ color: AppColors.LIGHTGREEN, fontSize: hp(2.7), fontFamily: Fonts.APP_REGULAR_FONT }}>{moment(eventData.start_datetime).format('DD')}</Text>
                        <Text style={{ color: AppColors.LIGHTGREEN, fontSize: hp(1.8), fontFamily: Fonts.APP_BOLD_FONT }}>{moment(eventData.start_datetime).format('MMM')}</Text>
                      </View>
                      <Text numberOfLines={3} style={{ width: '100%', paddingTop: hp(2), marginBottom: hp(1), textAlign: 'center', color: AppColors.BLACK, fontSize: hp(1.8), fontFamily: Fonts.APP_SEMIBOLD_FONT }}>{eventData.title}</Text>
                      <Text numberOfLines={3} style={{ width: '100%', marginBottom: hp(1), textAlign: 'center', color: AppColors.GREY_TEXT, fontSize: hp(1.6), fontFamily: Fonts.APP_SEMIBOLD_FONT }}>Created by {message.user.name}</Text>
                    </View>
                    <View style={{ marginTop: hp(2), padding: 20, marginBottom: hp(2), alignSelf: 'center', backgroundColor: AppColors.WHITE, width: wp(90), overflow: 'hidden', borderColor: 'rgba(128,128,128,0.2)', borderWidth: 1, borderRadius: 5 }} >
                      <View flexDirection='row' alignItems='center' marginBottom={hp(2)}>
                        <Image resizeMode="contain" style={{ height: hp(3), width: hp(3), marginRight: wp(4) }} source={Images.timeLock} />
                        {/* {
                    alert(JSON.stringify(eventData))
                    // alert(moment(eventData.start_datetime).format('ddddd'))
                  } */}
                        <View>
                          <Text style={{ color: AppColors.BLACK, fontSize: hp(2), fontFamily: Fonts.APP_SEMIBOLD_FONT }}>{eventData.start_datetime ? moment(eventData.start_datetime).format('dddd, MMM DD') : ''}</Text>
                          <Text style={{ color: AppColors.BLACK, fontSize: hp(2), fontFamily: Fonts.APP_SEMIBOLD_FONT }}>{moment(eventData.start_datetime).format('hh:mm A')} to {moment(eventData.end_datetime).format('hh:mm A')}</Text>
                        </View>
                      </View>

                      {
                        eventData.event_status === '1' ?
                          <Text style={{ color: AppColors.LIGHTGREEN, textAlign: 'center', fontSize: hp(2), fontFamily: Fonts.APP_SEMIBOLD_FONT }}>The event has started</Text>
                          :
                          eventData.event_status === '2' ?
                            <Text style={{ color: AppColors.LIGHTGREEN, textAlign: 'center', fontSize: hp(2), fontFamily: Fonts.APP_SEMIBOLD_FONT }}>The event has ended</Text>
                            :
                            joinedByMe != 0
                              ?
                              <View flexDirection='row' alignItems='center' >
                                <Text style={{ color: AppColors.BLACK, fontSize: hp(2), fontFamily: Fonts.APP_SEMIBOLD_FONT }}>Going ?</Text>
                                <TouchableOpacity onPress={() => { GoingInEvent(messageObj.id, 1) }} style={{ marginTop: hp(1), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: hp(10), marginHorizontal: wp(3), height: hp(4), borderColor: AppColors.LIGHTGREEN, borderWidth: 1.5, backgroundColor: joinedByMe === 1 ? AppColors.LIGHTGREEN : AppColors.WHITE }}>
                                  <Text style={{ color: joinedByMe === 1 ? AppColors.WHITE : AppColors.BLACK, fontSize: hp(1.8), fontFamily: Fonts.APP_BOLD_FONT }}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { GoingInEvent(messageObj.id, 2) }} style={{ marginTop: hp(1), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: hp(10), height: hp(4), borderColor: AppColors.LIGHTGREEN, borderWidth: 1.5, backgroundColor: joinedByMe === 2 ? AppColors.LIGHTGREEN : AppColors.WHITE }}>
                                  <Text style={{ color: joinedByMe === 2 ? AppColors.WHITE : AppColors.BLACK, fontSize: hp(1.8), fontFamily: Fonts.APP_BOLD_FONT }}>No</Text>
                                </TouchableOpacity>
                              </View>
                              :
                              <>
                                <View style={[markStyles.bottomLineContainer,]}>
                                  <TouchableOpacity style={[markStyles.checkBoxImg, {
                                    borderColor: true ? AppColors.APP_THEME : AppColors.BORDER_COLOR
                                  }]}
                                    onPress={() => setsentAccepted(!sentAccepted)}>
                                    {sentAccepted ?
                                      <Image resizeMode='contain' style={markStyles.checkboxStyles} source={Images.checkbox} />
                                      : null}
                                  </TouchableOpacity>
                                  <Text numberOfLines={2} style={markStyles.bottomLine} > Send Event information to my email</Text>
                                </View>
                                <TouchableOpacity onPress={() => { JoinEvent(messageObj.id) }} style={{ marginTop: hp(1.5), backgroundColor: AppColors.LIGHTGREEN, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: hp(40), height: hp(4), borderColor: AppColors.LIGHTGREEN, borderWidth: 1.5 }}>
                                  <Text style={{ color: AppColors.WHITE, fontSize: hp(1.8), fontFamily: Fonts.APP_BOLD_FONT }}>Click to Join</Text>
                                </TouchableOpacity>
                              </ >
                      }
                    </View>
                    <Text style={{ color: AppColors.GREY_TEXT, fontSize: hp(2), fontFamily: Fonts.APP_SEMIBOLD_FONT, paddingLeft: wp(5) }}>About</Text>
                    <Image source={{ uri: EVENT_IMAGE_URL + eventData.image }} style={{ marginVertical: hp(2), height: hp(45), width: wp(90), alignSelf: 'center', backgroundColor: 'rgba(128,128,128,0.2)' }} />
                    <View flexDirection='row' justifyContent='center' alignItems='center'>
                      <TouchableOpacity onPress={() => { setChoice(1) }} style={{ justifyContent: 'center', width: wp(30), borderBottomWidth: 3, borderBottomColor: choice === 1 ? AppColors.APP_THEME : 'transparent', height: hp(7), }}>
                        <Text style={{ color: AppColors.INPUT, fontSize: hp(2.1), fontFamily: Fonts.APP_SEMIBOLD_FONT, alignSelf: 'center' }}>Going</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setChoice(2) }} style={{ justifyContent: 'center', width: wp(30), borderBottomWidth: 3, borderBottomColor: choice === 2 ? AppColors.APP_THEME : 'transparent', height: hp(7), }}>
                        <Text style={{ color: AppColors.INPUT, fontSize: hp(2.1), fontFamily: Fonts.APP_SEMIBOLD_FONT, alignSelf: 'center' }}>Not Going</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setChoice(3) }} style={{ justifyContent: 'center', width: wp(30), borderBottomWidth: 3, borderBottomColor: choice === 3 ? AppColors.APP_THEME : 'transparent', height: hp(7), }}>
                        <Text style={{ color: AppColors.INPUT, fontSize: hp(2.1), fontFamily: Fonts.APP_SEMIBOLD_FONT, alignSelf: 'center' }}>Pending</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: wp(90), alignSelf: 'center', backgroundColor: AppColors.WHITE, marginBottom: hp(2) }}>
                      {eventData.participants ?
                        <FlatList
                          data={choice === 1 ? eventData.participants.filter(x => x.is_going === 1) : choice === 2 ? eventData.participants.filter(x => x.is_going === 2) : eventData.participants.filter(x => x.is_going === 0)}
                          keyExtractonr={(index) => index.toString()}
                          renderItem={({ item }) =>
                            <TouchableOpacity style={{ width: '100%', paddingVertical: hp(2), alignItems: 'center', alignSelf: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: AppColors.GREY_TEXT_COLOR }} >
                              <Image source={{ uri: IMAGE_URL + item.profile_image }} style={{ height: hp(6), width: hp(6), marginRight: hp(3.5), borderWidth: 1, borderColor: 'transparent', borderRadius: 100 }} />
                              <Text style={{ color: AppColors.INPUT, fontSize: hp(2), fontFamily: Fonts.APP_SEMIBOLD_FONT, textAlign: 'center' }} >{item.first_name + ' ' + item.last_name}</Text>
                            </TouchableOpacity>
                          }
                        />
                        : null}
                    </View>
                  </ >
                  : null}
              </ScrollView>
            </View>
          </Modal>
        </TouchableOpacity>
        : null
  );
};

const VideoThumbnail = (props) => {
  let name = props.message.attachments[0].title;
  let thumbUrl = THUMBNAIL_URL + name.replace('mp4', 'jpg');
  return (
    props.hideView ?
      <TouchableOpacity onPress={() => { props.setbottomSheetRef(true) }} style={{ backgroundColor: AppColors.WHITE, height: wp(53), width: wp(62), overflow: 'hidden', borderColor: 'transparent', borderBottomWidth: 0, borderBottomLeftRadius: 0, borderWidth: 1, borderRadius: 20 }} >
        <VideoPlayer
          // video={{ uri: props.uri }}
          // videoWidth={wp(62)}
          // videoHeight={wp(53)}
          onStart={() => props.setbottomSheetRef(true)}
          style={{ height: wp(53), width: wp(62) }}
          thumbnail={{ uri: thumbUrl }}
        />
      </TouchableOpacity> :
      <View style={{ backgroundColor: AppColors.WHITE, height: wp(53), width: wp(62), overflow: 'hidden', borderColor: 'transparent', borderBottomWidth: 0, borderBottomLeftRadius: 0, borderWidth: 1, borderRadius: 20 }} >
        <VideoPlayer
          video={{ uri: props.uri }}
          videoWidth={wp(62)}
          videoHeight={wp(53)}
          style={{ height: wp(53), width: wp(62) }}
          thumbnail={{ uri: thumbUrl }}
        />
      </View>
  )
}

const YoutubeLinkView = (props) => {
  let name = props.message.attachments[0].title;
  return (
    <View style={{ backgroundColor: AppColors.WHITE, width: wp(62), overflow: 'hidden', borderColor: 'transparent', borderBottomWidth: 0, borderBottomLeftRadius: 0, borderWidth: 1, borderRadius: 20 }} >
      <Text style={{ paddingLeft: 10, paddingTop: 5, paddingBottom: 0, marginBottom: hp(0.5), fontSize: hp(1.8), fontFamily: Fonts.APP_SEMIBOLD_FONT, color: AppColors.APP_THEME, textAlign: 'left' }}>Youtube</Text>
      {props.hideView ?
        <TouchableOpacity onPress={() => { props.setbottomSheetRef(true) }} >
          <VideoPlayer
            // video={{ uri: props.uri }}
            // videoWidth={wp(62)}
            // videoHeight={wp(35)}
            onStart={() => props.setbottomSheetRef(true)}
            style={{ height: wp(35), width: wp(62), }}
            thumbnail={{ uri: props.message.attachments[0].thumb_url }}
          />
        </TouchableOpacity>
        :
        <VideoPlayer
          video={{ uri: props.uri }}
          videoWidth={wp(62)}
          videoHeight={wp(35)}
          style={{ height: wp(35), width: wp(62), }}
          thumbnail={{ uri: props.message.attachments[0].thumb_url }}
        />
      }
      <Text numberOfLines={2} style={{ padding: 1, fontSize: hp(1.7), fontFamily: Fonts.APP_SEMIBOLD_FONT, color: AppColors.INPUT, textAlign: 'left', }}>{props.message.attachments[0].title}</Text>
      <Text numberOfLines={2} style={{ padding: 1, fontSize: hp(1.6), fontFamily: Fonts.APP_SEMIBOLD_FONT, color: AppColors.APP_THEME, textAlign: 'left', }}>{props.message.attachments[0].title_link}</Text>
    </View>
  )
}

const markStyles = StyleSheet.create({
  bottomLineContainer:
  {
    alignItems: 'center',
    width: wp(82),
    flexDirection: 'row',
    justifyContent: 'center'
  },
  checkBoxImg:
  {
    borderWidth: 1,
    height: hp(2.5),
    width: hp(2.5),
    borderRadius: hp(0.5),
    marginRight: hp(1),
    justifyContent: 'center',
  },
  bottomLine:
  {
    color: AppColors.GREY_TEXT,
    fontSize: hp(1.9),
    fontFamily: Fonts.APP_MEDIUM_FONT,
    width: '88%',
    alignSelf: 'center'
  },
  checkboxStyles:
  {
    borderRadius: wp(20),
    height: hp(2.5),
    width: hp(2.5),
  },
})
