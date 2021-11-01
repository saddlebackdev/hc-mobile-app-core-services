// npx jest ./src/coreServices/__tests__/authService.test.ts
import {login, isLoggedIn, logout, getAccessToken} from '../authService';
import {setItem, getItem, removeItem} from '../storageService';

const accessTokenValue  = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRCNDc1Q0I5RUQ5QTAzNThFMzExRjNBMjEwOERCNERDOUJGMDQ0MTIiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJTMGRjdWUyYUExampFZk9pRUkyMDNKdndSQkkifQ.eyJuYmYiOjE2MzU1MDU3ODUsImV4cCI6MTYzODA5Nzc4NSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1kZXYuc2FkZGxlYmFjay5jb20iLCJhdWQiOlsiaHR0cHM6Ly9pZGVudGl0eS1kZXYuc2FkZGxlYmFjay5jb20vcmVzb3VyY2VzIiwiY20tYXBpIiwiaW50cm9zcGVjdC1yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJoYy1tZW1iZXItZW5nYWdlbWVudCIsInN1YiI6Ijc3Nzk5MTAiLCJhdXRoX3RpbWUiOjE2MzU1MDU3ODEsImlkcCI6ImxvY2FsIiwidXJuOnNhZGRsZWJhY2s6dXNlcl9pZCI6WyI1MzcxZmUwZC0yMjQ4LTQ4OWYtYjgzNS04NGM5MmI4ODg5ZjIiLCI1MzcxZmUwZC0yMjQ4LTQ4OWYtYjgzNS04NGM5MmI4ODg5ZjIiXSwiaWQiOiI3Nzc5OTEwIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwidXJuOnNhZGRsZWJhY2s6cGVyc29uX2xpbmsiOiJVTktOT1dOIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIiwiaGM6Y29ubmVjdGlvbi1xdWVzdGlvbi1yZWFkIiwiaGM6Y29ubmVjdGlvbi1xdWVzdGlvbi1hbnN3ZXItcmVhZCIsImhjOmNvbm5lY3Rpb24tcXVlc3Rpb24tYW5zd2VyLWNyZWF0ZSIsImhjOmludGVybmFsLXN5c3RlbXMiLCJoYzpwZW9wbGUtY3JlZGVudGlhbHMtbWFuYWdlIiwiaGM6aW50cm9zcGVjdCIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.YdjMBavxS2KQIKe_hvwX1GIGVaX0ePGcBDHL9KMKFsbYNkZQEHIlUii9LyPdxwcKshHhpjz4zBVYUk7_abhyu8TWd4gLRR_iG060jsz7qjY3s7oM18heLXpt-vwvAG6uGeBiLI_dCZQ0gGCcrRxuSEG_cNulxSY4hpj_D9a5btjwdgMHIgFDE5Y0bEvxNDa0KL9Nbu7awx4xG6w50j6frECYUsGLKs_9RQaXgLRsfbNP4ljiPYUqujey0yDIqfDqpT0XEm5mEMbE9HhIqX85GBk9SyiF54LRSuMJQsnNEXlTPnI4x1spYhY-9q00Ac_J3JUEwloROnrba5mT9n2RvA"
const expirationDateValue = "2021-11-28T11:09:45Z";
const refreshToken = "af869384bbb3f30084798caee52e5fd50142cef17c668c84a83cdac6fce31cdd";

describe('AuthService', () => {
    it('login function should set accessToken to asyncStorage',  async () => {
        const userLogin = await login({}, 'asyncStorage');
        const accessToken = await getItem('accessToken', 'asyncStorage');
        expect(accessToken).toBeDefined();
        expect(accessToken).toEqual(accessTokenValue);
    })

    it('login function should set expirationDate to asyncStorage',  async () => {
        const userLogin = await login({}, 'asyncStorage');
        const accessTokenExpirationDate = await getItem('accessTokenExpirationDate', 'asyncStorage');
        expect(accessTokenExpirationDate).toBeDefined();
        expect(accessTokenExpirationDate).toEqual(expirationDateValue);
    })
    
    it('login function should set refresh token to asyncStorage',  async () => {
        const userLogin = await login({}, 'asyncStorage');
        const refreshToken = await getItem('refreshToken', 'asyncStorage');
        expect(refreshToken).toBeDefined();
        expect(refreshToken).toEqual(refreshToken);
    })

    it('isLoggedin function should return true if access token is found on asyncstorage',  async () => {
        const userLogin = await login({}, 'asyncStorage');
        const isUserrLoggedIn = await isLoggedIn();
        expect(isUserrLoggedIn).toBeTruthy();
    })

    it('getAccessToken function should return acessTokenn  if access token is found on asyncstorage',  async () => {
        const accessToken = await getAccessToken();
        expect(accessToken).toBeDefined();
        expect(accessToken).toEqual(accessTokenValue);
    })

    it('logout function should clear all token, refreshToken and accessTokenExpirationDate from asyncStorage',  async () => {
        const userLogout = await logout({}, 'asyncStorage');
        const accessToken = await getItem('accessToken', 'asyncStorage');
        const accessTokenExpirationDate = await getItem('accessTokenExpirationDate', 'asyncStorage');
        const refreshToken = await getItem('refreshToken', 'asyncStorage');
        expect(accessToken).toBeUndefined();
        expect(accessTokenExpirationDate).toBeUndefined();
        expect(refreshToken).toBeUndefined();
        const isUserrLoggedIn = await isLoggedIn();
        expect(isUserrLoggedIn).toBeFalsy();
    })

    it('getAccessToken function should return null  if access token is not found on asyncstorage',  async () => {
        await logout({}, 'asyncStorage');
        const accessToken = await getAccessToken();
        expect(accessToken).toBeNull();
    })
    
});
