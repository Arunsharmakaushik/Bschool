import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, TextInput } from 'react-native';
import Styles from './Styles';
import HeaderView from '../../components/HeaderView';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import AppColors from '../../utils/AppColors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChatContext } from '../../navigation/TabNavigator';
import moment from 'moment';
import { AllGroupStyles } from '../chats/Styles';
import Icon from 'react-native-vector-icons/AntDesign';
import FirstStage from './FirstStage'
import SecondStage from './SecondStage';
import ThirdStage from './ThirdStage';
import FourthStage from './FourthStage';
import { getClient } from '../../utils';
import { IMAGE_URL } from '../../webServices/EndPoints';

const ChatDescription = ({ navigation, route }) => {
    const [index, setIndex] = useState(3);
    const [sharedLink, setsharedLink] = useState([]);
    const [sharedTag, setsharedTag] = useState([]);
    const { channel, setChannel } = useContext(ChatContext);
    const [selectedId, setselectedId] = useState('');
    const [open, setOpen] = useState(false);
    const [todayContents, setTodayContent] = useState([]);
    const [weekContents, setWeekContent] = useState([]);
    const [monthContents, setMonthContent] = useState([]);
    const [totalContents, setTotalContent] = useState([]);
    const [popularMessage, setpopularMessage] = useState([]);
    const [pinnedMessage, setpinnedMessage] = useState([]);
    const [loading, setLoading] = useState(false);

    const [routes] = useState([
        { key: 'first', title: 'Day', tabStyle: { backgroundColor: AppColors.APP_THEME } },
        { key: 'second', title: 'Week' },
        { key: 'third', title: 'Month' },
        { key: 'fourth', title: 'Lifetime' },
    ]);

    const DATA = [
        { date: 'May 15 2020', heading: 'What Is The Big R For Marketing Your Business', type: 'Types Of Cookware Pots And Pangdjsg dshgdjh hsgdh', link: 'www.yourwebsite.com' },
        { date: 'May 16 2020', heading: 'WMotivation The Defining Moment Of Self Improvement', type: 'Types Of Cookware Pots And Pangdjsg dshgdjh hsgdh', link: 'www.yourwebsite.com' },
        { date: 'May 16 2020', heading: 'Search Engine Optimization And Advertising', type: 'Types Of Cookware Pots And Pangdjsg dshgdjh hsgdh', link: 'www.yourwebsite.com' },
        { date: 'May 17 2020', heading: 'Free Philippine Real Estate Ads Forums And Classifieds', type: 'Types Of Cookware Pots And Pangdjsg dshgdjh hsgdh', link: 'www.yourwebsite.com' },
        { date: 'May 18 2020', heading: 'What Is The Big R For Marketing Your Business', type: 'Types Of Cookware Pots And Pangdjsg dshgdjh hsgdh', link: 'www.yourwebsite.com' }];

    const FirstRoute = () => (
        <>
            <FirstStage sharedTag={[...sharedTag]} channel={channel} monthContents={[...monthContents]} totalContents={[...totalContents]} todayContents={[...todayContents]} weekContents={[...weekContents]} popularMessage={[...popularMessage]} pinnedMessage={[...pinnedMessage]} status={'first'} title={route.params.title} sharedLink={[...sharedLink]} />
        </>
    );

    const SecondRoute = () => (
        <>
            <SecondStage sharedTag={[...sharedTag]} channel={channel} monthContents={[...monthContents]} totalContents={[...totalContents]} todayContents={[...todayContents]} weekContents={[...weekContents]} popularMessage={[...popularMessage]} pinnedMessage={[...pinnedMessage]} status={'second'} title={route.params.title} sharedLink={[...sharedLink]} />
        </>
    );

    const ThirdRoute = () => (
        <>
            <ThirdStage sharedTag={[...sharedTag]} channel={channel} monthContents={[...monthContents]} totalContents={[...totalContents]} todayContents={[...todayContents]} weekContents={[...weekContents]} popularMessage={[...popularMessage]} pinnedMessage={[...pinnedMessage]} status={'third'} title={route.params.title} sharedLink={[...sharedLink]} />
        </>
    );

    const FourthRoute = () => (
        <>
            <FourthStage sharedTag={[...sharedTag]} channel={channel} monthContents={[...monthContents]} totalContents={[...totalContents]} todayContents={[...todayContents]} weekContents={[...weekContents]} popularMessage={[...popularMessage]} pinnedMessage={[...pinnedMessage]} status={'fourth'} title={route.params.title} sharedLink={[...sharedLink]} />
        </>
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
        fourth: FourthRoute
    });

    useEffect(() => {
        if (route.params.title === 'Tags') {
            getTagText();
        }
        else if (route.params.title === 'Popular') {
            (async () => {
                let CC = getClient();
                const channels = await CC.queryChannels({
                    members: { $in: [String(CC.user.id)] },
                });
                channels.map((res) => {
                    if (res.id === channel.id) {
                        getPopularText(res)
                    }
                })
            })()
        }
        else if (route.params.title === 'Pinned') {
            (async () => {
                let CC = getClient();
                const channels = await CC.queryChannels({
                    members: { $in: [String(CC.user.id)] },
                });
                channels.map((res) => {
                    if (res.id === channel.id) {
                        setLoading(true);
                        getPinnedText(res);
                    }
                })
            })()
        }
        else {
            getLinks();
        }
    }, ([]));

    const getPopularText = (res) => {
        let popularText = [];
        let count = 0;
        res.state.messages.map((res) => {
            if (res.deleted_at) {
            } else {
                if (Object.keys(res.reaction_counts).length !== 0) {
                    for (var prop in res.reaction_counts) {
                        if (res.reaction_counts[prop] !== undefined) {
                            count = res.reaction_counts[prop] + count
                        }
                    }
                    if (count >= 2) {
                        let maindata = channel.data;
                        let attachmentData = res.attachments;
                        if (attachmentData.length > 0) {
                            attachmentData.map((response) => {
                                let data = {
                                    image: maindata.created_by.image,
                                    created_at: res.created_at,
                                    name: maindata.name,
                                    message: res.text,
                                    reactionCount: Object.keys(res.reaction_counts).length,
                                    reactions: res.latest_reactions,
                                    attachments: response.image_url
                                }
                                popularText.push(data)
                            })
                        }
                        else {
                            let data = {
                                image: maindata.created_by.image,
                                created_at: res.created_at,
                                name: maindata.name,
                                message: res.text,
                                reactionCount: Object.keys(res.reaction_counts).length,
                                reactions: res.latest_reactions,
                            }
                            popularText.push(data)
                        }
                    }
                }
            }
            count = 0;
        })
        setpopularMessage(popularText);
    }

    const getTagText = () => {
        let sharedTags = [];
        channel.state.messages.map((res, index) => {
            if (res.deleted_at) {
            } else {
                const resTag = res.text.match(/\#\w\w+\s?/g);
                if (resTag !== null) {
                    let mainText = resTag[0];
                    let data = {
                        mainTag: mainText.split(" ")[0],
                        details: [],
                    }
                    sharedTags.push(data);
                    let todayDate = new Date();
                    if (sharedTags.length > 0 && sharedTags.length < index + 1) {
                        let content = {
                            id: index,
                            name: data.mainTag,
                            customItem: (
                                <MainView open={open} members={'0 Groups'} selectedId={selectedId} id={0} heading={data.mainTag} />
                            ),
                            subCategory: [
                                {
                                    customInnerItem: (
                                        <ExpandView navigation={navigation} data={[{ message: res.text, name: res.user.name, created_at: res.created_at, image: res.user.image, attachments: res.attachments, }]} />
                                    )
                                }]
                        }
                        totalContents.push(content);
                        if (moment(res.created_at).format('DD-MM-YYYY') === (moment(todayDate).format('DD-MM-YYYY'))) {
                            todayContents.push(content);
                        }
                        var newDate = moment(moment(res.created_at).format('DD-MM-YYYY'), 'DD-MM-YYYY');
                        var today = moment(moment(todayDate).format('DD-MM-YYYY'), 'DD-MM-YYYY');
                        let diff = today.diff(newDate, 'days');
                        if (diff <= 7) {
                            weekContents.push(content);
                        }
                        if (moment(todayDate).format('YYYY') === moment(res.created_at).format('YYYY')) {
                            if (moment(todayDate).format('MM') === moment(res.created_at).format('MM')) {
                                monthContents.push(content);
                            }
                        }
                    }
                }
            }
        })
        setsharedTag(sharedTags);
    }

    const getLinks = () => {
        let sharedLinks = [];
        var urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        channel.state.messages.map((res) => {
            if (res.deleted_at) {
            } else {
                var text = res.text.match(urlRegex);
                if (text !== null) {
                    console.log("jjjj " + JSON.stringify(res))
                    let img = res.attachments.length > 0 ? res.attachments[0].image_url : null;
                    let data = {
                        link: text[0],
                        image: img,
                        date: moment(res.created_at).format('MMM DD, YYYY'),
                        heading: res.user.name,
                    }
                    sharedLinks.push(data)
                }
            }
        })
        setsharedLink([...sharedLinks]);
    }

    const getPinnedText = (myChannel) => {
        let pinnedText = [];
        if (myChannel.state.messages.length > 0) {
            myChannel.state.messages.map((res) => {
                if (res.deleted_at) {
                }
                else {
                    if (res.pinned) {
                        let maindata = channel.data;
                        let attachmentData = res.attachments;
                        if (attachmentData.length > 0) {
                            attachmentData.map((response) => {

                                let data = {
                                    image: maindata.created_by.image,
                                    created_at: res.pinned_at,
                                    name: maindata.name,
                                    message: res.text,
                                    reactionCount: Object.keys(res.reaction_counts).length,
                                    reactions: res.latest_reactions,
                                    attachments: response.image_url
                                }
                                pinnedText.push(data)
                            })
                        }
                        else {
                            console.log('res ', res)
                            let data = {
                                image: maindata.created_by.image,
                                created_at: res.pinned_at,
                                name: maindata.name,
                                message: res.text,
                                reactionCount: Object.keys(res.reaction_counts).length,
                                reactions: res.latest_reactions,
                            }
                            pinnedText.push(data)
                        }
                    } else {
                        setLoading(false)
                    }
                }
            })
            setpinnedMessage(pinnedText);
            setLoading(false)
        }
        else {
            setLoading(false);
        }
    }

    return (
        <View style={Styles.container}>
            <HeaderView onLeftClick={() => { navigation.goBack() }} white title={route.params.title} />
            <TabView
                style={Styles.tabView}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        tabStyle={Styles.tabStyle}
                        style={{ backgroundColor: AppColors.APP_THEME }}
                        labelStyle={Styles.labelStyle}
                        indicatorStyle={{
                            height: 3,
                            backgroundColor: AppColors.WHITE
                        }}
                    />
                }
                initialLayout={Styles.tabView}
            />
        </View>
    );
}
export default ChatDescription;

