import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key: string, value: string, type: string) => {
  switch (type) {
    case 'asyncStorage': {
      await AsyncStorage.setItem(key, value);
      break;
    }
    default: {
      await AsyncStorage.setItem(key, value);
    }
  }
  return true;
};

export const getItem = async (key: string, type: string) => {
  let value = null;
  switch (type) {
    case 'asyncStorage': {
      value = await AsyncStorage.getItem(key);
      break;
    }
    default: {
      value = await AsyncStorage.getItem(key);
    }
  }
  return value;
};

export const removeItem = async (key: string, type: string) => {
  let value = null;
  switch (type) {
    case 'asyncStorage': {
      value = await AsyncStorage.removeItem(key);
      break;
    }
    default: {
      value = await AsyncStorage.removeItem(key);
    }
  }
  return value;
};

export default {
  setItem,
  getItem,
  removeItem,
};
