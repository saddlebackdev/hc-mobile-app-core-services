export interface INotifocationStorage {
  // value is not boelean because user can set the value to true and false to set permissions
  isPushNotificationInstallationActive: string | null;
  pushNotificationInstallationId: string | null;
  pushNotificationInstallationDeviceHandle: string | null;
}
export interface INotifocationAPIData {
  id?: string | null;
  deviceHandle: string;
  devicePlatform: string;
  deviceId: string;
}
