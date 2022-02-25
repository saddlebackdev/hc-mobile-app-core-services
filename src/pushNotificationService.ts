import DeviceService from './deviceService';
import StorageService from './storageService';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import apiUtils from './apiUtils';
import { getAccessToken } from './authService';

let registerNotificationUrl: string = '';
let deRegisterNotificationUrl: string = '';

interface INotifocationStorage {
  // value is not boelean because user can set the value to true and false to set permissions
  isPushNotificationInstallationActive: string | null;
  pushNotificationInstallationId: string | null;
  pushNotificationInstallationDeviceHandle: string | null;
}
interface INotifocationAPIData {
  id?: string | null;
  deviceHandle: string;
  devicePlatform: string;
  deviceId: string;
}

export const register = async (url: string): Promise<any> => {
  registerNotificationUrl = url;
  const storedPushNotificationData = await getPushNotificationDataFromStorage();

  if (DeviceService.isIos) {
    if (
      storedPushNotificationData.isPushNotificationInstallationActive === null
    ) {
      PushNotificationIOS.requestPermissions();
    }

    return new Promise(function (resolve) {
      PushNotificationIOS.addEventListener('register', (token) =>
        handleRegistrationEventListener(token, resolve)
      );
    });

    // write event listeners for ios
  }
  if (DeviceService.isAndroid) {
    // write event listeners for android
    return new Promise(function (resolve) {
      messaging()
        .getToken()
        .then((fcmToken) => {
          handleRegistrationEventListener(fcmToken, resolve);
        });
    });
  }
};

const handleRegistrationEventListener = async (
  token: string,
  resolve: Function
): Promise<void> => {
  const storedPushNotificationData = await getPushNotificationDataFromStorage();
  const alreadyRegistered: string | null =
    storedPushNotificationData.isPushNotificationInstallationActive;
  let deviceRegistrationData: INotifocationAPIData = {
    deviceHandle: token,
    devicePlatform: DeviceService.isIos ? 'iOS' : 'Android',
    deviceId: DeviceService.deviceId,
  };
  if (alreadyRegistered === null) {
    return resolve(createUserPushNotificationData(deviceRegistrationData));
  } else if (alreadyRegistered === 'true') {
    if (
      token !==
      storedPushNotificationData.pushNotificationInstallationDeviceHandle
    ) {
      deviceRegistrationData.id =
        storedPushNotificationData.pushNotificationInstallationId;
      return resolve(updateUserPushNotificationData(deviceRegistrationData));
    }
  } else {
    if (DeviceService.isAndroid) {
      messaging().onTokenRefresh((newFcmToken) => {
        deviceRegistrationData.deviceHandle = newFcmToken;
        deviceRegistrationData.id =
          storedPushNotificationData.pushNotificationInstallationId;
        return resolve(updateUserPushNotificationData(deviceRegistrationData));
      });
    }
  }
};

const storePushnotificationData = async (
  data: INotifocationStorage
): Promise<void> => {
  try {
    if (data?.isPushNotificationInstallationActive) {
      await StorageService.setItem(
        'isPushNotificationInstallationActive',
        data.isPushNotificationInstallationActive
      );
    }

    if (data?.pushNotificationInstallationId) {
      await StorageService.setItem(
        'isPushNotificationInstallationActive',
        data.pushNotificationInstallationId
      );
    }

    if (data?.pushNotificationInstallationDeviceHandle) {
      await StorageService.setItem(
        'isPushNotificationInstallationActive',
        data.pushNotificationInstallationDeviceHandle
      );
    }
  } catch (error) {
    return Promise.reject();
  }
};

const getPushNotificationDataFromStorage =
  async (): Promise<INotifocationStorage> => {
    const isPushNotificationInstallationActive = await StorageService.getItem(
      'isPushNotificationInstallationActive'
    );
    const pushNotificationInstallationId = await StorageService.getItem(
      'pushNotificationInstallationId'
    );
    const pushNotificationInstallationDeviceHandle =
      await StorageService.getItem('pushNotificationInstallationDeviceHandle');

    return {
      isPushNotificationInstallationActive,
      pushNotificationInstallationId,
      pushNotificationInstallationDeviceHandle,
    };
  };

const createUserPushNotificationData = async (
  deviceRegistrationData: INotifocationAPIData
) => {
  const api = apiUtils.createApi(registerNotificationUrl);
  const accessToken = await getAccessToken();
  const headers: any = {
    'Content-Type': 'application/json;charset=UTF-8',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return api
    .post(registerNotificationUrl, JSON.stringify(deviceRegistrationData), {
      headers: headers,
    })
    .then((res: any) => {
      const isPushNotificationInstallationActive = 'true';
      const pushNotificationInstallationId = res.id.toString();
      storePushnotificationData({
        isPushNotificationInstallationActive,
        pushNotificationInstallationId,
        pushNotificationInstallationDeviceHandle:
          deviceRegistrationData.deviceHandle,
      });
    });
};

const updateUserPushNotificationData = async (
  deviceRegistrationData: INotifocationAPIData
) => {
  const api = apiUtils.createApi(registerNotificationUrl);
  const accessToken = await getAccessToken();
  const headers: any = {
    'Content-Type': 'application/json;charset=UTF-8',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return api
    .post(registerNotificationUrl, JSON.stringify(deviceRegistrationData), {
      headers,
    })
    .then((res: any) => {
      const isPushNotificationInstallationActive = 'true';
      const pushNotificationInstallationId = res.id.toString();
      storePushnotificationData({
        isPushNotificationInstallationActive,
        pushNotificationInstallationId,
        pushNotificationInstallationDeviceHandle:
          deviceRegistrationData.deviceHandle,
      });
    });
};

const deleteUserPushNotificationData = async (url: string) => {
  const api = apiUtils.createApi(url);
  const accessToken = await getAccessToken();
  return api.delete(deRegisterNotificationUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const deRegister = async (url: string) => {
  const storedPushNotificationData = await getPushNotificationDataFromStorage();
  let installationId =
    storedPushNotificationData.pushNotificationInstallationId;
  const installationDeviceHandle =
    storedPushNotificationData.pushNotificationInstallationDeviceHandle;
  let isInstallationActive =
    storedPushNotificationData.isPushNotificationInstallationActive;

  if (isInstallationActive === 'true' && installationId) {
    deleteUserPushNotificationData(url);

    // installationDeviceHandle = '';

    storePushnotificationData({
      pushNotificationInstallationId: '',
      pushNotificationInstallationDeviceHandle: installationDeviceHandle,
      isPushNotificationInstallationActive: 'false',
    });
  }
};

export default { register, deRegister };
