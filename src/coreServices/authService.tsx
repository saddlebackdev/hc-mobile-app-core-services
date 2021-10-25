import {Buffer} from 'buffer';
import {authorize, revoke} from 'react-native-app-auth';
// @ts-ignore
import _ from 'lodash';
import moment from 'moment';
import {setItem, getItem, removeItem} from './storageService';

export const login = async (
  config: any,
  storageType: string,
  cb: () => string,
): Promise<any> => {
  try {
    const authState = await authorize(config);
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
    cb();
    return Promise.resolve();
  } catch (error) {
    // Failed to login
    return Promise.reject();
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const accessToken = await getItem('accessToken', 'asyncStorage');
    const accessTokenExpirationDate = await getItem(
      'accessTokenExpirationDate',
      'asyncStorage',
    );

    if (_.isNil(accessToken)) {
      return false;
    }

    const isExpiredAccessToken = moment()
      .utc()
      .isAfter(accessTokenExpirationDate);

    if (isExpiredAccessToken) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const logout = async (config: any, cb: () => string): Promise<any> => {
  try {
    let accessToken = await getItem('accessToken', 'asyncStorage');
    await revoke(config, {
      tokenToRevoke: accessToken!,
      sendClientId: true,
    });

    await removeItem('accessToken', 'asyncStorage');
    await removeItem('accessTokenExpirationDate', 'asyncStorage');
    await removeItem('refreshToken', 'asyncStorage');
    await removeItem('uniqueId', 'asyncStorage');
    await removeItem('churchId', 'asyncStorage');
    await removeItem('PersonQrCode', 'asyncStorage');

    cb();
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

  return authToken;
};

export default {
  login,
  logout,
  isLoggedIn,
  getAccessToken,
};
