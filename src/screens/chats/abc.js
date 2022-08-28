import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Modal, TextInput, Platform, FlatList, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Images from '../../assets/Images';

const ABC = ({ navigation }) => {
    const [name, setName] = useState('Powerfull Girl');

    return (
        <View style={Styles.container}>
            <TouchableOpacity>
                <Image resizeMode='contain' style={Styles.imageIcon} />
            </TouchableOpacity>
            <Text style={Styles.headText}>Edit Username</Text>
            <View style={Styles.editOuterView}>
            <Text style={[Styles.headText,{fontWeight:'400',fontSize:hp(1.8),}]}>Username</Text>
                <TextInput value={name} placeholder='Powerfull Girl' placeholderTextColor='grey' onChangeText={setName} style={Styles.textinputStyle} />
            
        </View>
        <Text onPress={()=>{alert('saved')}} style={Styles.nextStyle}>Save Changes</Text>

          </View>
    );
};
export default ABC;


const Styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(5)
    },
   
    headText:
    {
        fontWeight: 'bold',
        fontSize: hp(2),
        color: 'black',
        marginTop: hp(2)
    },
    imageIcon:
    {
        height: hp(3),
        width: hp(3),
        backgroundColor: 'red',
        marginTop: hp(3)
    },
   
    editOuterView:
    {
        width: wp(90),
        marginTop:hp(5),

    },
    placeholderText:
    {
        fontSize: hp(1.5),
        color: 'grey',
    },
    textinputStyle:
    {
        
        fontWeight: '600',
        fontSize: hp(1.8),
        paddingLeft:-2,
        color: 'grey',
        borderBottomColor:'grey',
        borderBottomWidth:1,
        textAlign:'left',

    },
    nextStyle:
    {
        alignSelf:'flex-end',
        color:'green',
        fontWeight:'bold',
        fontSize:hp(2),
        textAlign:'right',
        marginTop:hp(3)
        
    }
});
