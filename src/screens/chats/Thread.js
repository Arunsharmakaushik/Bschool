import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, Platform, StyleSheet} from 'react-native';
import {
  Chat,
  Channel,
  KeyboardCompatibleView,
  Thread,
  Message as DefaultMessage,
} from 'stream-chat-react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
// import {InputBoxThread} from '../components/InputBoxThread';
import {SCText} from '../../components/SCText';
import Images from '../../assets/Images';
import { StreamChat } from 'stream-chat';
import CONSTANTS from '../../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessagesMark } from '../../components/MessagesMark';

const CustomKeyboardCompatibleView = ({children}) => (
  <KeyboardCompatibleView
    keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : -200}
    behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
    {children}
  </KeyboardCompatibleView>
);
export function ThreadScreen({
  route: {
    params: {channelId = null, threadId = null},
  },
}) {
  const {colors} = useTheme();
  const chatClient =new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
  const navigation = useNavigation();

  const [channel, setChannel] = useState(null);
  const [thread, setThread] = useState();
  const [sendMessageInChannel, setSendMessageInChannel] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };


  useEffect(() => {
   
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then((response) => {
      if (response !== null) {
        let data = JSON.parse(response[1][1]);
        const userTokken = response[0][1];
        const user = {
          id: String(data.id),
          name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
        };
       
        const setupClient = async () => {
          await chatClient.connectUser(user, userTokken);
        };
        setupClient();

          const getThread = async () => {
      const res = await chatClient.getMessage(threadId);
      setThread(res.message);
    };

    getThread();

    if (!channelId) {
          navigation.goBack();
        } else {
          const _channel = chatClient.channel('messaging', channelId);
          setChannel(_channel);
          setIsReady(true);
        }
      }
    })
  }, []);

  useEffect(() => {
  //   setTimeout(() => {
      
  
  //   const getThread = async () => {
  //     const res = await chatClient.getMessage(threadId);
  //     setThread(res.message);
  //   };

  //   getThread();

  //   if (!channelId) {
  //     navigation.goBack();
  //   } else {
  //     const _channel = chatClient.channel('messaging', channelId);
  //     setChannel(_channel);
  //     setIsReady(true);
  //   }
  // }, 2000);
  }, [chatClient, threadId]);

  if (!isReady || !thread) {
    return null;
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
      }}>
      <View style={styles.channelScreenContainer}>
      
        <View
          style={[
            styles.chatContainer,
            {
              backgroundColor: colors.background,
            },
          ]}>
          <Chat client={chatClient}>
            <Channel
              channel={channel}
              thread={thread}
              doSendMessageRequest={async (cid, message) => {
                const newMessage = {
                  ...message,
                  show_in_channel: sendMessageInChannel,
                  parentMessageText: sendMessageInChannel
                    ? thread.text
                    : undefined,
                };
                return channel.sendMessage(newMessage);
              }}
              KeyboardCompatibleView={CustomKeyboardCompatibleView}>
              <Thread
                
              />
            </Channel>
          </Chat>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  channelScreenContainer: {flexDirection: 'column', height: '100%'},
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  drawerNavigator: {
    backgroundColor: '#3F0E40',
    width: 350,
  },
  chatContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  threadHeaderSeparator: {
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  emptyThreadHeaderSeparatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
