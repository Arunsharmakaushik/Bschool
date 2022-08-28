import React from 'react';
import { SafeAreaView } from 'react-native';
import { Text, View,Modal } from 'react-native';
import AppColors from '../../utils/AppColors';
import PersonProfile from './PersonProfile';

const MemberProfile = ({navigation, route }) => {
    const {USERID} = route.params;
    // alert(USERID)
    return ( 
     <PersonProfile navigation={navigation}  userId={String(USERID)} goBack={() => navigation.goBack()} />

    );
};

export default MemberProfile;
