import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Images from "../../assets/Images";
import Button from "../../components/Button";
import { siStyles } from "./Styles";
import Spinner from "../../components/Spinner";
import SwiperFlatList from "react-native-swiper-flatlist";
import {
  EVENT_IMAGE_URL,
  IMAGE_URL,
  ITEM_IMAGE_URL,
} from "../../webServices/EndPoints";
import ReadMore from "react-native-read-more-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONSTANTS from "../../utils/Constants";
import Actions from "../../webServices/Action";
import { getClient } from "../../utils";
import SimpleToast from "react-native-simple-toast";
import { ChatContext } from "../../navigation/TabNavigator";
import { StreamChat } from "stream-chat";
import FastImage from "react-native-fast-image";
import Fonts from "../../assets/Fonts";
import { Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import HeaderView from "../../components/HeaderView";
let imagesArray = [];

const SellingItemDetail = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [imageUri, setImageUri] = useState([]);
  const [zoomImage, setZoomImage] = useState(false);
  const { setChannel } = useContext(ChatContext);

  useEffect(() => {
    getSellingItemDetails();
  }, []);

  const getSellingItemDetails = () => {
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        setLoading(true);
        let id = String(route.params.id);
        Actions.GetSellingItemDetail(myToken, id)
          .then((response) => {
            console.log("ressssss " + JSON.stringify(response.data));
            if (response.data.status === "success") {
              setLoading(false);
              let data = response.data.data;
              let alldata = data.item;

              if (alldata.item_images && alldata.item_images.length > 0) {
                imagesArray = [];
                alldata.item_images.map((_imgData) => {
                  imagesArray.push({
                    props: { source: "" },
                    url: ITEM_IMAGE_URL + _imgData.image,
                  });
                });
              }
              setDetails(alldata);
              console.log("res " + JSON.stringify(alldata));
            } else {
              setLoading(false);
              SimpleToast.showWithGravity(
                response.data.message,
                SimpleToast.SHORT,
                SimpleToast.CENTER
              );
            }
          })
          .catch((err) => {
            if (err&&err.response&&err.response.status&& err.response.status === 401) {
              refreshToken();
            } else if (err&&err.response&&err.response.status&& err.response.status ===403) {
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
              console.log("err " + JSON.stringify(err));
              SimpleToast.showWithGravity(
                "Something went wrong",
                SimpleToast.SHORT,
                SimpleToast.CENTER
              );
            }
          });
      }
    });
  };

  const connectToMember = () => {
    const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);

    let PERSON_NAME =
      details.first_name + (details.last_name ? " " + details.last_name : "");
    setLoading(true);
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
          await chatClient.connectUser(user, userTokken);

          let Client = getClient();
          const channels = await Client.queryChannels({
            members: { $in: [String(Client.user.id)] },
          });
          let filteredData = [];
          let res = channels.filter((x) => x.data.name.includes(PERSON_NAME));
          channels.map((res) => {
            if (res.data.member_count === 2) {
              let arr = res.state.members;
              const result = Object.keys(arr).map((key) => arr[key]);

              if (
                (result[0].user.id === getClient().user.id &&
                  result[1].user.name === PERSON_NAME) ||
                (result[1].user.id === getClient().user.id &&
                  result[0].user.name === PERSON_NAME)
              ) {
                filteredData.push(res);
              }
            }
          });

          if (res.length > 0) {
            setLoading(false);
            setChannel(res[0]);
            navigation.navigate("ChatMessage");
          } else if (filteredData.length > 0) {
            // alert(JSON.stringify(filteredData))
            setLoading(false);
            setChannel(filteredData[0]);
            navigation.navigate("ChatMessage");
          } else {
            const channel = chatClient.channel(
              "messaging",
              String(Math.floor(Math.random() * 1000) + 1) +
                String(details.user_id),
              {
                name: PERSON_NAME,
                image: details.profile_image,
                members: [String(details.user_id), String(data.id)],
                session: 8,
              }
            );
            channel
              .create()
              .then((response) => {
                console.log("##" + JSON.stringify(response));
                if (response) {
                  setLoading(false);
                  setChannel(channel);
                  navigation.navigate("ChatMessage");
                }
              })
              .catch((err) => {
                setLoading(false);
                SimpleToast.showWithGravity(
                  "This user is not registered with this client",
                  SimpleToast.SHORT,
                  SimpleToast.CENTER
                );
              });
          }
        } else {
          setLoading(false);
        }
      }
    );
  };

  const refreshToken = () => {
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
              getSellingItemDetails();
            }
          })
          .catch((err) => {
            console.log(err.response.data);
            SimpleToast.showWithGravity(
              err.response.data.message,
              SimpleToast.SHORT,
              SimpleToast.CENTER
            );
          });
      }
      else
      {
        setLoading(false)
      }
    });
  };

  const _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={siStyles.readMore} onPress={handlePress}>
        Read more
      </Text>
    );
  };

  const _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={siStyles.readMore} onPress={handlePress}>
        Show less
      </Text>
    );
  };

  return (
    <View style={siStyles.container}>
      {loading ? <Spinner /> : null}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={siStyles.backButton}
      >
        <Image
          resizeMode="contain"
          source={Images.white_back}
          style={siStyles.backButtonStyle}
        />
      </TouchableOpacity>

      <View style={siStyles.swiperContainer}>
        {details.item_images &&
        details.item_images.length > 0 ? (
          <SwiperFlatList
            paginationStyle={{ marginBottom: hp(2) }}
            paginationStyleItem={siStyles.paginationStyleItems}
            paginationDefaultColor={"transparent"}
            paginationActiveColor={"white"}
            index={0}
            data={details.item_images}
            showPagination={details.item_images.length>1}
            vertical={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setZoomImage(true);
                }}
              >
                <FastImage
                  style={siStyles.swiperImage}
                  source={{ uri: ITEM_IMAGE_URL + item.image }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            )}
          />
        ):null}
      </View>
      <View style={siStyles.outerView}>
        <View style={siStyles.topTextView}>
          <Text style={siStyles.topText}>{details.name}</Text>
          <Text style={siStyles.priceText}>${details.sell_price}</Text>
        </View>
        <View style={[siStyles.topTextView, { marginTop: hp(1) }]}>
          <Text
            style={[siStyles.topText, { fontFamily: Fonts.APP_MEDIUM_FONT }]}
          >
            Retail Price
          </Text>
          <Text
            style={[
              siStyles.topText,
              {
                textDecorationLine: "line-through",
                fontFamily: Fonts.APP_MEDIUM_FON,
              },
            ]}
          >
            ${details.retail_price}
          </Text>
        </View>
      </View>
      <View style={siStyles.outerView}>
        <View style={siStyles.textView}>
          <Text
            style={[
              siStyles.topText,
              { fontSize: hp(1.7), marginBottom: hp(1) },
            ]}
          >
            Description
          </Text>
          <ReadMore
            numberOfLines={4}
            renderTruncatedFooter={_renderTruncatedFooter}
            renderRevealedFooter={_renderRevealedFooter}
          >
            <Text style={siStyles.cardText}>{details.description}</Text>
          </ReadMore>
        </View>
      </View>
      <Button
        continue={() => connectToMember()}
        style={{ bottom: 0, position: "absolute" }}
        title="Message Seller"
      />
      {zoomImage ? (
        <Modal
          animationType="slide"
          visible={zoomImage}
          transparent={true}
          onRequestClose={() => {
            setZoomImage(false);
          }}
          onDismiss={() => {
            setZoomImage(false);
          }}
        >
          <View style={siStyles.topView}>
            <HeaderView
              title={""}
              onLeftClick={() => {
                setZoomImage(false);
              }}
            />
            <ImageViewer
              enableSwipeDown={true}
              onSwipeDown={() => {
                setZoomImage(false);
              }}
              imageUrls={imagesArray}
            />
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

export default SellingItemDetail;
