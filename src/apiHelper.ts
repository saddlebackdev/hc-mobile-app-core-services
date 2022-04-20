/* eslint-disable prettier/prettier */
import { axios } from './apiUtils';
import type { AxiosRequestConfig } from 'axios';
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

class ApiHelper {
    page: number;
    config: AxiosRequestConfig;

    constructor(config: AxiosRequestConfig) {
        this.page = 0;
        this.config = config
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

    getNextPage(config?: AxiosRequestConfig, firstLoad?: boolean) {
        if (config) {
            this.setConfig(config);
        }

        if (firstLoad) {
            this.resetPage();
        }

        const path = axios.getUri({
            ...this.config,
            params: {
                ...this.config.params,
                page: this.page,
            },
        });

        this.incrementPage();

        return axios.get(path, {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjRCNDc1Q0I5RUQ5QTAzNThFMzExRjNBMjEwOERCNERDOUJGMDQ0MTIiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJTMGRjdWUyYUExampFZk9pRUkyMDNKdndSQkkifQ.eyJuYmYiOjE2NTA0MzI0MDksImV4cCI6MTY1MDQzNjAwOSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1kZXYuc2FkZGxlYmFjay5jb20iLCJhdWQiOlsiaHR0cHM6Ly9pZGVudGl0eS1kZXYuc2FkZGxlYmFjay5jb20vcmVzb3VyY2VzIiwiY20tYXBpIiwibXlzYi1hcGkiLCJ2aXNpb24tMiIsImZhY2Vib29rIl0sImNsaWVudF9pZCI6ImNtIiwic3ViIjoiNzc3ODA4NCIsImF1dGhfdGltZSI6MTY1MDQyNTMwNCwiaWRwIjoibG9jYWwiLCJ1cm46c2FkZGxlYmFjazp1c2VyX2lkIjpbIjBlODg0NjEzLWJjM2YtNDk0OC1hNzk1LWM2YThkM2QxYzVkNyIsIjBlODg0NjEzLWJjM2YtNDk0OC1hNzk1LWM2YThkM2QxYzVkNyJdLCJpZCI6Ijc3NzgwODQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwidXJuOnNhZGRsZWJhY2s6cGVyc29uX2xpbmsiOiJVTktOT1dOIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImNtLWFwaS5kZWZhdWx0IiwibXlzYi1hcGkuZGVmYXVsdCIsInZpc2lvbi0yLmFjY2Vzcy10b2tlbiIsImZhY2Vib29rLmFjY2Vzcy10b2tlbiJdLCJhbXIiOlsicHdkIl19.INwx1tR-qewBMaMbPMwW-p--GVz0Lt3ltmAC_WiHGNzmlIcKkZdZI4kHDSROHEw5x0ShDglNQBzuog9mFFug4S8JpJzi69qJWmObXF2NJCTlxU8AXf1YRW7ZGF02MyX-FvrBHG2DV9gMs1tQGM4iE3rjuJusWaAonWGrcHM2mvUaGn5JoQfvHk-l-iTkan4gWUNmuoA0LzjV8ME-oztKu-Vw0RDeJ-EdgtIJhZbJJoB25mgXKwT5CfAfgGVmHz9Qts06rohnfTooc_7V2B2e7HIxRzJIougUoUTAYKxtW0iZJzOhEzngZO-doCw6SEs9QX6JTepq0eILubGWqPfqGg',
            }
        });
    }
}

export default ApiHelper;
