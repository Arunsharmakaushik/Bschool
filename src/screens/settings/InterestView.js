import React, { useEffect, useState } from 'react';
import { View, BackHandler, } from 'react-native'
import Styles from './Styles';
import HeaderView from '../../components/HeaderView';
import Spinner from '../../components/Spinner';
import { SignupStep3 } from '../signup/SignupStep3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import Actions from '../../webServices/Action';
import SimpleToast from 'react-native-simple-toast';

export const InterestView = ({ navigation, route }) => {
    const [selectedNumber, setSelectedNumber] = useState(0);
    const [allData, setData] = useState([]);
    const [allData2, setData2] = useState([]);
    const [allData3, setData3] = useState([]);
    const [loading, setLoading] = useState(true);
    const [headText, setHeadText] = useState('Interests');


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

    useEffect(() => {
        getDetails();
    }, []);

    // get user detail
    const getDetails = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                let data = {
                    token: myToken
                }
                Actions.ProfileStatus(data)
                    .then((response) => {
                        console.log("data***** " + JSON.stringify(response.data.data));
                        if (response.data.status === 'success') {
                            setLoading(false);
                            let data = response.data.data;
                            let userData = data.user;
                            userData.intended_jobs.map((res) => {
                                res.selected = true;
                            })
                            userData.interests.map((res) => {
                                res.selected = true;
                            })
                            userData.previousJobs.map((res) => {
                                res.selected = true;
                            })
                            getInterests(userData.interests);
                            getIntendedJobs(userData.intended_jobs);
                            getPreviousJobs(userData.previousJobs);
                        }
                    })
                    .catch((err) => {
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            refreshToken('details');
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
        })
    }

    const getPreviousJobs = (userData) => {
        Actions.GetJobNames().then((response) => {
            if (response.data) {
                let data = response.data.data;
                data.map((res) => {
                    res.selected = false;
                })
                let ee = userData.concat(data);
                const newArray = [];
                ee.forEach(obj => {
                    if (!newArray.some(o => o.id === obj.id)) {
                        newArray.push({ ...obj })
                    }
                });
                newArray.sort(function (a, b) { return a.id - b.id });
                    setData3([...newArray])
                
                setLoading(false);
            }
        })
            .catch((err) => {
                setLoading(false);
                alert(err.message)
            })
    }

    const getInterests = (userData) => {
        Actions.GetInterestNames().then((response) => {
            if (response.data) {
                let data = response.data.data;
                data.map((res) => {
                    res.selected = false;
                })
                let ee = userData.concat(data);
                const newArray = [];
                ee.forEach(obj => {
                    if (!newArray.some(o => o.id === obj.id)) {
                        newArray.push({ ...obj })
                    }
                });
                newArray.sort(function (a, b) { return a.id - b.id });
                setData([...newArray])
                setLoading(false);
            }
        })
            .catch((err) => {
                setLoading(false);
                alert(err.message)
            })
    }

    const getIntendedJobs = (userData) => {
        Actions.GetJobNames().then((response) => {
            if (response.data) {
                let data = response.data.data;
                data.map((res) => {
                    res.selected = false;
                })
                let ee = userData.concat(data);
                const newArray = [];
                ee.forEach(obj => {
                    if (!newArray.some(o => o.id === obj.id)) {
                        newArray.push({ ...obj })
                    }
                });
                newArray.sort(function (a, b) { return a.id - b.id });
                setData2([...newArray])
                setLoading(false);
            }
        })
            .catch((err) => {
                setLoading(false);
                alert(err.message)
            })
    }

    const refreshToken = (state) => {
        AsyncStorage.multiGet([CONSTANTS.REFRESH_TOKEN, CONSTANTS.ACCESS_TOKEN]).then((res) => {
            if (res !== null) {
                let data = {
                    token: res[0][1],
                    oldToken: res[1][1]
                }
                Actions.Refresh_Token(data)
                    .then((response) => {
                        console.log("refreshed " + JSON.stringify(response))
                        if (response.data.status === 'success') {
                            let data = response.data.data;
                            let token = data.token;
                            AsyncStorage.setItem(CONSTANTS.ACCESS_TOKEN, token.access_token);
                            AsyncStorage.setItem(CONSTANTS.REFRESH_TOKEN, token.refresh_token);
                            AsyncStorage.setItem(CONSTANTS.GETSTREAM_TOKEN, data.getstream_token);
                            if(state==='update'){
                                doUpdate();
                            } else{getDetails();}

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

    const btnContinue = () => {
        if (selectedNumber === 0) {
            
            setHeadText('Intended Job carrier');
            setSelectedNumber(selectedNumber + 1);
        }
        else if (selectedNumber === 1) {
            setHeadText('Past Job field')
            setSelectedNumber(parseInt(selectedNumber) + 1);
        } else if (selectedNumber === 2) {
            doUpdate();
        }
    }

    const handleBackButtonClick = () => {
        if (selectedNumber === 1) {
            setHeadText('Interests');
            setSelectedNumber(0);
        }
        else if (selectedNumber === 2) {
            setSelectedNumber(1);
            setHeadText('Intended Job carrier');
        }
        else if (selectedNumber === 0) {
            navigation.goBack()
        }
    }

    const selectInteredtedItems = (index, item) => {
        if (selectedNumber === 0) {
            let newItem = allData[index];
            if (item.selected) {
                newItem.selected = false;
            }
            else {
                newItem.selected = true;
            }
            setData([...allData]);
        }
        else if (selectedNumber === 1) {
            let newItem = allData2[index];
            if (item.selected) {
                newItem.selected = false;
            }
            else {
                newItem.selected = true;
            }
            setData2([...allData2]);
        }
        else if (selectedNumber === 2) {
            let newItem = allData3[index];
            if (item.selected) {
                newItem.selected = false;
            }
            else {
                newItem.selected = true;
            }
            setData3([...allData3]);
        }
    }

    const doUpdate = () => {
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                setLoading(true);
                let selectedJobs = '';
                let selectedPasJobs = '';
                let selectedInterests = '';
                allData.map((res) => {
                    if (res.selected) {
                        if (selectedInterests === '') {
                            selectedInterests = res.id;
                        } else {
                            selectedInterests = selectedInterests + ',' + res.id;
                        }
                    }
                })

                allData2.map((res) => {
                    if (res.selected) {
                        if (selectedJobs === '') {
                            selectedJobs = res.id;
                        } else {
                            selectedJobs = selectedJobs + ',' + res.id;
                        }
                    }
                })

                allData3.map((res) => {
                    if (res.selected) {
                        if (selectedPasJobs === '') {
                            selectedPasJobs = res.id;
                        } else {
                            selectedPasJobs = selectedPasJobs + ',' + res.id;
                        }
                    }
                })

                let formdata = new FormData();
                formdata.append("intended_job", selectedJobs);
                formdata.append("previous_job", selectedPasJobs);
                formdata.append("interest", selectedInterests);

                let data = { 
                    'intended_job': selectedJobs ,
                    'previous_job': selectedPasJobs ,
                    'interest': selectedInterests ,
                }
                let maindata = {
                  data: data,
                  token: myToken
                }
                Actions.Update(maindata)
                    .then((response) => {
                        if (response.data.status === 'success') {
                            console.log("res " + JSON.stringify(response));
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                            setSelectedNumber(0);
                            navigation.goBack();
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        // alert(err)
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            refreshToken('update');
                        } 
                        else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else { setLoading(false);
                        console.log("err " + JSON.stringify(err))
                        SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                    }
                })
            }
        })
    }

    return (
        <View style={Styles.container}>
            <HeaderView white title={'Interests'} onLeftClick={() => { handleBackButtonClick() }} />
            {loading ? <Spinner  white/> : null}
            <>
                {selectedNumber === 0 ?
                    <SignupStep3 text={headText} continue={() => { btnContinue() }} selectInteredtedItems={(item, index) => selectInteredtedItems(item, index)} allData={[...allData]} />
                    :
                    selectedNumber === 1 ?
                        <SignupStep3 text={headText} continue={() => { btnContinue() }} selectInteredtedItems={(item, index) => selectInteredtedItems(item, index)} allData={[...allData2]} />
                        :
                        selectedNumber === 2 ?
                            <SignupStep3 text={headText} btnText='Finish' continue={() => { btnContinue() }} selectInteredtedItems={(item, index) => selectInteredtedItems(item, index)} allData={[...allData3]} />
                            :
                            null
                }
            </ >
        </View>
    )
}

export default InterestView;