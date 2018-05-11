import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormGroup } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import Input, { InputLabel } from 'material-ui/Input';
import Grid from 'material-ui/Grid';

import qs from 'qs';
import axios from 'axios';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'top'
    },
    formGroup: {

    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2
    },
    button: {
        margin: theme.spacing.unit,
        marginBottom: 0
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

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={inputRef}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
};

class RegisterForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            passwordConfirm: '',
            email: '',
            firstName: '',
            lastName: '',
            phone: '(   )    -    '
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getButtonText = this.getButtonText.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.props = props;
    }

    handleSubmit (event) {
        const instance = axios.create({ baseURL: `https://${process.env.API_HOST}:${process.env.API_HOST}/api` });
        const props = this.props;
        instance.post('/auth', qs.stringify({
            username: this.state.username,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone

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
            return 'Submit';
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    render () {
        const { classes } = this.props;
        return (
            <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
                <FormGroup className={classes.formGroup}>
                    <FormControl align="center" justify="center" className={classes.formControl}>
                        <TextField
                            required
                            id="username-input"
                            label="Username"
                            helperText="username"
                            className={classes.textField}
                            margin="normal"
                            value={this.state.username}
                            onChange={this.handleChange('username')}
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
                            onChange={this.handleChange('password')}
                        />
                        <TextField
                            required
                            id="password-input-repeat"
                            label="Password Confirm"
                            type="password"
                            helperText="password confirm"
                            className={classes.textField}
                            margin="normal"
                            value={this.state.passwordConfirm}
                            onChange={this.handleChange('passwordConfirm')}
                        />

                    </FormControl>

                </FormGroup>
                <FormGroup>
                    <FormControl align="center" className={classes.formControl}>

                        <TextField
                            required
                            id="email-input"
                            label="Email"
                            type="email"
                            helperText="email"
                            className={classes.textField}
                            margin="normal"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                        />
                        <TextField
                            required
                            id="firstname-input"
                            label="First Name"
                            helperText="first name"
                            className={classes.textField}
                            margin="normal"
                            value={this.state.firstName}
                            onChange={this.handleChange('firstName')}
                        />
                        <TextField
                            required
                            id="lastname-input"
                            label="Last Name"
                            helperText="last name"
                            className={classes.textField}
                            margin="normal"
                            value={this.state.lastName}
                            onChange={this.handleChange('lastName')}
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="formatted-text-mask-input">Mobile Phone</InputLabel>
                            <Input
                                value={this.state.phone}
                                onChange={this.handleChange('phone')}
                                id="formatted-text-mask-input"
                                inputComponent={TextMaskCustom}
                            />
                        </FormControl>

                    </FormControl>

                </FormGroup>
                <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                >
                <Button type="button" href="/#/login" className={classes.button} color="secondary">
                    Go Back
                </Button>
                <Button type="submit" className={classes.button} color="primary">
                    {this.getButtonText()}
                </Button>
                </Grid>
            </form>
        );
    }
}

RegisterForm.propTypes = {
    classes: PropTypes.object.isRequired,
    buttonText: PropTypes.string,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func
};

export default withRouter(withStyles(styles)(RegisterForm));

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired
};

function NumberFormatCustom (props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value
                    }
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};
