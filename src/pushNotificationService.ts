import DeviceService from './deviceService';
import StorageService from './storageService';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import apiUtils from './apiUtils';
import { getAccessToken } from './authService';

let registerNotificationUrl: string = '';
let deRegisterNotificationUrl: string = '';

interface INotifocationStorage {
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

    PushNotificationIOS.addEventListener(
      'register',
      handleRegistrationEventListener
    );
    // write event listeners for ios
  }
  if (DeviceService.isAndroid) {
    // write event listeners for android
    messaging()
      .getToken()
      .then((fcmToken) => {
        handleRegistrationEventListener(fcmToken);
      });
  }
};

const handleRegistrationEventListener = async (
  token: string
): Promise<void> => {
  const alreadyRegistered = false;
  const storedPushNotificationData = await getPushNotificationDataFromStorage();
  let deviceRegistrationData: INotifocationAPIData = {
    deviceHandle: token,
    devicePlatform: DeviceService.isIos ? 'iOS' : 'Android',
    deviceId: DeviceService.deviceId,
  };
  if (alreadyRegistered) {
    deviceRegistrationData.id =
      storedPushNotificationData.pushNotificationInstallationId;
    return updateUserPushNotificationData(deviceRegistrationData);
  } else {
    return createUserPushNotificationData(deviceRegistrationData);
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
  const api = apiUtils.loadApiUtils(registerNotificationUrl);
  const accessToken = await getAccessToken();
  api
    .post(registerNotificationUrl, JSON.stringify(deviceRegistrationData), {
      headers: { Authorization: `Bearer ${accessToken}` },
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
  const api = apiUtils.loadApiUtils(registerNotificationUrl);
  const accessToken = await getAccessToken();
  return api
    .post(registerNotificationUrl, JSON.stringify(deviceRegistrationData), {
      headers: { Authorization: `Bearer ${accessToken}` },
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
  const api = apiUtils.loadApiUtils(url);
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
