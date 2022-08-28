import React, { useState, useEffect, useReducer } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Platform, TouchableOpacity, View, BackHandler } from 'react-native';
import Images from '../assets/Images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Home from '../screens/home/Home';
import ChatScreen from '../screens/chats/Chat';
import Classbook from '../screens/classbook/Classbook';
import ClassbookDetail from '../screens/classbookDetails/ClassbookDetail';
import Events from '../screens/events/Events';
import More from '../screens/more/More';
import AppColors from '../utils/AppColors';
import Fonts from '../assets/Fonts';
import { isiPhoneX } from '../utils';
import { createStackNavigator } from '@react-navigation/stack';
import ChatMessage from '../screens/chats/ChatMessage';
import InvitePerson from '../screens/InvitePersons/InvitePerson';
import ChatDescription from '../screens/chatDescription/ChatDescription';
import GridGallery from '../screens/gridGallery/GridGallery';
import SellingItemDetail from '../screens/housing/SellingItemDetail';
import Housing from '../screens/housing/Housing';
import { StackRouter, useNavigation, useRoute, } from '@react-navigation/native';
import RNExitApp from 'react-native-exit-app';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const ChatContext = React.createContext();
export const ThemeContext = React.createContext();

const ChatStack = ({ navigation }) => {
    const [channel, setChannel] = useState();
    const [thread, setThread] = useState();

    return (
        <ChatContext.Provider value={{ channel, setChannel, setThread, thread, }}>
            <Stack.Navigator

                screenOptions={{ headerTitleStyle: { alignSelf: 'center', fontWeight: 'bold' }, }} >
                <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: '', headerTransparent: true, headerLeft: null }} />
                <Stack.Screen name="ChatMessage" component={ChatMessage} options={{
                    headerBackTitle: 'Back',
                    headerShown: false,
                    animationEnabled: false
                }} />
                <Stack.Screen name='InvitePerson' component={InvitePerson} options={{ headerShown: false }} />
                <Stack.Screen name='ChatDescription' component={ChatDescription} options={{ headerShown: false }} />
                <Stack.Screen name='GridGallery' component={GridGallery} options={{ headerShown: false }} />
            </Stack.Navigator>
        </ChatContext.Provider>
    );
};


const MoreStack = ({  }) => {
    const [channel, setChannel] = useState();
    const [thread, setThread] = useState()

    return (
        <ChatContext.Provider value={{ channel, setChannel, setThread, thread, }}>
            <Stack.Navigator
                screenOptions={{ headerTitleStyle: { alignSelf: 'center', fontWeight: 'bold' }, }} >
                <Stack.Screen

                    name="More"
                    component={More}
                    // component={More}
                    options={{ title: '', headerTransparent: true, headerLeft: null }} 
                    
                   
                        />
            </Stack.Navigator>
        </ChatContext.Provider>
    );
};


const EventStack = ({  }) => {
    const [channel, setChannel] = useState();
    const [thread, setThread] = useState()

    return (
        <ChatContext.Provider value={{ channel, setChannel, setThread, thread, }}>
            <Stack.Navigator
                screenOptions={{ headerTitleStyle: { alignSelf: 'center', fontWeight: 'bold' }, }} >
                <Stack.Screen

                    name="More"
                    component={Events}
                    // component={More}
                    options={{ title: '', headerTransparent: true, headerLeft: null }} 
                    
                   
                        />
            </Stack.Navigator>
        </ChatContext.Provider>
    );
};

const HomeStack = ({ navigation }) => {
    const [channel, setChannel] = useState();
    const [thread, setThread] = useState();

    return (
        <ChatContext.Provider value={{ channel, setChannel, setThread, thread, }}>
            <Stack.Navigator >
                <Stack.Screen name='HomeStack' component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="ChatMessage" component={ChatMessage} options={{
                    headerBackTitle: 'Back',
                    headerShown: false,
                    animationEnabled: false
                }} />
                <Stack.Screen name='InvitePerson' component={InvitePerson} options={{ headerShown: false }} />
                <Stack.Screen name='ChatDescription' component={ChatDescription} options={{ headerShown: false }} />
                <Stack.Screen name='GridGallery' component={GridGallery} options={{ headerShown: false }} />
            </Stack.Navigator>
        </ChatContext.Provider>
    );
};

