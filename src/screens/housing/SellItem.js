import React, { useState } from 'react';
import { Image,  TouchableOpacity, Text,  FlatList,  View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { sellStyle } from './Styles';
import Spinner from '../../components/Spinner';
import HeaderView from '../../components/HeaderView';
import AppColors from '../../utils/AppColors';
import ImagePicker from 'react-native-image-crop-picker';
import Images from '../../assets/Images';
import SellItemInput from '../../components/SellItemInput';
import Button from '../../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import Actions from '../../webServices/Action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';

const SellItem = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [itemName, setItemName] = useState('');
    const [retailPrice, setRetailPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPics, setSelectedpic] = useState([]);
    const renderPicView = ({ item, index }) => {
        return (
            index > 3 ? null :
                <>
                    {index === 0 && selectedPics.length < 4 ?
                        <TouchableOpacity style={[sellStyle.addImgView, { marginRight: wp(5) }]} onPress={() => { OpenGallary() }}>
                            <Image style={sellStyle.addImg} source={Images.camera} />
                            <Text style={sellStyle.addImgText}>Add Image</Text>
                        </TouchableOpacity>
                        : null}
                    <View style={sellStyle.imgStyle}>
                        <Image resizeMode='cover' style={sellStyle.imgStyle} source={{ uri: item.uri }} />
                        <TouchableOpacity style={sellStyle.crossOuterView} onPress={() => removeImage(index)}>
                            <Image resizeMode='cover' style={sellStyle.crossStyle} source={Images.cross} />
                        </TouchableOpacity>
                    </View>
                </ >
        )
    }
    
    const removeImage = (index) => {
        var arr = selectedPics;
        arr.splice(index, 1)
        setSelectedpic(arr);
        let arrr = selectedPics;
        setSelectedpic([...arrr]);
    }

    const OpenGallary = () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                compressImageMaxWidth: 300,
                compressImageMaxHeight: 300,
                compressImageQuality: 0.7,
                path: 'images',
            },
            width: 300,
            height: 400,
            cropping: true,
            multiple: true
        };
        ImagePicker.openPicker(options).then(response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let date = Date.now()
                console.log("RRR" + JSON.stringify(response))
                let imgObj = [];
                if (selectedPics.length > 0) {
                    selectedPics.map((res) => {
                        imgObj.push(res)
                    })
                }
                response.map((res) => {
                    const file =
                    {
                        name: "Image" + date + ".jpg",
                        type: res.mime,
                        uri: Platform.OS === "android" ? res.path : res.path.replace("file://", ""),
                    }
                    imgObj.push(file);
                })
                setSelectedpic([...imgObj]);
            }
        })
    }

    const sellTheItem = () => {
        if (!itemName) {
            SimpleToast.showWithGravity('Please enter Item name which you want to sell', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (!retailPrice) {
            SimpleToast.showWithGravity('Please enter the retail Price of item', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (!sellPrice) {
            SimpleToast.showWithGravity('Please enter the sell Price of item', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (!description) {
            SimpleToast.showWithGravity('Please enter the description of item', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else if (selectedPics.length === 0) {
            SimpleToast.showWithGravity('Please add images of item', SimpleToast.SHORT, SimpleToast.CENTER);
        }
        else {
            let formdata = new FormData();
            formdata.append("item_name", itemName);
            formdata.append("retail_price", retailPrice);
            formdata.append("sell_price", sellPrice);
            formdata.append("short_description", description);
            formdata.append("image_count", selectedPics.length);
            selectedPics.map((res, index) => {formdata.append("image" + index, res)})
            console.log(formdata)
            AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
                if (myToken !== null) {
                    setLoading(true);
                    let alldata = {
                        token: myToken,
                        data: formdata
                    }
                    Actions.AddItemToSell(alldata)
                        .then((response) => {
                            console.log("res " + JSON.stringify(response))
                            if (response.data.status === 'success') {
                                setLoading(false);
                                SimpleToast.showWithGravity('Successfully Added', SimpleToast.SHORT, SimpleToast.CENTER);
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
    }}

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
                            sellTheItem();
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
        <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: AppColors.APP_THEME }} contentContainerStyle={sellStyle.container}>
            <HeaderView title='Sell Item' white onLeftClick={() => { navigation.goBack() }} />
            {loading ? <Spinner /> : null}
            <View style={sellStyle.topImgSelectionView}>
                {selectedPics.length > 0 ?
                    <FlatList
                        horizontal={true}
                        data={[...selectedPics]}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderPicView}
                    />
                    :
                    <TouchableOpacity style={[sellStyle.addImgView]} onPress={() => { OpenGallary() }}>
                        <Image style={sellStyle.addImg} source={Images.camera} />
                        <Text style={sellStyle.addImgText}>Add Image</Text>
                    </TouchableOpacity>}
            </View>
            <SellItemInput placeholder={'Item Name'} value={itemName} onChangeText={setItemName} />
            <SellItemInput price keyboardType='numeric' icon={Images.retailPrice} placeholder={'Retail Price'} value={retailPrice} onChangeText={setRetailPrice} />
            <SellItemInput price keyboardType='numeric' icon={Images.retailPrice} placeholder={'Sell Price'} value={sellPrice} onChangeText={setSellPrice} />
            <View style={sellStyle.line} />
            <SellItemInput icon={Images.entypotext} detail placeholder={'Description'} value={description} onChangeText={setDescription} />
            <Button style={{ bottom: 0, position: 'absolute' }} title={'Sell Item'} continue={() => { sellTheItem() }} />
        </KeyboardAwareScrollView>
    )
}
export default SellItem;
