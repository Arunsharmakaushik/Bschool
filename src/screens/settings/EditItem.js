import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, Text, Keyboard, FlatList, TextInput, View } from 'react-native';
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
import { ITEM_IMAGE_URL } from '../../webServices/EndPoints';
import FastImage from 'react-native-fast-image'

const EditItem = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [itemName, setItemName] = useState('');
    const [retailPrice, setRetailPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [description, setDescription] = useState('');
    const [soldOut, setSoldOut] = useState(0);
    const [selectedPics, setSelectedpic] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [itemId, setItemId] = useState('');

    useEffect(() => {
        if (Object.keys(route.params.item).length > 0) {
            let item = route.params.item;
            setSelectedpic([...item.item_images]);
            setItemName(item.name);
            setSellPrice(String(Number(item.sell_price).toFixed(0)));
            setRetailPrice(String(Number(item.retail_price).toFixed(0)));
            setDescription(item.description);
            setSoldOut(item.sold_status);
            setItemId(item.id)
        }


    }, ([]));

    const renderPicView = ({ item, index }) => {
        return (
            index > 3 ? null :
                <>
                    {index === 0 && selectedPics.length < 4 ?
                        <TouchableOpacity style={[sellStyle.addImgView, { marginRight: wp(5) }]} onPress={() => { OpenGallary() }}>
                            <FastImage style={sellStyle.addImg} source={Images.camera} />
                            <Text style={sellStyle.addImgText}>Add Image</Text>
                        </TouchableOpacity>
                        : null}
                    <View style={sellStyle.imgStyle}>
                        <FastImage resizeMode={FastImage.resizeMode.cover} style={sellStyle.imgStyle} source={{ uri: item.uri ? item.uri : ITEM_IMAGE_URL + item.image }} />
                        <TouchableOpacity style={sellStyle.crossOuterView} onPress={() => removeImage(index)}>
                            <FastImage resizeMode={FastImage.resizeMode.cover} style={sellStyle.crossStyle} source={Images.cross} />
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
                response.map((res, index) => {
                    let mainLength = selectedPics.length + index;
                    if (mainLength + 1 <= 4) {
                        const file =
                        {
                            name: "Image" + date + ".jpg",
                            type: res.mime,
                            uri: Platform.OS === "android" ? res.path : res.path.replace("file://", ""),
                        }
                        imgObj.push(file);
                    }
                })
                setSelectedpic([...imgObj]);
            }
        })
    }

    function arrayDiff(a, b) {
        var arrays = Array.prototype.slice.call(arguments);
        var diff = [];
        arrays.forEach(function (arr, i) {
            var other = i === 1 ? a : b;
            arr.forEach(function (x) {
                if (other.indexOf(x) === -1) {
                    diff.push(x);
                }
            });
        })
        return diff;
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
            let newPics = [];
            selectedPics.map((res) => {
                if (!res.id) {
                    newPics.push(res);
                }
            })
            // console.log('cgkvgfkvg ' + JSON.stringify(newPics));
            let formdata = new FormData();
            formdata.append("image_count", newPics.length);
            formdata.append("item_name", itemName);
            formdata.append("retail_price", retailPrice);
            formdata.append("sell_price", sellPrice);
            formdata.append("short_description", description);
            newPics.map((res, index) => {
                formdata.append('image' + index, res)
            })
            let mainItem = route.params.item;
            let oldImg = mainItem.item_images;
            oldImg.sort((a, b) => a.id - b.id);
            let OldPicIds = [];
            let removedId = [];
            oldImg.map((res) => {
                res.id ? OldPicIds.push(res.id) : ''
            })
            selectedPics.map((res) => {
                res.id ? removedId.push(res.id) : ''
            })
            let removedIdsCount = ''
            let newarr = arrayDiff(OldPicIds, removedId);
            newarr.map((res) => {
                if (removedIdsCount === '') {
                    removedIdsCount = res;
                }
                else {
                    removedIdsCount = removedIdsCount + ',' + res
                }
            })
            formdata.append("remove_images_id", removedIdsCount === '' ? 0 : removedIdsCount);
            AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
                if (myToken !== null) {
                    setLoading(true);
                    let data = {
                        id: itemId,
                        token: myToken,
                        data: formdata
                    }
                    Actions.EditSellingItem(data)
                        .then((response) => {
                            console.log("res " + JSON.stringify(response))
                            if (response.data.status === 'success') {
                                SimpleToast.showWithGravity('Edited Successfully', SimpleToast.SHORT, SimpleToast.CENTER);
                                setLoading(false);
                                navigation.goBack();
                            }
                            else {
                                setLoading(false);
                                SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                            }
                        })
                        .catch((err) => {
                            if (err&&err.response&&err.response.status&& err.response.status === 401) {
                                refreshToken('edit');
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
                }
            })
        }
    }

    const setAsSoldOut = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                setLoading(true);
                Actions.Sold_Out(myToken, itemId)
                    .then((response) => {
                        console.log("res " + JSON.stringify(response))
                        if (response.data.status === 'success') {
                            setLoading(false);
                            if (soldOut) {
                                setSoldOut(0);
                            }
                            else {
                                setSoldOut(1);
                            }
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            refreshToken('sold');
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
            }
        })
    }

    const refreshToken = (status) => {
        AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.ACCESS_TOKEN]).then((res) => {
            if (res !== null) {
                let data =
                {
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
                            if (status === 'edit') {
                                sellTheItem();
                            }
                            else if (status === 'deleteItem') {
                                deleteItem();
                            }
                            else {
                                setAsSoldOut();
                            }
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

    const deleteItem = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                setLoading(true);
                let data = {
                    id: itemId,
                    token: myToken,
                }
                Actions.DeleteItem(data)
                    .then((response) => {
                        console.log("res " + JSON.stringify(response))
                        if (response.data.status === 'success') {
                            SimpleToast.showWithGravity('Deleted Successfully', SimpleToast.SHORT, SimpleToast.CENTER);
                            setLoading(false);
                            navigation.goBack();
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {

                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            refreshToken('delete');
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
            }
        })
    }

    return (
        <KeyboardAwareScrollView nestedScrollEnabled={true}  contentContainerStyle={sellStyle.container}>
            <HeaderView title={itemName} white onLeftClick={() => { navigation.goBack() }} />
            {loading ? <Spinner /> : null}
            <ScrollView style={{height:'100%'}} >
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
                        </TouchableOpacity>
                    }
                </View>
                <SellItemInput placeholder={'Item Name'} value={itemName} onChangeText={setItemName} />
                <SellItemInput keyboardType='numeric' icon={Images.retailPrice} placeholder={'Retail Price'} value={retailPrice} onChangeText={setRetailPrice} />
                <SellItemInput keyboardType='numeric' icon={Images.retailPrice} placeholder={'Sell Price'} value={sellPrice} onChangeText={setSellPrice} />
                <View style={sellStyle.line} />
                <SellItemInput icon={Images.entypotext} detail placeholder={'Description'} value={description} onChangeText={setDescription} />
                <TouchableOpacity onPress={() => { deleteItem() }} style={sellStyle.deleteItem}>
                    <Text style={[sellStyle.soldOutTxt, { color: AppColors.WHITE }]}>{'Delete Item'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { soldOut ? {} : setAsSoldOut() }} style={[sellStyle.soldOutView, {marginBottom:'20%', borderColor: soldOut ? AppColors.SOLD_OUT : AppColors.APP_THEME }]}>
                    <Text style={[sellStyle.soldOutTxt, { color: soldOut ? AppColors.SOLD_OUT : AppColors.APP_THEME }]}>{soldOut ? 'Already Sold Out' : 'Mark As Sold'}</Text>
                </TouchableOpacity>
               

                </ScrollView>
              
            {
                soldOut ?
                    null :
                    <Button style={{ bottom: 0, position: 'absolute' }} title={'Save Changes'} continue={() => { sellTheItem() }} />
            }
          
        </KeyboardAwareScrollView>
    )
}

export default EditItem;
