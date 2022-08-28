import React, { useContext, useEffect, useState } from 'react';
import { LogBox, TouchableOpacity, Image, SafeAreaView, Text, View, TextInput, FlatList } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { StreamChat } from 'stream-chat';
import CONSTANTS from '../../utils/Constants';
import { ChatContext } from '../../navigation/TabNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChannelList, ChannelListMessenger, ChannelPreviewMessenger, Chat, IconBadge, Avatar, Streami18n, } from 'stream-chat-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';
import moment from 'moment';
import Styles, { AllGroupStyles, GroupStyles } from './Styles';
import Images from '../../assets/Images';
import { getClient, setClient } from '../../utils';
import Spinner from '../../components/Spinner';
import { Alert } from 'react-native';
import { IMAGE_URL } from '../../webServices/EndPoints';

LogBox.ignoreAllLogs(true);
enableScreens();

const Recent = ({ navigation }) => {
  const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
  const { setChannel } = useContext(ChatContext);
  const [id, setid] = useState('');
  const [userfix, setuserfix] = useState(false);
  const [userToken, setuserToken] = useState('');
  const [user, setuser] = useState(false);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textToSearch, setTextToSearch] = React.useState('');
  const [searchedData, setSearchedData] = React.useState([]);

  useEffect(() => {
    if (id == '') {
      AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then((response) => {
        if (response !== null) {
          let data = JSON.parse(response[1][1]);
          const userToken = response[0][1];
          setuserToken(userToken);
          setid(String(data.id));
          setuser(data);
          setuserfix(true);
        }
      })
    }
  });

  useEffect(() => {
    if (userfix && id != '') {
      setTheUser();
    }
  });

  useEffect(() => {
    getChannels()
  }, ([]));

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getChannels();
      setSearchedData([]); setTextToSearch('');

    });
    return unsubscribe;
  }, [navigation]);

  const CustomChannelPreview2 = (
    channel, setActiveChannel
  ) => {
    let latestMessage = channel.state.messages.length > 0 ? channel.state.messages[channel.state.messages.length - 1] : null;
    let isDeleted = latestMessage != null ? channel.state.messages[channel.state.messages.length - 1].deleted_at ? true : false : false;
    let index = channel.state.messages.length - 1;
    let fileName = latestMessage != null
      ?
      isDeleted
        ? '' :
        latestMessage.text === '' ?
          channel.state.messages[index].attachments[0].mime_type && channel.state.messages[index].attachments[0].mime_type === 'video/mp4' ? 'Shared a Video' : channel.state.messages[index].attachments[0].mime_type ? 'Shared a file' : 'Shared an ' + channel.state.messages[index].attachments[0].type
          : ''
      : '';
    const unreadCount = channel.countUnread();
    let anotherName = '';
    let anotherImg = '';
    if (channel.data.member_count === 2) {
      let arr = channel.state.members;

      const result = Object.keys(arr).map((key) => arr[key]);
      result.map((res) => {
        if (res.user.id != getClient().user.id) {
          anotherName = res.user.name;
          anotherImg = res.user.image != null ? res.user.image : '';
        }
      })
    }
    return (
      <TouchableOpacity
        style={Styles.messageList}
        onPress={() => {
          setChannel(channel);
        // console.log('jj  ',channel)
          navigation.navigate('ChatMessage');
        }}>
        {
          anotherImg === '' ?
            <Avatar image={channel.data.image} size={hp(4.7)} />
            :
            <Image source={{ uri: IMAGE_URL + anotherImg }} style={{ height: hp(4.7), width: hp(4.7), borderRadius: 50 }} />
        }
        <View justifyContent='center'>
          <View style={Styles.nameView}>
            <Text
              style={[Styles.nameText, {width:'80%',fontWeight: unreadCount > 0 ? 'bold' : '500', }]}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {anotherName === '' ? channel.data.name : anotherName}
            </Text>
            {latestMessage !== null ? <Text style={Styles.msgText} >{moment(latestMessage.created_at).format('hh:mm A')}</Text> : null}
          </View>
          {latestMessage !== null ?
            <View style={Styles.nameView}>
              {latestMessage !== null ? <Text style={[Styles.mainMsgText, { marginTop: 3 }]}
                numberOfLines={1}>{latestMessage.text.includes('New Event Created:') ? 'New Event Created' : latestMessage.text != '' ? latestMessage.deleted_at ? '' : latestMessage.text : fileName}</Text> : null}
              {unreadCount > 0 ?
                <TouchableOpacity style={Styles.countView}>
                  <Text style={Styles.countText}>{unreadCount}</Text>
                </TouchableOpacity>
                : null}
            </View>
            : null}
        </View>
      </TouchableOpacity>
    );
  }

  const getChannels = () => {
    const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then(async (response) => {
      if (response !== null) {
        let data = JSON.parse(response[1][1]);
        const userTokken = response[0][1];
        const user = {
          id: String(data.id),
          name: data.first_name + (data.last_name ? ' ' + data.last_name : '')
        };
        chatClient.setUser(user, userTokken);
        setClient(chatClient);
        const channels = await chatClient.queryChannels({
          members: { $in: [String(data.id)] },
        });
        // alert(">>"+JSON.stringify(channels))
        setChannels(channels);
        setLoading(false);
      }
      else
      {
        setLoading(false);
      }
    })
  }

  const setTheUser = () => {
    const details =
    {
      id: id, name: user.first_name + (user.last_name ? ' ' + user.last_name : '')
    };
    const setupClient = async () => {
      await chatClient.setUser(details, userToken);
    };
    setupClient();
  }

  const searchText = (text) => {
    setTextToSearch(text);
    if (text.length > 1) {
      let newData = channels.filter(x => String(x.data.name.toLowerCase()).includes(text.toLowerCase()));
      setSearchedData(newData);
    }
    else {
      setSearchedData([]);
    }
  }

  return (
    <SafeAreaView>
      {loading ? <Spinner /> : null}
      <View style={AllGroupStyles.searchViewContainer}>
        <Image resizeMode="contain" source={Images.greenSearch} style={AllGroupStyles.searchIcon} />
        <TextInput returnKeyType='search' value={textToSearch} onChangeText={(text) => searchText(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={AllGroupStyles.searchTextinput} />
        {textToSearch ?
          <TouchableOpacity onPress={() => { setTextToSearch(''); setSearchedData([]) }}>
            <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
          </TouchableOpacity>
          : null}
      </View>
      <Chat
        client={chatClient} i18nInstance={new Streami18n({
          language: 'en',
        })}>
        <View style={{ height: '85%', padding: 10, }}>
          {textToSearch.length > 1 ?
            searchedData.length === 0 ?
              <Text style={[AllGroupStyles.searchTextinput, { textAlign: 'center' }]}>No People Found
</Text> :
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: AppColors.LIGHT_GREY, }}
                data={searchedData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => CustomChannelPreview2(item, true)}
              />
            :
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ backgroundColor: AppColors.LIGHT_GREY, }}
              data={[...channels]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => CustomChannelPreview2(item, true)}
            />
          }
        </View>
      </Chat>
    </SafeAreaView>
  );
};

export default Recent;
