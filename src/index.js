import React from 'react';
import { render } from 'react-dom';
import getRoutes from './routes';
import './styles/common.css';
import 'typeface-roboto';
import sampleData from './initialState';
import storeFactory from './store';
import { Provider } from 'react-redux';
import {
    addError,
    clearAllErrors,
    deleteAllIntentsStatisticData,
    deleteAllListenedStatisticData,
    deleteAllRetortsStatisticData
} from './actions';

const initialState = (localStorage['redux-store']) ?
    JSON.parse(localStorage['redux-store']) :
    sampleData;

const store = storeFactory(initialState);

const saveState = () =>
    localStorage['redux-store'] = JSON.stringify(store.getState());

const handleError = error => {
    store.dispatch(
        addError(error.message)
    );
};

let clearErrors = () => {
    store.dispatch(
        clearAllErrors()
    );
};

store.subscribe(saveState);

window.React = React;
window.store = store;
window.resetStats = () => {
    store.dispatch(
        deleteAllListenedStatisticData()
    );
    store.dispatch(
        deleteAllRetortsStatisticData()
    );
    store.dispatch(
        deleteAllIntentsStatisticData()
    );
};

window.clearErrors = clearErrors;

window.addEventListener('error', handleError);

render(
    <Provider store={store}>
        {getRoutes(store)}
    </Provider>,
    document.getElementById('react-container')
);
