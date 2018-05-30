import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import About from '../About';
import TopNav from '../../containers/TopNav';
import LeftNav from '../../containers/LeftNav';
import { withStyles } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Whoops404 } from '../index';

const styles = theme => ({

    paper: {
        padding: 16,
        textAlign: 'center',
        height: '100%'
    },
    button: {
        background: 'rgb(209, 72, 54)'
    },
    frame: {
        height: 200,
        backgroundColor: '#eee'
    },
    account: {
        marginTop: '30%'
    }
});

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    }
});

const Main = () => (
    <MuiThemeProvider theme={theme}>
        <main className="container">
            <TopNav/>
            <LeftNav/>
            <Switch>
                <Route exact path='/' component={About}/>
                <Route path="*" component={Whoops404}/>
            </Switch>
        </main>
    </MuiThemeProvider>
);

Main.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(withTheme()(withStyles(styles)(Main)));
