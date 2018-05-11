import C from '../constants';
import { combineReducers } from 'redux';
import initialState from '../initialState';

export const errors = (state = initialState, action) => {
    switch (action.type) {
        case C.ADD_ERROR :
            return [
                ...state.errors,
                action.payload
            ];
        case C.CLEAR_ERROR :
            return state.errors.filter((message, i) => message !== action.payload);
        case C.CLEAR_ALL_ERROR :
            return [];
        default:
            return state;
    }
};

export const loggedIn = (state = initialState, action) => {

    switch (action.type) {
        case C.SESSION_ACTIVE :
            return true;
        case C.SESSION_INACTIVE :
            return false;
        default:
            return state;
    }
};

export const user = {
    fetching: (state = initialState, action) => {

        return state;

    },
    data: (state = initialState, action) => {

        switch (action.type) {
            case C.SET_USER :
                return action.payload;
            case C.LOGOUT :
                return {};
            default:
                return state;
        }
    }
};

export const navigation = {
    leftDrawer: {
        open: (state = initialState, action) => {
            switch (action.type) {
                case C.TOGGLE_LEFT_DRAWER :
                    return !state;
                case C.OPEN_LEFT_DRAWER :
                    return true;
                case C.CLOSE_LEFT_DRAWER :
                    return false;
                default:
                    return state;
            }
        }
    },
    rightDrawer: {
        open: (state = initialState, action) => {
            switch (action.type) {
                case C.TOGGLE_RIGHT_DRAWER :
                    return !state;
                case C.OPEN_RIGHT_DRAWER :
                    return true;
                case C.CLOSE_RIGHT_DRAWER :
                    return false;
                default:
                    return state;
            }
        }
    }
};

export const modals = {
    logout: {
        open: (state = initialState, action) => {
            switch (action.type) {
                case C.TOGGLE_LOGOUT_DIALOG :
                    return !state;
                default:
                    return state;
            }
        }
    }
};

export const intents = {
    data: (state = initialState, action) => {
        switch (action.type) {
            case C.STATISTICS_INTENTS_INSERT_DATA :
                return [action.payload];
            case C.STATISTICS_INTENTS_ADD_DATA :
                return [
                    ...state,
                    action.payload
                ];
            case C.STATISTICS_INTENTS_DELETE_DATA :
                return action.payload;
            case C.STATISTICS_INTENTS_DELETE_ALL_DATA :
                return [];
            default:
                return state;
        }
    }
};

export const listened = {
    data: (state = initialState, action) => {
        switch (action.type) {

            case C.STATISTICS_LISTENED_INSERT_DATA :
                return [action.payload];
            case C.STATISTICS_LISTENED_ADD_DATA :
                return [
                    ...state,
                    action.payload
                ];
            case C.STATISTICS_LISTENED_DELETE_DATA :
                return action.payload;
            case C.STATISTICS_LISTENED_DELETE_ALL_DATA :
                return [];
            default:
                return state;
        }
    }
};

export const minutes = (state = initialState, action) => {
    switch (action.type) {
        case C.SET_MINUTES :

            return Number(action.payload);
        default:
            return state;
    }
};

export const retorts = {
    data: (state = initialState, action) => {

        switch (action.type) {
            case C.STATISTICS_RETORTS_INSERT_DATA :
                return [action.payload];
            case C.STATISTICS_RETORTS_ADD_DATA :
                return [
                    ...state,
                    action.payload
                ];
            case C.STATISTICS_RETORTS_DELETE_DATA :
                return action.payload;
            case C.STATISTICS_RETORTS_DELETE_ALL_DATA :
                return [];
            default:
                return state;
        }
    }
};

export default combineReducers({
    errors,
    user: combineReducers({
        fetching: user.fetching,
        data: user.data
    }),
    navigation: combineReducers({
        leftDrawer: combineReducers({
            open: navigation.leftDrawer.open
        }),
        rightDrawer: combineReducers({
            open: navigation.rightDrawer.open
        })
    }),
    modals: combineReducers({
        logout: combineReducers({
            open: modals.logout.open
        })
    }),
    dashboard: combineReducers({
        minutes: minutes
    }),
    statistics: combineReducers({
        intents: combineReducers({
            data: intents.data
        }),
        listened: combineReducers({
            data: listened.data
        }),
        retorts: combineReducers({
            data: retorts.data
        })
    }),
    loggedIn
});
