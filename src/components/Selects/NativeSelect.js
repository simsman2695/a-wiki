import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input, { InputLabel } from '@material-ui/core/Input';
import { FormControl, FormHelperText } from '@material-ui/core/Form';
import Select from '@material-ui/core/Select';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2
    }
});

class NativeSelect extends React.Component {
    state = {
        value: ''
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
        this.props.handleChange(event.target.value);
    };

    getSelectedKey = () => {
        const def = this.props.setDefault;
        const selected = this.props.selected;
        const values = this.props.values;
        for (let i in values) {
            if (values[i].value === selected && typeof def === 'undefined') {
                this.setState({ ['value']: event.target.value });
            } else {
                this.setState({ ['value']: def });
            }
        }

    };

    componentDidMount () {

        this.getSelectedKey();

    }

    render () {
        const { classes, label, values, helperText } = this.props;
        return (
            <div className={classes.root}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="select-native-helper">{label}</InputLabel>

                    <Select
                        native
                        value={Number(this.state.value)}
                        onChange={this.handleChange('value')}
                        input={<Input id="select-native-helper"/>}
                    >
                        {values.map((row, key) => {

                            return (<option key={key} value={row.value}>{row.label}</option>);

                        })}
                    </Select>

                    {typeof helperText !== 'undefined' ?
                        <FormHelperText>{helperText}</FormHelperText> :
                        ''
                    }
                </FormControl>
            </div>
        );
    }
}

NativeSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    selected: PropTypes.string,
    helperText: PropTypes.string,
    setDefault: PropTypes.number,
    handleChange: PropTypes.func.isRequired
};

export default withStyles(styles)(NativeSelect);
