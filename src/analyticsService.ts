// Modules
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactNativePlugin } from '@microsoft/applicationinsights-react-native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {
  IAppInsights,
  IPageViewTelemetry,
  IAutoExceptionTelemetry,
  ICustomProperties,
  IEventTelemetry,
  IExceptionTelemetry,
  IConfig,
} from '@microsoft/applicationinsights-web';

// Interfaces
interface IParams {
  apiKey: string;
  commonProps?: { [key: string | number]: any };
  config?: IConfig;
}
export interface IAnalyticsInstance {
  enable: () => void;
  disable: () => void;
  trackPageView: (pageName: string, props: any) => void;
  trackException: (exception: any, props: any) => void;
  trackEvent: (event: any, props: any) => void;
  instance: IAppInsights;
}

/**
 * @method createAnalyticsInstance
 * @description Creates an instance of the analytics service
 * @param {object} options - The options object for the analytics service
 * @param {string} options.apiKey - The API key for the analytics service
 * @param {object} options.commonProps - Optional. The common properties to be sent with each event
 * @param {object} options.config - Optional. The configuration object for the analytics service
 */
export const createAnalyticsInstance = function({
  apiKey,
  commonProps = {},
  config = {},
}: IParams): IAnalyticsInstance {
  const RNPlugin = new ReactNativePlugin();

  // Flags
  let isEnabled: boolean = true;

  /**
   * @property instance
   * @description The instance of AppInsights. It can use to access the unexposed methods and properties.
   */
  const instance: IAppInsights = new ApplicationInsights({
    config: {
      extensions: [RNPlugin],
      instrumentationKey: apiKey,
      ...config,
    },
  }).loadAppInsights();

  /**
   * @method enable
   * @description Enables analytics
   */
  const enable = (): void => {
    isEnabled = true;
  };

  /**
   * @method disable
   * @description Disables analytics
   */
  const disable = (): void => {
    isEnabled = false;
  };

  /**
   * @method trackEvent
   * @description Tracks an event
   * @param event Name of the event
   * @param customProperties Optional. Custom properties to be sent with the event
   */
  const trackEvent = (event: string, customProperties?: ICustomProperties): void => {
    if (isEnabled) {
      return;
    }

    const customEvent: IEventTelemetry = {
      name: event,
    };

    instance.trackEvent(customEvent, customProperties);
  };

  /**
   * @method trackException
   * @description Tracks an exception
   * @param exception Name of the exception
   * @param customProperties Optional. Custom properties to be sent with the exception
   */
  const trackException = (exception: IAutoExceptionTelemetry, customProperties?: ICustomProperties): void => {
    if (isEnabled) {
      return;
    }

    const exceptionEvent: Partial<IExceptionTelemetry> = {
      exception,
    };

    instance.trackException(exceptionEvent, customProperties);
  };

  /**
   * @method trackPageView
   * @description Tracks a page view
   * @param pageName Name of the page or route
   * @param eventProperties Optional. Additional properties to be sent with the page view event
   * @param customProperties Optional. Custom properties to be sent with the page view event
   */
  const trackPageView = (pageName: string, eventProperties: any, customProperties?: ICustomProperties) => {
    if (!isEnabled) {
      return;
    }

    const pageView: Partial<IPageViewTelemetry> = {
      name: pageName,
      properties: {
        ...commonProps,
        ...eventProperties,
      },
    };

    instance.trackPageView(pageView, customProperties);
  };

  return {
    enable,
    disable,
    trackEvent,
    trackException,
    trackPageView,
    instance,
  };
};

// Exports
export default { createAnalyticsInstance };
