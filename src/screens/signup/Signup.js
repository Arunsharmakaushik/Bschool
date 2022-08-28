import React, { useEffect, useState } from 'react';
import { View, BackHandler, } from 'react-native'
import Styles from './Styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';
import HeaderView from '../../components/HeaderView';
import * as Progress from 'react-native-progress';
import { SignupStep1 } from './SignupStep1';
import { SignupStep2 } from './SignupStep2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignupStep3 } from './SignupStep3';
import VerifyView from './VerifyView';
import Actions from '../../webServices/Action';
import Spinner from '../../components/Spinner';
import SimpleToast from 'react-native-simple-toast';
import CONSTANTS from '../../utils/Constants';
import { ToastAndroid } from 'react-native';
import branch from 'react-native-branch';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';


export const Signup = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [codeValue, setCodeValue] = useState('');
    const [selectedNumber, setSelectedNumber] = useState(0);
    const [progressRate, setProgressRate] = useState(0.5);
    const [headText, setHeadText] = useState('Intended Job Fields');
    const [selectedCarrier, setSelectedCarrier] = useState([]);
    const [selectedPastField, setSelectedPastField] = useState([]);
    const [selectedInterest, setSelectedInterest] = useState([]);
    const [step1, step1completed] = useState(false);
    const [step2, step2completed] = useState(false);
    const [errorId, setErrorId] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [imageObject, setImageObject] = React.useState({});
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [graduationYear, setGraduationYear] = useState('');
    const [gender, setGender] = useState('');
    const [genderId, setGenderId] = useState('');

    const [focusId, setFocusId] = useState('');
    const [school, setSchool] = useState('');
    const [schoolId, setSchoolId] = useState('');
    const [underGrade, setUnderGrade] = useState('');
    const [underGradeId, setUnderGradeId] = useState('');
    const [homeState, setHomeState] = useState('');
    const [homeStateId, setHomeStateId] = useState('');
    const [previousStateId, setPreviousStateId] = useState('');
    const [previousState, setPreviousState] = useState('');
    const [verified, setAsVerified] = useState(false);
    const [allData, setData] = useState([]);
    const [allData2, setData2] = useState([]);
    const [allData3, setData3] = useState([]);
    const [bio, setBio] = useState('');
    const [fun, setFun] = useState('');
    const [help, setHelp] = useState('');
    const [myReferralLink,setRefLink]=useState('');

    useEffect(() => {
        getLink();
        getSignupStatus();
        getJobList();
        getInterestList();

    }, []);

    useEffect(() => {
        const backAction = () => {
            handleBackButtonClick()
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    });

    const getFcmToken=async()=>{
        const fcmToken = await messaging().getToken();
return fcmToken
    }

    const getSignupStatus = () => {
        if (route.params) {
            if (route.params.status === 'NotVerified') {
                step1completed(true);
                step2completed(true);
            }
            else if (route.params.status === 'ProfileIncompleted') {
                step1completed(true);
                step2completed(true);
                setAsVerified(true);
            }
        }
    }

    const getJobList = () => {
        Actions.GetJobNames().then((response) => {
            if (response.data) {
                let data = response.data.data;
                setData([...data]);
                setData2([...data]);
                setLoading(false);
            }
        })
            .catch((err) => {
                setLoading(false);
                alert(err.message)
            })
    }

  
    const getInterestList = () => {
        Actions.GetInterestNames().then((response) => {
            if (response.data) {
                let data = response.data.data;
                setData3([...data]);
                setLoading(false);
            }
        })
            .catch((err) => {
                setLoading(false);
                alert(err.message)
            })
    }

    const doSignup = (statusId) => {
        setErrorId('');
        setErrMsg('');
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        switch (statusId) {
            case '0':
                if (school === '') {
                    setErrorId(0);
                    setFocusId(0);
                    setErrMsg('Please set School');
                }
                else {
                    setFocusId(1)
                }
                break;
            case '1':
                if (underGrade === '') {
                    setErrorId(1);
                    setFocusId(1);
                    setErrMsg('Please set undergrade');
                }
                else {
                    setFocusId(2)
                }
                break;
            case '2':
                if (homeState === '') {
                    setErrorId(2);
                    setFocusId(2);
                    setErrMsg('Please choose your Home State');
                }
                else {
                    setFocusId(3)
                }
                break;
            case '3':
                if (previousState === '') {
                    setErrorId(3);
                    setFocusId(3);
                    setErrMsg('Please choose your Previous State');
                }
                else {

                    setErrMsg('');
                    setErrorId('');
                    doRegister();
                }
                break;
            case 'final':
                if (school === '') {
                    setErrorId(0);
                    setFocusId(0);
                    setErrMsg('Please set School');
                }
                else if (underGrade === '') {
                    setErrorId(1);
                    setFocusId(1);
                    setErrMsg('Please set undergrade');
                }
                else if (homeState === '') {
                    setErrorId(2);
                    setFocusId(2);
                    setErrMsg('Please choose your Home State');
                }
                else if (previousState === '') {
                    setErrorId(3);
                    setFocusId(3);
                    setErrMsg('Please choose your Previous State');
                }

                else {
                    setErrMsg('');
                    setErrorId('');
                    doRegister()
                }
                break;
            default:
                SimpleToast.show('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
        }
    }

    const selectInteredtedItems = (index, item) => {
        if (selectedNumber === 0) {
            if (item.selected) {
                let newItem = {
                    'name': item.name,
                    'selected': false,
                    'id': item.id,
                }
                allData[index] = newItem;
                setData([...allData]);
                const newArray = [];
                selectedCarrier.forEach(obj => {
                    if (!newArray.some(o => o.id === obj.id)) {
                        newArray.push({ ...obj })
                    }
                })
                const Data = selectedCarrier.filter(prod => prod.id === prod.id)
                setSelectedCarrier(Data);
            }
            else {
                let newItem = {
                    'name': item.name,
                    'selected': true,
                    'id': item.id,
                }
                allData[index] = newItem;
                setData([...allData]);
                selectedCarrier.push(newItem);
                setSelectedCarrier(selectedCarrier);
            }
        }
        else if (selectedNumber === 1) {
            if (item.selected) {
                let newItem = {
                    'name': item.name,
                    'selected': false,
                    'id': item.id,
                }
                allData2[index] = newItem;
                setData2([...allData2]);
                const Data = selectedPastField.filter(prod => prod.id !== index)
                setSelectedPastField(Data);
            }
            else {
                let newItem = {
                    'name': item.name,
                    'selected': true,
                    'id': item.id,
                }
                allData2[index] = newItem;
                setData2([...allData2]);
                selectedPastField.push(newItem);
                setSelectedPastField(selectedPastField);
            }
        }
        else {
            if (item.selected) {
                let newItem = {
                    'name': item.name,
                    'selected': false,
                    'id': item.id,
                }
                allData3[index] = newItem;
                setData3([...allData3]);
                const Data = selectedInterest.filter(prod => prod.id !== index)
                setSelectedInterest(Data);
            }
            else {
                let newItem = {
                    'name': item.name,
                    'selected': true,
                    'id': item.id,
                }
                allData3[index] = newItem;
                setData3([...allData3]);
                selectedInterest.push(newItem);
                setSelectedInterest(selectedInterest);
            }
        }
    }

    const btnContinue = () => {
        if (selectedNumber === 0 && selectedCarrier.length > 0) {
            setHeadText('Past Job Fields');
            setSelectedNumber(selectedNumber + 1);
            setProgressRate(progressRate + 0.4);
        }
        else if ((selectedNumber === '1' || selectedNumber === 1) && selectedPastField.length > 0) {
            setHeadText('Interests')
            setSelectedNumber(parseInt(selectedNumber) + 1);
            setProgressRate(progressRate + 0.4);
        } else if ((selectedNumber === '2' || selectedNumber === 2) && selectedInterest.length > 0) {
            finalRegistration();
        }
    }

    const handleBackButtonClick = () => {
        if (!step1 && !step2) {
            navigation.goBack()
        }
        else if (step1 && !step2) {
            step1completed(false)
        }
        else if (!verified) {
            // verfied back
        }
        else if (selectedNumber === 1 || selectedNumber === '1') {
            setHeadText('Intended Job Fields');
            setSelectedNumber(0);
            setProgressRate(0.5);
        }
        else if (selectedNumber === 2 || selectedNumber === '2') {
            setSelectedNumber(1);
            setHeadText('Past Job Fields');
            setProgressRate(0.8);
        }
        else if (selectedNumber === 3 || selectedNumber === '3') {

        }
        else if (selectedNumber === 0 && verified) {
            // setAsVerified(false)
        }
        else {
            // setAsVerified(false)
        }
    }

    const doSignupStep1 = (statusId) => {

        setErrorId('');
        setErrMsg('');
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


        switch (statusId) {
            case '10':
                if (firstName === '') {
                    setErrorId(10);
                    setFocusId(10);
                    setErrMsg('Please enter First Name');
                }
                else {
                    setFocusId(11)
                }
                break;
            case '11':
                if (lastName === '') {
                    setErrorId(11);
                    setFocusId(11);
                    setErrMsg('Please enter Last Name');
                }
                else {
                    setFocusId(12)
                }
                break;
            case '12':
                if (email === '') {
                    setErrorId(12);
                    setFocusId(12);
                    setErrMsg('Please enter Email address');
                }
                else if (reg.test(email) === false) {
                    setErrorId(12);
                    setFocusId(12);
                    setErrMsg('Please enter valid Email');
                }
                // else if (email.search(".edu") == -1) {
                //     setErrorId(12);
                //     setFocusId(12);
                //     setErrMsg('Please enter .edu emails only');
                // }
                else {
                    setFocusId(13);
                }
                break;
            case '13':
                if (graduationYear === '') {
                    setErrorId(13); setFocusId(13);
                    setErrMsg('Please set Graduation Year');
                }
                else {
                    setFocusId(14)
                }
                break;
                case '14':
                    if (gender === '') {
                        setErrorId(14); setFocusId(14);
                        setErrMsg('Please set Gender');
                    }
                    else {
                        setFocusId(15)
                    }
                    break;
            case '15':
                if (password === '') {
                    setErrorId(15); setFocusId(15);
                    setErrMsg('Please enter password');
                }
                else if (password.length < 6) {
                    setErrorId(15); setFocusId(15);
                    setErrMsg('Password length must be more than 6');
                }
                else {
                    setFocusId(16)
                }
                break;
            case '16':
                if (confirmPass === '') {
                    setErrorId(16); setFocusId(16);
                    setErrMsg('Please re-type your password');
                }
                else if (password !== confirmPass) {
                   
                    setErrorId(16); setFocusId(16);
                    setErrMsg('Password not matched');
                }
                else {
                    if (!termsAccepted) {
                        SimpleToast.showWithGravity('Accept the terms and condition', SimpleToast.SHORT, SimpleToast.CENTER);

                    }
                    else {
                        doSignupStep1('final')
                        // setErrMsg('');
                        // setErrorId('')
                        // step1completed(true)
                    }
                }
                break;
            case 'final':
                if (imageObject.uri == undefined) {
                    setErrorId(9);
                    setFocusId(9);
                    setErrMsg('Please select your profile picture');
                }
                 else if (firstName === '') {
                    setErrorId(10); setFocusId(10);
                    setErrMsg('Please enter First Name');
                }
                else if (lastName === '') {
                    setErrorId(11); setFocusId(11);
                    setErrMsg('Please enter Last Name');
                }
                else if (email === '') {
                    console.log(imageObject.uri)
                    setErrorId(12); setFocusId(12);
                    setErrMsg('Please enter Email address');
                }
                else if (reg.test(email) === false) {
                    setErrorId(12); setFocusId(12);
                    setErrMsg('Please enter valid Email');
                }
                // else if (email.search(".edu") == -1) {
                //     setErrorId(12);
                //     setFocusId(12);
                //     setErrMsg('Please enter .edu emails only');
                // }
                else if (graduationYear === '') {
                    setErrorId(13); setFocusId(13);
                    setErrMsg('Please set Graduation Year');
                }
                else if (gender === '') {
                    setErrorId(14); setFocusId(14);
                    setErrMsg('Please set Gender');
                }
                else if (password === '') {
                    setErrorId(15); setFocusId(15);
                    setErrMsg('Please enter password');
                }
                else if (password.length < 6) {
                    setErrorId(15); setFocusId(15);
                    setErrMsg('Password length must be more than 6');
                }
                else if (confirmPass === '') {
                    setErrorId(16); setFocusId(16);
                    setErrMsg('Please re-type your password');
                }
                else if (password !== confirmPass) {
                    setErrorId(16); setFocusId(16);
                    setErrMsg('Password not matched');
                }
               
                else if (!termsAccepted) {
                    SimpleToast.showWithGravity('Accept the terms and condition', SimpleToast.SHORT, SimpleToast.CENTER);
                }
                else {
                    step1completed(true)
                    setErrMsg('');
                    setErrorId('')
                }
                break;
            default:
                SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
        }
    }

    const checkOtp = () => {
        setLoading(true);
        if (codeValue.length < 4) {
            setLoading(false);
            SimpleToast.showWithGravity('Wrong Code', SimpleToast.SHORT, SimpleToast.CENTER)
        }
        else {
            AsyncStorage.getItem(CONSTANTS.EMAIL).then((res) => {
                if (res !== null) {
                    let data =
                    {
                        'email': res,
                        'otp': codeValue,
                        "type": '1'
                    }
                    console.log(data)
                    Actions.Email_Verify(data)
                        .then((response) => {
                            console.log("final " + JSON.stringify(response))
                            if (response.data.status === 'success') {
                                setLoading(false);
                                let data = response.data.data;
                                let token = data.token;
                                AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
                                AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
                                AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
                                setAsVerified(true);
                                SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                            }
                            else {
                                setLoading(false);
                                SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                            }
                        })
                        .catch((err) => {
                            setLoading(false);
                            console.log(JSON.stringify(err.response.data.message))
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                        })
                }
            })
        }
    }

    const resendOtp = () => {
        AsyncStorage.getItem(CONSTANTS.EMAIL).then((res) => {
            if (res !== null) {
                let data =
                {
                    'email': res,
                }
                console.log(data)
                Actions.Resend_Otp(data)
                    .then((response) => {
                        setLoading(false);
                        if (response.data.status === 'success') {
                            setLoading(false);
                            SimpleToast.showWithGravity('OTP sent', SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        SimpleToast.showWithGravity("Already Verified", SimpleToast.SHORT, SimpleToast.CENTER);
                    })
            }
        })
    }

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
        setRefLink(res.url);
      })
      }


    const finalRegistration = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then(async(myToken) => {
            if (myToken !== null) {
                setLoading(true);
                let selectedJobs = '';
                let selectedPasJobs = '';
                let selectedInterests = '';
                allData.map((item, index) => {
                    if (selectedJobs === '') { if (item.selected) { selectedJobs = item.id } }
                    else { if (item.selected) { selectedJobs = selectedJobs + ',' + item.id } }
                })
                allData2.map((item, index) => {
                    if (selectedPasJobs === '') { if (item.selected) { selectedPasJobs = item.id } }
                    else { if (item.selected) { selectedPasJobs = selectedPasJobs + ',' + item.id } }
                })
                allData3.map((item, index) => {
                    if (selectedInterests === '') { if (item.selected) { selectedInterests = item.id } }
                    else { if (item.selected) { selectedInterests = selectedInterests + ',' + item.id } }
                })
                let fcmToken = await AsyncStorage.getItem(CONSTANTS.FCM_TOKEN);
                let uuid = DeviceInfo.getUniqueId();


                let data = {
                    'intended_job': selectedJobs,
                    'previous_job': selectedPasJobs,
                    'interest': selectedInterests,
                    'profile_completed': 1,
                    'referral_link':myReferralLink,
                    'device_token': fcmToken != null ? fcmToken : '',
                    'uuid': uuid,
                }

                let maindata = {
                    data: data,
                    token: myToken
                }
                
                Actions.Final_Registration(maindata)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            setLoading(false);
                            AsyncStorage.setItem(CONSTANTS.LOGIN_ALREADY, '1');
                            navigation.reset({ index: 0, routes: [{ name: 'BottomTabNavigator' }] })
                            // navigation.replace('Tutorial');
                            SimpleToast.showWithGravity('Account Successfully Created', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                    })
            }
        })
    }

    const doRegister = () => {
        setLoading(true);
        let formdata = new FormData();
        formdata.append("profile_image", Object.keys(imageObject).length > 0 ? imageObject : '')
        formdata.append("first_name", firstName)
        formdata.append("last_name", lastName)
        formdata.append("email", email)
        formdata.append("gender", String(genderId))
        formdata.append("graduation_year", String(graduationYear))
        formdata.append("school", String(schoolId))
        formdata.append("undergrad", String(underGradeId))
        formdata.append("home_state_id",homeStateId)
        formdata.append("home_state", homeState)
        formdata.append("previous_state_id", previousStateId)
        formdata.append("previous_state", previousState)
        formdata.append("password", password)
        formdata.append("bio",bio)
        formdata.append("fun_fact", fun)
        formdata.append("help_other", help)
        const mainData = { data: formdata };
        Actions.Register(mainData)
            .then((response) => {
                console.log("res " + JSON.stringify(response))
                if (response.data.status === 'success') {
                    setLoading(false);
                    AsyncStorage.setItem(CONSTANTS.EMAIL, email);
                    SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                    step2completed(true);
                }
                else {
                    setLoading(false);
                    SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log("res " + JSON.stringify(err.response.data))
                SimpleToast.showWithGravity(err.response.data[0], SimpleToast.SHORT, SimpleToast.CENTER);
            })
    }

    return (
        <View flex={1} >
             {
                !step1 && !step2
                ?
                <SignupStep1 setImageObject={(file) => setImageObject(file)} imageObject={imageObject} setFocusId={setFocusId} doSignupStep1={(status) => doSignupStep1(status)} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} email={email} setEmail={setEmail} graduationYear={graduationYear} gender={gender} setGender={(v) => {setGender(v.value),setGenderId(v.id)}} setGraduationYear={(v) => setGraduationYear(v.value)} password={password} setPassword={setPassword} focusId={focusId} errorId={errorId} errMsg={errMsg} confirmPass={confirmPass} setConfirmPass={setConfirmPass} termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} back={() => navigation.goBack()} />
                :
                step1 && !step2
                    ?  
                <SignupStep2 bio={bio} setBio={(text)=>{setBio(text)}} fun={fun} setFun={(text)=>{setFun(text)}} help={help} setHelp={(text)=>{setHelp(text)}} loading={loading} setFocusId={setFocusId} school={school} setSchool={(item) => { setSchool(item.value), setSchoolId(item.id) }} homeState={homeState} setHomeState={(value) => { setHomeState(value) }} setPreviousStateId={(id)=>{setPreviousStateId(id)}} homeStateId={homeStateId} previousStateId={previousStateId} setHomeStateId={(id)=>{setHomeStateId(id)}} underGrade={underGrade} setUnderGrade={(item) => { setUnderGrade(item.value), setUnderGradeId(item.id) }} previousState={previousState} setPreviousState={(value) => setPreviousState(value)} focusId={focusId} errMsg={errMsg} errorId={errorId} doSignup={(status) => doSignup(status)} back={() => step1completed(false)} />
                 :
                    !verified ?
                            <VerifyView resendOtp={() => resendOtp()} loading={loading} back={() => { step2completed(false); }} CELL_COUNT={4} value={codeValue} continue={() => { checkOtp() }} setValue={(v) => setCodeValue(v)} />
                        :
                        <View style={Styles.container}>
                            <HeaderView onLeftClick={() => { handleBackButtonClick() }} />
                            <Progress.Bar progress={progressRate} color={AppColors.APP_THEME} style={{ marginTop: hp(1), borderWidth: 0, alignSelf: 'center', backgroundColor: AppColors.GREY_TEXT_COLOR, marginBottom: 5 }} borderColor={'transparent'} height={hp(0.5)} borderRadius={0} width={wp('90%')} />
                            {loading ? <Spinner /> : null}
                            <>
                                {selectedNumber === '0' || selectedNumber === 0 ?
                                    <SignupStep3 text={headText} continue={() => { btnContinue() }} selectInteredtedItems={(item, index) => selectInteredtedItems(item, index)} allData={allData} />
                                    :
                                    selectedNumber === '1' || selectedNumber === 1 ?
                                        <SignupStep3 text={headText} continue={() => { btnContinue() }} selectInteredtedItems={(item, index) => selectInteredtedItems(item, index)} allData={allData2} />
                                        :
                                        selectedNumber === '2' || selectedNumber === 2 ?
                                            <SignupStep3 text={headText} btnText='Finish' continue={() => { btnContinue() }} selectInteredtedItems={(item, index) => selectInteredtedItems(item, index)} allData={allData3} />
                                            :
                                            null
                                } 
                            </ >
                        </View>
            } 
        </View>
    )
}
