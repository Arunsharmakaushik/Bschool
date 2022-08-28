import React, { useState ,useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderView from '../../components/HeaderView';
import Images from '../../assets/Images';
import Fonts from '../../assets/Fonts';
import AppColors from '../../utils/AppColors';
import Actions from '../../webServices/Action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../utils/Constants';
import SimpleToast from 'react-native-simple-toast';
import Spinner from '../../components/Spinner';
import { ITEM_IMAGE_URL } from '../../webServices/EndPoints';
import { Alert } from 'react-native';
import FastImage from 'react-native-fast-image'


const Itemsale = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const [myItems, setMyItems] = useState([]);

    useEffect(()=>{
        getMySellingItem();
      },([]));

      useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getMySellingItem();
        });
        return unsubscribe;
    }, [navigation]);

      const getMySellingItem=()=>{
        AsyncStorage.getItem(CONSTANTS.ACCESS_TOKEN).then((myToken) => {
            if (myToken !== null) {
                setLoading(true);
      
                Actions.GetMySellingItems(myToken)
                    .then((response) => {
      
                        console.log("ressssssddfv " + JSON.stringify(response.data)) 
                        if (response.data.status === 'success') {
                            setLoading(false);
                            let data = response.data.data;
                        
                            setMyItems(data.items ? data.items.data :data);
                            // console.log("res " + JSON.stringify(alldata))
                        }
                        else {
                            setLoading(false);
                            SimpleToast.showWithGravity(response.data.message, SimpleToast.SHORT, SimpleToast.CENTER)
                        }
                    })
                    .catch((err) => {
                        // alert(err)
                        if (err&&err.response&&err.response.status&& err.response.status === 401) {
                            refreshToken();
                        }
                        else if (err&&err.response&&err.response.status&& err.response.status ===403) {
                            setLoading(false);
                            SimpleToast.showWithGravity(err.response.data.message, SimpleToast.SHORT, SimpleToast.CENTER);
                            AsyncStorage.clear();
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }
                        else {
                            setLoading(false);
                            console.log("err " + JSON.stringify(err))
                            SimpleToast.showWithGravity('Something went wrong', SimpleToast.SHORT, SimpleToast.CENTER);
                        }
                    })
            }
        })
      }

      const refreshToken = () => {
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
                           getMySellingItem()
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

    const renderFlatlist = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.push('EditItem',{'item':item})} style={styles.flatlistInnerContainer} >
               {item.item_images.length > 0 ? 
               <FastImage   resizeMode={FastImage.resizeMode.cover} source={{uri: ITEM_IMAGE_URL+item.item_images[0].image}} style={styles.imgStyle} />
               :
                <View style={styles.imgStyle}/>}
                <Text numberOfLines={1} style={styles.titleText}>{item.name}</Text>
                <Text style={styles.priceText}>${item.sell_price}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: AppColors.WHITE }}>
            <HeaderView white title='Items for sale' onLeftClick={() => { navigation.goBack() }} />
          {loading ? <Spinner /> : null}
           <View style={styles.flatListStyle}>
          {myItems.length >0 ? <FlatList
                data={myItems}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                keyExtractor={(index) => index.toString()}
                renderItem={renderFlatlist}
            />
            :
            <Text style={styles.noResults}>No Results Found</Text>
          }
           </View>
            
        </View>
    );

}
export default Itemsale;

const styles = StyleSheet.create({
    flatListStyle:
    {
        marginHorizontal: wp(2),
        marginTop: hp(4),
    },
    imgStyle:
    {
        height: wp(30), 
        width: '100%' ,
        backgroundColor:AppColors.APP_THEME
    },
    flatlistInnerContainer:
    {
        marginBottom: hp(2.5),
        marginHorizontal: wp(1.8),
        borderWidth:wp(0.4),
        borderColor:AppColors.ITEM_BORDER,
        width: wp(28.4)
    },
    titleText:
    {
        color: AppColors.INPUT,
        paddingHorizontal: hp(0.5),
        fontSize: hp(1.8),
        paddingVertical:hp(0.5),
        fontFamily: Fonts.APP_MEDIUM_FONT,
    },
    priceText:
    {
        color:AppColors.APP_THEME,
        paddingHorizontal: hp(0.5),
        fontSize: hp(1.5),
        fontFamily: Fonts.APP_MEDIUM_FONT,
    },
    noResults:
    {
        color:AppColors.APP_THEME,
        paddingHorizontal: hp(0.5),
        fontSize: hp(2.2),
        alignSelf:'center',
        marginTop:hp(20),
        fontFamily: Fonts.APP_SEMIBOLD_FONT,
    }

})
