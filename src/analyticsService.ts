import NavigationService from './navigationService';

// let instrumentationKey:string = '';
let appInsights: any = null;
let allowTracking: boolean = false;
let commonTrackingProperties: object = {};

// export const setInstrumentationKey = (keyValue:string): void => {
//     instrumentationKey = keyValue;
// }

export const setAndLoadAppInsights = (appInsightsConfig: any): void => {
  appInsights = appInsightsConfig;
  appInsights.loadAppInsights();
};

// Get Route
export const getRouteName = (page: string) => {
  const route: any = NavigationService.getCurrentRoute();
  return page || route!.name;
};

export const setCommonTrackingPropertiesValue = (params: object) => {
  commonTrackingProperties = params;
};

// Get Common Tracking Propreties
export const getCommonTrackingProperties = (): object => {
  return commonTrackingProperties;
};

export const setTrackingAllowed = (isAllowedTracking: boolean) => {
  allowTracking = isAllowedTracking;
};

// Get Common Tracking Propreties
export const verifyTrackingAllowed = (): boolean => {
  return allowTracking;
};

// Track Page View
// Use this for Page Views or potentially modals and pop ups too??
export const trackPage = (page: string, params: any, force?: boolean): void => {
  const isTrackingAllowed = verifyTrackingAllowed();
  if (isTrackingAllowed || force) {
    const commonProps = getCommonTrackingProperties();
    const pageName = getRouteName(page);
    appInsights.trackPageView({
      name: pageName,
      properties: {
        ...commonProps,
        ...params,
      },
    });
  }
};

// Track Event
// Use this for custom events i.e. API Errors, Searches, Links Out, etc.
export const trackEvent = (type: string, params: any): void => {
  const isTrackingAllowed = verifyTrackingAllowed();

  if (isTrackingAllowed) {
    const commonProps = getCommonTrackingProperties();
    const Data = params;
    appInsights.trackEvent({
      name: type,
      properties: {
        ...commonProps,
        Data,
      },
    });
  }
};

// Track Exceptions
// Use this for exceptions
export const trackException = (exception: any) => {
  appInsights.trackException(exception);
};

// Exports
export default {
  getRouteName,
  setAndLoadAppInsights,
  setCommonTrackingPropertiesValue,
  setTrackingAllowed,
  trackEvent,
  trackException,
  verifyTrackingAllowed,
  trackPage,
  // setInstrumentationKey
};
