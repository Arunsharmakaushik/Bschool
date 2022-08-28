import React, { useState, useContext, useEffect, useRef } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Splash from '../screens/splash/Splash'
import Login from '../screens/login/Login'
import { Signup } from '../screens/signup/Signup'
import Tutorial from '../screens/tutorial/Tutorial'
import BottomTabNavigator, { ChatContext } from './TabNavigator'
import Permissions from '../screens/permissions/Permissions'
import ForgotPassword from '../screens/forgot/ForgotPassword'
import Profile from '../screens/profile/Profile'
import InvitePerson from '../screens/InvitePersons/InvitePerson'
import CreateGroup from '../screens/chats/CreateGroup'
import ChatScreen from '../screens/chats/Chat'
import ChatMessage from '../screens/chats/ChatMessage'
import AllGroups from '../screens/chats/AllGroups';
import Events from '../screens/events/Events'
import ABC from '../screens/chats/abc'
import SearchView from '../screens/chats/SeachView'
import PersonProfile from '../screens/chats/PersonProfile'
import EventScreen from '../screens/addEventScreen/EventScreen'
import EventDetail from '../screens/addEventScreen/EventDetail'
import AddPerson from '../screens/addEventScreen/AddPerson'
import InterestView from '../screens/settings/InterestView';
import NotificationScreen from '../screens/settings/NotificationScreen';
import Itemsale from '../screens/settings/Itemsale';
import Setting from '../screens/settings/Setting';
import Housing from '../screens/housing/Housing'
import App from '../../App'
import SellItem from '../screens/housing/SellItem'
import CreateRequest from '../screens/housing/CreateRequest'
import SellingItemDetail from '../screens/housing/SellingItemDetail'
import EditItem from '../screens/settings/EditItem'
import ContactUs from '../screens/settings/ContactUs'
import { navigationRef } from '../utils/NavigationService'
import NavigationService from '../utils/NavigationService';
import messaging from '@react-native-firebase/messaging';
import { Platform, Alert, View } from 'react-native';
import Referrals from '../screens/settings/Referrals';
import PendingReferrals from '../screens/settings/PendingReferrals';
import UploadPost from '../screens/uploadPost/UploadPost';
import MemberProfile from '../screens/chats/MemberProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../utils/Constants';

// let alreadyLogin=0;
// AsyncStorage.getItem(CONSTANTS.LOGIN_ALREADY).then((res) => {
//   if (res !== null) {
//     if (res === '1') {
//       alreadyLogin=1;
     
//     }
   
//   }
// })
export function AppNavigation() {
  const [channel, setChannel] = useState();
  const [thread, setThread] = useState();
  // const navigationRef = useRef(null);
 


  return (
    <ChatContext.Provider
      value={{ channel, setChannel, setThread, thread }}>
      <NavigationContainer
        ref={navigationRef}>

        <MainNavigation />
      </NavigationContainer>
    </ChatContext.Provider>
  )
}
const NavigationStack = createStackNavigator()
function MainNavigation() {
 

  return (
    <NavigationStack.Navigator initialRouteName={'Splash'} screenOptions={{ headerShown: false }}>
      <NavigationStack.Screen
        name="Splash"
        component={Splash} />

      <NavigationStack.Screen
        name="abc"
        component={ABC} />

      <NavigationStack.Screen
        name="Login"
        component={Login} />

      <NavigationStack.Screen
        name="Signup"
        component={Signup} />

      <NavigationStack.Screen
        name='SearchView'
        component={SearchView} />

      <NavigationStack.Screen
        name='App'
        component={App} />

      <NavigationStack.Screen
        name="Profile"
        component={Profile} />
      <NavigationStack.Screen
        name="Tutorial"
        component={Tutorial} />
      <NavigationStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator} />
      <NavigationStack.Screen
        name='Permissions'
        component={Permissions} />
      <NavigationStack.Screen
        name='ForgotPassword'
        component={ForgotPassword} />
      <NavigationStack.Screen
        name='InvitePerson'
        component={InvitePerson} />
      <NavigationStack.Screen
        name='CreateGroup'
        component={CreateGroup} />
      <NavigationStack.Screen
        name='AllGroups'
        component={AllGroups} />
      <NavigationStack.Screen
        name="ChatScreen"
        component={ChatScreen} />
      <NavigationStack.Screen
        name="ChatMessage"
        component={ChatMessage} />

      <NavigationStack.Screen
        name="Events"
        component={Events} />


      <NavigationStack.Screen
        name="EventScreen"
        component={EventScreen} />
      <NavigationStack.Screen
        name="EventDetail"
        component={EventDetail} />
      <NavigationStack.Screen
        name="AddPerson"
        component={AddPerson} />

      <NavigationStack.Screen
        name='InterestView'
        component={InterestView} />

      <NavigationStack.Screen
        name="NotificationScreen"
        component={NotificationScreen} />

      <NavigationStack.Screen
        name="Referrals"
        component={Referrals} />
      <NavigationStack.Screen
        name="PendingReferrals"
        component={PendingReferrals} />


      <NavigationStack.Screen
        name="Itemsale"
        component={Itemsale} />
      <NavigationStack.Screen
        name="Setting"
        component={Setting} />

      <NavigationStack.Screen
        name="Housing"
        component={Housing} />

      <NavigationStack.Screen
        name="SellItem"
        component={SellItem} />

      <NavigationStack.Screen
        name='CreateRequest'
        component={CreateRequest}

        options={{ gestureEnabled: false }}
      />

      <NavigationStack.Screen
        name='EditItem'
        component={EditItem}
      />

      <NavigationStack.Screen
        name='SellingItemDetail'
        component={SellingItemDetail}
      />

      <NavigationStack.Screen
        name='ContactUs'
        component={ContactUs}
      />

      <NavigationStack.Screen
        name='UploadPost'
        component={UploadPost}
      />

      <NavigationStack.Screen
        name='MemberProfile'
        component={MemberProfile} />

    </NavigationStack.Navigator>
  )
}
