import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormGroup } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import axios from 'axios';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: 'none'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200
    }
});

class LoginForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = { username: '', password: '' };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getButtonText = this.getButtonText.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.props = props;
    }

    handleSubmit (event) {
        const instance = axios.create({ baseURL: `https://${process.env.API_HOST}:${process.env.API_HOST}/api` });
        const props = this.props;
        instance.post('/auth', qs.stringify({
            username: this.state.username,
            password: this.state.password
        })).then(function (response) {

            props.onSuccess(response.data);
        }).catch(function (error) {
            console.log(error);
            if (typeof props.onFailure === 'function') {
                props.onFailure(error);
            }
        });
    }

    getButtonText () {
        if (this.props.buttonText) {
            return this.props.buttonText;
        } else {
            return 'Login';
        }
    }

    updateUsername (event) {
        this.setState({
            username: event.target.value
        });
    }

    updatePassword (event) {
        this.setState({
            password: event.target.value
        });
    }

    render () {
        const { classes } = this.props;
        return (
            <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
                <FormGroup>
                    <FormControl className={classes.formControl}>
                        <TextField
                            required
                            id="username-input"
                            label="Username"
                            helperText="username"
                            className={classes.textField}
                            margin="normal"
                            value={this.state.username}
                            onChange={this.updateUsername}
                        />
                        <TextField
                            required
                            id="password-input"
                            label="Password"
                            type="password"
                            helperText="password"
                            className={classes.textField}
                            margin="normal"
                            value={this.state.password}
                            onChange={this.updatePassword}
                        />
                        <Button type="submit" className={classes.button} color="primary">
                            {this.getButtonText()}
                        </Button>
                        <Button
                            type="button"
                            className={classes.button}
                            color="secondary"
                            href="/#/register">
                            Register
                        </Button>
                    </FormControl>
                </FormGroup>

            </form>
        );
    }
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired,
    buttonText: PropTypes.string,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func
};

export default withRouter(withStyles(styles)(LoginForm));
