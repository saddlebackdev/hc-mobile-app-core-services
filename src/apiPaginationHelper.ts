/* eslint-disable prettier/prettier */
// import { axios } from './apiUtils';
import { IExtendedAxiosInstance } from './apiUtils.types';
import {
    isLoggedIn,
    getAccessToken,
} from './authService';
import type { AxiosRequestConfig } from 'axios';
import { createApi } from './apiUtils';
import 'dotenv/config';

// import 
/**
 * TODOs:
 * config
 *  initialPage - 0 or 1 e.g. Optional?
 *  pageSize    - if exists, let's override the default
 *  baseUrl     - if exists, let's create a new axios instance
 * 
 * retrieve authorization token to inject it in the headers
 * 
 * Implement solutions for POST | PUT | DELETE
 * 
 * how will we handle params like search queries?
 */

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
    axios: IExtendedAxiosInstance;

    constructor(config: AxiosRequestConfig, mockedAbortController?: any) {
        console.log('process.env.API_URL', process.env.API_URL);
        this.page = 0;
        this.config = config;
        this.axios = createApi(
            process.env.API_URL || config.baseURL || '',
            {},
            mockedAbortController,
        );
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

    async getNextPage(config?: AxiosRequestConfig, firstLoad?: boolean) {
        if (config) {
            this.setConfig(config);
        }

        if (firstLoad) {
            this.resetPage();
        }

        // Creates the URL and injects page and pageSize automatically
        const uri = this.axios.getUri({
            ...DEFAULT_CONFIG,
            ...this.config,
            params: {
                ...this.config?.params,
                page: this.page,
            },
        });

        this.incrementPage();

        const isUserLoggedIn = await isLoggedIn();
        let authorizationToken;

        if (isUserLoggedIn) {
            authorizationToken = await getAccessToken(); 
        }

        return this.axios.get(uri, {
            ...(isUserLoggedIn && {
                headers: {
                    Authorization: `Bearer ${authorizationToken}`,
                }
            }),
        });
    }
}

export default ApiPaginationHelper;
