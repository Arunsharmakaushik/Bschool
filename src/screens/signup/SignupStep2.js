import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TextInput } from 'react-native'
import Styles from './Styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import InputView, { InputPickerView } from '../../components/InputView';
import Button from '../../components/Button';
import HeaderView from '../../components/HeaderView';
import * as Progress from 'react-native-progress';
import AppColors from '../../utils/AppColors';
import Actions from '../../webServices/Action';
import Spinner from '../../components/Spinner';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Keyboard } from 'react-native';

export const SignupStep2 = (props) => {
    const [schList, setSchList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLocation, setshowLocation] = useState(0);
    const [allStates, setAllStates] = useState([]);
    const [searchedData, setSearchedData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [totalSch, setTotalSch] = useState(0);
    const [page, setPage] = useState(1);
    const [page2, setPage2] = useState(1);
    const [page3, setPage3] = useState(1);
    const [total, setTotal] = useState(0);
    const [sPage,setSpage]=useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [allUndergrad, setAllUndergrad] = useState([]);

    const bioRef = useRef();
    const funRef=useRef();
    const helpRef=useRef();

    useEffect(() => {
        getSchoolList(1);
        getStatesList(1);
        getUndergradList(1);
    }, []);

    const getStatesList = (page) => {
        page > 1 ? setIsLoading(true) : setIsLoading(false);
        Actions.GetStates(page).then((response) => {
            if (response.data) {
                let data = response.data.data.states;
                let allData = data.data;
                setTotal(data.total);
                console.log('jjj ' + JSON.stringify(data.data))

                let arr = [];
                let item = {};
                allData.map((value) => {
                    item = {
                        id: value.id,
                        value: value.name,
                    }
                    arr.push(item)
                })

                // 
                // alert(allStates.length)
                if (allStates.length > 0) {
                    if (allStates.length != data.total) {
                        // let previousData = ;
                        let mainArr = allStates.concat(arr);
                        // alert(JSON.stringify(mainArr))
                        setAllStates([...mainArr]);
                        setIsLoading(false)
                    }
                }
                else {
                    setAllStates([...arr]);
                }
                setLoading(false);
                setIsLoading(false)
            }
        })
            .catch((err) => {
                setLoading(false);
                alert(err.message)
            })
    }


    const getUndergradList = (page) => {
        page2 > 1 ? setIsLoading(true) : setIsLoading(false);
        Actions.GetUndergrad(page).then((response) => {
            if (response.data) {

                let data = response.data.data.schools;
                let allData = data.data;
                setTotal(data.total);
                console.log('jjjjjj' + JSON.stringify(data))
                let arr = [];
                let item = {};
                allData.map((value) => {
                    item = {
                        id: value.id,
                        value: value.name,
                    }
                    arr.push(item)
                })
                if (allUndergrad.length > 0) {
                    if (allUndergrad.length != data.total) {
                        // let previousData = ;
                        let mainArr = allUndergrad.concat(arr);
                        // alert(JSON.stringify(mainArr))
                        setAllUndergrad([...mainArr]);
                        setIsLoading(false)
                    }
                }
                else {
                    setAllUndergrad([...arr]);
                }
                setLoading(false);
                setIsLoading(false)
            }
        })
            .catch((err) => {
                setLoading(false);
                alert(err.message)
            })
    }


    const getSchoolList = (page) => {
        // alert(page)
        page3 > 1 ? setIsLoading(true) : setIsLoading(false);
        // totalSch > 0 && totalSch === allStates.length ?null:
        Actions.GetSchoolNames(page).then((response) => {
            if (response.data) {
                console.log('sch' + JSON.stringify(response.data))
                setTotalSch(response.data.total)
                let data = response.data.data;
                let arr = [];
                let item = {};
                data.map((value) => {
                    item = {
                        id: value.id,
                        value: value.name,
                        email: value.email,
                        added_on: value.added_on
                    }
                    arr.push(item)
                })

                if (schList.length > 0) {
                    if (schList.length != response.data.total) {
                        // let previousData = ;
                        let mainArr = schList.concat(arr);
                        // alert(JSON.stringify(mainArr))
                        setSchList([...mainArr]);
                        setIsLoading(false)
                    }
                }
                else {
                    setSchList([...arr]);
                }

                setIsLoading(false)
                setLoading(false);
            }
        })
            .catch((err) => {
                setLoading(false);
                alert(err.message)
            })
    }

    const searchTheLocation = (v) => {
        setSearchText(v);
        let text = v;
        if (text.length > 1) {
            let newData = allStates.filter(x => String(x.value.toLowerCase()).includes(text.toLowerCase()));
            setSearchedData(newData);
        }
        else {
            setSearchedData([]);
        }

    }



  const loadMoreGrade=(page)=>{
      let text = searchText;
        Actions.SearchUndergrad(text,page).then((response) => {
            if (response.data) {
              console.log('ss'+JSON.stringify(response.data))
              if(response.data.status === 'success'){
let data = response.data.data.schools;
let allData = data.data;
let arr = [];
let item = {};
allData.map((value) => {
item = {
    id: value.id,
    value: value.name,
}
arr.push(item)
})

data.current_page === 1 ? setSpage(1):null
                if (searchedData.length > 0) {
                    if (searchedData.length != data.total) {
                        // let previousData = ;
                        let mainArr = searchedData.concat(arr);
                        // alert(JSON.stringify(mainArr))
                        let final = [...mainArr];
                        setSearchedData(getUnique(final,'id'));
                        setIsLoading(false)
                    }
                }
                else {
                    setSearchedData([...arr]);
                    setSpage(1);
                }
              }else{
                setSearchedData([]);
                setSpage(1)
              }
            }
        })
            .catch((err) => {
                alert(err.message)
            })


    
    }
    const searchUndergrade = (v) => {
        setSearchText(v);
        let text = v;
        if (text.length > 1) 
        {
            Actions.SearchUndergrad(text,sPage).then((response) => {
                if (response.data) {
                  console.log('ss'+JSON.stringify(response.data))
                  if(response.data.status === 'success'){
let data = response.data.data.schools;
let allData = data.data;
let arr = [];
let item = {};
allData.map((value) => {
    item = {
        id: value.id,
        value: value.name,
    }
    arr.push(item)
})

data.current_page === 1 ? setSpage(1):null
                    // if (searchedData.length > 0) {
                    //     if (searchedData.length != data.total) {
                    //         // let previousData = ;
                    //         let mainArr = searchedData.concat(arr);
                    //         // alert(JSON.stringify(mainArr))
                    //         let final = [...mainArr];
                    //         setSearchedData(getUnique(final,'id'));
                    //         setIsLoading(false)
                    //     }
                    // }
                    // else {
                        setSearchedData([...arr]);
                        // setSpage(1);
                    // }
                  }
                else{
                    setSearchedData([]);
                    setSpage(1)
                  }
                }
            })
                .catch((err) => {
                    alert(err.message)
                })


        }
        else{
            setSearchedData([]);
            setSpage(1)
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

    return (
        <View style={Styles.container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{}} enableOnAndroid={true} enableAutomaticScroll scrollEnabled resetScrollToCoords={{ x: 0, y: 0 }} >

                <HeaderView onLeftClick={() => { props.back() }} />
                {props.loading || loading ? <Spinner /> : null}
                <Progress.Bar progress={0.4} color={AppColors.APP_THEME} style={{ marginTop: hp(2), borderWidth: 0, alignSelf: 'center', backgroundColor: AppColors.GREY_TEXT_COLOR, marginBottom: 5 }} borderColor={'transparent'} height={hp(0.5)} borderRadius={0} width={wp(90)} />
                <View paddingHorizontal={wp(5)} >
                    <Text style={Styles.mainText}>Let us help you to find peers easier</Text>
                  <View height={hp(2.5)}/>
                    {/* <Text style={[Styles.descText, { marginBottom: hp(5) }]}>Classified advertising is a form of advertising that is particularly common</Text> */}
                    <InputPickerView
                        returnKeyType='next'
                        onSubmitEditing={() => props.setFocusId(1)}
                        onFocus={() => props.setFocusId(0)}
                        focusId={props.focusId}
                        id={0}
                        grade
                        mainText={'MBA Program'}
                        errorId={props.errorId}
                        onSelect={(item) => { props.setSchool(item), props.setFocusId(1) }}
                        errMsg={props.errMsg}
                        data={[...schList]}
                        value={props.school}
                        placeholder={'MBA Program'}
                        isLoading={isLoading}
                        loadMoreData={() => { setPage3(page3 + 1), getSchoolList(page3 + 1) }}
                        clearSearch={() => { setSearchedData([]), setSearchText('') }}

                    />
                    <InputPickerView
                        returnKeyType='next'
                        onSubmitEditing={() => {setSpage(1), props.setFocusId(2), setSearchedData([]), setSearchText(''), props.setFocusId(2) }}
                        onFocus={() => props.setFocusId(1)}
                        location
                        focusId={props.focusId}
                        id={1}
                        mainText={'Undergrad'}
                        errorId={props.errorId}
                        onSelect={(value) => {setSpage(1), props.setUnderGrade(value), props.setFocusId(2) }}
                        errMsg={props.errMsg}
                        // grade
                        data={(searchText.length > 1 || searchedData.length > 0) ? searchedData : [...allUndergrad]}
                        onChangeText={(v) => { searchUndergrade(v) }}
                        clearSearch={() => {setSearchText(''), setSearchedData([]), setSpage(1) }}
                        // clearSearch={()=>{setSearchText('');alert(searchText)}}
                        // data={[{ value: 'A', id: 1 }, { value: 'B', id: 2 }, { value: 'C', id: 3 }, { value: 'D', id: 4 }]}
                        value={props.underGrade}
                        searchText={searchText}
                        placeholder={'Undergrad University'}
                        isLoading={isLoading}
                        loadMoreData={() => {(searchText.length > 0 || searchedData.length > 0) ? (setSpage(sPage + 1),loadMoreGrade(sPage+1) ): setPage2(page2 + 1), getUndergradList(page2 + 1) }}

                    />

                    <InputPickerView
                        returnKeyType='next'
                        onSubmitEditing={() => { props.setHomeState(searchText), props.setHomeStateId(0), setSearchedData([]), setSearchText(''), props.setFocusId(3) }}
                        onFocus={() => props.setFocusId(2)}
                        focusId={props.focusId}
                        id={2}
                        isLoading={isLoading}
                        loadMoreData={() => { setPage(page + 1), getStatesList(page + 1) }}
                        mainText={'Home State'}
                        errorId={props.errorId}
                        location
                        onSelect={(v) => { props.setHomeState(v.value), props.setHomeStateId(v.id), props.setFocusId(3) }}
                        errMsg={props.errMsg}
                        searchText={searchText}
                        data={(searchText.length > 0 || searchedData.length > 0) ? searchedData : [...allStates]}
                        onChangeText={(v) => { searchTheLocation(v) }}
                        clearSearch={() => { setSearchedData([]), setSearchText('') }}
                        value={props.homeState}
                        placeholder={'Home State'}

                    />

                    <InputPickerView
                        returnKeyType='next'
                        onSubmitEditing={() => { props.setPreviousState(searchText), props.setPreviousStateId(0), setSearchedData([]), setSearchText(''), props.setFocusId(4) }}
                        onFocus={() => props.setFocusId(3)}
                        focusId={props.focusId}
                        id={3}
                        mainText={'Last State Previously Lived In'}
                        errorId={props.errorId}
                        location
                        onSelect={(value) => { props.setPreviousState(value.value), props.setPreviousStateId(value.id), props.setFocusId(4),bioRef.current.focus() }}
                        errMsg={props.errMsg}
                        searchText={searchText}
                        data={(searchText.length > 0 || searchedData.length > 0) ? searchedData : allStates}
                        onChangeText={(v) => { searchTheLocation(v) }}
                        clearSearch={() => { setSearchedData([]), setSearchText('') }}
                        value={props.previousState}
                        placeholder={'Last State Previously Lived In'}
                        isLoading={isLoading}
                        loadMoreData={() => { setPage(page + 1), getStatesList(page + 1) }}
                    />

                    <View style={[Styles.inputOuterView, {}]}>
                        <TextInput
                        ref={bioRef}
                            placeholder='Bio (optional) - Tell us a bit about yourself!'
                            placeholderTextColor={AppColors.INPUTNEW}
                            style={Styles.textinputStyle}
                            onFocus={() => props.setFocusId(4)}
                            value={props.bio}
                            keyboardType="default"
                            returnKeyType="next"
                            multiline={true}
                            blurOnSubmit={true}
                            onSubmitEditing={()=>{funRef.current.focus()}}
                            
                            onChangeText={props.setBio} />
                    </View>
                    <View style={[Styles.inputOuterView, {}]}>
                    <TextInput
                        ref={funRef}
                            placeholder='Fun Facts (optional) - Are there any interesting facts about yourself?'
                            placeholderTextColor={AppColors.INPUTNEW}
                            style={Styles.textinputStyle}
                            value={props.fun}
                            keyboardType="default"
                            returnKeyType="next"
                            multiline={true}
                            blurOnSubmit={true}
                            onSubmitEditing={()=>{helpRef.current.focus()}}
                            onChangeText={props.setFun} />
    
                    </View>
                    <View style={[Styles.inputOuterView, {marginBottom:hp(8)}]}>
                        <TextInput
                        ref={helpRef}
                           
                            placeholder='How I can help others (optional) - Business is about reciprocity, how can you help others?'
                            placeholderTextColor={AppColors.INPUTNEW}
                            style={Styles.textinputStyle}
                           
                            value={props.help}
                            keyboardType="default"
                            returnKeyType="next"
                            multiline={true}
                            blurOnSubmit={true}
                            onSubmitEditing={()=>{ props.doSignup('final')}}
                            onChangeText={props.setHelp} />
                    </View>

                    {/* 
                    <InputView
                        onFocus={() => props.setFocusId(4)}
                        id={4}
                        // style={{height:null,backgroundColor:'red'}}
                        autoFocus={true}
                        returnKeyType='next'
                        onSubmitEditing={() => props.setFocusId(5)}
                        focusId={props.focusId}
                        errorId={props.errorId}
                        errMsg={props.errMsg}
                        value={props.bio}
                        bio
                        onChangeText={props.setBio}
                        placeholder={'Bio - Tell us a bit about yourself!'} />

                    <InputView
                        onFocus={() => props.setFocusId(5)}
                        id={5}
                        bio
                        innerStyle={{ height: hp(7.5), }}
                        autoFocus={true}
                        returnKeyType='next'
                        onSubmitEditing={() => props.setFocusId(6)}
                        focusId={props.focusId}
                        errorId={props.errorId}
                        errMsg={props.errMsg}
                        value={props.fun}
                        onChangeText={props.setFun}
                        placeholder={'Fun Fact - Are there any interesting facts about yourself?'} />

                    <InputView
                        onFocus={() => props.setFocusId(6)}
                        id={6}
                        bio
                        innerStyle={{ height: hp(7.5), }}
                        style={{ marginBottom: hp(5) }}
                        autoFocus={true}
                        returnKeyType='next'
                        onSubmitEditing={() => props.setFocusId(7)}
                        focusId={props.focusId}
                        errorId={props.errorId}
                        errMsg={props.errMsg}
                        value={props.help}
                        onChangeText={props.setHelp}
                        placeholder={'How I can help others - Business School is about reciprocity!'} 
                        /> */}

                </View>
            </KeyboardAwareScrollView>
            <Button title={'Continue'} style={{}} continue={() => {props.loading?null: props.doSignup('final') }} />
        </View>
    )
}
