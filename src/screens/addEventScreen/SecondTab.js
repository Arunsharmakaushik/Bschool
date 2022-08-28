import React,{useRef, useState} from 'react';
import { Image, TouchableOpacity,Text, FlatList, TextInput, View } from 'react-native';
import Images from '../../assets/Images';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AppColors from '../../utils/AppColors';
import { IMAGE_URL } from '../../webServices/EndPoints';
import { secondRoutStyle } from './Styles';
import moment from 'moment';

const SecondRoute = (props) => {
    const AllComments = props.AllComments;
    const [comment, setComment] = useState('');
    const flatref= useRef();

    return (
        <View style={{ height: hp(52) ,backgroundColor:AppColors.SEARCH_COLOR}}>
            <View style={{ justifyContent: 'center', height: hp(40) ,backgroundColor:AppColors.SEARCH_COLOR}}>
                {AllComments.length > 0 ?
                    <FlatList
                    ref={flatref}
                    onContentSizeChange={() => flatref.current.scrollToEnd()}
                        showsVerticalScrollIndicator={false}
                        data={[...AllComments]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            <View style={secondRoutStyle.mainContainer}>
                                {item.profile_image != null ?
                                    <Image resizeMode='cover' style={secondRoutStyle.commentorImage} source={{ uri: IMAGE_URL + item.profile_image }} />
                                    :
                                    <Image resizeMode='cover' style={secondRoutStyle.commentorImage} source={Images.user} />
                                }
                                <View style={secondRoutStyle.commentContainer}>
                                    <Text style={secondRoutStyle.commentorName} >
                                        {item.first_name} {item.last_name}
                                        <Text style={secondRoutStyle.commentTime} >    {moment(item.created_at).format('hh:mm A')}</Text>
                                    </Text>
                                    <Text style={secondRoutStyle.commentText} >{item.comment}</Text>
                                </View>
                            </View>
                        }
                    />

                    : <Text style={secondRoutStyle.noData}>No Discussion Found</Text>
                }
            </View>
            <View style={[secondRoutStyle.TextView,]}>
                <TextInput style={secondRoutStyle.textInputStyle}
                    placeholder='Write comment here…'
                    placeholderTextColor={AppColors.INPUT}
                    onChangeText={setComment}
                    value={comment} />
                <TouchableOpacity onPress={() => { props.sendMessage(comment) }} style={secondRoutStyle.sendVIew}>
                    <Image style={secondRoutStyle.sendImg} source={Images.send} resizeMode='contain' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SecondRoute