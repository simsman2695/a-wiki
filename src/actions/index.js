import C from '../constants';

export const setUser = (user) => ({
    type: C.SET_USER,
    payload: user
});

export const setLoginStatus = (status) => ({
    type: C.LOGIN,
    payload: status
});

/*
export const setToken = (token) => ({
    type: C.SET_TOKEN,
    payload: token
});
*/

export const openDrawer = (side) => {

    return {
        type: C[`OPEN_${side.toUpperCase()}_DRAWER`],
        payload: true
    };
};

export const closeDrawer = (side) => {
    return {
        type: C[`CLOSE_${side.toUpperCase()}_DRAWER`],
        payload: false
    };
};

export const toggleDrawer = (side) => {
    return {
        type: C[`TOGGLE_${side.toUpperCase()}_DRAWER`]
    };
};

export const logOut = () => {
    return {
        type: C.LOGOUT
    };
};

export const loginUser = (user) => {
    return {
        type: C.LOGIN,
        payload: user
    };
};

export const isLoggedIn = (status) => {
    return {
        type: C.SESSION_ACTIVE,
        payload: status
    };
};

export const addError = (message) => {
    return {
        type: C.ADD_ERROR,
        payload: message
    };
};

export const toggleDialog = (type) => {
    return {
        type: C[`TOGGLE_${type.toUpperCase()}_DIALOG`]
    };

};

export const clearError = index => {
    return {
        type: C.CLEAR_ERROR,
        payload: index
    };

};

export const setMinutes = minutes => {
    return {
        type: C.SET_MINUTES,
        payload: minutes
    };

};

export const addIntentsStatisticData = (data) => {
    return {
        type: C.STATISTICS_INTENTS_ADD_DATA,
        payload: data
    };
};

export const addListenedStatisticData = (data) => {
    return {
        type: C.STATISTICS_LISTENED_ADD_DATA,
        payload: data
    };
};
export const addRetortsStatisticData = (data) => {
    return {
        type: C.STATISTICS_RETORTS_ADD_DATA,
        payload: data
    };
};
export const insertIntentsStatisticData = (data) => {
    return {
        type: C.STATISTICS_INTENTS_INSERT_DATA,
        payload: data
    };
};

export const insertListenedStatisticData = (data) => {
    return {
        type: C.STATISTICS_LISTENED_INSERT_DATA,
        payload: data
    };
};
export const insertRetortsStatisticData = (data) => {
    return {
        type: C.STATISTICS_RETORTS_INSERT_DATA,
        payload: data
    };
};

export const deleteAllRetortsStatisticData = (data) => {
    return {
        type: C.STATISTICS_RETORTS_DELETE_ALL_DATA,
        payload: data
    };
};

export const deleteAllIntentsStatisticData = (data) => {
    return {
        type: C.STATISTICS_INTENTS_DELETE_ALL_DATA,
        payload: data
    };
};

export const deleteAllListenedStatisticData = (data) => {
    return {
        type: C.STATISTICS_LISTENED_DELETE_ALL_DATA,
        payload: data
    };
};

export const updateDialogFlowIntentSearchResults = (results) => {
    return {
        type: C.LOGIN,
        payload: results
    };
};

export const clearAllErrors = () => {
    return {
        type: C.CLEAR_ALL_ERROR
    };

};
