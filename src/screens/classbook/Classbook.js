import React, { useEffect, useState, useContext } from 'react';
import { Image, Text, TouchableOpacity, Modal, View, FlatList, ImageBackground, TextInput } from 'react-native';
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
import { BallIndicator } from 'react-native-indicators';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { InputPickerView } from '../../components/InputView';
import PersonProfile from '../chats/PersonProfile';

const Classbook = ({ navigation, noLoad }) => {
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
  const [selectedYearId, setselectedYearId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [onEndReached, setOnEndReached] = useState(false);
  const [total, setTotal] = useState();
  const [openDetail, setOpenDetail] = React.useState(false);
  const [details, setDetails] = React.useState({});
  const [filterData, setfilterData] = useState([]);
  const [filterDataCopy, setfilterDataCopy] = useState([]);

  useEffect(() => {
    AsyncStorage.setItem(CONSTANTS.FIXED_ROUTE_NAME, 'ClassbookStack');
    noLoad ? setLoading(false) : setLoading(true)
    getSchoolList(1);
  }, ([]));

  useEffect(() => {
    getJobList();

  }, []);

  const getMemberListToken = (schoolid) => {
    noLoad ? setLoading(false) : setLoading(true)
    AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((token) => {
      getSchoolMemberList(token, schoolid);
    })
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setOpenDetail(false)
      AsyncStorage.setItem(CONSTANTS.FIXED_ROUTE_NAME, 'ClassbookStack');
    })
    return unsubscribe;
  }, [navigation]);

  const getSchoolMemberList = (myToken, firstschoolid) => {
    Actions.GetSchoolUserList(myToken, firstschoolid)
      .then((response) => {
        if (response.data.status === 'success') {
          let data = response.data.data;
          let users = data.user.data;
          let newArr = users.sort(function (a, b) { return a.graduation_year > b.graduation_year });
          setLoading(false);
          setperson(newArr);
          setpersonCopy(newArr);
          if (filterData.length > 0) {
            clearAll();
          }
        }
        else {
          setLoading(false);
          SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
        }
      })
      .catch((err) => {
        if (err&&err.response&&err.response.status&& err.response.status === 401) {
          setLoading(false);
          refreshToken(firstschoolid);
          console.log('error');
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
    AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.SELECTED_SCHOOL, CONSTANTS.ACCESS_TOKEN]).then((res) => {
      if (res !== null) {
        let data = {
          token: res[0][1],
          oldToken: res[2][1]
        }
        Actions.Refresh_Token(data)
          .then((response) => {
            if (response.data.status === 'success') {
              let data = response.data.data;
              let token = data.token;
              AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
              AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
              AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
              String(schoolid) === 'school' ?
                getSchoolList(page)
                :
                getSchoolMemberList(token.access_token, schoolid);
            }
          })
          .catch((err) => {
            console.log(err.response.data)
            // SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
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
        // setLoading(false);
        getJobList2();
      }
    })
      .catch((err) => {
        setLoading(false);
      })
  }

  const getJobList2 = () => {
    Actions.GetJobNames().then((response) => {
      if (response.data) {
        let data = response.data.data;
        setInterestData(data);
        getJobList3();
      }
    })
      .catch((err) => {
        setLoading(false);
      })
  }

  const getJobList3 = () => {
    Actions.GetInterestNames().then((response) => {
      if (response.data) {
        let data = response.data.data;
        setPersonalInterest(data);
        setLoading(false);
      }
    })
      .catch((err) => {
        setLoading(false);
      })
  }

  const getSchoolList = (pageNum) => {
    page > 1 ? setIsLoading(true) : setIsLoading(false);
    // if(total != 0 && universityArray.length !== total){

    console.log(isLoading)
    Actions.GetSchoolNames(pageNum).then((response) => {
      if (response.data) {
        setTotal(response.data.total)
       
        let data = response.data.data;
        console.log('hffdfdf ' + JSON.stringify(response))
        let arr = [];
        let item = {};
        data.map((value) => {
          item = {
            id: value.id,
            value: value.name,
          }
          arr.push(item)
        })
        let previousArr = [...universityArray];
        if (previousArr.length > 0) {
          if (previousArr.length != response.data.total) {
            let mainArr = previousArr.concat(arr);
            console.log('hfdsdsdsds ' + JSON.stringify(mainArr))
            setuniversityArray([...mainArr]);
            setIsLoading(false);
          }
        }
        else {
          console.log('hfdsdsdssssds ' + JSON.stringify(arr))
          setuniversityArray([...arr]);
          setselectedUniText(arr[0].value)
          getMemberListToken(arr[0].id);
        }
        setIsLoading(false)
      }
    })
      .catch((err) => {
        if (err&&err.response&&err.response.status&& err.response.status === 401) {
          refreshToken('school');
        }
        else if (err&&err.response&&err.response.status&& err.response.status ===403) {
          setLoading(false);
          SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
          AsyncStorage.clear();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
        else {
          setLoading(false);
        }
      })
    // }
  }

  function getSortList(state) {
    if (state == 'first') {
      person.map((res) => {
        return res.data.sort(function (a, b) { return a.first_name.toLowerCase() > b.first_name.toLowerCase() })
      })
    }
    else if (state == 'last') {
      person.map((res) => {
        return res.data.sort(function (a, b) { return a.last_name.toLowerCase() > b.last_name.toLowerCase() })
      })
    }
    else {
      person.map((res) => {
        return res.data.sort(function (a, b) { return Number(a.graduation_year) > Number(b.graduation_year) })
      })
    }
  }
  function getSortListForFilter(state) {

    if (state == 'first') {
      filterData.map((res) => {
        return res.data.sort(function (a, b) { return a.first_name.toLowerCase() > b.first_name.toLowerCase() })
      })
    }
    else if (state == 'last') {
      filterData.map((res) => {
        return res.data.sort(function (a, b) { return a.last_name.toLowerCase() > b.last_name.toLowerCase() })
      })
    }
    else {
      filterData.map((res) => {
        return res.data.sort(function (a, b) { return Number(a.graduation_year) > Number(b.graduation_year) })
      })
    }


  }
  const sortStateChange = (value) => {
    if (filterData.length > 0) {
      setTimeout(() => {
        setOpenSortBy(false);
     }, 3000);
      if (value == "first") {
        if (firstNameSelected) {
          setfirstNameSelected(false);
          filterData.map((res) => {
            return res.data.sort(function (a, b) { return Number(a.id) < Number(b.id) })
          })
          // let newArr = filterData.sort(function (a, b) { return a.graduation_year > b.graduation_year })
          // setfilterData(newArr);
        }
        else {
          setfirstNameSelected(!firstNameSelected);
          setsecondNameSelected(false);
          setclassYearSelected(false);
          getSortListForFilter('first');
        }
      }
      else if (value == "last") {
        if (secondNameSelected) {
          setsecondNameSelected(false);
          filterData.map((res) => {
            return res.data.sort(function (a, b) { return Number(a.id) < Number(b.id) })
          })
          // let newArr = filterData.sort(function (a, b) { return a.graduation_year > b.graduation_year })
          // setfilterData(newArr);
        } else {
          setsecondNameSelected(!secondNameSelected);
          setfirstNameSelected(false);
          setclassYearSelected(false);
          getSortListForFilter('last');
        }
      }
      else {
        if (classYearSelected) {
          setclassYearSelected(false);
          // let newArr = filterData.sort(function (a, b) { return a.graduation_year > b.graduation_year })
          // setfilterData(newArr);
          filterData.map((res) => {
            return res.data.sort(function (a, b) { return Number(a.id) < Number(b.id) })
          })
        }
        else {
          setclassYearSelected(!classYearSelected);
          setfirstNameSelected(false);
          setsecondNameSelected(false);
          getSortListForFilter('class');
        }
      }
    }
    else  //for person data
    {
      
      setTimeout(() => {
         setOpenSortBy(false);
      }, 3000);
      if (value == "first") {
        if (firstNameSelected) {
          setfirstNameSelected(false);
          person.map((res) => {
            return res.data.sort(function (a, b) { return Number(a.id) < Number(b.id) })
          })
          // let newArr = person.sort(function (a, b) { return a.graduation_year > b.graduation_year })
          // setperson(newArr);

        }
        else {
          setfirstNameSelected(!firstNameSelected);
          setsecondNameSelected(false);
          setclassYearSelected(false);
          getSortList('first');
        }
      }
      else if (value == "last") {
        if (secondNameSelected) {
          setsecondNameSelected(false);
          // let newArr = person.sort(function (a, b) { return a.graduation_year > b.graduation_year })
          // setperson(newArr);
          person.map((res) => {
            return res.data.sort(function (a, b) { return Number(a.id) < Number(b.id) })
          })
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
          person.map((res) => {
            return res.data.sort(function (a, b) { return Number(a.id) < Number(b.id) })
          })
          // let newArr = person.sort(function (a, b) { return a.graduation_year > b.graduation_year })
          // setperson(newArr);
        } else {
          setclassYearSelected(!classYearSelected);
          setfirstNameSelected(false);
          setsecondNameSelected(false);
          getSortList('class');
        }
      }
    }
  }

  const SortModalView = (props) => {
    return (
      <TouchableOpacity onPress={props.onPressItem} style={{ marginTop: hp(2), flexDirection: 'row', }} >
        <View  >
          <Image resizeMode='contain' style={{
            height: hp(3),
            width: hp(3),
            marginRight: hp(1)
          }} source={props.SelectedItem ? Images.check_on : Images.check_off} />
        </View>
        <Text onPress={props.onPressItem} style={{ fontFamily: Fonts.APP_MEDIUM_FONT }} >{props.title}</Text>
      </TouchableOpacity>
    )
  }

  const supportedOrientations = [
    'portrait',
    'portrait-upside-down',
    'landscape',
    'landscape-left',
    'landscape-right',
  ];

  const onLoad = () => {
    let arr = [...universityArray];
    if (total === arr.length) {
      setOnEndReached(false);
    }
    else {
      setOpen(true)
      setOnEndReached(true);
      setPage(page + 1),
        getSchoolList(page + 1)
    }
  }


  const seachDataList = (text) => {

    setSearchTextInput(text)
    if (text.length > 1) {
      let data = filterData.length > 0 ? filterData : personCopy;
      let mainArr = [];
      let bioArr = [];
      let funArr = [];
      let helpArr = [];
      let lastArr = [];

      data.map((res) => {
        let arr = res.data.filter((item) => item.first_name.toLowerCase().includes(text.toLowerCase())).map((res) => (res));
        if (arr.length > 0) {
          arr.map((response) => {
            if (response.first_name.toLowerCase().includes(text.toLowerCase())) {
              mainArr.push(response)
            }
          })
        }
      })

      data.map((res) => {
        let arr = res.data.filter((item) => item.last_name.toLowerCase().includes(text.toLowerCase())).map((res) => (res));
        if (arr.length > 0) {
          arr.map((response) => {
            if (response.last_name.toLowerCase().includes(text.toLowerCase())) {
              lastArr.push(response)
            }
          })
        }
      })

      data.map((res) => {
        let arr = res.data.filter((item) => item.bio != null ? item.bio.toLowerCase().includes(text.toLowerCase()) : '').map((res) => (res));
        if (arr.length > 0) {
          arr.map((response) => {
            if (response.bio.toLowerCase().includes(text.toLowerCase())) {
              bioArr.push(response)
            }
          })
        }
      })

      data.map((res) => {
        let arr = res.data.filter((item) => item.fun_fact != null ? item.fun_fact.toLowerCase().includes(text.toLowerCase()) : '').map((res) => (res));
        if (arr.length > 0) {
          arr.map((response) => {
            if (response.fun_fact.toLowerCase().includes(text.toLowerCase())) {
              funArr.push(response)
            }
          })
        }
      })

      data.map((res) => {
        let arr = res.data.filter((item) => item.help_other != null ? item.help_other.toLowerCase().includes(text.toLowerCase()) : '').map((res) => (res));
        if (arr.length > 0) {
          arr.map((response) => {
            if (response.help_other.toLowerCase().includes(text.toLowerCase())) {
              helpArr.push(response)
            }
          })
        }
      })

      let a = mainArr.concat(funArr);
      let b = a.concat(bioArr);
      let c = b.concat(helpArr);
      let m = c.concat(lastArr);
      let d = getUnique(m, 'id');
      console.log('jhdjh ' + JSON.stringify(d))

      if (d.length > 0) {
        let currentYear = new Date().getFullYear();
        let arr = [];
        for (let i = currentYear; i < Number(currentYear + 2); i++) {
          let year = i + 1
          arr.push(year);
        }
        let year1 = [];
        let year2 = [];

        d.map((res) => {
          if (res.graduation_year === String(arr[0])) {
            year1.push(res)
          } else {
            year2.push(res)
          }
        });
        let finalArray = []
        year1.length > 0 ? finalArray.push({ graduation_year: arr[0], data: year1 }) : null;
        year2.length > 0 ? finalArray.push({ graduation_year: arr[1], data: year2 }) : null;

        if (filterData.length > 0) {
          setfilterData([...finalArray]);
        }
        else {
          setperson([...finalArray]);
        }

      }
      else {
        if (filterData.length > 0) {
          setfilterData([]);
        }
        else {
          setperson([]);
        }

      }

    }
    else {
      if (filterData.length > 0) {
        setfilterData(filterDataCopy)
      }
      else {
        setperson(personCopy)
      }

    }
  }

  function getUnique(arr, index) {

    const unique = arr
      .map(e => e[index])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);

    return unique;
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
    // alert(JSON.stringify(item.home_state))
    var homestate = home.split(",");
    if (item.previous_state != null) {
      var prev = item.previous_state;
      var prevlocation = prev.split(",");
    }
    else {
      var prevlocation = [];
    }
    return (
      <TouchableOpacity onPress={() =>
      //  navigation.push('ClassbookDetail',
      // {
      //   FIRST_NAME: item.first_name,
      //   PERSON_ID: item.id,
      //   PERSON_NAME: item.first_name + " " + item.last_name,
      //   PERSON_IMAGE: item.profile_image,
      //   HOME_STATE: homestate[0],
      //   PREV_LOCATION: prevlocation[0] != null ? prevlocation[0] : 'Not Found',
      //   PREV_JOB: item.previousJobs.length > 0 ? item.previousJobs : 'Not Found',
      //   REC_INTEREST: item.intended_jobs.length > 0 ? item.intended_jobs : 'Not Found',
      //   PERSONAL_INTEREST: item.interests.length > 0 ? item.interests : 'Not Found',
      //   COMPANY_INTEREST: 'Not Found',
      //   GRADUTION: item.graduation_year,
      //   SOCIAL_ID: item.social_id !== null ? item.social_id : null,
      // })

      {
        // console.log(item)
        setDetails(item);
        // setOpenDetail(true);
        navigation.push('MemberProfile', { USERID: item.id })
      }
      } >
        <ImageBackground style={Styles.flatlistImageContainer} source={item.profile_image != null ? { uri: IMAGE_URL + item.profile_image } : null} >
          <Text numberOfLines={1} style={Styles.flatlistTitleNameText}>
            {item.first_name + " " + item.last_name}
          </Text>
          <Text style={Styles.flatListProfileName}>{homestate[0]}</Text>
        </ImageBackground>
      </TouchableOpacity>)
  }

  // const setFilterByInterest = () => {
  //   let selectedPreviousJob = '';
  //   previousJobData.map((item) => {
  //     if (selectedPreviousJob === '') { if (item.selected) { selectedPreviousJob = item.id } }
  //     else { if (item.selected) { selectedPreviousJob = selectedPreviousJob + ',' + item.id } }
  //   })
  //   setSelectedprevious(selectedPreviousJob);
  //   let selectedInterest = '';
  //   interestData.map((item) => {
  //     if (selectedInterest === '') { if (item.selected) { selectedInterest = item.id } }
  //     else { if (item.selected) { selectedInterest = selectedInterest + ',' + item.id } }
  //   })

  //   setSelectedInterest(selectedInterest);
  //   let selectedPersonal = '';
  //   personalInterestData.map((item) => {
  //     if (selectedPersonal === '') { if (item.selected) { selectedPersonal = item.id } }
  //     else { if (item.selected) { selectedPersonal = selectedPersonal + ',' + item.id } }
  //   })
  //   setSelectedPersonal(selectedPersonal);
  //   setShowFilter(false);
  //   setselectedId(null)
  // }

  // const renderUniItem = ({ item, index }) => (
  //   <TouchableOpacity onPress={() => { setselectedUniText(item.value), setOpen(false), getMemberListToken(item.id) }} style={{ marginTop: hp(2) }} >
  //     <Text style={{ fontFamily: Fonts.APP_MEDIUM_FONT }} >{item.value}</Text>
  //   </TouchableOpacity>
  // );

  const renderUniItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => { setselectedUniText(item.value), setOpen(false), getMemberListToken(item.id) }} style={{ marginTop: hp(2) }} >
      {
        selectedUniText === item.value ?
          <View style={{ backgroundColor: AppColors.GREY_TEXT_COLOR, padding: 10 }} >
            <Text style={{ fontFamily: Fonts.APP_MEDIUM_FONT }} >{item.value}</Text>
          </View>
          : <Text style={{ fontFamily: Fonts.APP_MEDIUM_FONT }} >{item.value}</Text>
      }
    </TouchableOpacity>
  );

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={Styles.footer}>
        {isLoading ?
          <BallIndicator style={{ alignSelf: 'center' }} size={20} color={AppColors.APP_THEME} />
          : null}
      </View>
    );
  };

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

  // let showpast = [];
  // if (selectedPrevious) {
  //   let data = person;
  //   let mainArr = [];
  //   data.map((res) => {
  //     let arr = res.data.filter((item) => item.previous_job != null ? item.previous_job.includes(selectedPrevious) : res.data).map((res) => (res));
  //     if (arr.length > 0) {
  //       arr.map((response) => {
  //         if (response.previous_job != null ? response.previous_job.includes(selectedPrevious) : false) {
  //           mainArr.push(res)
  //         }
  //       })
  //     }
  //   })
  //   showpast = mainArr;
  // }
  // let showInteded = [];
  // if (selectedInterestData) {
  //   let data = person;
  //   let mainArr = [];
  //   data.map((res) => {
  //     let arr = res.data.filter((item) => item.intended_job != null ? item.intended_job.includes(selectedInterestData) : res.data).map((res) => (res));
  //     if (arr.length > 0) {
  //       arr.map((response) => {
  //         if (response.intended_job != null ? response.intended_job.includes(selectedInterestData) : false) {
  //           mainArr.push(res)
  //         }
  //       })
  //     }
  //   })
  //   showInteded = mainArr;
  // }
  // let showInterest = [];
  // if (selectedPersonal) {
  //   let data = person;
  //   let mainArr = [];
  //   data.map((res) => {
  //     let arr = res.data.filter((item) => item.interest != null ? item.interest.includes(selectedPersonal) : res.data).map((res) => (res));
  //     if (arr.length > 0) {
  //       arr.map((response) => {
  //         if (response.interest != null ? response.interest.includes(selectedPersonal) : false) {
  //           mainArr.push(res)
  //         }
  //       })
  //     }
  //   })
  //   showInterest = mainArr;
  // }
  // let arr = showpast.concat(showInteded);
  // let finalArray = arr.concat(showInterest);
  // const uniqueArray = finalArray.filter((ele, ind) => ind === arr.findIndex(elem => elem.id === ele.id && elem.id === ele.id))
  const falseAllSort = () => {
    setclassYearSelected(false);
    setfirstNameSelected(false);
    setsecondNameSelected(false);

  }
  const clearAll = () => {
    if (filterData.length > 0) {
      falseAllSort();
    }
    setfilterData([]);
    setfilterDataCopy([]);

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

  // let MainArray = !selectedPrevious && !selectedInterestData && !selectedPersonal ? person : uniqueArray;
  let MainArray = filterData.length < 1 && !selectedPrevious && !selectedInterestData && !selectedPersonal ? person : filterData;
  let ExpandableArray = [...MainArray];

  const setFilterByInterestMine = () => {
    let selectedPreviousJob = '';

    previousJobData.map((item) => {
      if (selectedPreviousJob === '') {
        if (item.selected) { selectedPreviousJob = item.id }
      }
      else {
        if (item.selected) { selectedPreviousJob = selectedPreviousJob + ',' + item.id }
      }
    })
    setSelectedprevious(selectedPreviousJob);
    let selectedInterest = '';
    interestData.map((item) => {
      if (selectedInterest === '') { if (item.selected) { selectedInterest = item.id } }
      else { if (item.selected) { selectedInterest = selectedInterest + ',' + item.id } }
    })

    setSelectedInterest(selectedInterest);
    let selectedPersonals = '';
    personalInterestData.map((item) => {
      if (selectedPersonals === '') { if (item.selected) { selectedPersonals = item.id } }
      else { if (item.selected) { selectedPersonals = selectedPersonals + ',' + item.id } }
    })
    setSelectedPersonal(selectedPersonals);
    var selectedPreviousJobArray = String(selectedPreviousJob).split(",")
    var selectedPersonalInterestArray = String(selectedPersonals).split(",")
    var selectedRecruitingArray = String(selectedInterest).split(",")
    let prevJobUser = prevJob(selectedPreviousJobArray);
    let prevAndRecruitJobs = prevJobUser.concat(recjob(selectedRecruitingArray));
    let AllSelectedUser = prevAndRecruitJobs.concat(intJob(selectedPersonalInterestArray));
    let uniqueChars = [...new Set(AllSelectedUser)];
    if (uniqueChars.length > 0) {
      setfilterData([]);
      setfilterDataCopy([]);
      let data = personCopy;
      let mainArr = [];
      // alert(uniqueChars)
      data.map((res) => {

        let arr = res.data.filter((item) => uniqueChars.includes(item.id)).map((res) => (res));
        if (arr.length > 0) {
          arr.map((response) => {
            if (uniqueChars.includes(response.id)) {
              let cc = [];
              cc.push(response);
              let item = {
                graduation_year: res.graduation_year,
                data: cc
              }
              mainArr.push(item)
            }
          })
        }

      })
      let final = []

      data.map((item) => {
        let dublicate = []
        let gdYear = ''
        mainArr.map((res) => {
          if (item.graduation_year == res.graduation_year) {
            dublicate.push(res.data[0])
            gdYear = item.graduation_year;
          }
        })
        if (gdYear != '') {
          let items = {
            graduation_year: gdYear,
            data: dublicate
          }
          final.push(items)
        }
      })
      setfilterData(final)
      setfilterDataCopy(final);
      // setfirstNameSelected(false);
      // setsecondNameSelected(false);
      // setclassYearSelected(false);
    }
    else {
      setfilterData([])
      setfilterDataCopy([]);
    }
    setShowFilter(false);
    setselectedId(null)
  }
  const intJob = (selectedPersonalInterestArray) => {
    let intJobs = []
    selectedPersonalInterestArray.map((item) => {
      person.map((value) => {
        value.data.map((val) => {
          val.interests.map((jobs) => {
            if (jobs.id == item) {
              intJobs.push(val.id)
            }
          })
        })
      })
    })
    return intJobs;
  }
  const recjob = (selectedRecruitingArray) => {
    let recJob = []
    selectedRecruitingArray.map((item) => {
      person.map((value) => {
        value.data.map((val) => {
          val.intended_jobs.map((jobs) => {
            if (jobs.id == item) {
              recJob.push(val.id)
            }
          })
        })
      })
    })
    return recJob;
  }
  const prevJob = (selectedPreviousJobArray) => {
    let prevJob = []
    selectedPreviousJobArray.map((item) => {
      person.map((value) => {
        value.data.map((val) => {
          val.previousJobs.map((jobs) => {
            if (jobs.id == item) {
              prevJob.push(val.id)
            }
          })
        })
      })
    })
    return prevJob;
  }
  return (
    <ScrollView nestedScrollEnabled={true} style={{ flex: 1, backgroundColor: AppColors.APP_THEME }}>
      {loading ? <Spinner /> : null}
      <View style={Styles.headerContainer}>
        <Text style={Styles.headerText}>Classbook</Text>
        <View style={Styles.SearchContainer}>
          <TextInput
            placeholder="Search...."
            value={searchTextInput}
            onSubmitEditing={() => seachDataList(searchTextInput)}
            onChangeText={(text) => seachDataList(text)}
            placeholderTextColor={AppColors.PRIVACY_BORDER}
            style={Styles.SearchTextInput} />
          <TouchableOpacity onPress={() => { setSearchTextInput(''), setperson(personCopy), setfilterData(filterDataCopy) }} style={Styles.crossIconContainer} >
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
          <Image resizeMode='contain' source={Images.sortby_arrow} style={Styles.sortIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowFilter(true)} style={[Styles.subHeaderItemView, { width: wp(26), paddingHorizontal: hp(1.3), }]}>
          <Text style={Styles.subHeaderItemText}> Filter</Text>
          <Image resizeMode='contain' source={Images.filterby} style={Styles.filterIcon} />
        </TouchableOpacity>
      </View>
      {loading ? <Spinner /> : null}
      {
        ExpandableArray.length > 0 ?
          <View style={{ flex: 1 }} >
            {ExpandableArray.map((item, index) => {
              return (
                <>
                  <TouchableOpacity onPress={() => { selectedYearId === index ? setselectedYearId(null) : setselectedYearId(index) }} style={[AllGroupStyles.outerView, { backgroundColor: 'white', padding: hp(1.2) }]}>
                    <Text style={AllGroupStyles.headingStyle}>{item.graduation_year}</Text>
                    {index === selectedYearId ?
                      <Icon name='up' size={hp(2.2)} style={Styles.downIcon} />
                      :
                      <Icon name='down' size={hp(2.2)} style={Styles.downIcon} />
                    }
                  </TouchableOpacity>
                  {index === selectedYearId ?
                    <FlatList
                      nestedScrollEnabled={true}
                      numColumns={3}
                      data={item.data}
                      keyExtractor={(item) => item.id}
                      renderItem={renderListItem}
                    />
                    : null}
                </ >
              )
            })}
          </View>
          :
          searchTextInput != '' ?
            <View style={Styles.searchingView}>
              <Text style={Styles.resultText} >No Result Found</Text>
            </View> :
            <View style={Styles.searchingView}>

              {
                selectedPersonal || selectedInterestData || selectedPrevious ?
                  <Text style={Styles.resultText} >No Data Found</Text>
                  :
                  <Text style={Styles.resultText} >Hold on! No students from this class yet, but students are joining daily!</Text>

              }

            </View>
      }
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
        <Button continue={() => { setFilterByInterestMine() }} style={{ height: hp(8), bottom: 0, position: 'absolute', }} title='Save Filter' />
      </Modal>

      <Modal animationType="slide" visible={openSortBy} transparent={true}>
        <TouchableOpacity onPress={() => setOpenSortBy(false)} style={{ height: hp(100), width: wp(100), backgroundColor: AppColors.TRANSPARENT_COLOR }}>
          <TouchableOpacity activeOpacity={1.0} onPress={() => setOpenSortBy(true)} style={Styles.modalContainer} >
            <Text style={{ fontFamily: Fonts.APP_REGULAR_FONT, fontSize: hp(2) }} >Sort By</Text>
            <SortModalView SelectedItem={firstNameSelected} title='First Name' onPressItem={() => { setsecondNameSelected(false), setclassYearSelected(false), setfirstNameSelected(!firstNameSelected), sortStateChange("first") }} />
            <SortModalView SelectedItem={secondNameSelected} title='Last Name' onPressItem={() => { setfirstNameSelected(false), setclassYearSelected(false), setsecondNameSelected(!secondNameSelected), sortStateChange("last") }} />
            <SortModalView SelectedItem={classYearSelected} title='Class Year' onPressItem={() => { setfirstNameSelected(false), setsecondNameSelected(false), setclassYearSelected(!classYearSelected), sortStateChange("class") }} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={open}
        transparent={true}
        onRequestClose={() => { setOpen(false) }}
        supportedOrientations={supportedOrientations}>

        <TouchableOpacity activeOpacity={1.0} onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(56,56,56,0.5)' }}>
          <TouchableOpacity activeOpacity={1.0} onPress={() => setOpen(true)} style={[{ bottom: 0, position: 'absolute', backgroundColor: AppColors.WHITE, height: hp(50), width: wp(100), padding: 10, borderTopLeftRadius: hp(4), borderTopRightRadius: hp(4), alignSelf: 'center' }]}>
            <Text style={[{
              textAlign: 'left',
              fontSize: hp('2%'),
              paddingVertical: hp(1), color: AppColors.INPUT, fontWeight: 'bold', paddingLeft: wp(5),
            }]}>Select University</Text>
            <View style={{ height: hp(43), alignSelf: 'center', width: '100%', paddingHorizontal: wp(5) }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[...universityArray]}
                renderItem={renderUniItem}
                ListFooterComponent={renderFooter}
                initialNumToRender={15}
                keyExtractor={(item, index) => index.toString()}
                maxToRenderPerBatch={2}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => { setOnEndReached(false) }}
                onEndReached={() => {
                  if (!onEndReached) {
                    onLoad()
                  }
                }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal animationType="slide"
        style={{ flex: 1 }}
        onRequestClose={() => { setOpenDetail(false) }}
        supportedOrientations={supportedOrientations}
        contentContainerStyle={{ backgroundColor: AppColors.SEARCH_COLOR, flexGrow: 1 }}
        visible={openDetail} //showPopup
        transparent={true}>
        <View backgroundColor={AppColors.WHITE} flex={1}>
          <PersonProfile navigation={navigation} classbook userId={details.id} goBack={() => setOpenDetail(false)} />
        </View>
      </Modal>
    </ScrollView>
  )
}

export default Classbook;
