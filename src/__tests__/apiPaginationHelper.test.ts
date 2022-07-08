// npx jest ./src/__tests__/apiPaginationHelper.test.ts
import ApiPaginationHelper from '../apiPaginationHelper';
import * as AuthService from '../authService';

jest.mock('../authService.ts');

const mockedGetUri = jest.fn();
const mockedGet = jest.fn();

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: mockedGet,
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
      getUri: mockedGetUri,
    })),
  };
});

const BASE_URL = 'hc-test.saddleback.com';
let apiPaginationHelperInstance: ApiPaginationHelper;
const mockedAbortController = {
  signal: 'test',
  abort: jest.fn(),
};

describe('apiPaginationHelper', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache

    process.env = {
      ...OLD_ENV,
      API_URL: BASE_URL,
    }; // Make a copy

    apiPaginationHelperInstance = new ApiPaginationHelper(
      {
        baseURL: BASE_URL,
        url: '/api/some/endpoint',
        params: {
          oneParam: 1,
          anotherParam: 'a',
        },
      },
      mockedAbortController
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  describe('Page number', () => {
    it('should increment when calling each time we call getNextPage()', async () => {
      expect(apiPaginationHelperInstance.getPage()).toBe(0);
      await apiPaginationHelperInstance.getNextPage();
      await apiPaginationHelperInstance.getNextPage();
      await apiPaginationHelperInstance.getNextPage();
      expect(apiPaginationHelperInstance.getPage()).toBe(3);
    });

    it('should start from 0 when getNextPage() is called with firstLoad', async () => {
      expect(apiPaginationHelperInstance.getPage()).toBe(0);
      await apiPaginationHelperInstance.getNextPage();
      await apiPaginationHelperInstance.getNextPage();
      expect(apiPaginationHelperInstance.getPage()).toBe(2);
      await apiPaginationHelperInstance.getNextPage({}, true);
      expect(apiPaginationHelperInstance.getPage()).toBe(1);
    });

    it('should reset to the inital value when calling resetPage() ', async () => {
      expect(apiPaginationHelperInstance.getPage()).toBe(0);
      await apiPaginationHelperInstance.getNextPage();
      await apiPaginationHelperInstance.getNextPage();
      await apiPaginationHelperInstance.getNextPage();
      expect(apiPaginationHelperInstance.getPage()).toBe(3);
      apiPaginationHelperInstance.resetPage();
      expect(apiPaginationHelperInstance.getPage()).toBe(0);
    });
  });

  describe('getUri()', () => {
    it('must be called each time getNextPage() is called', async () => {
      await apiPaginationHelperInstance.getNextPage();
      expect(mockedGetUri).toHaveBeenCalledWith({
        pageSize: 5,
        page: 0,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        baseURL: 'hc-test.saddleback.com',
        url: '/api/some/endpoint',
        params: { oneParam: 1, anotherParam: 'a', page: 0 },
      });
      await apiPaginationHelperInstance.getNextPage();
      await apiPaginationHelperInstance.getNextPage();
      await apiPaginationHelperInstance.getNextPage();
      expect(mockedGetUri).toHaveBeenCalledTimes(4);
    });
  });
});

describe('Access Token', () => {
  it('is injected when the user is logged in and  the access token exist', async () => {
    // @ts-ignore
    AuthService.getAccessToken.mockImplementation(() => 'mocked_token');
    // @ts-ignore
    AuthService.isLoggedIn.mockImplementationOnce(() => true);
    await apiPaginationHelperInstance.getNextPage();
    let requestConfig = mockedGet.mock.calls[0][1];
    let headers = requestConfig.headers;
    expect(headers).toEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mocked_token',
    });
    // @ts-ignore
    AuthService.isLoggedIn.mockImplementationOnce(() => false);
    await apiPaginationHelperInstance.getNextPage();
    requestConfig = mockedGet.mock.calls[1][1];
    expect(requestConfig).toEqual({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  });
});
