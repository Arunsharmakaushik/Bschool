import React, { useContext, useEffect, useState } from "react";
import {
  LogBox,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { ExpandableListView } from "react-native-expandable-listview";
import { AllGroupStyles } from "./Styles";
import Images from "../../assets/Images";
import AppColors from "../../utils/AppColors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONSTANTS from "../../utils/Constants";
import { StreamChat } from "stream-chat";
import { ChatContext } from "../../navigation/TabNavigator";
import Actions from "../../webServices/Action";
import { IMAGE_URL } from "../../webServices/EndPoints";
import { Streami18n } from "stream-chat-react-native";
import { Chat } from "stream-chat-react-native";
import { getClient } from "../../utils";
import Spinner from "../../components/Spinner";
import SimpleToast from "react-native-simple-toast";

const EmoryGroups = ({ navigation, school, schoolId }) => {
  const [textToSearch, setTextToSearch] = useState("");
  const [selectedId, setselectedId] = useState("");
  const [open, setOpen] = useState(false);
  const [GroupImage, setGroupImage] = useState([]);
  const [done, setAsDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setChannel } = useContext(ChatContext);
  const [favoriteList, setfavoriteList] = useState([]);
  const [RequestedData, setRequestedData] = useState([]);
  const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
  const [id, setid] = useState("");
  const [userfix, setuserfix] = useState(false);
  const [userToken, setuserToken] = useState("");
  const [user, setuser] = useState(false);
  const [myChannel, setMyChannel] = useState([]);
  const [searchedData, setSearchedData] = React.useState([]);

  useEffect(() => {
    getChannels();
  }, []);

  const getChannels = () => {
    // let chatClient = getClient();
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, "USER_DETAILS"]).then(
      async (response) => {
        if (response !== null) {
          let data = JSON.parse(response[1][1]);
          const userTokken = response[0][1];
          const user = {
            id: String(data.id),
            name:
              data.first_name + (data.last_name ? " " + data.last_name : ""),
          };
          // chatClient.setUser(user, userTokken);

          let MyCleint = getClient();
          const channels = await MyCleint.queryChannels({
            members: { $in: [String(data.id)] },
            // type: 'messaging',
          });
          setMyChannel(channels);
          if (channels.length > 0) {
            var listArray = [];
            channels.map((data, index) => {
              // alert(JSON.stringify(data.data.Grouptype))
              if (data.data.Grouptype === school) {
                if (data.data.member_count > 2) {
                  listArray.push({
                    channel: data,
                    name: data.data.name,
                    image: data.data.image,
                    unreadCount: data.state.unreadCount,
                  });
                }
              }
            });
            setGroupImage(listArray);
            getChatJoinData();
            setFavouriteGroups();
          } else {
            getChatJoinData();
          }
        }
      }
    );
  };

  const setOldData = () => {
    if (myChannel.length > 0) {
      var listArray = [];
      myChannel.map((data, index) => {
        if (data.data.Grouptype === school) {
          if (data.data.member_count > 2) {
            listArray.push({
              channel: data,
              name: data.data.name,
              image: data.data.image,
              unreadCount: data.state.unreadCount,
            });
          }
        }
      });
      setGroupImage(listArray);
    }
  };
  const setFavouriteData = async (datas) => {
    const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, "USER_DETAILS"]).then(
      async (response) => {
        if (response !== null) {
          let data = JSON.parse(response[1][1]);
          //         const userTokken = response[0][1];
          //         const user = {
          //             id: String(data.id),
          //             name: data.first_name + (data.last_name ? ' ' + data.last_name : ''),
          //             image: null,
          //         };
          //         chatClient.setUser(user, userTokken);
          var FavlistArray = [];
          datas.favChannels.data.map((data, index) => {
            FavlistArray.push(data.channel_id);
          });
          const filter = { type: "messaging", id: { $in: FavlistArray } };
          const sort = [{ last_message_at: -1 }];
          var favouriteslistArray = [];
          let myclient = getClient();
          const channels = await myclient.queryChannels(filter, sort, {
            members: { $in: [String(data.id)] },
            type: "messaging",
          });
          channels.map((data, index) => {
            if (data.data.Grouptype === school) {
              favouriteslistArray.push({
                channel: data,
                id: data.data.id,
                name: data.data.name,
                image: data.data.image,
                unreadCount: data.state.unreadCount,
              });
            }
          });
          setfavoriteList(favouriteslistArray);
          console.log("up to the mark!");
          setAsDone(true);
        }
      }
    );
  };

  const setFavouriteGroups = () => {
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        let data = { token: myToken };
        Actions.FavouriteList(data)
          .then((response) => {
            if (response.data.status === "success") {
              let mainData = response.data.data;
              let newData = mainData.favChannels;
              if (newData.data.length > 0) {
                setFavouriteData(mainData);
                setLoading(false);
              } else {
                setAsDone(true);
                setLoading(false);
              }
            } else {
              setLoading(false);
              console.log("else statement run");
            }
          })
          .catch((err) => {
            if (err&&err.response&&err.response.status&& err.response.status === 401) {
              loading ? null : refreshToken("fav");
              setLoading(false);
            } 
            else if (err&&err.response&&err.response.status&& err.response.status ===403) {
              setLoading(false);
              SimpleToast.showWithGravity(
                err.response.data.message,
                SimpleToast.SHORT,
                SimpleToast.CENTER
              );
              AsyncStorage.clear();
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } else {
              setLoading(false);
              console.log("catchsAllGroup" + JSON.stringify(err));
            }
          });
      }
    });
  };

  const refreshToken = (state) => {
    AsyncStorage.multiGet([
      CONSTANTS.REFRESH_TOKEN,
      CONSTANTS.ACCESS_TOKEN,
    ]).then((res) => {
      if (res !== null) {
        let data = {
          token: res[0][1],
          oldToken: res[1][1],
        };
        Actions.Refresh_Token(data)
          .then((response) => {
            console.log("refreshed " + JSON.stringify(response));
            if (response.data.status === "success") {
              let data = response.data.data;
              let token = data.token;
              AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
              AsyncStorage.setItem(
                CONSTANTS.REFRESH_TOKEN,
                token.refresh_token
              );
              AsyncStorage.setItem(
                CONSTANTS.GETSTREAM_TOKEN,
                data.getstream_token
              );
              state === "join" ? getChatJoinData() : setFavouriteGroups();
            }
          })
          .catch((err) => {
            console.log(err.response.data);
            // SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
          });
      }
      else
      {
        setLoading(false)
      }
    });
  };

  const CONTENT = [
    {
      id: "1",
      customItem: (
        <MainView
          open={open}
          members={favoriteList.length + " Groups"}
          selectedId={selectedId}
          id={0}
          heading="Favorite Chats"
        />
      ),
      subCategory: [
        {
          customInnerItem: (
            <ExpandView
              setChannel={(d) => {
                setChannel(d);
              }}
              navigation={navigation}
              data={favoriteList.length === 0 ? [] : favoriteList}
            />
          ),
        },
      ],
    },
    {
      id: "2",
      customItem: (
        <MainView
          open={open}
          members={GroupImage.length + " Groups"}
          id={1}
          selectedId={selectedId}
          heading="My joined Chats"
        />
      ),
      subCategory: [
        {
          customInnerItem: (
            <ExpandView
              setChannel={(d) => {
                setChannel(d);
              }}
              navigation={navigation}
              data={GroupImage.length > 0 ? GroupImage : []}
            />
          ),
        },
      ],
    },
    {
      id: "3",
      customItem: (
        <MainView
          members={RequestedData.length + " Groups"}
          open={open}
          selectedId={selectedId}
          id={2}
          heading="Chats you can join"
        />
      ),
      subCategory: [
        {
          customInnerItem: (
            <ExpandView
              forJoin
              data={RequestedData.length === 0 ? [] : RequestedData}
            />
          ),
        },
      ],
    },
  ];

  const getChatJoinData = () => {
    setRequestedData([]);
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        setLoading(true);
        let data = {
          token: myToken,
        };
        Actions.GetChannelListNin(data)
          .then((response) => {
            if (response.data.status === "success") {
              let mainData = response.data.data;
              let newData = mainData.channels;
              if (newData.channels.length > 0) {
                setchatwecanJoin(newData);
                setAsDone(true);
                setLoading(false);
              } else {
                setAsDone(true);
                setLoading(false);
              }
            }
          })
          .catch((err) => {
            if (err&&err.response&&err.response.status&& err.response.status === 401) {
              refreshToken("join");
            } 
            else if (err&&err.response&&err.response.status&& err.response.status ===403) {
              setLoading(false);
              SimpleToast.showWithGravity(
                err.response.data.message,
                SimpleToast.SHORT,
                SimpleToast.CENTER
              );
              AsyncStorage.clear();
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } else {
              // console.log("catchsAllGroup" + JSON.stringify(err));
              setAsDone(true);
              setLoading(false);
            }
          });
      }
    });
  };

  const setchatwecanJoin = (datas) => {
    var channelNiNlistArray = [];
    console.log("up to the mark!" + JSON.stringify(datas.channels[0].members));
    datas.channels.map((data, index) => {
      if (
        data.channel.Grouptype === "Public" &&
        data.channel.school === Number(schoolId)
      ) {
        alert(data.channel.school);
        channelNiNlistArray.push({
          // channel:data.channel,
          channel2: data,
          id: data.channel.id,
          name: data.channel.name,
          image: data.channel.image,
        });
      }
    });
    setRequestedData(channelNiNlistArray);
    console.log("up to the mark!");
    setAsDone(true);
  };

  const searchText = (text) => {
    setTextToSearch(text);
    if (text.length > 1) {
      let newData = myChannel.filter((x) =>
        String(x.data.name.toLowerCase()).includes(text.toLowerCase())
      );
      setSearchedData([...newData]);
      //   getChannels();
      var listArray = [];
      newData.map((data, index) => {
        if (data.data.Grouptype === school) {
          if (data.data.member_count > 2) {
            listArray.push({
              channel: data,
              name: data.data.name,
              image: data.data.image,
              unreadCount: data.state.unreadCount,
            });
          }
        }
      });
      setGroupImage(listArray);
    } else {
      setSearchedData([]);
      setOldData();
    }
  };

  return (
    <>
      <View style={AllGroupStyles.searchViewContainer}>
        <Image
          resizeMode="contain"
          source={Images.search}
          style={AllGroupStyles.searchIcon}
        />
        <TextInput
        returnKeyType='search'
          value={textToSearch}
          onChangeText={(text) => searchText(text)}
          placeholderTextColor={AppColors.GREY_TEXT}
          placeholder="Search chats"
          style={AllGroupStyles.searchTextinput}
        />
        {textToSearch ? (
          <TouchableOpacity
            onPress={() => {
              setTextToSearch(""), setSearchedData([]), setOldData();
            }}
          >
            <Image
              resizeMode="contain"
              source={Images.cross}
              style={[AllGroupStyles.searchIcon, { marginLeft: wp(2) }]}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <Chat
        client={chatClient}
        i18nInstance={
          new Streami18n({
            language: "en",
          })
        }
      >
        {loading ? <Spinner /> : null}
        <View style={AllGroupStyles.container}>
          {done ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, width: wp(100), paddingHorizontal: wp(5) }}
            >
              {searchedData.length > 0 ? null : (
                <>
                  <MainView
                    doSelect={() => {
                      selectedId === 0 ? setselectedId(null) : setselectedId(0);
                    }}
                    open={open}
                    members={favoriteList.length + " Groups"}
                    selectedId={selectedId}
                    id={0}
                    heading="Favorite Chats"
                  />
                  {selectedId === 0 ? (
                    <ExpandView
                      setChannel={(d) => {
                        setChannel(d);
                      }}
                      navigation={navigation}
                      data={favoriteList.length === 0 ? [] : favoriteList}
                    />
                  ) : null}
                </>
              )}
              <MainView
                doSelect={() => {
                  selectedId === 1 ? setselectedId(null) : setselectedId(1);
                }}
                open={open}
                members={GroupImage.length + " Groups"}
                id={1}
                selectedId={selectedId}
                heading="My joined Chats"
              />

              {selectedId === 1 ? (
                <ExpandView
                  setChannel={(d) => {
                    setChannel(d);
                  }}
                  navigation={navigation}
                  data={GroupImage.length > 0 ? GroupImage : []}
                />
              ) : null}
              {searchedData.length > 0 ? null : (
                <>
                  <MainView
                    doSelect={() => {
                      selectedId === 2 ? setselectedId(null) : setselectedId(2);
                    }}
                    members={RequestedData.length + " Groups"}
                    open={open}
                    selectedId={selectedId}
                    id={2}
                    heading="Chats you can join"
                  />

                  {selectedId === 2 ? (
                    <ExpandView
                      forJoin
                      data={RequestedData.length === 0 ? [] : RequestedData}
                    />
                  ) : null}
                </>
              )}
            </ScrollView>
          ) : // <View style={{ flex: 1 }} >
          //     <ExpandableListView
          //         data={searchedData.length > 0 ? CONTENT2 : CONTENT}
          //         itemContainerStyle={{ backgroundColor: 'transparent', width: wp(95), alignSelf: 'center' }}
          //         onInnerItemClick={() => { }}
          //     />
          // </View>
          null}
        </View>
      </Chat>
    </>
  );
};

