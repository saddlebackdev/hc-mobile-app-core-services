import { Buffer } from 'buffer';
import { authorize, refresh, revoke } from 'react-native-app-auth';
// @ts-ignore
import _ from 'lodash';
import moment from 'moment';
import { setItem, getItem, removeItem } from './storageService';

export const login = async (
  config: any,
  storageType: string,
  cb?: () => string
): Promise<any> => {
  try {
    const authState = await authorize(config);
    const jwtBody = authState.idToken.split('.')[1];
    const base64 = jwtBody.replace('-', '+').replace('_', '/');
    const decodedJwt = Buffer.from(base64, 'base64');
    const idTokenJSON = JSON.parse(decodedJwt.toString());
    const uniqueId = idTokenJSON.sub;
    await setItem('accessToken', authState.accessToken, storageType);
    await setItem(
      'accessTokenExpirationDate',
      authState.accessTokenExpirationDate,
      'asyncStorage'
    );
    await setItem('refreshToken', authState.refreshToken, storageType);
    await setItem('uniqueId', uniqueId, storageType);
    if (cb) {
      cb();
    }
    return Promise.resolve({ ...authState, uniqueId });
  } catch (error) {
    // Failed to login
    return Promise.reject(error);
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const accessToken = await getItem('accessToken', 'asyncStorage');
    let isExpiredAccessToken = false;

    const accessTokenExpirationDate = await getItem(
      'accessTokenExpirationDate',
      'asyncStorage'
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
  cb?: () => string
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

// Refresh Access Token
export const refreshAccessToken = async (
  config: any,
  refreshToken: string
): Promise<unknown> => {
  const result = await refresh(config, { refreshToken });

  return result;
};

// Get Access Token
export const getAccessToken = async (): Promise<string | null> => {
  return await getItem('accessToken', 'asyncStorage');
};

// Get Refresh Token
export const getRefreshToken = async (): Promise<string | null> => {
  return await getItem('refreshToken', 'asyncStorage');
};
