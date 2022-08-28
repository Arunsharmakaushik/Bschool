import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Modal, TextInput, Platform, FlatList, Text } from 'react-native';
import { AutoCompleteInput, MessageInput, } from 'stream-chat-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Images from '../assets/Images';
import { getClient, isiPhoneX } from '../utils';
import EmojiSelector, { Categories } from '../components/react-native-emoji-selector'
import AppColors from '../utils/AppColors';
import Fonts from '../assets/Fonts';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { DotIndicator, } from 'react-native-indicators';
import { createThumbnail } from "react-native-create-thumbnail";
import CONSTANTS from '../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Actions from '../webServices/Action';
import SimpleToast from 'react-native-simple-toast';

export const InputBox = (item) => {
  let props = item.props;
  const [text, setText] = React.useState('');
  const [gifs, setGifs] = useState([]);
  const [term, updateTerm] = useState('happy');
  const [selectionView, setSelectionView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myFile, setMyFile] = useState({});

  useEffect(() => {
    fetchGifs();
  }, []);

  const OpenGallary = () => {
    const options = {
      mediaType: 'photo',
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
        setSelectionView(false)
        props.uploadNewImage(file);
      }
    })
  }

  const OpenCamera = () => {
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
    ImagePicker.openCamera(options).then(response => {
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
          uri: Platform.OS === "android" ? response.path : response.path.replace("file://", ""),
        }
        setSelectionView(false)
        props.uploadNewImage(file);
      }
    })
  }

  const OpenvideoPicker = () => {
    const options = {
      mediaType: 'video',
      compressVideoPreset: 'MediumQuality',
      storageOptions: {
        skipBackup: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        compressImageQuality: 0.7,
      },
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
          name: "Video" + date + ".mp4",
          type: response.mime,
          size: 20000000,
          uri: Platform.OS === "android" ? response.path : response.path.replace("file://", ""),
        }
        setSelectionView(false)
        const options = {
          width: 720,
          height: 1280,
          bitrateMultiplier: 3,
          minimumBitrate: 20000,
        };
        setMyFile(file);
        props.uploadNewFile(file)
        }
    })
  }

  const pickDocument = async () => {
    let results;
    try {
      results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.doc],
      });
      if (results.length > 0) {
        let data = results[0];
        setSelectionView(false)
        props.uploadNewFile(data);
      }
    }
    catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        setSelectionView(false)
        throw err;
      }
    }
  }

  async function fetchGifs() {
    try {
      const API_KEY = 's0F7SGlrUNSdh9qLmLwQv4G8SySWqE8W';
      const BASE_URL = 'http://api.giphy.com/v1/gifs/search';
      const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
      const res = await resJson.json();
      setGifs(res.data);
      // console.log('#giphy' + JSON.stringify(res.data))
    } catch (error) {
      console.warn(error);
    }
  }

  function onEdit(newTerm) {
    if (newTerm != '') {
      updateTerm(newTerm);
      fetchGifs();
    }
  }

  const checkBeforeSend=async()=>{
    if(myFile.uri){
     var response = await createThumbnail({
      url: myFile.uri,
      timeStamp: 1000,
    })
    let path = Platform.OS === "android" ? response.path : response.path.replace("file://", "");
    console.log(path);
   let file={
     uri:path,
     name:myFile.name.replace("mp4", "jpg"),
     type:'image/jpg'
   }
   setLoading(true)
    let formdata = new FormData();
    formdata.append("thumbnail", file);
    AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN,CONSTANTS.ACCESS_TOKEN]).then((res) => {
      if (res !== null) {
          let data = {
            token: res[1][1],
              data:formdata
            }
        Actions.UpoadThumbnail(data)
          .then((response) => {
            console.log("refreshed " + JSON.stringify(response))
            if (response.data.status === 'success') {
              setLoading(false);
              props.sendMessage();
              setMyFile({});
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              refreshToken();
            } else {
              setLoading(false);
              SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
            }
          })
      }
    })}
    else{
      props.sendMessage();
    }
  }

  const refreshToken = () => {
    AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN,CONSTANTS.ACCESS_TOKEN]).then((res) => {
      if (res !== null) {
          let data = { token: res[0][1],oldToken:res[1][1]}
        Actions.Refresh_Token(data)
          .then((response) => {
            console.log("refreshed " + JSON.stringify(response))
            if (response.data.status === 'success') {
              let data = response.data.data;
              let token = data.token;
              AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
              AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
              AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
             checkBeforeSend();
            }
          })
          .catch((err) => {
            console.log(err.response.data)
            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
          })
      }
    })
  }

  return (
    <View style={[styles.container, { justifyContent: 'center', height: item.open ? hp(47) : null, }]}>
     {loading? 
      <View style={{zIndex:100,elevation:100,position:'absolute', justifyContent: 'center',alignItems:'center',height:hp('100%'),width:wp('100%'), backgroundColor:'transparent' }}>
      <DotIndicator style={{alignSelf:'center'}} size={12} color={AppColors.APP_THEME} />
     </View>
     :null}
      <View
        style={styles.row}>
        {item.noemoji ? null : <TouchableOpacity
          onPress={() => {
            item.settoTrue()
          }}
          style={[styles.imageAttachmentIcon, { marginTop: isiPhoneX() ? -5 : 0, marginLeft: -5, marginRight: 15, }]}>
          <Image resizeMode='contain' style={{ height: hp(3), width: hp(3), }} source={Images.emoji} />
        </TouchableOpacity>}
        <AutoCompleteInput {...props} />
        {item.noemoji ? null :
          <TouchableOpacity
            // onPress={props._pickFile}
            onPress={() => { setSelectionView(true) }}
            style={[styles.imageAttachmentIcon, { marginTop: -5 }]}>
            <Image resizeMode='contain' style={{ height: hp(3), width: hp(3), }} source={Images.add} />
          </TouchableOpacity>
        }
        {/* //props.sendMessage() */}
        <View alignSelf='center'> 
          <TouchableOpacity onPress={() => { checkBeforeSend()}}>
            <Image resizeMode='contain' style={{ height: hp(3), width: hp(3), marginTop: -5 }} source={Images.send} />
          </TouchableOpacity>
        </View>
      </View>

      {item.open ?
        
        <View style={[styles.modalContainer,]}>
         
          {/* <EmojiSelector
          onEmojiSelected={emoji =>{props.appendText(emoji),setText(emoji)}}
          showSearchBar={true}
          columns={10}
          showTabs={true}
          showHistory={true}
          onCancel={()=>item.setOpen(false)}
          showSearchBar={false}
          showSectionTitles={true}
          category={Categories.all}
        /> */}

          <View style={styles.searchView} >
            <Image resizeMode='contain' style={styles.searchIcon} source={Images.search} />
            <TextInput
              placeholder="Search Giphy.."
              placeholderTextColor={AppColors.INPUT}
              style={styles.searchTextinput}
              onChangeText={(text) => onEdit(text)}
            />
            <TouchableOpacity
              onPress={() => item.setOpen(false)}
              style={[styles.imageAttachmentIcon, { marginTop: isiPhoneX() ? -5 : 0, marginLeft: 5, marginRight: 15, }]}>
              <Image resizeMode='contain' style={styles.searchIcon} source={Images.cross} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingTop: hp(1), backgroundColor: AppColors.WHITE, alignItems: 'center' }} >
            <FlatList
              numColumns={2}
              data={gifs}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    let file = {
                      uri: item.images.original.url
                    }
                    props.uploadNewImage(file)
                  }}
                  style={styles.giphyView} >
                  <Image
                    resizeMode='cover'
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    source={{ uri: item.images.original.url }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        : null}

      <Modal animationType="slide"
        style={{ flex: 1 }}
        visible={selectionView}
        transparent={true}>
        <TouchableOpacity onPress={() => { setSelectionView(false) }} style={styles.selectionView} >
          <View style={[styles.selectionOuterView]}>
            <View style={styles.innerView}>
              <TouchableOpacity onPress={() => { OpenCamera() }} style={[styles.selectionInnerView]}>
                <Image resizeMode='contain' style={styles.selectionImage} source={Images.selectCamera} />
                <Text style={styles.viewText}>Select Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { OpenGallary() }} style={[styles.selectionInnerView]}>
                <Image resizeMode='contain' style={styles.selectionImage} source={Images.selectPhoto} />
                <Text style={styles.viewText}>Select Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { pickDocument() }} style={[styles.selectionInnerView]}>
                <Image resizeMode='contain' style={styles.selectionImage} source={Images.selectDoc} />
                <Text style={styles.viewText}>Select Files</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { OpenvideoPicker() }} style={[styles.selectionInnerView]}>
                <Image resizeMode='contain' style={styles.selectionImage} source={Images.selectPhoto} />
                <Text style={styles.viewText}>Select Video</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { setSelectionView(false) }} style={styles.cancelView}>
              <Text style={styles.viewText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  modalContainer:
  {
    marginTop: hp(2),
    alignSelf: 'center',
    height: hp(40),
    width: wp(100),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: { flexDirection: 'row', },
  textActionLabel: {
    fontSize: 18,
  },
  textEditorContainer: {
    marginLeft: 10,
  },
  fileAttachmentIcon: {
    marginRight: 10,
    marginLeft: 10,
    alignSelf: 'center',
  },
  imageAttachmentIcon: {
    marginRight: 10,
    marginLeft: 10,
    alignSelf: 'center',
  },
  searchView:
  {
    backgroundColor: AppColors.SEARCH_COLOR,
    borderRadius: hp(2), paddingHorizontal: hp(1),
    alignItems: 'center',
    height: hp(6), borderWidth: 1,
    borderColor: AppColors.SEARCH_COLOR, flexDirection: 'row',
    marginHorizontal: hp(2)
  },
  searchIcon: {
    width: hp(2.6),
    height: hp(2.6),
    alignSelf: 'center'
  },
  searchTextinput: {
    width: wp(72),
    alignSelf: 'center',
    textAlign: 'left',
    fontFamily: Fonts.APP_SEMIBOLD_FONT,
    color: AppColors.BLACK,
    marginLeft: wp(1)
  },
  giphyView:
  {
    width: wp(46),
    borderColor: 'transparent',
    marginHorizontal: wp(0.4),
    height: hp(14),
    backgroundColor: AppColors.GREY_TEXT_COLOR,
    borderWidth: 1,
    marginBottom: hp(0.4)
  },
  selectionView:
  {

    backgroundColor: AppColors.TRANSPARENT_COLOR,
    justifyContent: 'center',
    width: wp(100),
    height: hp(100)
  },

  cancelView:
  {
    width: wp(95),
    backgroundColor: AppColors.WHITE,
    height: hp(8),
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: hp(2),
    justifyContent: 'center'
  },
  viewText:
  {
    color: AppColors.APP_THEME,
    fontSize: hp(2.3),
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: Fonts.APP_SEMIBOLD_FONT
  },

  selectionOuterView:
  {
    width: wp(95),
    bottom: 0, position: 'absolute',
    justifyContent: 'center',
    height: hp(52),
    alignSelf: 'center',
  },
  innerView:
  {
    width: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    height: hp(38),
    alignSelf: 'center',
    backgroundColor: AppColors.WHITE
  },
  selectionInnerView:
  {
    width: wp(95),
    height: '25%',
    flexDirection: 'row',
  },
  selectionImage:
  {
    marginHorizontal: wp(5),
    height: hp(3),
    width: hp(3),
    alignSelf: 'center',
    overflow: 'hidden'
  }
});
