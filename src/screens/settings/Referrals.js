import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, TouchableOpacity, Image, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderView from '../../components/HeaderView';
import Images from '../../assets/Images';
import Fonts from '../../assets/Fonts';
import FastImage from 'react-native-fast-image';
import { refStyles } from './Styles';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import AppColors from '../../utils/AppColors';
// import DropDownPicker from 'react-native-dropdown-picker';
import Contacts from 'react-native-contacts';
import { Platform } from 'react-native';
import Share from 'react-native-share';
import branch ,{BranchEvent} from 'react-native-branch';
import { getClient } from '../../utils';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import SimpleToast from 'react-native-simple-toast';

const Referrals = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [myReferralLink, setRefLink] = useState('');

  const [giftCards] = useState([
    { id: 0, name: 'Amazon', image: Images.amazon },
    { id: 1, name: 'Venmo', image: Images.venamo },
    { id: 2, name: 'Chick fill a', image: Images.chick },
    { id: 3, name: 'Cashapp', image: Images.cash },
    { id: 4, name: 'Starbuck', image: Images.star }]);
  const [choice, setChoice] = useState(giftCards[0].name);
  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        loadContacts();
      }
      );
    } else {
      console.log("else")
      //  alert("Hello")
      loadContacts();
    }
  }, [])

  useEffect(()=>{

    // let shareOptions = { messageHeader: 'Check this out', messageBody: 'No really, check this out!' }
    // let linkProperties = { feature: 'share', channel: 'RNApp' }
    // let controlParams = { $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }
    // let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
// getLink()

AsyncStorage.getItem(CONSTANTS.REFERRAL_LINK).then((link) => {
  // alert(JSON.stringify(CONSTANTS.REFERRAL_LINK))
  if (link !== null) {
    setRefLink(link)
  }
})

  },([]))

  const getLink=async()=>{
    
    let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
      locallyIndex: true,
      title: 'Cool Content!',
      contentDescription: 'Cool Content Description',
      contentMetadata: {
        ratingAverage: 4.2,
        customMetadata: {
          prop1: 'test',
          prop2: 'abc'
        }
      }
    })

    let linkProperties2 = {
      feature: 'share',
      channel: 'RNApp',
  }
  
