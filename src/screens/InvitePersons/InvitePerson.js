import React, { Component, useEffect, useContext } from 'react';
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
import { usePowerState } from 'react-native-device-info';
import { Alert } from 'react-native';


const InvitePerson = ({ navigation, route, setParams }) => {
    const [selectedData, setSelectedData] = React.useState([]);
    const [textToSearch, setTextToSearch] = React.useState('');
    const [searchedData, setSearchedData] = React.useState([]);
    const [allData, setAllData] = React.useState([]);
    const [allDataCopy, setAllDataCopy] = React.useState([]);
    const [seacrhData, setSeacrhData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [mySchool, setMySchool] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [onEndReached, setOnEndReached] = React.useState(false);
    const [total, setTotal] = React.useState();
    const [userTokenDetails, setUserTokenDetail] = React.useState(null);
    const { channel } = useContext(ChatContext);

    const searchText = (text) => {
        setTextToSearch(text);
        if (text.length > 0) {
            let newData1 = allData.filter(x => String(x.first_name.toLowerCase()).includes(text.toLowerCase()));
            let newData2 = allData.filter(x => String(x.last_name.toLowerCase()).includes(text.toLowerCase()));
            let newData = newData1.concat(newData2)
            setSearchedData(newData);
        }
        else {
            setSearchedData([]);
        }
    }

    const selectItem = (item, index) => {

        if (textToSearch.trim().length > 0) {

            if (item.selected) {
                item.selected = false;
                let data = selectedData;
                let _selectedDatas = searchedData.filter(x => String(x.selected).includes('true'));

                // _selectedData[index].selected = false;
                let _selectedData = _selectedDatas.concat(data)
                let wholeData = _selectedData.filter(x => String(x.selected).includes('true'));

                // alert(_selectedData.length)

                var obj = {};
                for (var i = 0, len = wholeData.length; i < len; i++)
                    obj[wholeData[i]['id']] = wholeData[i];

                wholeData = new Array();
                for (var key in obj)
                    wholeData.push(obj[key]);

                    let indexx = allData.findIndex((items) => items.id == item.id);
                    if (indexx >= 0) {
                        let allUsers = allData
                        allUsers[indexx].selected = false
                        setAllData(allUsers)
                    }
                setSelectedData([...wholeData]);


            }
            else {
                // alert(item.id)
                item.selected = true;
                // let newItem = item;
                // newItem.selected = true;

                let _selectedData = searchedData.filter(x => String(x.selected).includes('true'));
                if (selectedData.length > 0) {
                    let data = selectedData;
                    let wholeData = _selectedData.concat(data)

                    var obj = {};
                    for (var i = 0, len = wholeData.length; i < len; i++)
                        obj[wholeData[i]['id']] = wholeData[i];

                    wholeData = new Array();
                    for (var key in obj)
                        wholeData.push(obj[key]);

                    let indexx = allData.findIndex((items) => items.id == item.id);
                    if (indexx >= 0) {
                        let allUsers = allData
                        allUsers[indexx].selected = true
                        setAllData(allUsers)
                    }
                    setSelectedData(wholeData)
                }
                else {
                    var obj = {};
                    for (var i = 0, len = _selectedData.length; i < len; i++)
                        obj[_selectedData[i]['id']] = _selectedData[i];

                    _selectedData = new Array();
                    for (var key in obj)
                        _selectedData.push(obj[key]);
                    setSelectedData([..._selectedData]);
                }

            }

        }
        else {
            if (item.selected) {

                let newItem = item;
                newItem.selected = false;
                let mainData = allData;
                // mainData[item.checkId] = newItem;
                mainData[index] = newItem;
                // let _selectedData = allData.filter(x => String(x.selected).includes('true'));
                // setSelectedData(_selectedData)
              
                setAllData([...mainData])
            }   
            else {
                let newItem = item;
                newItem.selected = true;
                let mainData = allData;
                // mainData[item.checkId] = newItem;
                mainData[index] = newItem;
                setAllData([...mainData])
            }
            

            let _selectedData = allData.filter(x => String(x.selected).includes('true'));
       
            

             
            setSelectedData(_selectedData);
        }

    }

    function comparer(otherArray) {
        return function (current) {
            return otherArray.filter(function (other) {
                return other.id == current.id
            }).length == 0;
        }
    }

    useEffect(() => {
    //    alert(allData.length)
        AsyncStorage.multiGet([CONSTANTS.ACCESS_TOKEN, CONSTANTS.SELECTED_SCHOOL]).then((res) => {
            if (res !== null) {
                let detail = { myToken: res[0][1], mySchool: res[1][1] };
                setUserTokenDetail(detail);
                getList(res[0][1], res[1][1], 1);
                setMySchool(res[1][1]);
            }
        })
    }, []);

    const SearchUser = (text) => {
        setTextToSearch(text)
        AsyncStorage.multiGet([CONSTANTS.ACCESS_TOKEN, CONSTANTS.SELECTED_SCHOOL]).then((res) => {
            if (res !== null) {
                if (text.length > 0) {
                    let formdata = new FormData();
                    formdata.append("search", text !== null ? text : '');
                    let alldata = {
                        token: res[0][1],
                        data: formdata,
                    };
                    Actions.searchUser(alldata)
                        .then((response) => {
                            if (response.data.status === "success") {
                                let data = response.data.data;
                                let users = data.user.data;
                                let resultArr = [];
                                users.map((item) => {
                                    let it = item;
                                    it.selected = false;
                                    resultArr.push(it);
                                })
                                console.log("KKK>>>" + JSON.stringify(users));

                                if (selectedData.length > 0) {

                                    let newData = []
                                    // selectedData.map((item) => {
                                    //     console.log('>>>'+item.id)
                                    //     users.map((items) => {
                                    //         // console.log(items.id)
                                    //         if (item.id == items.id) {
                                    //             // console.log('LLL '+items.id)
                                    //             // newData.push(items)
                                    //         }
                                    //         else
                                    //         {
                                    //             // newData.push(items)
                                    //             console.log('LLL '+items.id)


                                    //         }
                                    //     })
                                    // })
                                    // var array3 = users.filter(function (obj) { return selectedData.indexOf(obj) == -1; });
                                    // alert(JSON.stringify(newData[0].id))


                                    const finalArr = resultArr.filter(({ id }) =>
                                        !selectedData.some(exclude => exclude.id === id)
                                    );
                                    setSearchedData(finalArr);

                                }
                                else {
                                    // alert('hh')
                                    setSearchedData(resultArr)
                                }
                                // let resultArr = users.sort(function (a, b) { return a.first_name.toLowerCase() > b.first_name.toLowerCase() })
                                // console.log('secondTime>> '+JSON.stringify(resultArr))
                                // setAllData(users)
                                setLoading(false);
                            }
                            else {
                                setLoading(false);
                            }
                        })
                        .catch((err) => {
                            // alert(err)
                            if (err && err.response && err.response.status && err.response.status === 401) {
                                refreshToken('', {});

                            }
                            else if (err && err.response && err.response.status && err.response.status === 403) {
                                setLoading(false);
                                SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                                AsyncStorage.clear();
                                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                            }
                            else {
                                setLoading(false);
                                SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                            }

                        });
                }
            }
        })


        // else {

        //     console.log(">>>>>> " + JSON.stringify(allDataCopy))

        //     setAllData(allDataCopy)
        // }

    }



    const getSelectedData = (users) => {

        if (!route.params.fromChat) {
            if (route.params.data.length > 0) {


                setSelectedData(route.params.data)
                let mainData = users;
                users.map((res1, index) => {
                    route.params.data.map((res) => {
                        if (res.id === res1.id) {
                            mainData[index].selected = true;
                        }
                    })
                })
                navigation.setParams({ data: [] });
                setAllData(mainData)
            }
            else {

                if (selectedData.length > 0) {
                    let newData = users;
                    newData.map((item, index) => {
                        // if (selectedData.filter(x =>  x.id === item.id)) {

                        //     // item.selected = true
                        //     alert(item.id)


                        // }
                        selectedData.map((items) => {
                            if (items.id === item.id) {
                                item.selected = true
                            }
                        })

                    })
                    setAllData(newData)
                }
                else {

                    setAllData(users)
                }

            }
        }
        else {

            setAllData(users)
        }
    }


    function filterByDifference(array1, array2) {
        return array1.filter(firstArrayItem =>
            !array2.some(
                secondArrayItem => firstArrayItem.id === secondArrayItem.id
            )
        );
    }


    const getList = (myToken, mySchool, pageNum) => {
        if (route.params.selectedPrivacy == mySchool) {
            AsyncStorage.getItem(CONSTANTS.SELECTED_SCHOOLID).then((schoolId) => {
                Actions.GetSameSchoolMembers(myToken, schoolId)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            let data = response.data.data;
                            let users = data.user.data;
                            let newData = [];
                            let resultArr = users.sort(function (a, b) { return a.first_name.toLowerCase() > b.first_name.toLowerCase() })

                            resultArr.map((item, index) => {
                                let obj = item;
                                obj.checkId = index;
                                obj.selected = false;
                                newData.push(obj)
                            });


                            setAllData(resultArr);
                            console.log("SchoolOnly->>> " + JSON.stringify(users))
                            // console.log(">>>>>>>>???SchoolOnly" + schoolId)
                            getSelectedData(users);
                            setLoading(false);
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        if (err && err.response && err.response.status && err.response.status === 401) {
                            refreshToken('', {});
                        }
                        else if (err && err.response && err.response.status && err.response.status === 403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity('Something went wrong' + err, SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            })

        }
        else {
            Actions.GetUserList(myToken, pageNum)
                .then((response) => {

                    if (response.data.status === 'success') {
                        setTotal(response.data.data.user.total)
                        let data = response.data.data;
                        let users = data.user.data;
                        let resultArr = users.sort(function (a, b) { return a.first_name.toLowerCase() > b.first_name.toLowerCase() })

                        console.log("publicOnl->>>" + JSON.stringify(response))
                        if (route.params.fromChat === undefined) {
                            let newData = [];
                            resultArr.map((item, index) => {
                                let obj = item;
                                obj.checkId = index;
                                obj.selected = false;
                                newData.push(obj)
                            })
                            let previousArr = [...allData];
                            if (previousArr.length > 0) {
                                if (previousArr.length != response.data.data.user.total) {
                                    let mainArr = previousArr.concat(newData);
                                    console.log('hfdsdsdsds ' + JSON.stringify(mainArr))


                                    getSelectedData(mainArr);


                                    // setAllData(mainArr);
                                    // setAllDataCopy(mainArr);

                                    setLoading(false);
                                }

                            }
                            else {
                                // alert('3')
                                setAllData(resultArr);
                                console.log('firstTime>> ' + JSON.stringify(resultArr))
                                setAllDataCopy(resultArr);
                                // alert('2')
                                getSelectedData(resultArr);
                                setLoading(false);
                            }
                            // setAllData(resultArr);
                            // getSelectedData(resultArr);
                            setLoading(false);
                        }
                        else {

                            let arr = route.params.channel.state.members;
                            const result = Object.keys(arr).map((key) => arr[key]);
                            let newData = [];

                            result.map((item, index) => {
                                if (item.user_id != getClient().user.id) {
                                    let obj = {}
                                    obj.checkId = index;
                                    obj.selected = false;
                                    obj.id = Number(item.user.id);
                                    obj.created_at = item.user.created_at;
                                    obj.email = item.user.email;
                                    obj.school_name = '';
                                    obj.first_name = item.user.name;
                                    obj.profile_image = item.user.image
                                    newData.push(obj);
                                }
                            })
                            let m = filterByDifference(resultArr, newData);
                            setAllData(m);
                            setLoading(false);
                        }
                    }
                    else {
                        setLoading(false);
                        SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                    }
                })
                .catch((err) => {
                    if (err && err.response && err.response.status && err.response.status === 401) {
                        refreshToken('', {});
                    }
                    else if (err && err.response && err.response.status && err.response.status === 403) {
                        setLoading(false);
                        SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                        AsyncStorage.clear();
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                    else {
                        setLoading(false);
                        SimpleToast.showWithGravity('Something went wrong' + err, SimpleToast.SHORT, SimpleToast.CENTER);
                    }
                })
        }
    }


    const refreshToken = (state, itemToUpdate) => {
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
                            if (state === 'update') {
                                UpdateTheGroup(itemToUpdate.id, itemToUpdate.members, itemToUpdate.school, itemToUpdate.type, itemToUpdate.channelname)
                            } else {
                                getList(token.access_token, res[1][0], page)
                            }
                            setLoading(false);

                        }
                    })
                    .catch((err) => {
                        console.log(err.response.data)
                        setLoading(false);
                        // SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                    })
            }
            else {
                setLoading(false)
            }
        })
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
    const addMembers = () => {
        if (selectedData.length === 0) {
            alert('Please select atleast 1 member')
        }
        else {
            setLoading(true)
            //    console.log('jj',channel)
            let selectedIds = [];
            let selectednames = '';

            const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
            AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then(async (response) => {

                if (response !== null) {
                    let data = JSON.parse(response[1][1]);
                    const userTokken = response[0][1];
                    const user = {
                        id: String(data.id),
                        name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
                    };
                    chatClient.setUser(user, userTokken);
                    const MyChannel = chatClient.channel('messaging', channel.id, {
                    });


                    const members = Object.keys(channel.state.members).map((key) => channel.state.members[key]);

                    let newData = [];
                    members.map((res) => {
                        newData.push(res.user);
                    });

                    let a = newData;
                    let b = selectedData;
                    let final = b.filter(comparer(a));
                    final.map((res) => {
                        selectedIds.push(String(res.id));
                        if (selectednames === '') {
                            selectednames = res.first_name;
                        }
                        else {
                            selectednames = selectednames + ',' + res.first_name;
                        }
                    })

                    MyChannel.addMembers(selectedIds, { text: selectednames + ' joined the channel.' })
                        .then((res) => {
                            console.log('respo' + JSON.stringify(res))
                            // setLoading(false);
                            // navigation.reset({ index: 0, routes: [{ name: 'Chat' }] });
                            UpdateTheGroup(channel.id, res.channel.member_count, res.channel.school, res.channel.Grouptype, channel.data.name);
                        }).
                        catch((err) => {
                            setLoading(false);
                            SimpleToast.showWithGravity("This channel is not created by you, You can't add member in this group", SimpleToast.SHORT, SimpleToast.CENTER);
                            navigation.reset({ index: 0, routes: [{ name: 'Chat' }] });
                        })
                }
            })
        }
    }
    const onLoad = () => {

        // AsyncStorage.multiGet([CONSTANTS.ACCESS_TOKEN, CONSTANTS.SELECTED_SCHOOL]).then((res) => {
        if (textToSearch == '') {

            if (userTokenDetails !== null) {
                let arr = [...allData];
                if (total === arr.length) {
                    setOnEndReached(false);
                }
                else {

                    setOnEndReached(true);
                    setPage(page + 1)
                    // getSchoolList(page + 1)

                    getList(userTokenDetails.myToken, userTokenDetails.mySchool, page + 1);
                    setMySchool(userTokenDetails.mySchool);
                }

            }
        }

        // })
    }

    const UpdateTheGroup = (id, members, school, type, channelname) => {
        if (!isNaN(school)) {
            AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
                if (myToken !== null) {
                    let formdata = new FormData();
                    formdata.append("total_members", String(members));
                    formdata.append("school", Number(school));
                    formdata.append("type", type);
                    formdata.append("channel_name", channelname)
                    formdata.append("_method", 'put');
                    let data = {
                        data: formdata,
                        id: id,
                        token: myToken
                    }
                    Actions.UpdateChannel(data)
                        .then((response) => {
                            console.log('jhjh ' + JSON.stringify(response.data))
                            if (response.data.status === 'success') {
                                setLoading(false);
                                navigation.reset({ index: 0, routes: [{ name: 'Chat' }] });
                            }
                        })
                        .catch((err) => {
                            if (err && err.response && err.response.status && err.response.status === 401) {
                                let itm = { id: id, members: members, school: school, type: type, channelname: channelname }
                                refreshToken('update', itm);
                            }
                            else if (err && err.response && err.response.status && err.response.status === 403) {
                                setLoading(false);
                                SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                                AsyncStorage.clear();
                                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                            }
                            else {
                                console.log("error " + JSON.stringify(err))
                            }
                        })
                }
            })
        }
        else {
            setLoading(false);
            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
        }
    }

    const back = () => {
        if (route.params.fromChat) { navigation.goBack() }
        else {
            navigation.replace('CreateGroup', { groupName: route.params.groupName, selectedPrivacy: route.params.selectedPrivacy, imageObject: route.params.imageObject, accepted: route.params.accepted, data: [] })
        }
    }

    return (
        <View style={Styles.container}>
            <HeaderView title='Invite Peer To group' white onLeftClick={() => { back() }} />
            {loading ? <Spinner /> : null}

            {textToSearch === '' && selectedData.length > 0 ?
                <View style={{ paddingVertical: hp(1), width: wp(100), height: hp(15), backgroundColor: AppColors.LIGHT_GREY }}>
                    <FlatList
                        horizontal={true}
                        data={[...selectedData]}
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
                                    <Text numberOfLines={1} style={[Styles.addressText, { color: AppColors.INPUT, paddingTop: hp(0.8), alignSelf: 'center' }]}>{item.first_name + (item.last_name ? ' ' + item.last_name : '')}</Text>
                                </View>
                            )
                        }}
                    />
                </View>
                : null}
            <View style={Styles.searchViewContainer}>
                <Image resizeMode="contain" source={Images.greenSearch} style={Styles.searchIcon} />
                <TextInput
                    value={textToSearch}
                    // onChangeText={(text) => searchText(text)}
                    onChangeText={(text) => SearchUser(text)}
                    placeholderTextColor={AppColors.GREY_TEXT}
                    placeholder="Search People"
                    style={Styles.searchTextinput} />
                {textToSearch ?
                    <TouchableOpacity onPress={() => { setTextToSearch(''); setSearchedData([]) }}>
                        <Image resizeMode="contain" source={Images.cross} style={Styles.searchIcon} />
                    </TouchableOpacity>
                    : null}
            </View>

            {/* {textToSearch !== '' && searchedData.length === 0 ? */}
            {textToSearch !== '' && allData.length === 0 ?

                <View style={{ height: hp(73) }}><Text>No Data found</Text></View> :
                <FlatList
                    style={{ width: wp(90), }}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={renderFooter}
                    initialNumToRender={15}
                    maxToRenderPerBatch={2}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => { setOnEndReached(false) }}
                    onEndReached={() => {
                        if (!onEndReached) {
                            onLoad()
                        }
                    }}
                    data={textToSearch === '' ? [...allData] : searchedData}
                    // data={[...allData]}

                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={Styles.flatOuterView}>
                                <TouchableOpacity style={{
                                    height: hp(4.2),
                                    width: hp(4.2),
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                }} onPress={() => { selectItem(item, index) }}>
                                    <View style={[Styles.checkBox, { backgroundColor: item.selected ? AppColors.APP_THEME : 'transparent', borderColor: item.selected ? AppColors.APP_THEME : AppColors.BORDER_COLOR }]}>
                                        {item.selected ? <Image resizeMode='contain' source={Images.tick} style={Styles.checkBoxImg} /> : null}
                                    </View>
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
            <Button title={route.params.fromChat ? 'Add Member' : 'Invite'} continue={() => { if (route.params.fromChat) { addMembers() } else { navigation.replace('CreateGroup', { groupName: route.params.groupName, selectedPrivacy: route.params.selectedPrivacy, imageObject: route.params.imageObject, accepted: route.params.accepted, data: selectedData }) } }} />
        </View>
    );
}

export default InvitePerson;
