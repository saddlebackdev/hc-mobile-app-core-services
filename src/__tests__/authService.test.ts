// npx jest ./src/__tests__/authService.test.ts
import { login, isLoggedIn, logout, getAccessToken } from '../authService';
import { getItem } from '../storageService';

const accessTokenValue = 'mkDEr88ICoXsDjfAS7Hesg';
const expirationDateValue = '2022-11-28T11:09:45Z';
const refreshToken = 'daY-k29zbte5FIFgbkBMHg';

describe('AuthService', () => {
  it('login function should set accessToken to asyncStorage', async () => {
    await login({}, 'asyncStorage');
    const accessToken = await getItem('accessToken', 'asyncStorage');
    expect(accessToken).toBeDefined();
    expect(accessToken).toEqual(accessTokenValue);
  });

  it('login function should set expirationDate to asyncStorage', async () => {
    await login({}, 'asyncStorage');
    const accessTokenExpirationDate = await getItem(
      'accessTokenExpirationDate',
      'asyncStorage'
    );
    expect(accessTokenExpirationDate).toBeDefined();
    expect(accessTokenExpirationDate).toEqual(expirationDateValue);
  });

  it('login function should set refresh token to asyncStorage', async () => {
    await login({}, 'asyncStorage');
    const refreshTokenStored = await getItem('refreshToken', 'asyncStorage');
    expect(refreshTokenStored).toBeDefined();
    expect(refreshTokenStored).toEqual(refreshToken);
  });

  it('isLoggedin function should return true if access token is found on asyncstorage', async () => {
    await login({}, 'asyncStorage');
    const isUserrLoggedIn = await isLoggedIn();
    expect(isUserrLoggedIn).toBeTruthy();
  });

  it('getAccessToken function should return acessTokenn  if access token is found on asyncstorage', async () => {
    const accessToken = await getAccessToken();
    expect(accessToken).toBeDefined();
    expect(accessToken).toEqual(accessTokenValue);
  });

  it('logout function should clear all token, refreshToken and accessTokenExpirationDate from asyncStorage', async () => {
    await logout({}, 'asyncStorage');
    const accessToken = await getItem('accessToken', 'asyncStorage');
    const accessTokenExpirationDate = await getItem(
      'accessTokenExpirationDate',
      'asyncStorage'
    );
    const refreshTokenStored = await getItem('refreshToken', 'asyncStorage');
    expect(accessToken).toBeUndefined();
    expect(accessTokenExpirationDate).toBeUndefined();
    expect(refreshTokenStored).toBeUndefined();
    const isUserrLoggedIn = await isLoggedIn();
    expect(isUserrLoggedIn).toBeFalsy();
  });

  it('getAccessToken function should return null  if access token is not found on asyncstorage', async () => {
    await logout({}, 'asyncStorage');
    const accessToken = await getAccessToken();
    expect(accessToken).toBeNull();
  });
});
