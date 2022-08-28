import React, { useState,useEffect } from 'react';
import { Image, ScrollView, Text, Modal, TextInput,BackHandler, TouchableOpacity, StyleSheet, View } from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';;
import Images from '../assets/Images';
import AppColors from '../utils/AppColors';
import Actions from '../webServices/Action';

const LocationModal = ({ onClose, onSelectLocation, state, code }) => {
    const [visible, setModalVisible] = useState(true);

    const getLatLong = (item) => {
        Actions.GetLatLong(item.place_id)
            .then((response) => {
                if (response.data.status === 'OK') {
                    let data = response.data.results;
                    let geometry = data[0].geometry;
                    let location = geometry.location;
                    setModalVisible(false);
                    onSelectLocation(item.description, location.lat, location.lng)
                }
            })
            .catch((err) => {
                setModalVisible(false);
                onSelectLocation(item.description, 0, 0)
            })
    }
    return (

        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
            onRequestClose={() => {
                setModalVisible(false);
                onClose();
            }}
            onDismiss={() => {
                setModalVisible(false);
                onClose();
            }}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={true} contentContainerStyle={{ height: hp(100), width: wp(100), backgroundColor: AppColors.APP_THEME, justifyContent: 'center', alignSelf: 'center' }} enableOnAndroid={true} enableAutomaticScroll scrollEnabled resetScrollToCoords={{ x: 0, y: 0 }} >
                <TouchableOpacity activeOpacity={1} onPress={() => onClose()} style={{ height: hp(100), width: wp(100), backgroundColor: 'rgba(56,56,56,0.5)', justifyContent: 'center', alignSelf: 'center' }}>
                    <View style={Styles.modalMainContainer}>
                        <GoogleAutoComplete
                            apiKey={'AIzaSyAL-QyTSE5ZCtvz4ITkUzg_XkILhFdbmYU'}
                            debounce={300}
                            queryTypes={state ? "(regions)" : "(cities)"}>
                            {({ inputValue, handleTextChange, locationResults, fetchDetails, clearSearch }) => {
                                return (
                                    <React.Fragment>
                                        <View style={Styles.locationInputContainer}>
                                            <Image source={Images.search} style={Styles.searchIcon} />
                                            <TextInput
                                                style={{
                                                    height: hp(6),
                                                    color: AppColors.BLACK,
                                                    paddingHorizontal: 16,
                                                    width: wp(70),
                                                }}
                                                value={inputValue}
                                                onChangeText={handleTextChange}
                                                placeholder="Enter location"
                                                placeholderTextColor={AppColors.BLACK}
                                            />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleTextChange('')
                                                    clearSearch()
                                                }}>
                                                <Image resizeMode='contain' source={Images.cross} style={Styles.locationCancelIcon} />
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <ScrollView style={{ width: wp(90), alignSelf: 'center', marginTop: hp(1), backgroundColor: AppColors.APP_THEME_INPUT }}>
                                                {
                                                    locationResults.map((item) =>
                                                        <TouchableOpacity key={item.place_id} style={Styles.locationCardContainer} onPress={() => { if (code) { getLatLong(item) } else { setModalVisible(false); onSelectLocation(item.description) } }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center',paddingLeft:wp(3) }}>
                                                                <Image source={Images.location} />
                                                                <Text style={{ color: AppColors.BLACK, marginLeft: 15, width: wp(70), }}>{item.description}</Text>
                                                            </View>
                                                            <Image source={Images.dropdown} style={{marginRight:wp(3), transform: [{ rotate: '270deg' }] }} />
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            </ScrollView>
                                        </View>
                                    </React.Fragment>
                                )
                            }}
                        </GoogleAutoComplete>
                    </View>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </Modal>
    )
}

export default LocationModal;

const Styles = StyleSheet.create({
    modalMainContainer: {
        height: hp(70),
        backgroundColor: AppColors.WHITE,
        width: wp(100),
        borderTopLeftRadius: hp(2),
        borderTopRightRadius: hp(2),
        padding: wp(8),
        alignSelf: 'center',
        bottom: 0, position: 'absolute'
    },
    modalCloseIcon: {
        width: hp(6),
        height: hp(6),
        borderRadius: 50,
        zIndex: 200, elevation: 200,
        position: 'absolute',
        top: hp(2), left: hp(2),
        backgroundColor: 'red'
    },
    locationInputContainer: {
        height: hp(6),
        backgroundColor: AppColors.APP_THEME_INPUT,
        borderRadius: 8,
        marginVertical: hp(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        width: wp(90),
        alignSelf: 'center'
    },
    searchIcon: {
        height: wp(4),
        width: wp(4)
    },
    locationCancelIcon: {
        height: wp(4),
        width: wp(4)
    },
    searchResultText: {
        color: AppColors.BLACK,
    },
    locationCardContainer: {
        paddingVertical: 20,
        borderColor: AppColors.BLACK,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})
