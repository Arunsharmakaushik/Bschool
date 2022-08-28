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
import Fonts from '../../assets/Fonts';


const SearchView = ({ navigation, route }) => {
  const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
  const chatStyles = StreamColors();
  const [threadSheet, setThreadSheet] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = useState([]);
  const [textToSearch, setTextToSearch] = React.useState('');
  const [searchedData, setSearchedData] = React.useState([]);
  const [wantToSearch, setWantToSearch] = useState(false);
  // const { channel } = useContext(ChatContext);
  const [show, setShow] = useState(true);
  const [showPinned, setShowPinned] = useState(false);
const [channel,setChannel] = useState(route.params.channel)

useEffect(()=>{
  // setSearchedData(channel)
})

  const PopUpView = () => {
    return (
      <>
        {Platform.OS === 'android' ?
          //  <View  height={hp(80)} backgroundColor={AppColors.SEARCH_COLOR} flex={1}> 
          <View style={{width:wp(100), backgroundColor: AppColors.WHITE, height: hp(87) }}>
            <ListOfChannels />
          </View>
          :
          <View style={{width:wp(100),  backgroundColor: AppColors.WHITE, height: hp(83) }}>
            <ListOfChannels />
          </View>
        }
      </ >
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
            //  textToSearch.length > 0 ?
            //   <Channel channel={searchedData} >
            //     <MyChannel />
            //   </Channel>
            //   :
              <Channel channel={channel} >
                <MyChannel />
              </Channel>
            }
          </Chat>
        </SafeAreaView>
      </ >
    )
  }

  const MyChannel = () => {
    return (
      <View style={{ flex: 1, }}>
        <MessageList
          //  onListScroll={(event)=>{console.log(event._dispatchInstances.memoizedProps.children)}}
          Message={props => (
            <MessagesMark
            navigation={navigation}
              setShowPinned={setShowPinned}
              textToSearch={''}
              ownMessage={props.isMyMessage(props.message)}
              {...props}
            />
          )
          }
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
            <View style={{ height: hp(1), width: wp(100), backgroundColor: AppColors.WHITE, alignSelf: 'center' }} />
            // <View marginBottom={hp(2)}>
            // <InputBox props={props} open={open} settoTrue={() => setOpen(true)} setOpen={() => { setOpen(false) }} />
            // </View>
          }
        />
      </View>
    )
  }

  const setText = (text) => {
    setTextToSearch(text);
    if (text.length > 1) {
      let data = [];
      channel.state.messages.map((res) => {
        if(res.text != ''){
        if (res.text.toLowerCase().includes(text.toLowerCase())) {
          data.push(res);
        }}
        // else if(res.attachments.length>0){
        //   // alert(JSON.stringify(res.attachments[0]))
        //   if (res.attachments[0].title? res.attachments[0].title.includes(text) :res.attachments[0].image_url ? res.attachments[0].image_url:res.attachments[0].asset_url) {
        //     data.push(res);
        //   }
        // }
      })
      console.log(data)
      setSearchedData(data)
    }
    else {
      // alert(channel.state.messages.length)
      setSearchedData([]);
      // setChannel(route.params.channel)
    }
  }

  return (
    <View style={[Styles.container]}>
      <HeaderView white title={'Search'} onLeftClick={() => {
          setShow(false);
          setTextToSearch(''); 
          // navigation.navigate('ChatMessage')
          navigation.goBack()
        }} />
        <View style={{
          //   top: 0, position: 'absolute', zIndex: 100,
          marginTop: hp(3), alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'row', width: wp(100), height: Platform.OS === 'android' ? hp(8) : hp(10), backgroundColor: 'transparent'
        }}>
          <View style={[AllGroupStyles.searchViewContainer, { width: wp(94), marginTop: isiPhoneX() ? -hp(0.8) : -hp(3), height: hp(6), marginBottom: 0, backgroundColor: AppColors.SEARCH_COLOR }]}>
            <Image resizeMode="contain" source={Images.search} style={AllGroupStyles.searchIcon} />
            <TextInput returnKeyType='search' value={textToSearch} onChangeText={(text) => setText(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={[AllGroupStyles.searchTextinput]} />
            <TouchableOpacity onPress={() => { setTextToSearch('');setSearchedData([]); setWantToSearch(false) }}>
              <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
            </TouchableOpacity>
          </View>
        </View>
      {searchedData.length >0 || textToSearch.length >1 ?
        <View style={{height:hp(80),paddingVertical:hp(2),backgroundColor:AppColors.WHITE,width:wp(100)}}>
          {
            searchedData.length>0?
            <FlatList
            showsVerticalScrollIndicator={false}
           
            data={[...searchedData]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) =>
            <View style={[{ justifyContent: null, alignSelf: 'center', marginBottom: hp(2.5), flexDirection: 'row', width: wp(90), height: item.message === '' && item.attachments != '' ? hp(20) : null }]}>
            <View style={{ height: hp(5.5), width: hp(5.5), justifyContent: 'center', alignItems: 'center', left: 0, position: 'absolute', borderColor: 'transparent', borderRadius: 50, backgroundColor: AppColors.LIGHTGREEN }}>
                {item.user.image === null ?
                    <Text style={{ color: 'white' }}>{item.user.name.charAt(0).toUpperCase()}</Text> :
                    <Image resizeMode='cover' source={{ uri: IMAGE_URL + item.user.image }} style={{ height: hp(5.5), alignSelf: 'center', width: hp(5.5), borderColor: 'transparent', borderRadius: 50, }} />}
            </View>
            <View width={wp(75)} marginLeft={wp(2)}>
                <Text
                    style={{ width: '100%', fontSize: hp(2), fontFamily: Fonts.APP_SEMIBOLD_FONT, color: AppColors.LIGHTGREEN, textAlign: `left`, left: wp(13), }}>
                    {item.user.name}
                    <Text style={{ color: AppColors.LIGHT, fontSize: hp(1.5), fontFamily: Fonts.APP_MEDIUM_FONT, }}>     {moment(item.created_at).format('hh:mm A')}</Text>
                </Text>
                {item.text === '' && item.attachments != '' ?

                item.attachments[0].title?

<Text style={[{  color:AppColors.INPUT,
                      fontFamily:Fonts.APP_MEDIUM_FONT,
                      fontSize:wp(3.5),
                      paddingTop:3, marginLeft: wp(13), width: wp(62), }]}>{item.attachments[0].title}</Text>
           
                :
                // res.attachments[0].title? res.attachments[0].title.includes(text) :res.attachments[0].image_url ? res.attachments[0].image_url:res.attachments[0].asset_url
                    <Image source={{ uri:item.attachments[0].image_url ? item.attachments[0].image_url : item.attachments[0].asset_url }} resizeMode='contain' style={{marginLeft:wp(12), height: hp(15), width: wp(20),alignSelf:'flex-start',}} />
                    : <Text style={[{  color:AppColors.INPUT,
                      fontFamily:Fonts.APP_MEDIUM_FONT,
                      fontSize:wp(3.5),
                      paddingTop:3, marginLeft: wp(13), width: wp(62), }]}>{item.text}</Text>}
            </View>
        </View>


            } />
            :
            <Text style={{textAlign:'center',marginTop:hp(15),fontFamily:Fonts.APP_MEDIUM_FONT,fontSize:hp(2.5)}} >No Data Found</Text>
          }
          </View>
          :
      //  <Modal
      //   animationType="none"
      //   visible={show} //showPopup
      //   transparent={true}
      //   contentContainerStyle={{
      //     justifyContent: "center",
      //     alignItems: "center",
      //     height: hp(80),
      //     width: wp(100),
      //     top: 0,
      //     position: 'absolute',
      //     backgroundColor: 'red'
      //   }}>

        // {/* <HeaderView white title={'Search View'} onLeftClick={() => {
        //   setShow(false);
        //   setTextToSearch(''); 
        //   // navigation.navigate('ChatMessage')
        //   navigation.goBack()
        // }} />

        // <View style={{
        //   //   top: 0, position: 'absolute', zIndex: 100,
        //   marginTop: hp(3), alignSelf: 'center',
        //   justifyContent: 'center',
        //   flexDirection: 'row', width: wp(100), height: Platform.OS === 'android' ? hp(8) : hp(10), backgroundColor: 'transparent'
        // }}>
        //   <View style={[AllGroupStyles.searchViewContainer, { width: wp(94), marginTop: isiPhoneX() ? -hp(0.8) : -hp(3), height: hp(6), marginBottom: 0, backgroundColor: AppColors.SEARCH_COLOR }]}>
        //     <Image resizeMode="contain" source={Images.search} style={AllGroupStyles.searchIcon} />
        //     <TextInput value={textToSearch} onChangeText={(text) => setText(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search Chat" style={[AllGroupStyles.searchTextinput]} />
        //     <TouchableOpacity onPress={() => { setTextToSearch('');setChannel(route.params.channel), setSearchedData(); setWantToSearch(false) }}>
        //       <Image resizeMode="contain" source={Images.cross} style={AllGroupStyles.searchIcon} />
        //     </TouchableOpacity>
        //   </View>
        // </View> */}
        <PopUpView />
    
      
      // </Modal> 
}
    </View>
  );
}

export default SearchView;
