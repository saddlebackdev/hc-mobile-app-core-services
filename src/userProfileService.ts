import request, { Method } from 'axios';
// @ts-ignore
import AuthService from './authService';

interface User {
  preferredService?: string | null;
  profilePictureUrl?: string | null;
  profilePhotoUrl?: string | null;
  churchEntityKnown?: boolean | null;
  churchEntityId?: number | null;
  churchEntityName?: string | null;
  prefix?: string | null;
  middleName?: string | null;
  suffix?: string | null;
  nickName?: string | null;
  fullName?: string | null;
  gender?: string | null;
  maritalStatusId?: number | null;
  maritalStatus?: string | null;
  membershipStatusId?: number | null;
  membershipStatus?: string | null;
  disengagementReason?: string | null;
  birthDate?: string | null;
  deceasedDate?: string | null;
  age?: number | null;
  allergies?: string | null;
  gradeLevel?: string | null;
  departmentId?: number | null;
  departmentName?: string | null;
  departmentChurchEntityId?: number | null;
  departmentChurchEntityName?: string | null;
  preferredServiceEventId?: number | null;
  modifiedDate?: number | null;
  isAdult?: boolean | null;
  isChild?: boolean | null;
  isStudent?: boolean | null;
  milestones?: Array<any> | null;
  addresses?: Array<any> | null;
  emails?: Array<any> | null;
  phones?: Array<any> | null;
  occupations?: Array<any> | null;
  contactPreferences?: Object | null;
  emergencyContacts?: Array<any> | null;
  id: number | null;
  firstName: string | null;
  lastName: string | null;
}

export const getUserProfile = async (url: string) => {
  let user: any = null;
  try {
    const accessToken = await AuthService.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const options = {
      method: 'GET' as Method,
      headers: { Authorization: `Bearer ${accessToken}` },
      url,
    };

    const { data } = await request(options);
    user = data;
    return user;
  } catch (error) {
    return null;
  }
};

export const updateUserProfile = async (url: string, user: User) => {
  let updatedUser: any = null;
  try {
    const accessToken = await AuthService.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const options = {
      method: 'PUT' as Method,
      headers: { Authorization: `Bearer ${accessToken}` },
      data: JSON.stringify(user),
      url,
    };

    const { data } = await request(options);
    updatedUser = data;
    return JSON.parse(updatedUser.toString());
  } catch (error) {
    return null;
  }
};

export const createUserProfile = async (url: string, user: User) => {
  try {
    const accessToken = await AuthService.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const options = {
      method: 'POST' as Method,
      headers: { Authorization: `Bearer ${accessToken}` },
      data: JSON.stringify(user),
      url,
    };

    const { data } = await request(options);
    return data;
  } catch (error) {
    return null;
  }
};

export const getPermmissions = async (url: string) => {
  let permissions: any = null;
  try {
    const accessToken = await AuthService.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const options = {
      method: 'GET' as Method,
      headers: { Authorization: `Bearer ${accessToken}` },
      url,
    };
    const { data } = await request(options);
    permissions = data;
    return JSON.parse(permissions);
  } catch (error) {
    return null;
  }
};

export const getPersonCredentials = async (url: string) => {
  let credentials: any = null;
  try {
    const accessToken = await AuthService.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const options = {
      method: 'GET' as Method,
      headers: { Authorization: `Bearer ${accessToken}` },
      url,
    };
    const { data } = await request(options);
    credentials = data;
    return JSON.parse(credentials);
  } catch (error) {
    return null;
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  getPermmissions,
  getPersonCredentials,
};
