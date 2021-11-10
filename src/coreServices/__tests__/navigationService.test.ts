// npx jest ./src/coreServices/__tests__/navigationService.test.ts
import {
  back,
  push,
  _navigator,
  navigate,
  setRef,
  getCurrentRoute,
  replace,
} from '../navigationService';
import {CommonActions, StackActions} from '@react-navigation/native';

const navigationMockRef = {
  dispatch: jest.fn,
  current: {
    getCurrentRoute: () => {
      return {
        name: 'currentRouteTest',
      };
    },
  },
};

describe('NavigationService', () => {
  it('should set ref form navigator', async () => {
    setRef(navigationMockRef);
    expect(_navigator).toBeDefined();
  });

  it('should dispatch goback form CommonActions Service', async () => {
    back();
    expect(CommonActions.goBack).toBeCalled();
  });

  it('should dispatch push form StackActions Service', async () => {
    push('testRoute', {});
    expect(StackActions.push).toBeCalled();
  });

  it('should dispatch navigate form CommonActions Service', async () => {
    navigate('testRoute', {option1: 'option1'});
    expect(CommonActions.navigate).toBeCalledWith('testRoute', {
      option1: 'option1',
    });
  });

  it('should dispatch replace form StackActions Service', async () => {
    replace('testRoute', {option1: 'option1'});
    expect(StackActions.replace).toBeCalledWith('testRoute', {
      option1: 'option1',
    });
  });

  it('should getCurrentRoute should return current navigated screen', async () => {
    const route = getCurrentRoute();
    expect(route).toEqual('currentRouteTest');
  });
});
