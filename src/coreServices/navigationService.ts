// @ts-ignore
import _ from 'lodash';
import {
    CommonActions,
    StackActions,
    DrawerActions,
    createNavigationContainerRef
} from '@react-navigation/native';


export const _navigator = createNavigationContainerRef() 

const back = () : void => {
    if (!_.isFunction(_navigator.dispatch)) {
        return;
    }
    _navigator.dispatch(CommonActions.goBack());
};

const navigate = (name:string, params:object) : void => {
    if (!_.isFunction(_navigator.dispatch)) {
        return;
    }

    _navigator.dispatch(
        CommonActions.navigate({
            name,
            params,
        }),
    );
};

const replace = (routeName:string, params:object) : void => {
    if (!_.isFunction(_navigator.dispatch)) {
        return;
    }

    _navigator.dispatch(
        StackActions.replace(
            routeName,
            params,
        ),
    );
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

const push = (routeName:string, params:object) => {
    if (!_.isFunction(_navigator.dispatch)) {
        return;
    }
    _navigator.dispatch(StackActions.push(routeName, params));
};

const pushBack = (params :object) => {
    if (!_.isFunction(_navigator.dispatch)) {
        return;
    }

    const prevRoute = getPastRoute();
    _navigator.dispatch(
        StackActions.push(
            prevRoute,
            params,
        ),
    );
};

const getIndexAndRoute = () => {
    const { index, routes } = _navigator.current!.getRootState()

    return { index, routes };
};

const getCurrentRoute = () => {
    const route = _navigator.getCurrentRoute();
    return route;
};

const getPastRoute = () => {
    const { index, routes } = getIndexAndRoute();
    const route = routes[routes.length - 1];

    if (route) {
        return route.name;
    }

    return '';
};

const reset = (routeName:string, params:object) => {
    if (!_.isFunction(_navigator.dispatch)) {
        return;
    }

    const resetAction = CommonActions.reset({
        index: 1,
        routes: [
            { name: routeName , params },
        ],
    });

    _navigator.dispatch(resetAction);
};

// Pop And Navigate
const popAndNavigate = (name:string, params:object) => {
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
