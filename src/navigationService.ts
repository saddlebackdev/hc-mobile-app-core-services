// @ts-ignore
import _ from 'lodash';
import {
  CommonActions,
  StackActions,
  DrawerActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

export let _navigator = createNavigationContainerRef();

export const back = (): void => {
  if (!_.isFunction(_navigator.dispatch)) {
    return;
  }
  _navigator.dispatch(CommonActions.goBack());
};

export const navigate = (name: string, params: object): void => {
  if (!_.isFunction(_navigator.dispatch)) {
    return;
  }

  _navigator.dispatch(CommonActions.navigate(name, params));
};

export const replace = (routeName: string, params: object): void => {
  if (!_.isFunction(_navigator.dispatch)) {
    return;
  }

  _navigator.dispatch(StackActions.replace(routeName, params));
};

const openDrawer = () => {
  if (!_.isFunction(_navigator.dispatch)) {
    return;
  }

  _navigator.dispatch(DrawerActions.openDrawer());
};

const closeDrawer = () => {
  if (!_.isFunction(_navigator.dispatch)) {
    return;
  }

  _navigator.dispatch(DrawerActions.closeDrawer());
};

export const push = (routeName: string, params: object) => {
  if (!_.isFunction(_navigator.dispatch)) {
    return;
  }
  _navigator.dispatch(StackActions.push(routeName, params));
};

const pushBack = (params: object) => {
  if (!_.isFunction(_navigator.dispatch)) {
    return;
  }

  const prevRoute = getPastRoute();
  _navigator.dispatch(StackActions.push(prevRoute, params));
};

export const getIndexAndRoute = () => {
  const { index, routes } = _navigator.current!.getRootState();
  return { index, routes };
};

export const getCurrentRoute = (): string => {
  const route = _navigator.current!.getCurrentRoute();
  return route?.name || '';
};

export const getPastRoute = (): string => {
  const { index, routes } = getIndexAndRoute();
    const currentRoutes = routes[index]?.state?.routes;
    const route = currentRoutes![currentRoutes!.length - 1];

    if (route) {
        return route.name;
    }

    return '';
};

const reset = (routeName: string, params: object) => {
  if (!_.isFunction(_navigator.dispatch)) {
    return;
  }

  const resetAction = CommonActions.reset({
    index: 1,
    routes: [{ name: routeName, params }],
  });

  _navigator.dispatch(resetAction);
};

// Pop And Navigate
const popAndNavigate = (name: string, params: object) => {
  if (!_.isFunction(_navigator.dispatch)) {
    return null;
  }

  // Pop Stack
  _navigator.dispatch(StackActions.popToTop());

  if (!name) {
    return null;
  }

  // Navigate to Specified Route
  navigate(name, params);
  return;
};

export const setRef = (ref: any) => {
  _navigator = ref;
};

export default {
  back,
  navigate,
  push,
  pushBack,
  reset,
  closeDrawer,
  getCurrentRoute,
  getPastRoute,
  replace,
  openDrawer,
  popAndNavigate,
};
