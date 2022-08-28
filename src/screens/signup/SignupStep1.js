import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, BackHandler, ImageBackground, Platform } from 'react-native'
import Styles from './Styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import InputView, { InputPickerView } from '../../components/InputView';
import Button from '../../components/Button';
import HeaderView from '../../components/HeaderView';
import * as Progress from 'react-native-progress';
import AppColors from '../../utils/AppColors';
import Images from '../../assets/Images';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TermsWebView from '../../components/TermsWebView';
import Actions from '../../webServices/Action';
import FastImage from 'react-native-fast-image';
import { Keyboard } from 'react-native';

export const SignupStep1 = (props) => {
    const [confirmPassShow, setConfirmPassShow] = useState(true);
    const [passShow, setPassShow] = useState(true);
    const [yearList, setYearList] = useState([]);
    const [showWeb, setShowWeb] = useState(false);
    const [showTerm, setTerm] = useState('');

    useEffect(() => {
        getYearsList();
        getTermContent();
    }, []);

    useEffect(() => {
        const backAction = () => {
            if (showWeb) {
                setShowWeb(false);
            } else {
                props.back()
            }
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    });


    const getYearsList = () => {
        let currentYear = new Date().getFullYear();
        let arr = yearList;
        for (let i = currentYear; i < Number(currentYear+2); i++) {
            let year = { value: i+1 }
            arr.push(year);
        }
        setYearList([...arr]);
    }

    const getTermContent = () => {
        Actions.GetTermCondition().then((response) => {
            if (response.data) {
                setTerm(response.data.data.data.description)
            }
        })
            .catch((err) => {
                alert(err.message)
            })
    }

    const OpenGallary = () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                compressImageMaxWidth: 300,
                compressImageMaxHeight: 300,
                compressImageQuality: 0.8,
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
                props.setImageObject(file);
            }
        })
    }

    const image = props.imageObject;
    return (
        <View style={[Styles.container, { backgroundColor: AppColors.APP_THEME }]}>
            {showWeb ?
                <TermsWebView showTerm={showTerm} back={() => setShowWeb(!showWeb)} /> :
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: AppColors.WHITE, }} enableOnAndroid={true} enableAutomaticScroll scrollEnabled  >
                    <ImageBackground resizeMode='cover' source={Images.topShape} style={Styles.topView}>
                        <HeaderView white onLeftClick={() => { props.back() }} />
                        <Progress.Bar progress={0.2} color={AppColors.WHITE} style={{ marginTop: hp(2), borderWidth: 0, alignSelf: 'center', backgroundColor: AppColors.BORDER_COLOR, marginBottom: 5 }} borderColor={'transparent'} height={hp(0.5)} borderRadius={0} width={wp('90%')} />
                        <Text style={Styles.topText}>Complete Profile</Text>
                    </ImageBackground>
                    <TouchableOpacity style={Styles.imgPickView} onPress={() => OpenGallary()}>
                        {image.uri ?
                            <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: image.uri }} style={Styles.imgView} /> :
                            <FastImage resizeMode={FastImage.resizeMode.contain} source={Images.user} style={Styles.imgView} />
                        }

                        <Image resizeMode='contain' source={Images.addImage} style={Styles.cameraIcon}/>
                    </TouchableOpacity>
                    
                    { props.errorId=='9'&& image.uri==undefined ?<Text style={{marginTop:5, color: 'red',textAlign:'center',fontSize: hp('1.8%'), fontWeight: 'bold' }}>{props.errMsg}</Text>:null }
                    <View marginVertical={hp(2)} paddingHorizontal={wp(5)}>
                        <InputView
                            onFocus={() => props.setFocusId(10)}
                            id={10}
                            autoFocus={true}
                            returnKeyType='next'
                            onSubmitEditing={() => props.doSignupStep1('10')}
                            focusId={props.focusId}
                            errorId={props.errorId}
                            errMsg={props.errMsg}
                            value={props.firstName}
                            onChangeText={props.setFirstName}
                            placeholder={'First Name'} />
                        <InputView
                            onFocus={() => props.setFocusId(11)}
                            id={11}
                            returnKeyType='next'
                            onSubmitEditing={() => props.doSignupStep1('11')}
                            focusId={props.focusId}
                            errorId={props.errorId}
                            errMsg={props.errMsg}
                            value={props.lastName}
                            onChangeText={props.setLastName}
                            placeholder={'Last Name'}
                        />
                        <InputView
                            onFocus={() => props.setFocusId(12)}
                            id={12}
                            returnKeyType='next'
                            onSubmitEditing={() => props.doSignupStep1('12')}
                            focusId={props.focusId}
                            autoCapitalize='none'
                            keyboardType="email-address"
                            errorId={props.errorId}
                            errMsg={props.errMsg}
                            value={props.email}
                            onChangeText={props.setEmail}
                            placeholder={'School Email Address'}
                        />
                        <InputPickerView
                            returnKeyType='next'
                            year
                            onSubmitEditing={() => props.doSignupStep1('13')}
                            onFocus={() => props.setFocusId(13)}
                            focusId={props.focusId}
                            id={13}
                            mainText='Graduation Year'
                            errorId={props.errorId}
                            onSelect={(value) => { props.setGraduationYear(value), props.setFocusId(14) }}
                            errMsg={props.errMsg}
                            data={yearList}
                            value={props.graduationYear}
                            onChangeText={props.setGraduationYear}
                            placeholder={'Graduation Year'}
                        />

