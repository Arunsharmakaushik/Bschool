import React, { Component, useEffect, useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, ImageStore } from 'react-native';
import Styles from './Styles';
import HeaderView from '../../components/HeaderView';
import Images from '../../assets/Images';
import Button from '../../components/Button';
import AppColors from '../../utils/AppColors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import Actions from '../../webServices/Action';
import SimpleToast from 'react-native-simple-toast';
import { IMAGE_URL } from '../../webServices/EndPoints';
import moment from 'moment';
import Spinner from '../../components/Spinner';
import { ChatContext } from '../../navigation/TabNavigator';
import { StreamChat } from 'stream-chat';
import { getClient } from '../../utils';
import { BallIndicator } from 'react-native-indicators';

const AddPerson = (props) => {
    const [selectedData, setSelectedData] = React.useState([]);
    const [textToSearch, setTextToSearch] = React.useState('');
    const [searchedData, setSearchedData] = React.useState([]);
    const [allData, setAllData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [mySchool, setMySchool] = React.useState('');
    const { channel } = useContext(ChatContext);
    const [page, setPage] = useState(1);
    const [onEndReached, setOnEndReached] = useState(false);
const [myAccessToken,setToken] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [total, setTotal] = useState();

    const searchText = (text) => {
        setTextToSearch(text);
        if (text.length > 0) {
            let newData1 = allData.filter(x => String(x.first_name.toLowerCase()).includes(text.toLowerCase()));
            let newData2 = allData.filter(x => String(x.last_name.toLowerCase()).includes(text.toLowerCase()));
            let newData= newData1.concat(newData2)
            setSearchedData(newData);
        }
        else {
            setSearchedData([]);
        }
    }


    const renderFooter = () => {
        return (
          //Footer View with Load More button
          <View style={Styles.footer}>
            {isLoading ?
              <BallIndicator style={{ alignSelf: 'center' }} size={20} color={AppColors.APP_THEME} />
              : null}
          </View>
        );
      };

    const selectItem = (item, index) => {
        if (item.selected) {
            let newItem = item;
            newItem.selected = false;
            let mainData = allData;
            mainData[item.checkId] = newItem;
            setAllData([...mainData])
        }
        else {
            let newItem = item;
            newItem.selected = true;
            let mainData = allData;
            mainData[item.checkId] = newItem;
            setAllData([...mainData])
        }
        let selectedData = allData.filter(x => String(x.selected).includes('true'));
        setSelectedData(selectedData);
    }

    function comparer(otherArray) {
        return function (current) {
            return otherArray.filter(function (other) {
                return other.id == current.id
            }).length == 0;
        }
    }

    useEffect(() => {
        AsyncStorage.multiGet([CONSTANTS.ACCESS_TOKEN, CONSTANTS.SELECTED_SCHOOL]).then((res) => {
            if (res !== null) {
                setToken(res[0][1]);
                if (props.route.params != undefined) {

                    if (props.route.params.from === 'chat') {
                        let channel = props.route.params.channel;
                        let arr = [];
                        arr = channel.state.members;
                        const result = Object.keys(arr).map((key) => arr[key]);

                        let newData = [];
                       let mainData =result.filter(x => x.user_id != getClient().user.id)

                       mainData.map((item, index) => {
                                let obj = {}
                                obj.checkId = index;
                                obj.selected = false;
                                obj.id = item.user.id;
                                obj.created_at = item.user.created_at;
                                obj.email = item.user.email;
                                obj.school_name = '';
                                obj.first_name = item.user.name;
                                obj.profile_image = item.user.image
                                newData.push(obj)
                        })
                        setAllData([...newData])
                        getSelectedData([...newData]);
                        setLoading(false);
                        setMySchool(res[1][1]);
                    }
                } else {
                    getList(res[0][1]);
                    setMySchool(res[1][1]);
                }
            }
        })
    }, []);



    const onLoad = () => {
        let arr = [...allData];
        if (total === arr.length) {
          setOnEndReached(false);
        }
        else {
          setOnEndReached(true);
          setPage(page + 1),
            getList(myAccessToken, page + 1)
        }
      }

    const getList = (myToken,pageNum) => {
        // alert(mySchool)
        page > 1 ? setIsLoading(true) : setIsLoading(false);

        Actions.GetUserList(myToken,pageNum)
            .then((response) => {
                if (response&&response.data&&response.data.status&&response.data.status === 'success') {                   
                    let data = response.data.data;
                    let users = data.user.data;
                    setTotal(data.user.total);
                    let resultArr =  users.sort(function (a, b) { return a.first_name.toLowerCase() > b.first_name.toLowerCase() })
                    let newData = [];
                    resultArr.map((item, index) => {
                        let obj = item;
                        obj.checkId = index;
                        obj.selected = false;
                        newData.push(obj)
                    })

                    // alert(data.user.total);
                   
                    // users.map((item, index) => {
                    //     let obj = item;
                    //     obj.checkId = index;
                    //     obj.selected = false;
                    //     newData.push(obj)
                    // })

                    // let previousArr = [...allData];
                    // if (previousArr.length > 0) {
                    //   if (previousArr.length != data.user.total) {
                    //     let mainArr = previousArr.concat(arr);
                    //     setAllData([...mainArr]);
                    //     setIsLoading(false);
                    //     setIsLoading(false);
                    //   }
                    // }
                    // else {

                    setAllData(newData);
                    getSelectedData(newData);
                    // }
                    setIsLoading(false);
                    console.log(">>>>>>>>???Public" + JSON.stringify(response.data))
                }
                else {
                    setLoading(false);
                    SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                }
            })
            .catch((err) => {
                // alert(JSON.stringify(err))
                if (err&&err.response&&err.response.status&& err.response.status === 401) {
                    refreshToken();
                } 
                else if (err&&err.response&&err.response.status&& err.response.status === 403) {
                    setLoading(false);
                    SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                    AsyncStorage.clear();
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                }
                else {
                    setLoading(false);
                    SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                }
            })
    }

    const refreshToken = () => {
        AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.SELECTED_SCHOOL, CONSTANTS.ACCESS_TOKEN]).then((res) => {
            if (res !== null) {
                let data = {
                    token: res[0][1],
                    oldToken: res[2][1]
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
                           setToken(token.access_token);
                            getList(token.access_token)
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

    const getSelectedData = (users) => {
        setLoading(false);
        if (props.data.length > 0) {
            setSelectedData(props.data)
            let mainData = users;
            users.map((res1, index) => {
                props.data.map((res) => {
                    if (res.id === res1.id) {
                        mainData[index].selected = true;
                    }
                })
            })
            setAllData([...mainData])
        }
    }

    const back = () => {
        props.back()
        // navigation.replace('EventScreen', { data: [] }) 
    }

    return (
        <View style={Styles.container}>
            <HeaderView title='Participants' white onLeftClick={() => { back() }} />
            {loading ? <Spinner /> : null}
            {textToSearch === '' && selectedData.length > 0 ?
              <View  style={{ width: wp(100), height: hp(14), backgroundColor: AppColors.LIGHT_GREY, }}>
              <FlatList
                    horizontal={true}
                    data={selectedData}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ margin: hp(1), width: wp(20), justifyContent: 'center', }}>
                                <View style={Styles.outerImg}>
                                    <Image resizeMode='cover' source={item.profile_image != null ? { uri: IMAGE_URL + item.profile_image } : Images.user} style={[Styles.personImage, { margin: 0, marginRight: 0 }]} />
                                    <TouchableOpacity style={Styles.cutImage} onPress={() => { selectItem(item) }}>
                                        <Image style={Styles.cutImg} resizeMode='contain' source={Images.whiteCross} />
                                    </TouchableOpacity>
                                </View>
                                <Text onPress={() => { selectItem(item) }} numberOfLines={1} style={[Styles.addressText, { color: AppColors.INPUT, paddingTop: hp(0.8), alignSelf: 'center' }]}>{item.first_name + (item.last_name ? ' ' + item.last_name : '')}</Text>
                            </View>
                        )
                    }}
                />
                </View>
                : null}
            <View style={Styles.searchViewContainer}>
                <Image resizeMode="contain" source={Images.greenSearch} style={Styles.searchIcon} />
                <TextInput value={textToSearch} onChangeText={(text) => searchText(text)} placeholderTextColor={AppColors.GREY_TEXT} placeholder="Search People" style={Styles.searchTextinput} />
                {textToSearch ?
                    <TouchableOpacity onPress={() => { setTextToSearch(''); setSearchedData([]) }}>
                        <Image resizeMode="contain" source={Images.cross} style={Styles.searchIcon} />
                    </TouchableOpacity>
                    : null}
            </View>
            {textToSearch !== '' && searchedData.length === 0 ?
                <View style={{ height: hp(73) }}><Text>No Data found</Text></View> :
                <FlatList
                    style={{ width: wp(90), }}
                    showsVerticalScrollIndicator={false}
                    data={textToSearch === '' ? allData : searchedData}
                    keyExtractor={(item, index) => index.toString()}
                   
                    // ListFooterComponent={renderFooter}
                    // initialNumToRender={15}
                    // maxToRenderPerBatch={2}
                    // onEndReachedThreshold={0.1}
                    // onMomentumScrollBegin={() => { setOnEndReached(false) }}
                    // onEndReached={() => {
                    //   if (!onEndReached) {
                    //     onLoad()
                    //   }
                    // }}

                    renderItem={({ item, index }) => {
                        return (
                            <View style={Styles.flatOuterView}>
                                <TouchableOpacity style={[Styles.checkBox, { backgroundColor: item.selected ? AppColors.APP_THEME : 'transparent', borderColor: item.selected ? AppColors.APP_THEME : AppColors.BORDER_COLOR }]} onPress={() => { selectItem(item, index) }}>
                                    {item.selected ? <Image resizeMode='contain' source={Images.tick} style={Styles.checkBoxImg} /> : null}
                                </TouchableOpacity>
                                <Image resizeMode='cover' source={item.profile_image != null ? { uri: IMAGE_URL + item.profile_image } : Images.user} style={Styles.personImage} />
                                <View alignSelf='center'>
                                    <Text style={Styles.nameText}>{item.first_name + (item.last_name ? ' ' + item.last_name : '')}</Text>
                                    <Text style={Styles.addressText}>{item.school_name} {moment(item.created_at).format('YYYY')}</Text></View>
                            </View>
                        )
                    }}
                />
            }
            {/* navigation.replace('EventScreen', {  data: selectedData }) } */}
            <Button title={'Invite'} continue={() => { props.invite(selectedData) }} />
        </View>
    );
}

export default AddPerson;
