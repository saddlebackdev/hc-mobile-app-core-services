// Modules
import Axios from 'axios';

// Types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IExtendedAxiosInstance, IMiddleware } from './apiUtils.types';

const params = {
  pageSize: 5,
  page: 0,
};

const config = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

// Create API
export const createApi = (
  baseURL: string,
  mockedAbortController?: any
): IExtendedAxiosInstance => {
  // Create Axios Instance
  const axiosInstance: AxiosInstance = Axios.create({
    baseURL,
    params,
    ...config,
  });

  // Middlewares
  const requestSuccessMiddlewares: Array<IMiddleware> = [];
  const requestFailureMiddlewares: Array<IMiddleware> = [];
  const responseSuccessMiddlewares: Array<IMiddleware> = [];
  const responseFailureMiddlewares: Array<IMiddleware> = [];

  // Note: Need Axios 0.22+
  // eslint-disable-next-line no-undef
  const abortController = mockedAbortController || new AbortController();

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (request) => {
      if (requestSuccessMiddlewares.length) {
        requestSuccessMiddlewares.map((middleware) => {
          request = middleware.run(request);
        });
      }

      // @ts-ignore
      if (request.cancel) {
        request.signal = abortController.signal;
        abortController.abort();
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
    (response: AxiosResponse) => {
      if (responseSuccessMiddlewares.length) {
        responseSuccessMiddlewares.map((middleware) => {
          middleware.run(response);
        });
      }

      return Promise.resolve(response);
    },
    // Error
    (exception: AxiosError) => {
      if (exception.message === 'canceled') {
        return Promise.reject(exception);
      }

      if (responseFailureMiddlewares.length) {
        responseFailureMiddlewares.map((middleware) => {
          middleware.run(exception);
        });
      }

      return Promise.reject(exception);
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

const abortController = { signal: 'test', abort: () => {} };

export const axios = createApi(
  'https://hc-dev.saddleback.com/api/',
  abortController // for unit testing
);
// Exports
export default { createApi };
