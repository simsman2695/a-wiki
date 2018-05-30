import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import qs from 'qs';
import axios from 'axios';

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

class GoogleLoginView extends Component {

    constructor (props) {
        super(props);
        this.props = props;
    }

    responseGoogle (event) {
        console.log(event);
        const user = event.profileObj;
        const instance = axios.create({ baseURL: `https://${process.env.API_HOST}:${process.env.API_HOST}/api` });
        const props = this.props;
        instance.post('/googleauth', qs.stringify(user))
            .then(function (response) {
                props.onSuccess(response.data);
            }).catch(function (error) {
            console.log(error);
            if (typeof props.onFailure === 'function') {
                props.onFailure(error);
            }
        });

    }

    render () {
        return (
            <GoogleLogin
                clientId="15249943813-5s64hjgp7ecl3ifphld5h41vg06hgkjr.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
            />
        );
    }
}

GoogleLoginView.propTypes = {
    classes: PropTypes.object.isRequired,
    buttonText: PropTypes.string,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func
};

export default withRouter(withStyles(styles)(GoogleLoginView));
