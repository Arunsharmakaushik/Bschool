import React, { Component, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { GroupStyles } from './Styles';
import HeaderView from '../../components/HeaderView';
import Images from '../../assets/Images';
import ImagePicker from 'react-native-image-crop-picker';
import InputView from '../../components/InputView';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';
import Button from '../../components/Button';
import { DEFAULT_GROUP_IMG, IMAGE_URL, THUMBNAIL_URL } from '../../webServices/EndPoints';
import SimpleToast from 'react-native-simple-toast';
import { StreamChat } from "stream-chat";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import Spinner from '../../components/Spinner';
import Actions from '../../webServices/Action';
import { createThumbnail } from 'react-native-create-thumbnail';
import { Platform } from 'react-native';

const CreateGroup = ({ navigation, route }) => {
    const [imageObject, setImageObject] = React.useState({});
    const [focusId, setFocusId] = React.useState('');
    const [accepted, setAccepted] = React.useState(false);
    const [selectedPrivacy, setPrivacy] = React.useState('');
    const [groupName, setGroupName] = React.useState('');
    const [selectedData, setSelectedData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [mySchool, setMySchool] = React.useState('');

    useEffect(() => {
        AsyncStorage.getItem(CONSTANTS.SELECTED_SCHOOL).then((school) => {
            if (school !== null) {
                setMySchool(school)
            }
        })
        if (route.params) {
            setGroupName(route.params.groupName);
            setImageObject(route.params.imageObject);
            setPrivacy(route.params.selectedPrivacy);
            setAccepted(route.params.accepted);
            route.params.data.map((item) => {
                let data = selectedData;
                data.push(item);
                setSelectedData([...data]);
            })
        }
    }, []);

    const OpenGallary = () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                compressImageMaxWidth: 300,
                compressImageMaxHeight: 300,
                compressImageQuality: 0.8,
                path: 'images'
            },
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
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
                const file = {
                    name: "Image" + date + ".jpg",
                    type: response.mime,
                    path: Platform.OS === "android" ? response.path : response.path.replace("file://", ""),
                    // uri: `data:${response.mime};base64,` + response.data,
                }
                setImageObject(file);


            }
        })
    }

    const refreshToken = (state, itemToAdd) => {
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
                            if (state === 'add') {
                                addCreatedGroup(itemToAdd.id, itemToAdd.type, itemToAdd.school, itemToAdd.members, itemToAdd.groupName)
                            }
                            else {
                                checkBeforeSend();
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

    const checkBeforeSend = async () => {
        console.log(imageObject.path);

        if (imageObject.path) {
            let file = {
                uri: imageObject.path,
                name: imageObject.name,
                type: imageObject.type
            }
            let formdata = new FormData();
            formdata.append("thumbnail", file);
            setLoading(true);
            AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.ACCESS_TOKEN]).then((res) => {
                if (res !== null) {
                    let data = {
                        token: res[1][1],
                        data: formdata
                    }

                    Actions.UpoadThumbnail(data)
                        .then((response) => {
                            // console.log("refreshed " + JSON.stringify(response))
                            if (response.data.status === 'success') {
                                setLoading(false);
                                let data = response.data.data;
                                console.log("THUMBNAIL_URL " + THUMBNAIL_URL + data.thumbnail)

                                CreateNewChannel(THUMBNAIL_URL + data.thumbnail);
                            }
                        })
                        .catch((err) => {
                            //   alert(err)
                            if (err&&err.response&&err.response.status&& err.response.status === 401) {
                                refreshToken('', {});
                            }
                            else if (err&&err.response&&err.response.status&& err.response.status ===403) {
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
            })
        }
        else {
            CreateNewChannel(DEFAULT_GROUP_IMG)
        }
    }

    const groupCreated = () => {
        if (!groupName) {
            SimpleToast.showWithGravity('Please enter Group name', SimpleToast.SHORT, SimpleToast.CENTER)
        }
        else if (selectedData.length == 0) {
            SimpleToast.showWithGravity('Please select Participant to add in group', SimpleToast.SHORT, SimpleToast.CENTER)
        }
        else if (selectedPrivacy === '') {
            SimpleToast.showWithGravity('Please select privacy type.', SimpleToast.SHORT, SimpleToast.CENTER)
        }
        else if (selectedPrivacy !== route.params.selectedPrivacy) {
            SimpleToast.showWithGravity('You have changed your privacty type please select the Participants again', SimpleToast.SHORT, SimpleToast.CENTER)
            setSelectedData([]);
        }
        else if (selectedData.length === 1) {
            SimpleToast.showWithGravity('Please select atleast 2 Participants to add in group', SimpleToast.SHORT, SimpleToast.CENTER)
        }
        else {

            checkBeforeSend()
        }
    }

    const CreateNewChannel = (IMAGE) => {
        let selectedIds = []
        selectedData.map((item) => {
            let id = String(item.id);
            selectedIds.push(id);
        });
        const chatClient2 = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
        chatClient2.disconnect();
        AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS', CONSTANTS.SELECTED_SCHOOL, CONSTANTS.SELECTED_SCHOOLID]).then((response) => {
            if (response !== null) {
                setLoading(true);
                let data = JSON.parse(response[1][1]);
                let schoolName = response[2][1];
                let school = response[3][1];
                const userToken = response[0][1];
                const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY, {
                    timeout: 6000
                });
                selectedIds.push(String(data.id));
                chatClient.connectUser(
                    {
                        id: String(data.id),
                        name: data.first_name + (data.last_name ? ' ' + data.last_name : '')
                    },
                    userToken);
                let gname = groupName.replace(/[^a-zA-Z]/g, "");

                const channel = chatClient.channel('messaging', gname,
                    {
                        name: groupName,
                        image: IMAGE,
                        members: selectedIds,
                        session: 8,
                        Grouptype: selectedPrivacy,
                        school: String(school)
                    });
                channel.create().then((response) => {
                    console.log("##" + groupName);
                    console.log("####", response);

                    addCreatedGroup(gname, selectedPrivacy, school, selectedIds.length, groupName)
                }).catch((err) => {
                    console.log(err)
                    setLoading(false)
                    SimpleToast.showWithGravity('Group name is already exist', SimpleToast.SHORT, SimpleToast.CENTER)
                })
            }
        });
    }

    const addCreatedGroup = (id, type, school, members, groupName) => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                let formdata = new FormData();
                formdata.append("channel_id", id);
                formdata.append("type", type);
                formdata.append("school", Number(school));
                formdata.append("total_members", String(members));
                formdata.append("channel_name", groupName)
                let data = { data: formdata, token: myToken };
                console.log("channel form " + JSON.stringify(data))
                Actions.AddChannel(data)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            setLoading(false);
                            navigation.navigate('Home')
                        }
                    })
                    .catch((err) => {
                        //   alert(err)
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            let item = { id: id, type: type, school: school, members: members, groupName: groupName }
                            refreshToken('add', item);
                        }
                        else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false)
                            console.log("ee " + JSON.stringify(err.response.data))
                            console.log("error " + JSON.stringify(err))
                        }
                    })
            }
        })
    }

    const addParticipants = () => {
        if (selectedPrivacy === '') {
            SimpleToast.showWithGravity('Please select Privacy Type', SimpleToast.SHORT, SimpleToast.CENTER)
        }
        else {
            navigation.navigate('InvitePerson', { 'groupName': groupName, 'imageObject': imageObject, 'selectedPrivacy': selectedPrivacy, 'accepted': accepted, 'data': selectedData })
        }
    }

    return (
        <View style={GroupStyles.container}>
            <HeaderView title='Create Chat' group white onLeftClick={() => { navigation.goBack() }} />
            {loading ? <Spinner /> : null}
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={() => { OpenGallary() }} style={GroupStyles.topImageVIew}>
                    {imageObject.path ?
                        <Image resizeMode='cover' source={{ uri: imageObject.path }} style={GroupStyles.topImage} /> :
                        <>
                            <Image resizeMode='contain' source={Images.addImage} style={GroupStyles.addImg} />
                            <Text style={GroupStyles.addText}>Add Group Picture</Text></ >}
                </TouchableOpacity>
                <InputView
                    onFocus={() => setFocusId(0)}
                    id={0}
                    style={{ marginTop: hp(3.5), marginBottom: 5 }}
                    returnKeyType='next'
                    onSubmitEditing={() => { }}
                    focusId={focusId}
                    value={groupName}
                    onChangeText={setGroupName}
                    placeholder='Group Name'
                    placeholderTextColor={AppColors.BORDER_COLOR}
                />
                <View style={GroupStyles.adminChangeView}>
                    <Text style={GroupStyles.adminText}>Only admin can change the group name</Text>
                    <TouchableOpacity style={[GroupStyles.checkBox, { backgroundColor: accepted ? AppColors.APP_THEME : 'transparent', borderColor: accepted ? AppColors.APP_THEME : AppColors.BORDER_COLOR }]} onPress={() => setAccepted(!accepted)}>
                        {accepted ? <Image resizeMode='contain' source={Images.tick} style={GroupStyles.checkBoxImg} /> : null}
                    </TouchableOpacity>
                </View>
                <Text style={GroupStyles.headingText}>Select Privacy Type</Text>
                <View style={GroupStyles.privacyView}>
                    <PrivacyTypeView selected={selectedPrivacy === 'Public' ? true : false} descripition='anyone can join this group' privacy='Public' onPress={() => setPrivacy('Public')} />
                    <PrivacyTypeView selected={selectedPrivacy === 'Private' ? true : false} descripition='only people given access can be join' privacy='Private' onPress={() => setPrivacy('Private')} />
                    <PrivacyTypeView selected={selectedPrivacy === mySchool ? true : false} descripition='only people from school only can be join' privacy={'School only' + '\n' + CONSTANTS.MYSCHOOL + ' only'} onPress={() => setPrivacy(mySchool)} />
                </View>
                <Text style={GroupStyles.headingText}>Invite Member</Text>
                {selectedData.length > 0 ?
                    <FlatList
                        style={{ width: wp(90) }}
                        data={selectedData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    <Image resizeMode='cover' source={item.profile_image != null ? { uri: IMAGE_URL + item.profile_image } : Images.user} style={GroupStyles.personImage} />
                                    <Text style={GroupStyles.addText}>{item.first_name + (item.last_name ? ' ' + item.last_name : '')}</Text>
                                </View>
                            )
                        }}
                    /> : null}
                <TouchableOpacity style={GroupStyles.adminChangeView} onPress={() => { addParticipants() }}>
                    <TouchableOpacity onPress={() => { addParticipants() }}>
                        <Image resizeMode='cover' source={Images.greenAdd} style={[GroupStyles.addImg, { marginBottom: 0 }]} />
                    </TouchableOpacity>
                    <Text style={[GroupStyles.addText, { marginLeft: wp(5), }]}>Add Participant</Text>
                </TouchableOpacity>
            </ScrollView>
            <Button title={'Create Group'} continue={() => { groupCreated() }} />
        </View>
    );
}

const PrivacyTypeView = (props) => {
    return (
        <TouchableOpacity onPress={() => { props.onPress() }} style={[GroupStyles.privacyOuterView, { backgroundColor: props.selected ? AppColors.FILLED_COLOR : 'transparent', borderColor: props.selected ? AppColors.APP_THEME : AppColors.PRIVACY_BORDER, marginHorizontal: props.privacy === 'Private' ? wp(2) : 0 }]}>
            <Text numberOfLines={2} style={[GroupStyles.privacyText, { paddingHorizontal: 5 }]}>{props.privacy}</Text>
            <Text style={GroupStyles.privacydescription}>{props.descripition}</Text>
        </TouchableOpacity>
    )
}

export default CreateGroup;
