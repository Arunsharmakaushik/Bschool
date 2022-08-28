import React, { useRef, useState } from 'react';
import { View, Text, Image, ImageBackground, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';
import Styles from './Styles';

const Permissions = ({ navigation }) => {
    const [notificationPermission, setNotificationPermission] = useState(0);
    const [photoPermission, setPhotosPermission] = useState(0);
    const [locationPermission, setLocationPermission] = useState(0);

    return (
        <View>
            <PermissionView allow={()=>{}}  cancel={()=>{}} title='Notifications' description="Allow push Notification so you know when you've message or mentioned"/>
            {/* <PermissionView allow={()=>{}} cancel={()=>{}} title='Photos' description="Allow app to access your photos and gallery so you can upload and share your photos"/> */}
            {/* <PermissionView allow={()=>{}} cancel={()=>{}} title='Location' description="Allow app to share your last location so you can sare location with your claasmate"/> */}
        </View>
    );
}

const PermissionView = (props) => {
    return (
        <View style={Styles.container}>
            <Image resizeMode='contain' style={Styles.topImg} />
            <Text style={Styles.titleText}>{props.title}</Text>
            <Text style={Styles.desciptionText}>{props.description}</Text>
            <TouchableOpacity style={Styles.btnview} onPress={()=>props.allow()}>
                <Text style={Styles.btnText}>Allow {props.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[Styles.btnview,{backgroundColor:AppColors.WHITE}]} onPress={()=>props.cancel()}>
                <Text style={[Styles.btnText,{color:AppColors.APP_THEME}]}>Cancel</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Permissions;
