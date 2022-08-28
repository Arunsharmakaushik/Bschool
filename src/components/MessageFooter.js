import React from 'react';
import {ReactionPickerWrapper} from 'stream-chat-react-native';
import {StyleSheet, Image, View, TouchableOpacity, Text} from 'react-native';
import Images from '../assets/Images';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
// import iconEmoticon from '../images/icon-emoticon.png';

export const MessageFooter = props => {
  return (
    <View style={styles.reactionListContainer}>
      {props.message.latest_reactions &&
        props.message.latest_reactions.length > 0 &&
        renderReactions(
          props.message.latest_reactions,
          props.supportedReactions,
          props.message.reaction_counts,
          props.handleReaction,
        )}
      <ReactionPickerWrapper
        {...props}
        offset={{
          left: -70,
          top: 10,
        }}>
        {props.message.latest_reactions &&
          props.message.latest_reactions.length > 0 && (
            <View style={styles.reactionPickerContainer}>
              <Image resizeMode='contain' source={Images.heart_off} style={styles.reactionPickerIcon} />
            </View>
          )}
      </ReactionPickerWrapper>
    </View>
  );
};

export const renderReactions = (
  reactions,
  supportedReactions,
  reactionCounts,
  handleReaction,
) => {
  const reactionsByType = {};
  reactions &&
    reactions.forEach(item => {
      if (reactions[item.type] === undefined) {
        return (reactionsByType[item.type] = [item]);
      } else {
        return (reactionsByType[item.type] = [
          ...reactionsByType[item.type],
          item,
        ]);
      }
    });

  const emojiDataByType = {};
  supportedReactions.forEach(e => (emojiDataByType[e.id] = e));

  const reactionTypes = supportedReactions.map(e => e.id);
  return Object.keys(reactionsByType).map((type, index) =>
    reactionTypes.indexOf(type) > -1 ? (
      <ReactionItem
        key={index}
        type={type}
        handleReaction={handleReaction}
        reactionCounts={reactionCounts}
        emojiDataByType={emojiDataByType}
      />
    ) : null,
  );
};

const ReactionItem = ({
  type,
  handleReaction,
  reactionCounts,
  emojiDataByType,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        handleReaction(type);
      }}
      key={type}
      style={styles.reactionItemContainer}>
      <Text style={styles.reactionItem}>
        {emojiDataByType[type].icon} {reactionCounts[type]}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reactionListContainer: {
    flexDirection: 'row',
    // alignSelf: 'flex-end',
    // righht:0,position:'absolute',
    marginTop:5,
    // justifyContent:'flex-end',
    // bottom: heightPercentageToDP(3.5),
    // bottom: 0,
    // paddingRight: widthPercentageToDP(8),
    width:widthPercentageToDP(90),

    // backgroundColor:'red'
  },
  reactionItemContainer: {
    // borderColor: '#0064c2',
    // borderWidth: 1,
    // padding: 4,
    paddingLeft: 5,
    paddingRight: 5,
    // borderRadius: 10,
    backgroundColor: 'transparent',
    marginRight: 4,
  },
  reactionItem: {
    color: '#0064c2',
    fontSize: 14,
  },
  reactionPickerContainer: {
   marginTop:2.5,
marginRight:2,
    // backgroundColor: 'red',
  },
  reactionPickerIcon: {
    width: heightPercentageToDP(2),
    height: heightPercentageToDP(2),
    backgroundColor:'transparent'
  },
});