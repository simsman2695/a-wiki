import appReducer from '../reducers';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';

const consoleMessages = store => next => action => {

    let result;

    console.groupCollapsed(`dispatching action => ${action.type}`);

    result = next(action);

    console.log(store.getState());

    console.groupEnd();

    return result;

};

const allReducers = Object.assign(appReducer);

export default (initialState = {}) => {
    return applyMiddleware(thunk, consoleMessages)(createStore)(allReducers, initialState);
};
