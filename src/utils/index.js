import { Dimensions, PixelRatio, Platform } from 'react-native';
const iPhoneXHeight = 812;
import moment from 'moment';

export function isiPhoneX() {
  if (
    (Platform.OS === "ios") &&
    (Dimensions.get("window").height >= iPhoneXHeight)
  ) {
    return true;
  }
  return false;
}

export function timeSince(date) {
  return moment(date).local().startOf('seconds').fromNow();
}


let cleint = {};
export function setClient(value) {
        cleint = value;
};

export function getClient() {
        return cleint
};

