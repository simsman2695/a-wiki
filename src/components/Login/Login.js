import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import LoginForm from '../Forms/GoogleLogin';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';

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

const Login = (props) => {

    const { onLogin = f => f, loggedIn = false, classes, history } = props;

    const loginResponse = (user) => {
        onLogin(user);
        setTimeout(
            () => {
                history.push('/home');
            }
            , 1000);

    };

    return (
        <Grid container className={classes.root}>

            <Grid item xs={12} className="login">
                <Grid
                    container
                    className={classes.container}
                    direction="row"
                    alignItems="flex-start"
                    justify="center">
                    <Paper className={classes.paper}>
                        <Grid item xs={12}>
                            <Grid item xs={12} className={classes.frame}>
                                <Icon style={{ fontSize: 72, marginTop: '30%' }}
                                      color={loggedIn ? 'primary' : 'disabled'}>account_circle</Icon>
                            </Grid>
                        </Grid>
                        <LoginForm
                            onSuccess={loginResponse}
                        />
                    </Paper>
                </Grid>

            </Grid>

        </Grid>

    );

};

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onLogin: PropTypes.func,
    updateIntents: PropTypes.func,
    loggedIn: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(Login));

