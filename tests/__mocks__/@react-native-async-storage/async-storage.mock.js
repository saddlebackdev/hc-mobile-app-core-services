let db = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: (item, value) => {
    return new Promise((resolve, reject) => {
      db[item] = value;
      resolve(value);
    });
  },
  getItem: (item, value = null) => {
    return new Promise((resolve, reject) => {
      resolve(db[item]);
    });
  },
  removeItem: item => {
    return new Promise((resolve, reject) => {
      resolve(delete db[item]);
    });
  },
}));