export const MainView = (props) => {
    return (
        <View style={AllGroupStyles.outerView}>
            <View>
                <Text style={AllGroupStyles.headingStyle}>{props.heading}</Text>
            </View>
            {props.id === props.selectedId && props.open ?
                <Icon name='up' size={hp(2.2)} style={{ right: 0, position: 'absolute', alignSelf: 'center' }} />
                :
                <Icon name='down' size={hp(2.2)} style={{ right: 0, position: 'absolute', alignSelf: 'center' }} />
            }
        </View>
    )
};

export const ExpandView = (props) => {
    return (
        props.data.length > 0 ?
            <View >
                <FlatList
                    style={{ width: wp(90), alignSelf: 'center' }}
                    data={props.data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        let newdate = item.created_at;
                        let olddate = index <= 0 ? '' : props.data[index - 1].created_at;
                        let show = moment(newdate).format('DD-MM-YYYY') === moment(olddate).format('DD-MM-YYYY') ? false : true;
                        return (
                            // {show ? <Text style={[Styles.dateText, { marginBottom: 10 }]}>{moment(item.created_at).format('MMM DD, yyyy')}</Text> : null} */}
                            <View style={[Styles.taggedView, { height: item.message === '' && item.attachments != '' ? hp(20) : null }]}>
                                <View style={Styles.taggedImgView}>
                                    {item.image === null ?
                                        <Text style={{ color: 'white' }}>{item.name.charAt(0).toUpperCase()}</Text> :
                                        <Image resizeMode='cover' source={{ uri: IMAGE_URL + item.image }} style={Styles.imageView} />}
                                </View>
                                <View width={wp(78)} >
                                    <Text
                                        style={Styles.nameText}>
                                        {item.name}
                                        <Text style={Styles.timeText}>     {moment(item.created_at).format('MMM DD, yyyy')}</Text>
                                    </Text>
                                    {item.message === '' && item.attachments != '' ?
                                        <Image source={{ uri: item.attachments }} resizeMode='contain' style={{ height: hp(15), width: wp(50), }} />
                                        : <Text style={[Styles.typeText, { marginLeft: wp(13), width: wp(62), }]}>{item.message}</Text>}
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
            :
            <Text style={AllGroupStyles.nodataTest}>No data Found</Text>
    )
}
