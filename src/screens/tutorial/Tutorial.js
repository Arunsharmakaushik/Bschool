import React from 'react';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Images from '../../assets/Images';
import { Text, View } from 'react-native';
import AppColors from '../../utils/AppColors';
import Styles from './Styles';
import SwiperView from "../../components/SwiperView";
import CONSTANTS from '../../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Tutorial = ({ navigation }) => {

    const skip = () => {
        AsyncStorage.setItem(CONSTANTS.LOGIN_ALREADY, '1');
        navigation.reset({ index: 0, routes: [{ name: 'BottomTabNavigator' }] })
    }

    return (
        <View style={Styles.mainContainer} >
            <SwiperFlatList  autoplay
      autoplayDelay={4}
      autoplayLoop 
      paginationActiveColor={AppColors.APP_THEME} paginationStyleItem={Styles.dotStyle} paginationDefaultColor={'#A29FA0'} showPagination>
                <SwiperView  source={Images.tut1} title="Welcome To B School" discription="B School is a connected MBA experience, just for MBA students" />
                <SwiperView source={Images.tut_1_copy} title="See Your Classbook" discription="Find peers in your program and across other MBA campuses" />
             
                    <SwiperView source={Images.tut_2_copy} title="Chat With Your Classmates" discription="Join on going chats with your classmates and MBA students at other campuses" />
  
                    <SwiperView spread source={Images.tut_3_copy} title="Travel With Your Classmates" discription="Arrange trips and events with your classmates and stay connect to whats going on in the MBA world - Coming Soon!" />
                    <SwiperView spread source={Images.tut_4_copy} title="Guide Your Housing Needs" discription="Find a roommate, place to stay or sublet your house for the summer" />
            </SwiperFlatList>

            <View style={Styles.bottomContainer} >
                <TouchableOpacity onPress={() => navigation.push('Signup')} style={Styles.getBtn} >
                    <Text style={Styles.getText}  >Get Started</Text>
                </TouchableOpacity>
                <View style={Styles.bottomLine} >
                    <Text style={Styles.lineText} >Already have account ?<Text onPress={() => navigation.push('Login')} style={{ color: '#008583' }} > Login</Text></Text>
                </View>
            </View>

        </View>
    )
};

export default Tutorial;
