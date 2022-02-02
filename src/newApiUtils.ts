// Modules
import Axios from 'axios';

// Types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AxiosInstance } from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IExtendedAxiosInstance, IMiddleware } from './newApiUtils.types';

// Create API
export const createApi = (baseURL: string): IExtendedAxiosInstance => {
  // Create Axios Instance
  const axiosInstance: AxiosInstance = Axios.create({ baseURL });

  // Middlewares
  const requestSuccessMiddlewares: Array<IMiddleware> = [];
  const requestFailureMiddlewares: Array<IMiddleware> = [];
  const responseSuccessMiddlewares: Array<IMiddleware> = [];
  const responseFailureMiddlewares: Array<IMiddleware> = [];

  // Note: Need Axios 0.22+
  // eslint-disable-next-line no-undef
  const abortController = new AbortController();

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (request) => {
      request.signal = abortController.signal;

      if (requestSuccessMiddlewares.length) {
        requestSuccessMiddlewares.map((middleware) => {
          middleware.run(request);
        });
      }

      // @ts-ignore
      if (request.shouldCancel) {
        return abortController.abort();
      }

      return request;
    },
    (exception) => {
      if (requestFailureMiddlewares.length) {
        requestFailureMiddlewares.map((middleware) => {
          middleware.run(exception);
        });
      }

      return Promise.reject(exception);
    }
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    // Success
    (response) => {
      if (responseSuccessMiddlewares.length) {
        responseSuccessMiddlewares.map((middleware) => {
          response = middleware.run(response);
        });
      }

      return Promise.resolve(response);
    },
    // Error
    (exception) => {
      if (responseFailureMiddlewares.length) {
        responseFailureMiddlewares.map((middleware) => {
          middleware.run(exception);
        });
      }

      return Promise.resolve(exception);
    }
  );

  // Use Request Middleware
  const useRequestMiddleware = (middleware: IMiddleware): void => {
    if (middleware?.on === 'success') {
      requestSuccessMiddlewares.push(middleware);
      return;
    }

    if (middleware?.on === 'failure') {
      requestFailureMiddlewares.push(middleware);
      return;
    }

    requestSuccessMiddlewares.push(middleware);
    requestFailureMiddlewares.push(middleware);
  };

  // Use Response Middleware
  const useResponseMiddleware = (middleware: IMiddleware): void => {
    if (middleware?.on === 'success') {
      responseSuccessMiddlewares.push(middleware);
      return;
    }

    if (middleware?.on === 'failure') {
      responseFailureMiddlewares.push(middleware);
      return;
    }

    responseSuccessMiddlewares.push(middleware);
    responseFailureMiddlewares.push(middleware);
  };

  // Extend Axios Instance
  const extendedAxiosInstance: IExtendedAxiosInstance = Object.assign(
    {
      useRequestMiddleware,
      useResponseMiddleware,
    },
    axiosInstance
  );

  return extendedAxiosInstance;
};

// Exports
export default { createApi };
