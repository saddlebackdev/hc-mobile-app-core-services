// @flow

// Modules
import Axios from 'axios';

// Assets

// Create Instance

export const loadApiUtils = (baseURL: string): any => {
  const ApiUtills: any = Axios.create({
    baseURL: baseURL,
  });

  // Request Interceptor
  ApiUtills.interceptors.request.use((config: any) => {
    // Intercept outgoing requests here

    return config;
  });

  // Response Interceptor
  ApiUtills.interceptors.response.use(
    (response: any) => {
      // Intercept incoming responses here

      return Promise.resolve(response);
    },
    (error: any) => {
      // Intercept incoming responses here

      return Promise.reject(error);
    }
  );
  return ApiUtills;
};

// Exports
export default {
  loadApiUtils,
};