const ClassbookStack = ({ navigation }) => {
    const [channel, setChannel] = useState();
    const [thread, setThread] = useState();

    return (
        <ChatContext.Provider value={{ channel, setChannel, setThread, thread }} >
            <Stack.Navigator >
                <Stack.Screen name='Classbook' component={Classbook} options={{ headerShown: false }} />
                <Stack.Screen name="ChatMessage" component={ChatMessage} options={{
                    headerBackTitle: 'Back',
                    headerShown: false,
                }} />
                <Stack.Screen name='ClassbookDetail' component={ClassbookDetail} options={{ headerShown: false, }} />
            </Stack.Navigator>
        </ChatContext.Provider>
    );
};

const BottomTabNavigator = () => {
    const [show, setShow] = useState();

    return (
        <ThemeContext.Provider value={{show,setShow}}>

        <Tab.Navigator
            initialRouteName="Home"
            
            tabBarOptions={
                
                {
                activeBackgroundColor: AppColors.APP_THEME,
                inactiveBackgroundColor: AppColors.WHITE,
                activeTintColor: AppColors.WHITE,
                inactiveTintColor: AppColors.GREY_TEXT,
                labelStyle: {  fontFamily: Fonts.APP_BOLD_FONT, fontSize: hp(1.4), paddingBottom: isiPhoneX() ? hp(1.35) : hp(2), marginBottom: Platform.OS=='ios'? hp(1):0},
                safeAreaInset: { bottom: 'never', top: 'never' },
                style: {
                    justifyContent: 'center',
                    height: hp(10),
                    alignItems: 'center',
                    paddingBottom: 0,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ tintColor, focused }) =>
                        <Image resizeMode='contain' source={focused ? Images.home_white : Images.home_grey} style={{ height: hp(3), alignSelf: 'center', width: hp(3) }} />
                }} 
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // alert(JSON.stringify(e))
                        setShow(false)
                    //    alert('hhh')
                    }})}
                    />
            <Tab.Screen
                name='Chat'
                component={ChatStack}
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ tintColor, focused }) =>
                        <Image resizeMode='contain' source={focused ? Images.chat_white : Images.chat_grey} style={{ height: hp(3), alignSelf: 'center', width: hp(3) }}></Image>
                }} 
                
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // alert(JSON.stringify(e))
                        setShow(false)
                    //    alert('hhh')
                    }})}
                    />
            <Tab.Screen
                name='ClassbookStack'
                component={ClassbookStack}
                options={{
                    tabBarLabel: 'Classbook',
                    tabBarIcon: ({ tintColor, focused }) =>
                        <Image resizeMode='contain' source={focused ? Images.classbok_white : Images.classbok_grey} style={{ height: hp(3), alignSelf: 'center', width: hp(3), }}></Image>
                }}
                
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // alert(JSON.stringify(e))
                        setShow(false)
                    //    alert('hhh')
                    }})}
                    />
            <Tab.Screen
                name='Events'
                component={EventStack}
                options={{
                    tabBarLabel: 'Events',
                    tabBarIcon: ({ tintColor, focused }) =>
                        <Image resizeMode='contain' source={focused ? Images.event_white : Images.event_grey} style={{ height: hp(3), alignSelf: 'center', width: hp(3), }}></Image>
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        setShow(false)
                    }})}
                     />

            <Tab.Screen
                name='More'
                component={MoreStack}               
                options={{
                    tabBarLabel: 'More',
                    tabBarIcon: ({ tintColor, focused }) =>
                       <Image style={{ height: hp(3), alignSelf: 'center', width: hp(3), }} resizeMode='contain' source={focused ? Images.more_white : Images.more_grey} ></Image>
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // alert(JSON.stringify(e))
                        setShow(!show)
                    //    alert('hhh')
                    }})}
                    />
        </Tab.Navigator>
        </ThemeContext.Provider>
    );
};

export default BottomTabNavigator;