<InputPickerView
                            returnKeyType='next'
                            year
                            onSubmitEditing={() => props.doSignupStep1('14')}
                            onFocus={() => props.setFocusId(14)}
                            focusId={props.focusId}
                            id={14}
                            mainText='Gender'
                            errorId={props.errorId}
                            onSelect={(value) => { props.setGender(value), props.setFocusId(15) }}
                            errMsg={props.errMsg}
                            data={[{id:1,value:'Male'},{id:2,value:'Female'},{id:3,value:'Not Listed'}]}
                            value={props.gender}
                            onChangeText={props.setGender}
                            placeholder={'Gender'}
                        />

                        <InputView
                            eye
                            returnKeyType='next'
                            onSubmitEditing={() => {props.doSignupStep1('15'),Keyboard.dismiss()}}
                            onFocus={() => props.setFocusId(15)}
                            focusId={props.focusId}
                            id={15}
                            errorId={props.errorId}
                            errMsg={props.errMsg}
                            value={props.password}
                            maxLength={16}
                            secureText={() => setPassShow(!passShow)}
                            secureTextEntry={passShow ? true : false}
                            onChangeText={props.setPassword}
                            placeholder={'Password'}
                        />
                        <InputView
                            eye
                            returnKeyType='next'
                            onSubmitEditing={() => {props.doSignupStep1('16'),Keyboard.dismiss()}}
                            onFocus={() => props.setFocusId(16)}
                            focusId={props.focusId}
                            id={16}
                            errorId={props.errorId}
                            errMsg={props.errMsg}
                            value={props.confirmPass}
                            maxLength={15}
                            secureText={() => setConfirmPassShow(!confirmPassShow)}
                            secureTextEntry={confirmPassShow ? true : false}
                            onChangeText={props.setConfirmPass}
                            placeholder={'Re-Type Password'}
                        />
                        <View style={Styles.termsView}>
                            <TouchableOpacity style={[Styles.checkBox, { borderColor: props.termsAccepted ? AppColors.APP_THEME : AppColors.BORDER_COLOR }]} onPress={() => props.setTermsAccepted(!props.termsAccepted)}>
                                {props.termsAccepted ?
                                    <FastImage source={Images.checkbox} style={[Styles.checkBoxImg,]} resizeMode='contain' />
                                    : null}</TouchableOpacity>
                            <Text onPress={() => { setShowWeb(true) }} style={Styles.termText}>{'I agree with terms and conditions.'}</Text>
                        </View>
                    </View>
                    <Button title={'Continue'} continue={() => { props.doSignupStep1('final') }} />
                </KeyboardAwareScrollView>
            }
        </View>
    )
}
