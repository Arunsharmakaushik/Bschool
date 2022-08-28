import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler, Alert, NativeModules, StatusBar, Modal, Platform, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import InputView, { InputPickerView } from '../../components/InputView';
import Images from '../../assets/Images';
import styles from './Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Actions from '../../webServices/Action';
import Spinner from '../../components/Spinner';
import SimpleToast from 'react-native-simple-toast';
import CONSTANTS from '../../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderView from '../../components/HeaderView';
import ImagePicker from 'react-native-image-crop-picker';
import { IMAGE_URL, RESUME_URL } from '../../webServices/EndPoints';
import { Logout } from '../../utils';
import { StreamChat } from 'stream-chat';
import { TextInput } from 'react-native-gesture-handler';
import AppColors from '../../utils/AppColors';
import ImageViewer from 'react-native-image-zoom-viewer';
import DocumentPicker from 'react-native-document-picker';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
import branch from 'react-native-branch';

const Profile = ({ navigation }) => {
  const [imageObject, setImageObject] = React.useState({});
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [focusId, setFocusId] = useState('');
  const [errorId, setErrorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [edit, setEdit] = useState(false);
  const [allData, setAllData] = useState({});
  const [linkedInName, setLinkedInName] = useState('');
  const [showModal, setModal] = useState(false);
  const [resumeimageObject, setResumeImageObject] = useState();
  const [token, setToken] = useState('');
  const [viewImage, setViewImage] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    getDetails();
  }, []);


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
            if (response&&response.data&&response.data.status&&response.data.status === 'success') {
              let data = response.data.data;
              let token = data.token;
              AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
              AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
              AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
              getDetails();
              setLoading(false)
            }
            else
            {
              setLoading(false);
            }
          })
          .catch((err) => {
            if(errerr&&err.response&&err.response.data&& err.response.data.message)
            {
              setLoading(false);
              console.log(err)
              SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
            }
            else
            {
              setLoading(false);
              SimpleToast.showWithGravity(err, SimpleToast.SHORT, SimpleToast.CENTER);

            }
    
          })
      }
      else
      {
        setLoading(false)
      }
    })
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
        const file = {
          name: "Image" + date + ".jpg",
          type: response.mime,
          uri: Platform.OS === "android" ? response.path : response.path.replace("file://", ""),
        }
        setImageObject(file);
        updateProfile('direct', file);
      }
    })
  }

  // get user detail
  const getDetails = () => {
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        setToken(myToken);
        let data = {
          token: myToken
        }
        Actions.ProfileStatus(data)
          .then((response) => {
            console.log("data***** " + JSON.stringify(response));
            if (response&&response.data&&response.data.status&&response.data.status === 'success') {
              setLoading(false);
              let data = response.data.data;
              let userData = data.user;
              setResumeImageObject(userData.resume);
              console.log(JSON.stringify(userData));
              setAllData(userData);
            }
            else
            {
              setLoading(false)
            }
          })
          .catch((err) => {
            if(err&&err.response&&err.response.status)
            {
              if (err.response.status === 401) {
                refreshToken();
                setLoading(false);
              }
              else if (err.response.status ===403) {
                setLoading(false);
                SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                AsyncStorage.clear();
                navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
              }
              setLoading(false);
            } 
            else {
              setLoading(false);
              SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
            }
          })
      }
    })
  }

  const getAllChannels = (mainData, fullLastName, fullNewName) => {
    // setLoading(false);

    const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
    AsyncStorage.multiGet([CONSTANTS.GETSTREAM_TOKEN, 'USER_DETAILS']).then(async (response) => {
      if (response !== null) {
        let data = JSON.parse(response[1][1]);
        const userTokken = response[0][1];
        const user = {
          id: String(data.id),
          name: data.first_name + (data.last_name ? ' ' + data.last_name : '')
        };
        chatClient.setUser(user, userTokken);
        const channels = await chatClient.queryChannels({
          members: { $in: [String(data.id)] },
        });
        setLoading(false);
        channels.map((res) => {
          if (res.data.member_count === 2) {
            if (res.data.name === fullLastName) {
              const MyChannel = chatClient.channel('messaging', res.id, {
                name: res.data.name
              });
              MyChannel.update(
                {
                  name: fullNewName,
                }).then((res) => {
                  doUpdate(mainData);
                })
                .catch((err) => {
                  console.log('err ', err);
                })
            }
            else {
              setLoading(true);
              doUpdate(mainData);
            }
          }
          else {
            setLoading(true);
            doUpdate(mainData);
          }
        })
      }
    })
  }

  const updateProfile = (status, file) => {
    setLoading(true);
    setViewImage(false);

    let userName = name;
    let img = resumeimageObject;
    var myArray = userName.split(' ');
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        let fullNm1 = myArray[0] ? myArray[0] : allData.first_name;
        let fullNm2 = myArray[1] ? myArray[1] : allData.last_name;
        let fullNewName = fullNm1 + ' ' + fullNm2;
        let fullLastName = allData.first_name + ' ' + allData.last_name;

        setLoading(true);

        let formdata = new FormData();
        formdata.append("profile_image", status === 'direct' ? file : imageObject);
        formdata.append("first_name", myArray[0] ? myArray[0] : allData.first_name);
        formdata.append("gender", gender != '' ? gender === 'Male' ? 1 : gender === 'Female' ? 2 : 3 : allData.gender);

        formdata.append("last_name", myArray[1] ? myArray[1] : allData.last_name);
        formdata.append("social_id", linkedInName ? linkedInName.replace(/ /g, '') : allData.social_id);
        formdata.append("_method", 'put');
        let formdata2 = new FormData();
        formdata2.append("first_name", myArray[0] ? myArray[0] : allData.first_name);
        formdata2.append("last_name", myArray[1] ? myArray[1] : allData.last_name);
        formdata2.append("gender", gender != '' ? gender === 'Male' ? 1 : gender === 'Female' ? 2 : 3 : allData.gender);

        formdata2.append("social_id", linkedInName ? linkedInName.replace(/ /g, '') : allData.social_id);
        formdata2.append("_method", 'put');
        let data = {
          data: status === 'direct' ? file.uri ? formdata : formdata2 : imageObject.uri ? formdata : formdata2,
          token: myToken
        }
        if (status === 'direct') {
          doUpdate(data);
        } else {
          getAllChannels(data, fullLastName, fullNewName)
        }
      }
    })
  }

  const doUpdate = (data) => {
    setLoading(true);

    Actions.ProfileUpdate(data)
      .then((response) => {
        console.log("res " + JSON.stringify(response))
        if (response&&response.data&&response.data.status&&response.data.status === 'success') {
          setLoading(false);
          setEdit(false);
          SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
          getDetails();
          setFocusId('');
          setName('');
          setLinkedInName('');
          setGender('');
          setViewImage(false);
        }
        else {
          setLoading(false);
          SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err " + JSON.stringify(err))
        SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
      })
  }


  const AlertView = (props) => {
    return (
      <Modal
        visible={showLogout}
        transparent={true}
        onRequestClose={() => {
          setIsVisible(false);
        }}
      >
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => setShowLogout(false)}
          style={styles.outerView}
        >
          <View
            style={styles.alertOuterView}
          >
            <View style={{ backgroundColor: "white" }}>
              <Image
                style={styles.logoImageView}
                source={Images.logout}
                resizeMode="contain"
              />
              <Text style={styles.selectCountryText}>Logout</Text>
              <Text style={styles.sureText}>
                Are you sure you want to logout?
                </Text>
              <View
                style={styles.btnView}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowLogout(false);
                  }}
                  style={styles.noBtn}
                >
                  <Text style={styles.choiceText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setShowLogout(false); setLoading(true); Logout(navigation) }}


                  style={styles.yesBtn}
                >
                  <Text style={styles.choiceText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
  const Logout = () => {
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
      if (myToken !== null) {
        Actions.Logout(myToken)
          .then(async (response) => {
            if (response&&response.data&&response.data.status&&response.data.status === 'success') {
              SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
              AsyncStorage.clear();
              const chatClient = new StreamChat(CONSTANTS.STREAM_CHAT_KEY);
              chatClient.disconnect();
              const fcmToken = await messaging().getToken();
              AsyncStorage.setItem(CONSTANTS.FCM_TOKEN, fcmToken);
              branch.logout()
              setLoading(false);
              navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
            }
            else {
              setLoading(false);
              SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
            }
          })
          .catch((err) => {
            setLoading(false);
            console.log(JSON.stringify(err))
            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
          })
      }
    })
  }

  const doEdit = () => {
    setGender(allData.gender ? allData.gender === 1 ? 'Male' : allData.gender === 2 ? 'Female' : 'Not Listed' : '')
    setName(allData.first_name ? allData.first_name + (allData.last_name ? ' ' + allData.last_name : '') : '');
    setLinkedInName(allData.social_id ? allData.social_id : '');
    setEdit(true);
  }

  const saveLinkedInData = () => {
    if (linkedInName == '') {
      setErrMsg('Please enter LinkedIn User Name')
    }
    else {
      AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
        if (myToken !== null) {
          setLoading(true);
          let formdata = new FormData();
          formdata.append("social_id", linkedInName.replace(/ /g, ''));
          formdata.append("_method", 'put');
          let data = {
            data: formdata,
            token: myToken
          }

          Actions.ProfileUpdate(data)
            .then((response) => {
              console.log("res " + JSON.stringify(response))
              if (response&&response.data&&response.data.status&&response.data.status === 'success') {
                setErrMsg('');
                setModal(false);
                setLoading(false);
                getDetails();
                setLinkedInName('');
              }
              else {
                setLoading(false);
                SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
              }
            })
            .catch((err) => {
              setLoading(false);
              console.log("err " + JSON.stringify(err))
              SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
            })
        }
      })
    }
  }

  const resumePicker = async () => {
    // formdata.append("resume", resumeimageObject);
    let results;
    try {
      results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.doc],
      });
      if (results.length > 0) {
        setLoading(true);
        let data = results[0]; let formdata = new FormData();
        formdata.append("resume", data);
        formdata.append("_method", 'put');

        let dataToUpload = {
          data: formdata,
          token: token
        }
        doUpdate(dataToUpload);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }

  const postImg =
    imageObject.uri ?
      [{ props: { source: '' }, url: imageObject.uri }]
      :

      allData.profile_image ?
        [{ props: { source: '' }, url: IMAGE_URL + allData.profile_image }]

        :
        [{ props: { source: Images.cameraPlaceholder }, url: '' }]

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: AppColors.APP_THEME }} contentContainerStyle={styles.mainContainer}>
      {loading ? <Spinner /> : null}
      <HeaderView white edit rightText={edit ? 'Update' : 'Edit'} onEdit={() => { edit ? updateProfile('button', {}) : doEdit(), setFocusId(0) }} title='Profile' onLeftClick={() => { navigation.goBack() }} />
      <TouchableOpacity onPress={() => { setViewImage(true) }} style={[styles.ImgTopView]}>
        {imageObject.uri ?
          <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: imageObject.uri }} style={styles.imageView} /> :
          <FastImage resizeMode={FastImage.resizeMode.cover} source={allData.profile_image ? { uri: IMAGE_URL + allData.profile_image } : Images.cameraPlaceholder} style={styles.imageView} />
        }
        {/* {edit ? <Text onPress={() => { OpenGallary() }} style={styles.uploadText}>Upload Picture</Text> : null} */}
      </TouchableOpacity>

      {/* {resumeimageObject === null ? <TouchableOpacity onPress={() => { resumePicker() }} style={styles.attachView}>
      <Text style={styles.uploadText}>Attach Resume file</Text>
      </TouchableOpacity>
        :
        <>
          <TouchableOpacity onPress={() => { resumePicker() }} style={[styles.attachView, { marginBottom: 0 }]}>
            <Text style={styles.uploadText}>{resumeimageObject}</Text>
          </TouchableOpacity>
          <Text onPress={() => { Linking.openURL(RESUME_URL + resumeimageObject) }} style={[styles.uploadText, {}]}>Read Resume</Text>
        </ >
      }   */}

      <InputView
        onFocus={() => setFocusId(0)}
        id={0}
        style={{ marginBottom: hp(1) }}
        noEdit={edit ? false : true}
        autoFocus={true}
        returnKeyType='next'
        onSubmitEditing={() => { }}
        focusId={focusId}
        errorId={errorId}
        errMsg={errMsg}
        value={name}
        onChangeText={setName}
        placeholder={allData.first_name ? allData.first_name + (allData.last_name ? ' ' + allData.last_name : '') : ''}
      />
      <InputView
        onFocus={() => setFocusId(1)}
        id={1}
        style={{ marginTop: 0 }}
        autoFocus={true}
        returnKeyType='next'
        onSubmitEditing={() => { }}
        focusId={focusId}
        errorId={errorId}
        errMsg={errMsg}
        value={email}
        onChangeText={setEmail}
        noEdit

        placeholder={allData.email ? allData.email : ''}
      />

      <InputPickerView
        noEdit={edit ? false : true}
        style={{ marginTop: 1 }}
        returnKeyType='next'
        year
        onSubmitEditing={() => { }}
        onFocus={() => setFocusId(2)}
        focusId={focusId}
        id={2}
        mainText='Gender'
        errorId={errorId}
        onSelect={(v) => { setGender(v.value), setFocusId(3) }}
        errMsg={errMsg}
        data={[{ id: 1, value: 'Male' }, { id: 2, value: 'Female' }, { id: 3, value: 'Not Listed' }]}
        value={gender}
        onChangeText={setGender}
        placeholder={allData.gender ? allData.gender === 1 ? 'Male' : allData.gender === 2 ? 'Female' : 'Not Listed' : ''}
      />

      {allData.social_id != null && allData.social_id != '' ?
        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: linkedInName ? hp(2) : 0 }}>
          <InputView
            onFocus={() => setFocusId(3)}
            id={3}
            style={{ marginTop: 0, width: wp(81), marginRight: 0 }}
            inputStyle={{ width: '98%' }}
            autoFocus={true}
            returnKeyType='next'
            onSubmitEditing={() => { }}
            focusId={focusId}
            maxLength={35}
            errorId={errorId}
            errMsg={errMsg}
            noEdit={edit ? false : true}
            value={linkedInName}
            onChangeText={setLinkedInName}
            numberOfLines={1}
            placeholder={'https://www.linkedin.com/in/' + allData.social_id}
          />
          <TouchableOpacity style={[styles.InCheckView]} onPress={() => { Linking.openURL('https://www.linkedin.com/in/' + allData.social_id) }}>
            <Image source={Images.in} resizeMode='contain' style={[styles.InCheck]} />
          </TouchableOpacity>
        </View>
        :
        <TouchableOpacity style={[styles.btnStyle,]} onPress={() => { setErrMsg(''), setModal(true) }} >
          <Image source={Images.in} resizeMode='contain' style={styles.in} />
          <Text style={styles.btnText}>Add Linkedin Profile</Text>
        </TouchableOpacity>}
      <Text onPress={() => { setShowLogout(true) }} style={[styles.uploadText, { color: 'red', marginTop: hp(3) }]}>Logout</Text>
      <Modal
        animationType="slide"
        visible={showModal}
        transparent={true}
        onRequestClose={() => {
          setModal(false);
        }}
        onDismiss={() => {
          setModal(false);
        }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={true} contentContainerStyle={{ height: hp(100), width: wp(100), backgroundColor: 'rgba(56,56,56,0.5)', justifyContent: 'center', alignSelf: 'center' }} enableOnAndroid={true} enableAutomaticScroll scrollEnabled resetScrollToCoords={{ x: 0, y: 0 }} >
          <TouchableOpacity activeOpacity={1} onPress={() => setModal(false)} style={styles.modalOuterView}>
            <View style={styles.modalView}>
              <Text style={[styles.uploadText, { padding: 0, marginBottom: hp(6) }]}>LinkedIn Details</Text>
              <TextInput
                style={styles.linkedinName}
                value={linkedInName}
                onChangeText={setLinkedInName}
                placeholderTextColor={AppColors.BORDER_COLOR}
                placeholder="Enter LinkedIn User Name"
              />
              {errMsg ?
                <Text style={styles.errorText}>{errMsg}</Text>
                : null}
              <TouchableOpacity style={styles.saveView} onPress={() => { saveLinkedInData() }}>
                <Text style={[styles.uploadText, { color: AppColors.WHITE, padding: 0, }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </Modal>
      <Modal
        animationType="slide"
        visible={viewImage}
        transparent={true}
        onRequestClose={() => {
          setViewImage(false);
        }}
        onDismiss={() => {
          setViewImage(false);
        }}>
        <TouchableOpacity activeOpacity={1} onPress={() => setViewImage(false)} style={[styles.modalOuterView, { justifyContent: 'center' }]}>
          <View style={styles.alertView}>
            <View flexDirection='row' width='90%'>
              <Image resizeMode='contain' source={Images.viewImage} style={styles.imageicon} />
              <Text onPress={() => { setViewImage(false); setZoomImage(true) }} style={styles.buttonText}>View Profile Picture</Text>
            </View>
            <View flexDirection='row' width='90%'>
              <Image resizeMode='contain' source={Images.viewProfile} style={styles.imageicon} />
              <Text onPress={() => { OpenGallary() }} style={styles.buttonText}>Select Profile Picture</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="slide"
        visible={zoomImage}
        transparent={true}
        onRequestClose={() => {
          setZoomImage(false);
        }}
        onDismiss={() => {
          setZoomImage(false);
        }}>
        <View style={styles.topView}>
          <HeaderView title={allData.first_name ? allData.first_name + (allData.last_name ? ' ' + allData.last_name : '') : ''} onLeftClick={() => { setZoomImage(false) }} />
          <ImageViewer enableSwipeDown={true} onSwipeDown={() => { setZoomImage(false); }}
            imageUrls={postImg} />
        </View>
      </Modal>
      <AlertView />
    </KeyboardAwareScrollView>
  );
}

export default Profile;
