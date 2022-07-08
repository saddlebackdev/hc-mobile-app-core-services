import { isLoggedIn, getAccessToken } from './authService';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AxiosRequestConfig, AxiosInstance } from 'axios';
import { createApi } from './apiUtils';
import isEmpty from 'lodash/isEmpty';

const DEFAULT_CONFIG = {
  pageSize: 5,
  page: 0,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

class ApiPaginationHelper {
  page: number;
  config: AxiosRequestConfig;
  axios: AxiosInstance;

  constructor(config: AxiosRequestConfig, mockedAbortController?: any) {
    this.page = 0;
    this.config = config;
    this.axios = createApi(
      process.env.API_URL || config.baseURL || '',
      {},
      mockedAbortController
    );
  }

  getPage() {
    return this.page;
  }

  incrementPage() {
    this.page = this.page + 1;
  }

  resetPage() {
    this.page = 0;
  }

  setConfig(config: AxiosRequestConfig) {
    this.config = config;
  }

  getUri() {
    // Creates the URL and injects page and pageSize automatically
    const uri = this.axios.getUri({
      ...DEFAULT_CONFIG,
      ...this.config,
      params: {
        ...this.config?.params,
        page: this.page,
      },
    });

    return uri;
  }

  async getNextPage(config?: AxiosRequestConfig, firstLoad?: boolean) {
    if (!isEmpty(config)) {
      this.setConfig({
        ...config,
      });
    }

    if (firstLoad) {
      this.resetPage();
    }

    const uri = this.getUri();

    this.incrementPage();

    const isUserLoggedIn = await isLoggedIn();

    let authorizationToken;

    if (isUserLoggedIn) {
      authorizationToken = await getAccessToken();
    }

    return this.axios.get(uri, {
      headers: {
        ...DEFAULT_CONFIG.headers,
        ...(isUserLoggedIn && {
          Authorization: `Bearer ${authorizationToken}`,
        }),
      },
    });
  }
}

export default ApiPaginationHelper;
