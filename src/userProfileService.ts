// Modules
import Axios from 'axios';

// @ts-ignore
import { getAccessToken } from './authService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IUser } from './interfaces/user.interface';

/**
 * @method getUserProfile
 * @description Gets the user profile from the server
 */
export const getUserProfile = async (url: string): Promise<unknown> => {
  const accessToken = await getAccessToken();

  return await Axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

/**
 * @method updateUserProfile
 * @description Updates the user profile with the supplied changes
 */
export const updateUserProfile = async (
  url: string,
  user: Partial<IUser>
): Promise<unknown> => {
  const accessToken = await getAccessToken();

  return await Axios.put(url, JSON.stringify(user), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

/**
 * @method createUserProfile
 * @description Creates a new user profile
 */
export const createUserProfile = async (
  url: string,
  user: IUser
): Promise<unknown> => {
  const accessToken = await getAccessToken();

  return await Axios.post(url, JSON.stringify(user), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

/**
 * @method getPermissions
 * @description Get permissions for the user
 */
export const getPermissions = async (url: string): Promise<unknown> => {
  const accessToken = await getAccessToken();

  return await Axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

/**
 * @method getPersonCredentials
 * @description Get credentials for the user
 */
export const getPersonCredentials = async (url: string): Promise<unknown> => {
  const accessToken = await getAccessToken();

  return await Axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export default {
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  getPermissions,
  getPersonCredentials,
};
