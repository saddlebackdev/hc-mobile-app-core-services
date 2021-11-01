import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import DeviceService from './deviceService';

const registerDevice = () => {
    const isPushNotificationInstallationActive = await AsyncStorage.getItem(
        'isPushNotificationInstallationActive',
    );
    const pushNotificationInstallationId = await AsyncStorage.getItem(
        'pushNotificationInstallationId',
    );
    let pushNotificationInstallationDeviceHandle = await AsyncStorage.getItem(
        'pushNotificationInstallationDeviceHandle',
    );

    if (isPushNotificationInstallationActive === 'true') {
        // eslint-disable-next-line max-depth
        if (DeviceService.isIos && pushNotificationInstallationDeviceHandle) {
            const deviceRegistrationData = {
                'id': pushNotificationInstallationId,
                'deviceHandle': pushNotificationInstallationDeviceHandle,
                'devicePlatform': 'iOS',
                'deviceId': DeviceService.deviceId,
            };
            PushNotificationActions.setAuthToken(accessToken);
            return PushNotificationActions
                .updateDevice(
                    {id: pushNotificationInstallationId},
                    deviceRegistrationData,
                )
                .then(async () => {
                    await storeRegistration(
                        isPushNotificationInstallationActive,
                        pushNotificationInstallationId,
                        pushNotificationInstallationDeviceHandle,
                    );

                    // Registered and logged in
                    return Promise.resolve();
                })
                .catch(() => {
                    // Failed to update device
                    return Promise.reject();
                });
        }

        // eslint-disable-next-line max-depth
        if (DeviceService.isAndroid) {
            return messaging()
                .getToken()
                .then(fcmToken => {
                    if (fcmToken) {
                        pushNotificationInstallationDeviceHandle = fcmToken;

                        const deviceRegistrationData = {
                            'id': pushNotificationInstallationId,
                            'deviceHandle': fcmToken,
                            'devicePlatform': 'Android',
                            'deviceId': DeviceService.deviceId,
                        };

                        PushNotificationActions.setAuthToken(accessToken);

                        PushNotificationActions
                            .updateDevice(
                                {id: pushNotificationInstallationId},
                                deviceRegistrationData,
                            )
                            .then(
                                async () => {
                                    await storeRegistration(
                                        isPushNotificationInstallationActive,
                                        pushNotificationInstallationId,
                                        pushNotificationInstallationDeviceHandle,
                                    );

                                    // Registered and logged in
                                    return Promise.resolve();
                                },
                                () => {
                                    // Failed to update device
                                    return Promise.reject();
                                },
                            );
                    } else {
                        // No device token
                        // User doesn't have a device token yet
                        return Promise.resolve();
                    }
                })
                .catch(() => {
                    // Failed to register for push notifications
                    return Promise.reject();
                });
        }
    
    return true;
}

handleRegistrationasync