export default EmoryGroups;

export const MainView = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.doSelect();
      }}
      style={[AllGroupStyles.outerView, { marginVertical: hp(1) }]}
    >
      <View>
        <Text style={AllGroupStyles.headingStyle}>{props.heading}</Text>
        <Text style={AllGroupStyles.countStyle}>
          {props.members ? props.members : "10 Groups"}
        </Text>
      </View>
      {props.id === props.selectedId && props.open ? (
        <Icon
          name="up"
          size={hp(2.2)}
          style={{ right: 0, position: "absolute", alignSelf: "center" }}
        />
      ) : (
        <Icon
          name="down"
          size={hp(2.2)}
          style={{ right: 0, position: "absolute", alignSelf: "center" }}
        />
      )}
    </TouchableOpacity>
  );
};

export const ExpandView = (props) => {
  return props.data.length > 0 ? (
    <View style={{ width: wp(90), alignSelf: "center", marginVertical: hp(1) }}>
      <FlatList
        data={props.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          let channel = item.channel ? item.channel : false;
          let state = channel.state ? channel.state : "no";
          let members = state.members
            ? Object.keys(state.members).map((key) => state.members[key])
            : "no";
          return (
            <TouchableOpacity
              style={AllGroupStyles.flatView}
              onPress={() => {
                if (props.navigation) {
                  props.setChannel(item.channel);
                  props.navigation.navigate("ChatMessage");
                } else {
                }
              }}
            >
              <Image
                resizeMode="cover"
                style={AllGroupStyles.imgView}
                source={{
                  uri: item.image
                    ? item.image
                    : "https://i.pinimg.com/originals/9c/61/55/9c61559571308011811aa426860ff351.jpg",
                }}
              />
              {item.channel ? (
                <View
                  flexDirection="row"
                  width={wp(40)}
                  alignSelf="center"
                  justifyContent="center"
                  position="absolute"
                >
                  {members.map((item, index) => {
                    return index < 4 ? (
                      <View
                        style={{
                          height: hp(4),
                          marginTop: hp(9.5),
                          elevation: 5,
                          width: hp(4),
                          marginLeft: -10,
                          justifyContent: "center",
                          alignItems: "center",
                          borderColor: "transparent",
                          borderRadius: 50,
                          borderColor: AppColors.WHITE,
                          borderWidth: 1,
                          backgroundColor: AppColors.LIGHTGREEN,
                        }}
                      >
                        {item.user.image === null ? (
                          <Text style={{ color: "white" }}>
                            {item.user.name.charAt(0).toUpperCase()}
                          </Text>
                        ) : (
                          <Image
                            resizeMode="cover"
                            source={{ uri: IMAGE_URL + item.user.image }}
                            style={{
                              height: hp(4),
                              alignSelf: "center",
                              borderRadius: 50,
                              borderColor: AppColors.WHITE,
                              borderWidth: 1,
                              width: hp(4),
                            }}
                          />
                        )}
                      </View>
                    ) : null;
                  })}
                </View>
              ) : null}
              <Text style={AllGroupStyles.flatText}>
                {item.name ? item.name : "abcd"}
              </Text>
              {item.unreadCount > 0 ? (
                <View style={AllGroupStyles.redview}>
                  <Text style={AllGroupStyles.redDotView}>
                    {item.unreadCount}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  ) : (
    <Text style={AllGroupStyles.nodataTest}>No data Found</Text>
  );
};
