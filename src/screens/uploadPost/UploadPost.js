import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Spinner from "../../components/Spinner";
import HeaderView from "../../components/HeaderView";
import Styles from "./Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-crop-picker";
import AppColors from "../../utils/AppColors";
import Images from "../../assets/Images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimpleToast from "react-native-simple-toast";
import CONSTANTS from "../../utils/Constants";
import Actions from "../../webServices/Action";
import Fonts from "../../assets/Fonts";
import { BallIndicator } from "react-native-indicators";

const UploadPost = ({ navigation, route }) => {
  const [universityArray, setuniversityArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUri, setimageUri] = useState({});
  const [postName, setpostName] = useState("");
  const [discriptionText, setdiscriptionText] = useState("");
  const [websiteLink, setwebsiteLink] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUniText, setselectedUniText] = useState("");
  const [selectedUniId, setselectedUniId] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onEndReached, setOnEndReached] = useState(false);
  const [selectedAllSchool, setAllSchool] = useState(false);
  const [schoolCount, setSchoolCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    getSchoolList(1);
  }, []);

  const loadData = () => {
    setIsLoading(true);
    setPage(page + 1);
    getSchoolList(page + 1);
  };

  const getSchoolList = (pageNum) => {
    page > 1 ? setIsLoading(true) : setIsLoading(false);

    Actions.GetSchoolNames(pageNum)
      .then((response) => {
        if (response.data) {
          let data = response.data.data;
          // alert(JSON.stringify(response.data))
          if (universityArray.length > 0) {
            // alert(universityArray.length+' hh '+response.data.total)
            if (universityArray.length <= response.data.total) {
              // let previousData = ;
              let arrr = universityArray;
              let arr = [];

              let item = {};
              data.map((value) => {
                item = {
                  id: value.id,
                  universityName: value.name,
                  selected: false,
                };
                arr.push(item);
              });
              let mainArr = arrr.concat(arr);
              let resultArr = mainArr.sort(function (a, b) {
                return (
                  a.universityName.toLowerCase() >
                  b.universityName.toLowerCase()
                );
              });
              setuniversityArray([...resultArr]);
              setIsLoading(false);
              setLoading(false);
            }
            setIsLoading(false);
            setLoading(false);
          } else {
            let arr = [];
            arr.push({ id: 0, universityName: "All Schools", selected: false });
            let item = {};
            data.map((value) => {
              item = {
                id: value.id,
                universityName: value.name,
                selected: false,
              };
              arr.push(item);
            });
            let resultArr = arr.sort(function (a, b) {
              return (
                a.universityName.toLowerCase() > b.universityName.toLowerCase()
              );
            });
            setuniversityArray([...resultArr]);
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        if (err&&err.response&&err.response.status&& err.response.status === 401) {
          refreshToken("list");
        }
        else if (err&&err.response&&err.response.status&& err.response.status ===403) {
            setLoading(false);
            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
            AsyncStorage.clear();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
        else {
          setLoading(false);
          alert(err.message);
        }
      });
  };

  function addImage() {
    const options = {
      storageOptions: {
        skipBackup: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        compressImageQuality: 0.8,
        path: "images",
      },
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    };
    ImagePicker.openPicker(options).then((response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let date = Date.now();
        const file = {
          name: "Image" + date + ".jpg",
          type: response.mime,
          uri:
            Platform.OS === "android"
              ? response.path
              : response.path.replace("file://", ""),
        };
        setimageUri(file);
      }
    });
  }

  const checkEventFields = () => {
    if (Object.keys(imageUri).length == 0) {
      SimpleToast.showWithGravity(
        "Please select Image",
        SimpleToast.SHORT,
        SimpleToast.CENTER
      );
    } else if (!postName) {
      SimpleToast.showWithGravity(
        "Please enter Post name",
        SimpleToast.SHORT,
        SimpleToast.CENTER
      );
    } else if (!discriptionText) {
      SimpleToast.showWithGravity(
        "Please enter description",
        SimpleToast.SHORT,
        SimpleToast.CENTER
      );
    } else if (selectedUniText === "") {
      SimpleToast.showWithGravity(
        "Please Select University",
        SimpleToast.SHORT,
        SimpleToast.CENTER
      );
    } else {
      createPost();
    }
  };

  const createPost = () => {
    let formdata = new FormData();
    formdata.append("title", postName);

    formdata.append("school_type", selectedAllSchool ? 0 : 1);

    formdata.append("school_ids", selectedAllSchool ? 0 : selectedUniId);
    formdata.append("image", Object.keys(imageUri).length > 0 ? imageUri : "");
    formdata.append("description", discriptionText);
    formdata.append("website", websiteLink);
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        setLoading(true);
        let alldata = {
          token: myToken,
          data: formdata,
        };
        console.log("request " + JSON.stringify(formdata));
        Actions.UploadPost(alldata)
          .then((response) => {
            console.log("res " + JSON.stringify(response));
            if (response.data.status === "success") {
              setLoading(false);
              SimpleToast.showWithGravity(
                "Your post has been submitted . Please wait for Approval",
                SimpleToast.SHORT,
                SimpleToast.CENTER
              );
              navigation.goBack();
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
              refreshToken("create");
            } 
            else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                setLoading(false);
                SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                AsyncStorage.clear();
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
            else {
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
              state === "create" ? createPost() : getSchoolList(page);
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

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={Styles.footer}>
        {isLoading ? (
          <BallIndicator
            style={{ alignSelf: "center" }}
            size={20}
            color={AppColors.APP_THEME}
          />
        ) : null}
      </View>
    );
  };

  const selectItem = (item, index) => {
    let arr = universityArray;
    if (item.universityName === "All Schools") {
      let array = [];
      universityArray.map((res) => {
        let item = {
          id: res.id,
          universityName: res.universityName,
          selected: false,
        };
        array.push(item);
      });
      array[index].selected = true;
      setuniversityArray([...array]);
      setselectedUniText(item.universityName);
      setOpen(false);
      setselectedUniId(0);
      setAllSchool(true);
    } else {
      setAllSchool(false);
      if (item.selected === true) {
        arr[0].selected = false;
        arr[index].selected = false;
        setuniversityArray([...arr]);
      } else if (item.selected === false) {
        arr[index].selected = true;
        arr[0].selected = false;
        setuniversityArray([...arr]);
      }
      // setOpen(false)
      setselectedUniText(item.universityName);

      let mainArr = universityArray;

      let schCount = [];
      let ids = "";
      mainArr.map((res) => {
        if (res.selected === true) {
          schCount.push(res);
          if (ids === "") {
            ids = res.id;
          } else {
            ids = ids + "," + res.id;
          }
        }
      });
      setSchoolCount(schCount.length);
      setselectedUniId(ids);
      // alert(schCount.length)
    }
  };
  let remainingText = 200 - discriptionText.length;
  return (
    <View flex={1}>
      <HeaderView
        white
        onLeftClick={() => navigation.goBack()}
        title="Upload Post"
      />

      <KeyboardAwareScrollView
        extraScrollHeight={40} 
        style={Styles.mainContainerInner}
        contentContainerStyle={Styles.mainContainer}
      >
        {loading ? <Spinner /> : null}
        <Text
          style={{
            fontFamily: Fonts.APP_MEDIUM_FONT,
            margin: wp(4),
            fontSize: hp(2.3),
          }}
        >
          Upload a post to the Home Screen. All submissions require admin
          approval
        </Text>
        <TouchableOpacity
          onPress={() => addImage()}
          style={Styles.imageContainer}
        >
          {imageUri.uri ? (
            <Image
              resizeMode="cover"
              style={{ height: "100%", width: "100%" }}
              source={{ uri: imageUri.uri }}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Image
                resizeMode="contain"
                style={Styles.imageStyle}
                source={Images.imagePicker}
              />
              <Text style={{ fontSize: hp(2), color: AppColors.GREY_TEXT }}>
                Add Image
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={Styles.textInputContainer}>
          <TextInput
            value={postName}
            placeholder="Post Name"
            onChangeText={(text) => setpostName(text)}
            style={Styles.inputTextView}
          />
        </View>
        <View
          style={[
            Styles.listViewContainer,
            { height: discriptionText.length > 35 ? null : hp(5.5) },
          ]}
        >
          <Image
            resizeMode="contain"
            style={Styles.listIcon}
            source={Images.entypotext}
          />
          <TextInput
            maxLength={200}
            value={discriptionText}
            multiline={true}
            numberOfLines={4}
            placeholder="Short Decription"
            onChangeText={(text) => setdiscriptionText(text)}
            style={Styles.textInput}
          />
        </View>
        <Text
          style={{
            fontSize: hp(1.5),
            textAlign: "right",
            padding: 10,
            fontFamily: Fonts.APP_MEDIUM_FONT,
          }}
        >
          {remainingText}
        </Text>
        <View style={Styles.listViewContainer}>
          <Image
            resizeMode="contain"
            style={Styles.listIcon}
            source={Images.link}
          />
          <TextInput
            numberOfLines={1}
            value={websiteLink}
            placeholder="Website Link"
            onChangeText={(text) => setwebsiteLink(text)}
            style={Styles.textInput}
          />
        </View>
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={[
            Styles.midView,
            {
              ...Platform.select({
                ios: {
                  zIndex: 11,
                },
              }),
            },
          ]}
        >
          <Text style={Styles.midViewText}>Select School</Text>
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={() => {
              setOpen(true);
            }}
            style={Styles.selectType}
          >
            {selectedUniText !== "" ? (
              <Text numberOfLines={1} style={[Styles.selectTypeText, {}]}>
                {selectedAllSchool
                  ? selectedUniText
                  : schoolCount === 0
                  ? ""
                  : String(schoolCount) +
                    (schoolCount > 1 ? " Schools" : " School")}
              </Text>
            ) : null}
            <Image
              resizeMode="contain"
              style={[
                Styles.dropIcon,
                {
                  transform: [open ? { rotate: "180deg" } : { rotate: "0deg" }],
                },
              ]}
              source={Images.dropdown}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => checkEventFields()}
          style={Styles.bottomButtonContainer}
        >
          <Text style={Styles.bottomButtonText}>Upload Post</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          visible={open}
          onRequestClose={() => {
            setOpen(false);
          }}
          transparent={true}
        >
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={() => {
              setOpen(false);
            }}
            style={Styles.modalContainer}
          >
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => {
                setOpen(true);
              }}
              style={Styles.modalInnerView}
            >
              <Text style={Styles.modalMainText}>Select School</Text>
              <FlatList
                data={[...universityArray]}
                style={{ paddingHorizontal: hp(2) }}
                keyExtractonr={(index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={Styles.selectionOuterView}>
                    <TouchableOpacity
                      onPress={() => {
                        selectItem(item, index);
                      }}
                      style={[
                        Styles.checkBoxView,
                        {
                          borderColor: item.selected
                            ? AppColors.APP_THEME
                            : AppColors.BORDER_COLOR,
                        },
                      ]}
                    >
                      <View
                        style={[
                          Styles.innerCheckBox,
                          {
                            borderColor: item.selected
                              ? AppColors.APP_THEME
                              : AppColors.WHITE,
                            backgroundColor: item.selected
                              ? AppColors.APP_THEME
                              : AppColors.WHITE,
                          },
                        ]}
                      ></View>
                    </TouchableOpacity>
                    <Text
                      onPress={() => {
                        selectItem(item, index);
                      }}
                      style={[Styles.modalSelectText]}
                    >
                      {item.universityName}
                    </Text>
                  </View>
                )}
                ListFooterComponent={renderFooter}
                initialNumToRender={15}
                keyExtractor={(item, index) => index.toString()}
                maxToRenderPerBatch={2}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  setOnEndReached(false);
                }}
                onEndReached={() => {
                  if (!onEndReached) {
                    setOpen(true);
                    loadData(); // on end reached
                    setOnEndReached(true);
                  }
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default UploadPost;
