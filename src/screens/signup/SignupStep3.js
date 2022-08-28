import React from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, } from 'react-native'
import Styles from './Styles';
import Button from '../../components/Button';
import AppColors from '../../utils/AppColors';
import Images from '../../assets/Images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';


export const SignupStep3 = (props) => {
    return (
        <View style={[Styles.cardStyle,{}]}>
            <Text style={[Styles.mainText, { paddingLeft: wp(5), paddingRight: wp(5), }]}>{props.text}</Text>
            <Text style={[Styles.descText, { paddingHorizontal: wp(5) }]}>Let us help you find peers who share similar carrier interests as you!</Text>
            <View style={Styles.flatView}>
          
                <FlatList
                    data={props.allData}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    extraData={props.allData}
                    renderItem={({ index, item }) => (
                        <TouchableOpacity style={[{ backgroundColor: item.selected === true ? AppColors.WHITE : AppColors.APP_THEME }, Styles.outerView]} onPress={() => props.selectInteredtedItems(index, item)}>
                            {item.selected ?
                                <View style={Styles.clickStyle}>    
                                    <FastImage style={Styles.clickIcon} resizeMode={FastImage.resizeMode.contain} source={Images.tick} />
                                </View>
                                : null}
                            <Text style={[Styles.listText, { color: item.selected === true ? AppColors.APP_THEME : AppColors.WHITE }]}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
            <Button title={props.btnText ? props.btnText : 'Continue'} style={{position:'absolute',bottom:0}} continue={() => { props.continue() }} />
        </View>
    )
}