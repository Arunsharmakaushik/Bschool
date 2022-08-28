import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Images from '../../assets/Images';
import HeaderView from '../../components/HeaderView';
import AppColors from '../../utils/AppColors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LocationModal from '../../components/LocationModal';
import { crStyle } from './Styles';
import Button from '../../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import Actions from '../../webServices/Action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import Spinner from '../../components/Spinner';

const CreateRequest = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedLocationText, setselectedLocationText] = useState("");
    const [price, setprice] = useState("");
    const [minPrice, setminPrice] = useState("");
    const [maxPrice, setmaxPrice] = useState("");
    const [minPrice1, setminPrice1] = useState("400");
    const [maxPrice1, setmaxPrice1] = useState("800");
    const [descriptionText, setdescriptionText] = useState('');
    const [latitude, setLatitude] = useState(0);
    
    const [longitude, setLongitude] = useState(0);
    const [multiSliderValue1, setMultiSliderValue1] = React.useState(400)

    const [multiSliderValue2, setMultiSliderValue2] = React.useState(800)
    const setRange = (value) => {
        setminPrice(String(value[0]));
        setmaxPrice(String(value[1]));
        setminPrice1(String(value[0]));
        setmaxPrice1(String(value[1]));
    }
    const CustomMarker = () => {
        return (
            <View style={crStyle.markerView} />
        )
    };

    const CreateRoomateRequest=()=>{

        // if(!price){
        //     SimpleToast.showWithGravity('Please enter the price', SimpleToast.SHORT, SimpleToast.CENTER);
        // }
        // else
        //  if(!price){
        //     SimpleToast.showWithGravity('Please enter the price', SimpleToast.SHORT, SimpleToast.CENTER);
        // }
        // else
         if(!minPrice){
            SimpleToast.showWithGravity('Please set the minimum price.', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if(!maxPrice){
            SimpleToast.showWithGravity('Please set the maximum price.', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if(!selectedLocationText){
            SimpleToast.showWithGravity('Please set the location.', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if(!descriptionText){
            SimpleToast.showWithGravity('Please add description.', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else{
        let formdata = new FormData();
        formdata.append("price", price);
        formdata.append("min_price", minPrice);
        formdata.append("max_price", maxPrice);
        formdata.append("location", selectedLocationText);
        formdata.append("latitude", latitude);
        formdata.append("longitude", longitude);
        formdata.append("note", descriptionText);

        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                setLoading(true);
                let alldata = {
                    token: myToken,
                    data: formdata
                }
                Actions.AddRoomate(alldata)
                    .then((response) => {
                        console.log("res " + JSON.stringify(response))
                        if (response.data.status === 'success') {
                            setLoading(false);
                            SimpleToast.showWithGravity('Roommate request added successfully', SimpleToast.SHORT, SimpleToast.CENTER);
                            navigation.goBack();
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            refreshToken();
                        } 
                        else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false);
                            console.log("err " + JSON.stringify(err))
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }})
        }
    }

    const refreshToken = () => {
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
                            CreateRoomateRequest();
                        }
                    })
                    .catch((err) => {
                        console.log(err.response.data)
                        SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                    })
            }
            else
            {
              setLoading(false)
            }
        })
    }

    return (
        <KeyboardAwareScrollView style={{flex:1,backgroundColor:AppColors.APP_THEME}} contentContainerStyle={crStyle.container}>
            <HeaderView white title='Request' onLeftClick={() => { navigation.goBack() }} />
{loading ? <Spinner />:null}
            {/* <View style={[crStyle.listViewContainer, { marginTop: hp(7), height: hp(6) }]}>
                <Image resizeMode="contain" style={crStyle.listIcon} source={Images.retailPrice} />
                <TextInput
                    value={price}
                    multiline={false}
                    keyboardType='numeric'
                    placeholderTextColor={AppColors.GREY_TEXT}
                    placeholder="Price Housing" onChangeText={(text) => setprice(text)}
                    style={crStyle.priceTextInput}
                />
                <Text style={crStyle.monthText} >/ month</Text>
            </View> */}
            <Text style={crStyle.rentalText} >What is your monthly rental budget?</Text>


            <View style={crStyle.horizontalLine} />
            <Text style={crStyle.priceRangeText} >${minPrice1} - ${maxPrice1}</Text>
            <View style={crStyle.sliderContainer}>
                <MultiSlider
                    trackStyle={{ backgroundColor:AppColors.SLIDER_COLOR , height: hp(0.8) }}
                    selectedStyle={{ backgroundColor: AppColors.APP_THEME, height: hp(1) }}
                    values={[multiSliderValue1, multiSliderValue2]}
                    onValuesChange={(value) => setRange(value)}
                    style={{width:wp(90)}}
                    min={0}
                    max={1200}
                    step={400}
                    sliderLength={wp(90)}
                    customMarker={() => <CustomMarker />}
                    allowOverlap={false}
                    snapped={true}
                />
            </View>
            <View style={crStyle.midView}>
                <View style={{ width: '40%' }} >
                    <TextInput placeholderTextColor={AppColors.GREY_TEXT} maxLength={4} keyboardType='numeric' value={minPrice} onChangeText={(text) => {setminPrice(text);setMultiSliderValue1(Number(text))}} placeholder="Min. Price" style={crStyle.rangeTextInput} />
                    <View style={crStyle.rangeBottomLine} ></View>
                </View>
                <View style={crStyle.midLineView}></View>
                <View style={{ width: '40%' }}>
                    <TextInput placeholderTextColor={AppColors.GREY_TEXT} maxLength={4} keyboardType='numeric' value={maxPrice} onChangeText={(text) => {setmaxPrice(text);setMultiSliderValue2(Number(text))}} placeholder='Max. Price' style={crStyle.rangeTextInput} />
                    <View style={crStyle.rangeBottomLine} ></View>
                </View>
            </View>
            <TouchableOpacity onPress={() => setOpen(!open)} style={[crStyle.listViewContainer, { marginBottom: hp(0.1) }]}>
                <Image resizeMode="contain" style={crStyle.listIcon} source={Images.location} />
                <Text style={crStyle.touchListText}>
                    {selectedLocationText !== "" ? selectedLocationText : 'Select Location'}
                </Text>
                <Image resizeMode="contain" style={[crStyle.iconDrop, {
                    transform: [open ? { rotate: '180deg' } : { rotate: '0deg' }]

                }]} source={Images.dropdown} />
            </TouchableOpacity>
            <View style={[crStyle.listViewContainer, {height:hp(10), }]}>
                <Image resizeMode="contain" style={[crStyle.listIcon,{alignSelf:'flex-start',marginTop:hp(1.5)}]} source={Images.entypotext} />
                <TextInput
                    value={descriptionText}
                    multiline={true}
                    numberOfLines={4}
                    placeholder='Briefly write what your looking in a roommate, any places you identified, or briefly write about yourself'
                    placeholderTextColor={AppColors.GREY_TEXT}
                    onChangeText={(text) => setdescriptionText(text)}
                    style={crStyle.discriptionTextInput} />
            </View>
            <Button  continue={() => {CreateRoomateRequest()}} style={{bottom:0,position:'absolute'}} title='Create Request'/>
            {open ? <LocationModal code onClose={() => setOpen(false)} onSelectLocation={(text, lat, long) => { setselectedLocationText(text), setLatitude(lat), setLongitude(long), setOpen(false) }} /> : null}
        </KeyboardAwareScrollView>
    )
}
export default CreateRequest;