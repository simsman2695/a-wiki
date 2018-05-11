import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import Login from '../containers/Login';
import Register from '../containers/Register';
import Home from '../containers/Home';
import { Whoops404 } from '../components';

const history = createHashHistory();

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
        width: '100%'
    },
    paper: {
        padding: 16,
        textAlign: 'center',
        color: theme.palette.text.secondary
    }
});

const getRoutes = (store) => {
    const state = store.getState();
    const authRequired = (nextState, replaceState) => {
        // Now you can access the store object here.

        if (!state.loggedIn) {
            history.push('/login');
        }

    };
    return (
        <Router className={styles.root} history={history}>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="*" component={Whoops404}/>
            </Switch>
        </Router>
    );
};

export default getRoutes;
