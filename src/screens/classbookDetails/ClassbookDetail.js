import React, { useContext, useState } from 'react';
import { View, Text, ImageBackground, Image, Linking } from 'react-native';
import Styles from './Styles';
import Images from '../../assets/Images';
import { IMAGE_URL } from '../../webServices/EndPoints';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CONSTANTS from '../../utils/Constants';
import { StreamChat } from "stream-chat";
import { ChatContext } from '../../navigation/TabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClient } from '../../utils';
import Spinner from '../../components/Spinner';
import SimpleToast from 'react-native-simple-toast';

const ClassbookDetail = ({ navigation, route }) => {
    const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
    const { setChannel } = useContext(ChatContext);
    const [loading, setLoading] = useState(false);
    const {
        PERSONAL_INTEREST,
        PERSON_ID,
        COMPANY_INTEREST, GRADUTION,
        PERSON_NAME,
        PERSON_IMAGE,
        PREV_JOB,
        HOME_STATE,
        PREV_LOCATION,
        REC_INTEREST,
        FIRST_NAME,
        SOCIAL_ID } = route.params;

    const MidView = (props) => {
        // let names = props.data.length;
        let jobName = ''
        if (props.job) {
            if (props.data != 'Not Found') {
                console.log(props.data)
                props.data.map((res) => {
                    if (jobName === '') {
                        jobName = res.name;
                    } else {
                        jobName = jobName + ', ' + res.name
                    }
                })
            }
            else {
                jobName = 'Not Found'
            }
        }

        return (
            <View style={Styles.midViewContainer} >
                <Text style={Styles.midTitleText} >{props.title}</Text>
                <Text  style={Styles.midTextData} >{props.job ? jobName : props.data}</Text>
            </View>
        )
    }
   
    const connectToMember = () => {
        setLoading(true);

        AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then(async (response) => {
            if (response !== null) {
                let data = JSON.parse(response[1][1]);
                const userTokken = response[0][1];
                const user = {
                    id: String(data.id),
                    name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
                };
                await chatClient.connectUser(user, userTokken)

                let Client = getClient();
                const channels = await Client.queryChannels({
                    members: { $in: [String(Client.user.id)] },
                });
                let filteredData = [];
                let res = channels.filter(x => x.data.name.includes(PERSON_NAME))
                channels.map((res) => {

                    if (res.data.member_count === 2) {
                        let arr = res.state.members;
                        const result = Object.keys(arr).map((key) => arr[key]);

                        if ((result[0].user.id === getClient().user.id && result[1].user.name === PERSON_NAME) || (result[1].user.id === getClient().user.id && result[0].user.name === PERSON_NAME)) {
                            filteredData.push(res)
                        }
                    }
                })
                if (res.length > 0) {
                    setLoading(false)
                    setChannel(res[0]);
                    navigation.navigate('ChatMessage')
                }
                else if (filteredData.length > 0) {
                    // alert(JSON.stringify(filteredData))
                    setLoading(false)
                    setChannel(filteredData[0]);
                    navigation.navigate('ChatMessage')
                }
                else {

                    const channel = chatClient.channel('messaging', String(Math.floor(Math.random() * 1000) + 1) + String(PERSON_ID), {
                        name: PERSON_NAME,
                        image: PERSON_IMAGE,
                        members: [String(PERSON_ID), String(data.id)],
                        session: 8,
                    });
                    channel.create().then((response) => {
                        console.log("##" + JSON.stringify(response));
                        if (response) {
                            setLoading(false)
                            setChannel(channel);
                            navigation.navigate('ChatMessage')
                        }
                    })
                        .catch((err) => {
                            setLoading(false)
                            SimpleToast.showWithGravity('This user is not registered with this client', SimpleToast.SHORT, SimpleToast.CENTER);

                        })}
            } else {
                setLoading(false)
            }
        })
    }
    
    return (
        <ScrollView style={Styles.container}>
            {loading ? <Spinner /> : null}
            <ImageBackground resizeMode='cover' style={Styles.imageBackground} source={PERSON_IMAGE != null ? { uri: IMAGE_URL + PERSON_IMAGE } : null} >
               <View style={Styles.imageBackground2}>
                <TouchableOpacity style={Styles.backArrow} onPress={() => navigation.goBack()}>
                    <Image source={Images.white_back} style={Styles.backArrowImage} />
                </TouchableOpacity>
                <View style={Styles.upperbackgroundBottom} >
                    <View style={Styles.upperbottomView} >
                        <Text style={Styles.nameText} >{PERSON_NAME}</Text>
                        <TouchableOpacity onPress={() => connectToMember()} style={Styles.messageBtnContainer} >
                            <Text style={Styles.btnText} >Message {FIRST_NAME}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
            </ImageBackground>
            <View style={Styles.midContainer} >
                <MidView title='Homestate' data={HOME_STATE} />
                <MidView title='Previous Location' data={PREV_LOCATION} />
                <MidView job title='Previous Job' data={PREV_JOB} />
                <MidView job title='Recruiting Interest' data={REC_INTEREST} />
                <MidView job title='Personal Interest' data={PERSONAL_INTEREST} />
                <MidView title='Company Interest' data={COMPANY_INTEREST} />
                <MidView title='Graduation' data={GRADUTION} />
            </View>
            <TouchableOpacity style={Styles.messageBottomBtn} onPress={() => connectToMember()} >
                <Image source={Images.comment} resizeMode='contain' style={Styles.bottomBtnIcon} />
                <Text style={Styles.bottomBtnText}>Message {PERSON_NAME}</Text>
            </TouchableOpacity>
            {
                SOCIAL_ID != null ?
                    <TouchableOpacity style={Styles.linkdinBtnContainer} onPress={() => { Linking.openURL('https://www.linkedin.com/in/' + SOCIAL_ID) }} >
                        <Image source={Images.in} resizeMode='contain' style={Styles.bottomBtnIcon} />
                        <Text style={Styles.bottomBtnText}>{PERSON_NAME} Profile</Text>
                    </TouchableOpacity>:null
            }
        </ScrollView>
    );
}

export default ClassbookDetail;