let controlParams2 = { $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }
  branchUniversalObject.generateShortUrl(linkProperties2, controlParams2).then((res)=>{
    // setRefLink(res.url);
    // alert(res.url)
  })
  }

  const loadContacts = () => {
    if (Platform.OS === "ios") {
      Contacts.getAll().then(contacts => {
        setContactsInList(contacts, "ios");
        console.log(">>" + JSON.stringify(contacts))
      })
    }
    else {
      Contacts.getAll()
        .then((contacts) => {
          setContactsInList(contacts, "android");
        })
        .catch((e) => {
          alert(e)
        })
    }
  }

  const setContactsInList = (contacts, os) => {
    let list = [];
    contacts.map((item, index) => {
      if (os == "android") {
        // console.log(JSON.stringify(item))
        item.phoneNumbers.length >0 ?
        list.push({
          id: index,
          displayName: item.displayName != "" ? item.displayName : "Unknown",
          phoneNumbers: item.phoneNumbers.length > 0 ? item.phoneNumbers[0] : "XXXXXXXXX",
          thumbnailPath: item.thumbnailPath !== "" ? item.thumbnailPath : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXgrQ_oHDf3dgyjIX2RgsJ4S2LEzGReTYozWwu1IkMw40wLSXPq4aIVyxT5XaiFHxrFbU&usqp=CAU"
        })
        : null
      }
      else {
        item.phoneNumbers.length >0 ?

        list.push({
          id: index,
          displayName: item.givenName != "" ? item.givenName : "Unknown",
          phoneNumbers: item.phoneNumbers.length > 0 ? item.phoneNumbers[0] : "XXXXXXXXX",
          thumbnailPath: item.thumbnailPath !== "" ? item.thumbnailPath : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXgrQ_oHDf3dgyjIX2RgsJ4S2LEzGReTYozWwu1IkMw40wLSXPq4aIVyxT5XaiFHxrFbU&usqp=CAU"
        })
        : null
      }


    })
    setContactList(list);
  }


  const renderItem = ({ item, index }) => {
    return (
      <View style={refStyles.flatOuterView}>
        <FastImage resizeMode={FastImage.resizeMode.contain} source={{ uri: item.thumbnailPath }} style={refStyles.imgView} />
        <Text style={refStyles.nameText}>{item.displayName}</Text>
        <TouchableOpacity onPress={()=>{doMessage(item.phoneNumbers.number)}}  style={refStyles.flatbtn}>
          <Text style={refStyles.btnText}>Invite</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const doMessage = (num) => {
    if(myReferralLink===''){
      SimpleToast.showWithGravity('Referral Code required', SimpleToast.SHORT, SimpleToast.CENTER);
    }
    else{
    const url = (Platform.OS === 'android')
      ? 'sms:' + num.replace(' ', '') + '?body= Please check this link ' + myReferralLink
      : 'sms:'+ num.replace(' ', '') + '&body= Please check this link '+ myReferralLink

    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Unsupported url: ' + url)
      } else {
        return Linking.openURL(url)
      }
    }).catch(err => console.error('An error occurred', err))
   } }

  const renderOption = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => { setOpen(false), setChoice(item.name) }} style={[refStyles.flatOuterView, { zIndex: 100 }]}>
        <FastImage source={item.image} style={refStyles.optionimg} />
        <Text style={refStyles.nameText}>{item.name}</Text>
      </TouchableOpacity>
    )
  }
  const doshare = () => {
    if(myReferralLink===''){
      SimpleToast.showWithGravity('Referral Code required', SimpleToast.SHORT, SimpleToast.CENTER);
    }
    else{
    Share.open({
      message: "Hey please check this link "+myReferralLink
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.log(errorMsg));
  }}

  return (
    <View style={{ flex: 1, }} >
      <HeaderView white title='Referrals' onLeftClick={() => { navigation.goBack() }} />
      <ScrollView scrollEnabled={open ? false : true} nestedScrollEnabled={true} style={{ flex: 1 }} contentContainerStyle={refStyles.container}>
        <View style={refStyles.topView}>
          <Text style={refStyles.refText}>Referral Code</Text>
          <View style={refStyles.codeView}>
            <Text style={[refStyles.refText, {color: AppColors.APP_THEME }]}>{myReferralLink===''?'No Referral code found':myReferralLink}</Text>
          </View>
          <View style={refStyles.btnView}>
            <TouchableOpacity onPress={() => { doshare() }} style={[refStyles.btnShape, { marginRight: '5%' }]}>
              <Text style={refStyles.btnText}>Share Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={refStyles.btnShape}>
              <Text style={refStyles.btnText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[refStyles.topView, { zIndex: 500 }]}
        >
          {/* <DropDownPicker
                        items={[{ label: 'Item 1', value: 'item1' },
                        { label: 'Item 2', value: 'item2' },
                        { label: 'Item 2', value: 'item2' },
                        { label: 'Item 2', value: 'item2' }]}
                        defaultIndex={0}
                        // style={{zIndex:200}}
                        containerStyle={{ height: 40,zIndex:200}}
                        onChangeItem={item =>{alert(item.label)}} 
                    /> */}
          <Text style={refStyles.refText}>Choose Giftcards</Text>
          {open ?
            <View style={[refStyles.cardView]}>
              {/* <View > */}
              <FlatList
                style={{ zIndex: 200 }}
                data={giftCards}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderOption}
              />
              {/* </View> */}
            </View>
            :
            <TouchableOpacity onPress={() => { setOpen(true) }} style={refStyles.optionView}>
              <FastImage source={Images.amazon} style={refStyles.optionimg} />
              <Text style={refStyles.nameText}>{choice}</Text>
              <Image resizeMode='contain' style={refStyles.arrowStyle} source={Images.downArrow} />
            </TouchableOpacity>

          }
          <Text numberOfLines={2} style={[refStyles.detailText, {}]}>please be pateint we try to send giftcards out via email every friday</Text>
          {/* {open ?<View zindex={-200} backgroundColor='red' height={hp(10)}/> : null}  */}

        </View>
        <View style={refStyles.topGreenView}>
          <Text style={refStyles.refGreenText}>Choose Giftcards</Text>
          <Text numberOfLines={2} style={[refStyles.detailText, {
            marginTop: 0, color: AppColors.BORDER_COLOR
          }]}>Remind you pending invites</Text>
          <TouchableOpacity style={refStyles.whiteBox}>
            <Text style={[refStyles.btnText, { color: AppColors.GREY_TEXT_COLOR }]}>Show All</Text>
          </TouchableOpacity>
        </View>

        <View style={refStyles.topView}>
          <Text style={[refStyles.refText, { paddingBottom: 0 }]}>Invite Contact</Text>
          <Text numberOfLines={2} style={refStyles.detailText}>Remember B School is confined to current MBA studens only.</Text>
        </View>

        <View style={refStyles.flatView}>
          <FlatList
            data={[...contactList]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default Referrals;
