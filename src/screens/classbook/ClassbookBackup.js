import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, View, FlatList, ImageBackground, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Images from '../../assets/Images';
import Fonts from '../../assets/Fonts';
import Styles from './Styles';
import Actions from '../../webServices/Action';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from '../../components/Spinner';
import AppColors from '../../utils/AppColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMAGE_URL } from '../../webServices/EndPoints';
import SimpleToast from 'react-native-simple-toast';
import CONSTANTS from '../../utils/Constants';
import { AllGroupStyles } from '../chats/Styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../components/Button';
import { ExpandView, MainView } from '../../components/CustomExpandView';
import { getClient } from '../../utils';

const Classbook = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [openSortBy, setOpenSortBy] = useState(false);
  const [searchTextInput, setSearchTextInput] = useState('');
  const [universityArray, setuniversityArray] = useState([])
  const [selectedUniText, setselectedUniText] = useState('')
  const [loading, setLoading] = useState(true);
  const [person, setperson] = useState([]);
  const [personCopy, setpersonCopy] = useState([]);
  const [firstNameSelected, setfirstNameSelected] = useState(false);
  const [secondNameSelected, setsecondNameSelected] = useState(false);
  const [classYearSelected, setclassYearSelected] = useState(false);
  const [topics, setTopics] = useState([{ id: 0, name: 'a' }, { id: 1, name: 'b' }, { id: 2, name: 'c' }, { id: 3, name: 'd' }])
  const [showFilter, setShowFilter] = useState(false);
  const [selectedId, setselectedId] = useState(null);
  const [previousJobData, setPreviousJobData] = useState([]);
  const [interestData, setInterestData] = useState([]);
  const [personalInterestData, setPersonalInterest] = useState([]);

  const [selectedPrevious, setSelectedprevious] = useState('');
  const [selectedInterestData, setSelectedInterest] = useState('');
  const [selectedPersonal, setSelectedPersonal] = useState('');

  useEffect(() => {
    setLoading(true)
    getSchoolList();
  }, ([]));

  useEffect(() => {
    getJobList();
    getJobList2();
    getJobList3();
  }, []);

  const getMemberListToken = (schoolid) => {
    setLoading(true)
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((token) => {
      getSchoolMemberList(token, schoolid);
    })
  }

  const getSchoolMemberList = (myToken, firstschoolid) => {
    
    Actions.GetSchoolUserList(myToken, firstschoolid)
      .then((response) => {
        if (response.data.status === 'success') {
          let data = response.data.data;
          let users = data.user.data;
          console.log('result '+JSON.stringify(users));
          let newData = [];
          users.map((item, index) => {
            let obj = item;
            obj.checkId = index;
            obj.selected = false;
            newData.push(obj)
          })
          let newArr = newData.sort(function (a, b) { return a.id > b.id });
          var personArray = [];
          newArr.map((data) => {
            if (getClient().user.id != data.id) {
              personArray.push(
                {
                  id: data.id,
                  previousJobs: data.previousJobs,
                  school_name: data.school_name,
                  graduation_year: data.graduation_year,
                  home_state: data.home_state,
                  previous_state: data.previous_state,
                  interests: data.interests,
                  profile_image: data.profile_image,
                  first_name: data.first_name,
                  last_name: data.last_name,
                  social_id: data.social_id
                })
            }
          })
          setLoading(false);
          setperson(newArr);
          setpersonCopy(newArr);
        }
        else {
          setLoading(false);
          SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
        }
      })
      .catch((err) => {
// alert(err)
        if (err&&err.response&&err.response.status&& err.response.status === 401) {
          setLoading(false);
          refreshToken(firstschoolid);
          console.log('error')

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
  
  const refreshToken = (schoolid) => {
    AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.SELECTED_SCHOOL,CONSTANTS.ACCESS_TOKEN]).then((res) => {
      if (res !== null) {
        let data = {
          token: res[0][1],
          oldToken:res[2][1]
        }
        Actions.Refresh_Token(data)
          .then((response) => {
            if (response.data.status === 'success') {
              let data = response.data.data;
              let token = data.token;
              AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
              AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
              AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
              getSchoolMemberList(token.access_token, schoolid);

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

  const getJobList = () => {
    Actions.GetJobNames().then((response) => {
      if (response.data) {
        let data = response.data.data;
        setPreviousJobData(data);
        setLoading(false);
      }
    })
      .catch((err) => {
        setLoading(false);
        alert(err.message)
      })
  }

  const getJobList2 = () => {
    Actions.GetJobNames().then((response) => {
      if (response.data) {
        let data = response.data.data;
        setInterestData(data);
        setLoading(false);
      }
    })
      .catch((err) => {
        setLoading(false);
        alert(err.message)
      })
  }

  const getJobList3 = () => {
    Actions.GetJobNames().then((response) => {
      if (response.data) {
        let data = response.data.data;
        setPersonalInterest(data);
        // console.log('888' + JSON.stringify(data))
        setLoading(false);
      }
    })
      .catch((err) => {
        setLoading(false);
        alert(err.message)
      })
  }

  const getSchoolList = () => {
    Actions.GetSchoolNames().then((response) => {
      setLoading(true);
      if (response.data) {
        let data = response.data.data;
        let arr = [];
        let item = {};
        data.map((value) => {
          item = {
            id: value.id,
            universityName: value.name,
          }
          arr.push(item)
        })
        setuniversityArray([...arr]);
        setselectedUniText(arr[0].universityName)
        getMemberListToken(arr[0].id);

      }
    })
      .catch((err) => {
        setLoading(false);
        alert(err.message)
      })
  }
  function getSortList(state) {
    if (state == 'first') {
      let newArr = person.sort(function (a, b) { return a.first_name.toLowerCase() > b.first_name.toLowerCase() })
      setperson(newArr);
    }
    else if (state == 'last') {
      let newArr = person.sort(function (a, b) { return a.last_name.toLowerCase() > b.last_name.toLowerCase() })
      setperson(newArr);
    }
    else {
      let newArr = person.sort(function (a, b) { return Number(a.graduation_year) > Number(b.graduation_year) })
      setperson(newArr);
    }
  }
  const sortStateChange = (value) => {
    setOpenSortBy(false);
    if (value == "first") {
      if (firstNameSelected) {
        setfirstNameSelected(false);
        let newArr = person.sort(function (a, b) { return a.id > b.id })
        setperson(newArr);
      }
      else {
        setfirstNameSelected(!firstNameSelected);
        setsecondNameSelected(false);
        setclassYearSelected(false);
        getSortList('first');
      }
    }
    else if (value == "last") 
    {
      if (secondNameSelected) {
        setsecondNameSelected(false);
        let newArr = person.sort(function (a, b) { return a.id > b.id })
        setperson(newArr);
      } else {
        setsecondNameSelected(!secondNameSelected);
        setfirstNameSelected(false);
        setclassYearSelected(false);
        getSortList('last');
      }
    }
    else {
      if (classYearSelected) {
        setclassYearSelected(false);
        let newArr = person.sort(function (a, b) { return a.id > b.id })
        setperson(newArr);
      } else {
        setclassYearSelected(!classYearSelected);
        setfirstNameSelected(false);
        setsecondNameSelected(false);
        getSortList('class');
      }
    }
  }

  const SortModalView = (props) => {
    return (
      <View style={{ marginTop: hp(2), flexDirection: 'row' }} >
        <TouchableOpacity onPress={props.onPressItem} >
          <Image resizeMode='contain' style={{
            height: hp(3),
            width: hp(3),
            marginRight: hp(1)
          }} source={props.SelectedItem ? Images.check_on : Images.check_off} />
        </TouchableOpacity>
        <Text onPress={props.onPressItem} style={{ fontFamily: Fonts.APP_MEDIUM_FONT }} >{props.title}</Text>
      </View>
    )
  }
  const SelectSortBy = () => {
    return (
      <Modal animationType="slide" visible={openSortBy} transparent={true}>
        <TouchableOpacity onPress={() => setOpenSortBy(false)} style={{ height: hp(100), width: wp(100), backgroundColor: AppColors.TRANSPARENT_COLOR }}>
          <View style={Styles.modalContainer} >
            <Text style={{ fontFamily: Fonts.APP_REGULAR_FONT, fontSize: hp(2) }} >Sort By</Text>
            <SortModalView SelectedItem={firstNameSelected} title='First Name' onPressItem={() => sortStateChange("first")} />
            <SortModalView SelectedItem={secondNameSelected} title='Last Name' onPressItem={() => sortStateChange("last")} />
            <SortModalView SelectedItem={classYearSelected} title='Class Year' onPressItem={() => sortStateChange("class")} />
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  const SelectUniversity = () => {
    return (
      <Modal animationType="slide" visible={open} onRequestClose={() => { setOpen(false) }} transparent={true}>
        <TouchableOpacity onPress={() => setOpen(false)} style={{ height: hp(100), width: wp(100), }}>
          <View style={Styles.modalContainer} >
            <Text style={{ fontFamily: Fonts.APP_REGULAR_FONT, fontSize: hp(2) }} >Select University</Text>
            <FlatList
              data={universityArray}
              style={{ paddingHorizontal: hp(2) }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                <TouchableOpacity onPress={() => { setselectedUniText(item.universityName), setOpen(false), getMemberListToken(item.id) }} style={{ marginTop: hp(2) }} >
                  <Text style={{ fontFamily: Fonts.APP_MEDIUM_FONT }} >{item.universityName}</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  const seachDataList = (text) => {
    setSearchTextInput(text)
    if (text.length > 1) {
      const newData1 = personCopy.filter(item => {
        const itemData = item.first_name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1
      });
      setperson(newData1)
    }
    else {
      setperson(personCopy)
    }
  }

  const selectData = (item, index) => {
    if (selectedId === 0) {
      if (item.selected) {
        let oldData = previousJobData;
        let newItem = oldData[index];
        newItem.selected = false;
        oldData[index] = newItem;
        setPreviousJobData([...oldData])
      }
      else {
        let oldData = previousJobData;
        let newItem = oldData[index];
        newItem.selected = true;
        oldData[index] = newItem;
        setPreviousJobData([...oldData]);
      }
    }
    else if (selectedId === 1) {
      if (item.selected) {
        let oldData = interestData;
        let newItem = oldData[index];
        newItem.selected = false;
        oldData[index] = newItem;
        setInterestData([...oldData])
      }
      else {
        let oldData = interestData;
        let newItem = oldData[index];
        newItem.selected = true;
        oldData[index] = newItem;
        setInterestData([...oldData])
      }
    }
    else {
      if (item.selected) {
        let oldData = personalInterestData;
        let newItem = oldData[index];
        newItem.selected = false;
        oldData[index] = newItem;
        setPersonalInterest([...oldData])
      }
      else {
        let oldData = personalInterestData;
        let newItem = oldData[index];
        newItem.selected = true;
        oldData[index] = newItem;
        setPersonalInterest([...oldData])
      }
    }

  }

  const renderListItem = ({ item, index }) => {
    var home = item.home_state;
    var homestate = home.split(",");
    if (item.previous_state != null) {
      var prev = item.previous_state;
      var prevlocation = prev.split(",");
    }
    else {
      var prevlocation = [];
    }
    return (
      <TouchableOpacity onPress={() => navigation.push('ClassbookDetail',
        {
          FIRST_NAME: item.first_name,
          PERSON_ID: item.id,
          PERSON_NAME: item.first_name + " " + item.last_name,
          PERSON_IMAGE: item.profile_image,
          HOME_STATE: homestate[0],
          PREV_LOCATION: prevlocation[0] != null ? prevlocation[0] : 'Not Found',
          PREV_JOB: item.previousJobs.length > 0 ? item.previousJobs : 'Not Found',
          REC_INTEREST:item.intended_jobs.length >0 ?item.intended_jobs : 'Not Found',
          PERSONAL_INTEREST: item.interests.length > 0 ? item.interests : 'Not Found',
          COMPANY_INTEREST: 'Not Found',
          GRADUTION: item.graduation_year,
          SOCIAL_ID: item.social_id !== null ? item.social_id : null,
          })} >
        <ImageBackground style={Styles.flatlistImageContainer} source={item.profile_image != null ? { uri: IMAGE_URL + item.profile_image } : null} >
          <Text numberOfLines={1} style={Styles.flatlistTitleNameText}>
            {item.first_name + " " + item.last_name}
          </Text>
          <Text style={Styles.flatListProfileName}>{homestate[0]}</Text>
        </ImageBackground>
      </TouchableOpacity>)
  }

  const setFilterByInterest = () => {
    let selectedPreviousJob = '';
    previousJobData.map((item) => {
      if (selectedPreviousJob === '') { if (item.selected) { selectedPreviousJob = item.id } }
      else { if (item.selected) { selectedPreviousJob = selectedPreviousJob + ',' + item.id } }
    })

    setSelectedprevious(selectedPreviousJob);

    let selectedInterest = '';
    interestData.map((item) => {
      if (selectedInterest === '') { if (item.selected) { selectedInterest = item.id } }
      else { if (item.selected) { selectedInterest = selectedInterest + ',' + item.id } }
    })

    setSelectedInterest(selectedInterest);
    let selectedPersonal = '';
    personalInterestData.map((item) => {
      if (selectedPersonal === '') { if (item.selected) { selectedPersonal = item.id } }
      else { if (item.selected) { selectedPersonal = selectedPersonal + ',' + item.id } }
    })

    setSelectedPersonal(selectedPersonal);
    setShowFilter(false);
    setselectedId(null)
  }

  const ExpandableView = (props) => {
    return (
      <View>
        <MainView doExpand={() => props.doExpand()} open={props.selectedId === props.id ? true : false} heading={props.heading} />
        {props.selectedId === props.id ?
          <ExpandView selectedId={props.selectedId} selectData={(item, index,) => { selectData(item, index) }} data={props.data} />
          : null}
      </View>
    )
  }

  let showpast = [];
  if (selectedPrevious) {
    showpast = person.filter(x => x.previous_job != null ? x.previous_job.includes(selectedPrevious) : person);
  }
  let showInteded = [];
  if (selectedInterestData) {
    showInteded = person.filter(x => x.intended_job != null ? x.intended_job.includes(selectedInterestData) : person);
  }
  let showInterest = [];
  if (selectedPersonal) {
    showInterest = person.filter(x => x.interest != null ? x.interest.includes(selectedPersonal) : person);
  }
  let arr = showpast.concat(showInteded);
  let finalArray = arr.concat(showInterest);
  const uniqueArray = finalArray.filter((ele, ind) => ind === arr.findIndex(elem => elem.id === ele.id && elem.id === ele.id))

  const clearAll = () => {

    previousJobData.map((res, index) => {
      if (res.selected) {
        previousJobData[index].selected = false;
      }
    })

    interestData.map((res, index) => {
      if (res.selected) {
        interestData[index].selected = false;
      }
    })

    personalInterestData.map((res, index) => {
      if (res.selected) {
        personalInterestData[index].selected = false;
      }
    })

    setSelectedprevious(''); setSelectedInterest(''); setSelectedPersonal(''); setShowFilter(false);   
  }

  let MainArray = !selectedPrevious && !selectedInterestData && !selectedPersonal ? person.filter(x => getClient().user.id != x.id) : uniqueArray.filter(x => getClient().user.id != x.id) ;

  return (
    <ScrollView nestedScrollEnabled={true} style={{ flex: 1 ,backgroundColor:AppColors.APP_THEME}}>
      {loading ? <Spinner /> : null}
      <View style={Styles.headerContainer}>
        <Text style={Styles.headerText}>Classbook</Text>
        <View style={Styles.SearchContainer}>
          <TextInput
            placeholder="Search...."
            value={searchTextInput}
            onSubmitEditing={() => seachDataList()}
            onChangeText={(text) => seachDataList(text)}
            placeholderTextColor={AppColors.PRIVACY_BORDER}
            style={Styles.SearchTextInput} />
          <TouchableOpacity onPress={() => { setSearchTextInput(''), setperson(personCopy) }} style={Styles.crossIconContainer} >
            <Image resizeMode='contain' style={Styles.crossIcon} source={Images.closeCross} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={Styles.subHeaderContainer}>
        <TouchableOpacity onPress={() => setOpen(true)} style={Styles.subHeaderItemView}>
          <Text numberOfLines={1} style={Styles.subHeaderItemText}>{selectedUniText == '' ? 'NoData' : selectedUniText}
          </Text>
          <Image source={Images.downArrow} resizeMode='contain' style={Styles.downArrowstyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOpenSortBy(true)} style={[Styles.subHeaderItemView, { width: wp(26), paddingHorizontal: hp(0.5), }]}>
          <Text style={Styles.subHeaderItemText}> Sort by</Text>
          <Image resizeMode='contain'  source={Images.sortby_arrow} style={Styles.sortIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowFilter(true)} style={[Styles.subHeaderItemView, { width: wp(26), paddingHorizontal: hp(1.3), }]}>
          <Text style={Styles.subHeaderItemText}> Filter</Text>
          <Image resizeMode='contain'  source={Images.filterby} style={Styles.filterIcon} />
        </TouchableOpacity>
      </View>
      {loading ? <Spinner /> : null}
      {
        person.length > 0 ?
          <FlatList
            nestedScrollEnabled={true}
            numColumns={3}
            data={MainArray}
            keyExtractor={(item) => item.id}
            renderItem={renderListItem}
          />
          :
          searchTextInput != '' ?
            <View style={{ flex: 1, height: hp(50), justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: hp(3), color: AppColors.BLACK, fontFamily: Fonts.APP_REGULAR_FONT }} >No Result Found</Text>
            </View> : null}
      {open ? <SelectUniversity /> : null}
      { openSortBy ? <SelectSortBy /> : null}
      <Modal animationType="slide" visible={showFilter} transparent={true}>
        <View style={{ alignItems: 'center', paddingTop: hp(3), height: hp(92), width: wp(100), backgroundColor: AppColors.WHITE }}>
          <View style={Styles.topView}>
            <Text style={Styles.filterText}>Filter By</Text>
            <View flexDirection='row' justifyContent='center'><Text onPress={() => { clearAll() }} style={Styles.clearText}>Clear All</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)}>
                <Icon name='close' color={AppColors.INPUT} size={hp(3.2)} style={Styles.cancelIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: hp(78) }}>
            <ScrollView >
              <ExpandableView doExpand={() => { selectedId === 0 ? setselectedId(null) : setselectedId(0) }} id={0} selectedId={selectedId} heading='Previous Job' data={[...previousJobData]} />
              <ExpandableView doExpand={() => { selectedId === 1 ? setselectedId(null) : setselectedId(1) }} id={1} selectedId={selectedId} heading='Recruiting Interest' data={[...interestData]} />
              <ExpandableView doExpand={() => { selectedId === 2 ? setselectedId(null) : setselectedId(2) }} id={2} selectedId={selectedId} heading='Personal Interest' data={[...personalInterestData]} />
            </ScrollView>
          </View>
        </View>
        <Button continue={() => { setFilterByInterest() }} style={{ height: hp(8), bottom: 0, position: 'absolute', }} title='Save Filter' />
      </Modal>
    </ScrollView>
  )
}
export default Classbook;
