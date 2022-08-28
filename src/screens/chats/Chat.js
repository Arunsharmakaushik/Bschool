import React, { Component, useContext, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import Styles from './Styles';
import HeaderView from '../../components/HeaderView';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import AppColors from '../../utils/AppColors';
import Recent from './Recent';
import AllGroups from './AllGroups';
import { StreamChat } from 'stream-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import EmoryGroups from './EmoryGroups';
import { setClient } from '../../utils';

const ChatScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [myChannels, setMyChannels] = useState([]);
  const [mySchool, setMySchool] = React.useState('');
  const [mySchoolId, setMySchoolId] = React.useState('');
 
  const [routes] = useState([
    { key: 'first', title: 'Recent', tabStyle: { backgroundColor: AppColors.APP_THEME } },
    { key: 'second', title: 'All Chats' },
    { key: 'third', title: CONSTANTS.MYSCHOOL + ' Chats' }
  ]);


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.setItem(CONSTANTS.FIXED_ROUTE_NAME, 'Chat');
     

    })
    return unsubscribe;
  }, [navigation]);

  const setTheUser = () => {
    // if(myChannels.length===0){
    const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);

    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS',CONSTANTS.FCM_TOKEN]).then(async (response) => {
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
      ) 
      console.log('done')
      }
    })
    // }
  }

  useEffect(() => {
    AsyncStorage.setItem(CONSTANTS.FIXED_ROUTE_NAME, 'Chat');
    AsyncStorage.getItem(CONSTANTS.SELECTED_SCHOOL).then((school) => {
      if (school !== null) {
        setMySchool(school)
        // routes.push({ key: 'third', title: school+' Groups' },)
      }
    })

    AsyncStorage.getItem(CONSTANTS.SELECTED_SCHOOLID).then((school) => {
      if (school !== null) {
        setMySchoolId(school)
        // routes.push({ key: 'third', title: school+' Groups' },)
      }
    })
    setTheUser();

  }, ([]));

  const FirstRoute = () => (
    <Recent navigation={navigation} school={mySchool} />
  );

  const SecondRoute = () => (
    <AllGroups navigation={navigation} school={mySchool} channels={myChannels} />
  );

  const ThirdRoute = () => (
    <EmoryGroups navigation={navigation} schoolId={mySchoolId} school={mySchool} channels={myChannels} />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
  });

  return (
    <View style={Styles.container}>
      <HeaderView right noLeft white title='Chat' onRightClick={() => { navigation.navigate('CreateGroup') }} />
      <TabView
        style={Styles.tabView}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={props =>
          <TabBar
            {...props}
            tabStyle={Styles.tabStyle}
            style={{ backgroundColor: AppColors.APP_THEME }}
            labelStyle={Styles.labelStyle}
            indicatorStyle={{
              height: 3,
              backgroundColor: AppColors.WHITE
            }}
          />
        }
        initialLayout={Styles.tabView}
      />
    </View>
  );
}

export default ChatScreen;
