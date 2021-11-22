import {Buffer} from 'buffer';
import {authorize, revoke} from 'react-native-app-auth';
// @ts-ignore
import _ from 'lodash';
import moment from 'moment';
import {setItem, getItem, removeItem} from './storageService';

export const login = async (
  config: any,
  storageType: string,
  cb?: () => string,
): Promise<any> => {
  try {
    const authState = await authorize(config);
    console.log('test3');
    // eslint-disable-next-line prefer-destructuring
    const jwtBody = authState.idToken.split('.')[1];
    const base64 = jwtBody.replace('-', '+').replace('_', '/');
    const decodedJwt = Buffer.from(base64, 'base64');
    const idTokenJSON = JSON.parse(decodedJwt.toString());
    await setItem('accessToken', authState.accessToken, storageType);
    await setItem(
      'accessTokenExpirationDate',
      authState.accessTokenExpirationDate,
      'asyncStorage',
    );
    await setItem('refreshToken', authState.refreshToken, storageType);
    await setItem('uniqueId', idTokenJSON.sub, storageType);
    if (cb) {
      cb();
    }
    return Promise.resolve();
  } catch (error) {
    // Failed to login
    console.log(error);
    return Promise.reject();
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const accessToken = await getItem('accessToken', 'asyncStorage');
    let isExpiredAccessToken = false;

    const accessTokenExpirationDate = await getItem(
      'accessTokenExpirationDate',
      'asyncStorage',
    );

    if (_.isNil(accessToken)) {
      return false;
    }

    if (!_.isEmpty(accessTokenExpirationDate)) {
      isExpiredAccessToken = moment().utc().isAfter(accessTokenExpirationDate);
    }

    if (isExpiredAccessToken) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const logout = async (
  config: any,
  storageType: string,
  cb?: () => string,
): Promise<any> => {
  try {
    let accessToken = await getItem('accessToken', storageType);
    await revoke(config, {
      tokenToRevoke: accessToken!,
      sendClientId: true,
    });

    await removeItem('accessToken', storageType);
    await removeItem('accessTokenExpirationDate', storageType);
    await removeItem('refreshToken', storageType);
    await removeItem('uniqueId', storageType);
    await removeItem('churchId', storageType);
    if (cb) {
      cb();
    }
    accessToken = '';
    return Promise.resolve();
  } catch (error) {
    // Failed to logout
    return Promise.reject();
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  let authToken: any = null;

  try {
    authToken = await getItem('accessToken', 'asyncStorage');
  } catch (error) {
    return null;
  }

  if (!authToken) {
    return null;
  }

  return authToken;
};
