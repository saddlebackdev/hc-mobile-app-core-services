// Modules
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AxiosInstance } from 'axios';

// Middleware
export interface IMiddleware {
  /** The event on which this middleware should be executed. */
  on?: 'success' | 'failure';

  /** The function that should be executed. */
  run: Function;
}

// Extended Axios Instance
export interface IExtendedAxiosInstance extends AxiosInstance {
  useRequestMiddleware: Function;
  useResponseMiddleware: Function;
}
