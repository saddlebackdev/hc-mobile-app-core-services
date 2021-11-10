const params = {};

jest.mock('@react-navigation/native', () => {
    return {
        CommonActions: {
            navigate: jest.fn().mockImplementation(x => ( x, params)),
            push: jest.fn().mockImplementation(x => (x, params)),
            goBack: jest.fn().mockImplementation(x => (x, params)),
            replace: jest.fn().mockImplementation(x => (x, params)),
            reset: jest.fn(),
        },
        StackActions: {
            navigate: jest.fn().mockImplementation(x => x),
            push: jest.fn().mockImplementation(x => (x, params)),
            popToTop: jest.fn(),
            replace: jest.fn().mockImplementation(x => (x, params)),
            reset: jest.fn(),
        },
        DrawerActions: {
            navigate: jest.fn().mockImplementation(x => x),
            push: jest.fn().mockImplementation(x => (x, params)),
            replace: jest.fn().mockImplementation(x => (x, params)),
            reset: jest.fn(),
        },
        createNavigationContainerRef: jest.requireActual('@react-navigation/native').createNavigationContainerRef,
    }
})