import request, {Method} from 'axios';
// @ts-ignore
import AuthService from './authService';

interface User {
  preferredService?: string;
  profilePictureUrl?: string;
  profilePhotoUrl?: string;
  churchEntityKnown?: boolean;
  churchEntityId?: number;
  churchEntityName?: string;
  prefix?: string;
  middleName?: string;
  suffix?: string;
  nickName?: string;
  fullName?: string;
  gender?: string;
  maritalStatusId?: number;
  maritalStatus?: string;
  membershipStatusId?: number;
  membershipStatus?: string;
  disengagementReason?: string;
  birthDate?: string;
  deceasedDate?: string;
  age?: number;
  allergies?: string;
  gradeLevel?: string;
  departmentId?: number;
  departmentName?: string;
  departmentChurchEntityId?: number;
  departmentChurchEntityName?: string;
  preferredServiceEventId?: number;
  modifiedDate?: Date;
  isAdult?: boolean;
  isChild?: boolean;
  isStudent?: boolean;
  milestones?: Array<any>;
  addresses?: Array<any>;
  emails?: Array<any>;
  phones?: Array<any>;
  occupations?: Array<any>;
  contactPreferences?: Array<any>;
  emergencyContacts?: Array<any>;
  id: number;
  firstName: string;
  lastName: string;
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
      headers: {Authorization: `Bearer ${accessToken}`},
      url,
    };

    const {data} = await request(options);
    user = data;
    return JSON.parse(user.toString());
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
      headers: {Authorization: `Bearer ${accessToken}`},
      data: JSON.stringify(user),
      url,
    };

    const {data} = await request(options);
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
      headers: {Authorization: `Bearer ${accessToken}`},
      data: JSON.stringify(user),
      url,
    };

    const {data} = await request(options);
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
      headers: {Authorization: `Bearer ${accessToken}`},
      url,
    };
    const {data} = await request(options);
    permissions = data;
    return JSON.parse(permissions);
  } catch (error) {
    return null;
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  getPermmissions,
};
