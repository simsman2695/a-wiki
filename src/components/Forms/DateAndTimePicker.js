import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { DateTimePicker } from 'material-ui-pickers';
import { Icon, Typography } from 'material-ui';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

const styles = theme => ({
    dayWrapper: {
        position: 'relative'
    },
    day: {
        width: 36,
        height: 36,
        fontSize: theme.typography.caption.fontSize,
        margin: '0 2px',
        color: 'inherit'
    },
    customDayHighlight: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '2px',
        right: '2px',
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: '50%'
    },
    nonCurrentMonthDay: {
        color: theme.palette.common.minBlack
    },
    highlightNonCurrentMonthDay: {
        color: '#676767'
    },
    highlight: {
        background: theme.palette.primary.main,
        color: theme.palette.common.white
    },
    firstHighlight: {
        extend: 'highlight',
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%'
    },
    endHighlight: {
        extend: 'highlight',
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%'
    }
});

class DateAndTimePicker extends React.Component {
    state = {
        selectedDate: new Date(),
        selectedTime: new Date(),
        selectedDateTime: new Date()
    };
    componentDidMount = () => {
        this.defaultValue();
    };

    handleDateChange = date => {
        this.setState({ selectedDate: date });
    };

    handleTimeChange = time => {
        this.setState({ selectedTime: time });
    };

    handleDateTimeChange = dateTime => {
        this.setState({ selectedDateTime: dateTime });
        if (typeof this.props.onChange !== 'undefined') {
            this.props.onChange(dateTime);
        }
    };

    defaultValue = () => {
        if (typeof this.props.defaultValue !== 'undefined') {
            this.setState({ selectedDateTime: this.props.defaultValue });
        }

    };

    render () {
        const { selectedDateTime } = this.state;
        const { maxDate, minDate, label, disablePast, disableFuture } = this.props;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div>
                    <Typography variant="headline" align="left" gutterBottom>
                        {label}
                    </Typography>
                    <DateTimePicker
                        disablePast={disablePast}
                        disableFuture={disableFuture}
                        value={selectedDateTime}
                        onChange={this.handleDateTimeChange}
                        maxDate={maxDate}
                        minDate={minDate}
                        leftArrowIcon={<Icon> keyboard_arrow_left </Icon>}
                        rightArrowIcon={<Icon> keyboard_arrow_right </Icon>}
                    />
                </div>
            </MuiPickersUtilsProvider>
        );
    }
}

DateAndTimePicker.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    defaultValue: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date).isRequired,
    maxDate: PropTypes.instanceOf(Date),
    disableFuture: PropTypes.bool.isRequired,
    disablePast: PropTypes.bool.isRequired
};

export default withStyles(styles)(DateAndTimePicker);
