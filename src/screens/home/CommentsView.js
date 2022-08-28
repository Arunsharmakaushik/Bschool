import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, TextInput, FlatList, Image, Modal, Platform, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Images from '../../assets/Images';
import HeaderView from '../../components/HeaderView';
import Styles from './Styles';
import AppColors from '../../utils/AppColors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import CommentSection from '../../components/CommentSection';
import { BallIndicator } from 'react-native-indicators';

const CommentsView = (props) => {
    const [open, setOpen] = React.useState(true);
    const [replyMessage, setreplyMessage] = useState('');
    const flatRef = useRef('');
    const [onEndReached, setOnEndReached] = useState(false);
 
    const renderFooter = () => {
        return (
          //Footer View with Load More button
          <View style={Styles.footer}>
            {props.isLoading ?
              <BallIndicator style={{ alignSelf: 'center' }} size={20} color={props.white ? AppColors.WHITE : AppColors.APP_THEME} />
              : null}
          </View>
        );
      };

    return (
        <Modal
            visible={open}
            transparent={true}
            keyboardShouldPersistTaps='always'
            animationType="slide"
            onRequestClose={() => { setOpen(false), props.onClose() }}>
            <View style={Styles.topView}>
                <HeaderView title='Comments' onLeftClick={() => { props.onClose() }} />
                <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={hp(3)} scrollEnabled={false} keyboardShouldPersistTaps='always' style={{ flex: 1 }} contentContainerStyle={{ height: hp(91) }}>
                    <View style={[Styles.commentsView, { height: hp(81), backgroundColor: AppColors.WHITE, }]}>
                        <FlatList
                            ref={flatRef}
                            showsVerticalScrollIndicator={false}
                            data={props.allComments}
                            // onContentSizeChange={() => flatRef.current.scrollToEnd({ animated: true })}
                            renderItem={({ item }) =>
                                <CommentSection navigation={props.navigation} item={item} />}
                                ListFooterComponent={renderFooter}
                                initialNumToRender={15}
                                keyExtractor={(item, index) => index.toString()}
                                maxToRenderPerBatch={2}
                                onEndReachedThreshold={0.1}
                                onMomentumScrollBegin={() => { setOnEndReached(false) }}
                                onEndReached={() => {
                                  if (!onEndReached) {
                                    props.loadData();   // on end reached
                                    setOnEndReached(true)
                                  }
                                }
                                }
                        />
                    </View>
                    <View style={[Styles.replyView, { height: replyMessage.length > 50 ? hp(12) : null, bottom: 0, marginBottom: Platform.OS === 'ios' ? hp(3.5) : hp(3.5), position: 'absolute', backgroundColor: AppColors.WHITE }]}>
                        <TextInput autoCorrect={false} returnKeyType='done' onSubmitEditing={() => { replyMessage ? (props.send(replyMessage), setreplyMessage('')) : SimpleToast.showWithGravity('Please enter some text', SimpleToast.SHORT,SimpleToast.CENTER) }} blurOnSubmit={true} placeholderTextColor={AppColors.GREY_TEXT} onChangeText={setreplyMessage} value={replyMessage} multiline={true} placeholder='Write comment here...' style={[Styles.replyText, {}]}></TextInput>
                        <TouchableOpacity onPress={() => { replyMessage ? (props.send(replyMessage), setreplyMessage('')) : SimpleToast.showWithGravity('Please enter some text', SimpleToast.SHORT,SimpleToast.CENTER) }}>
                            <Image source={Images.send} style={Styles.send} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </Modal>
    );
}

export default CommentsView;
