import {Platform} from 'react-native';
import {getUniqueId} from 'react-native-device-info';

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const deviceId = getUniqueId();

export default {
  isIos,
  isAndroid,
  deviceId,
};
