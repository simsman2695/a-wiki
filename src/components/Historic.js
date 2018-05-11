import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import Hidden from 'material-ui/Hidden';
import TableEnhanced from './Tables/TableEnhanced';
import DateAndTimePicker from './Forms/DateAndTimePicker';
import { withStyles } from 'material-ui/styles/index';

const axios = require('axios');
const dateFormat = require('dateformat');

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
    },
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    },
    iconSmall: {
        fontSize: 20
    }
});

const instance = axios.create({
    baseURL: 'https://localhost:1337/',
    timeout: 60000
});

class Historic extends React.Component {
    state = {
        minDate: new Date(),
        maxDate: new Date(),
        tableData: []
    };
    getTableData = () => {
        const query = `SELECT *  FROM "slackbot"."retorts" 
        WHERE ms >= ${this.state.minDate.getTime()} 
        AND ms <= ${this.state.maxDate.getTime()} 
        ORDER BY ts DESC`;
        instance.post('/athena', {
            query: query
        })
            .then((response) => {
                let res = [];
                if (response.data.queryId) {
                    const result = response.data.data;
                    for (let i in result) {
                        if (i) {
                            const data = JSON.parse(result[i].data);
                            let ms = new Date(Number(data.ms));
                            res.push({
                                user: data.user.id,
                                query: data.event.text,
                                response: data.response.join('<br>'),
                                ts: dateFormat(ms, 'yyyy-mm-dd, HH:MM:ss.l')
                            });
                        }
                    }
                    this.setState({ tableData: res });
                }

            })
            .catch((error) => {
                console.log(error);
            });

    };

    getColumnData = () => {
        return [
            { id: 'user', numeric: false, disablePadding: false, label: 'User' },
            { id: 'query', numeric: true, disablePadding: false, label: 'User Said' },
            { id: 'response', numeric: true, disablePadding: false, label: 'Bot Retort' },
            { id: 'ts', numeric: false, disablePadding: false, label: 'Time' }
        ];
    };

    getMinDate = () => {
        let date = new Date('01 Jan 2018');
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    };

    getMaxDate = () => {
        let maxDate = new Date();
        maxDate.setDate(maxDate.getDate() - 1);
        maxDate.setHours(23);
        maxDate.setMinutes(59);
        return maxDate;
    };

    setMinDate = (date) => {
        this.setState({ minDate: date });
    };

    setMaxDate = (date) => {
        this.setState({ maxDate: date });
    };

    performQuery = () => {
        this.getTableData();
    };

    render () {
        const {
            classes

        } = this.props;

        const {
            tableData
        } = this.state;

        const maxDate = this.getMaxDate();
        let histMaxDate = this.getMaxDate();
        histMaxDate.setHours(0);
        histMaxDate.setMinutes(0);
        const minDate = this.getMinDate();

        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="title" gutterBottom>
                            Chat Bot Historical Data
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={5} lg={4}>
                        <DateAndTimePicker
                            minDate={minDate}
                            defaultValue={histMaxDate}
                            disablePast={false}
                            disableFuture={true}
                            label='From'
                            onChange={this.setMinDate}

                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={5} lg={4}>
                        <DateAndTimePicker
                            minDate={minDate}
                            defaultValue={maxDate}
                            disablePast={false}
                            disableFuture={true}
                            label='Through'
                            onChange={this.setMaxDate}

                        />
                    </Grid>
                    <Hidden mdUp>
                        <Grid
                            xs={8}
                            sm={8}
                        />
                    </Hidden>
                    <Grid
                        align='right'
                        item xs={3} sm={3} md={2} lg={4}>
                        <Button className={classes.button} variant="raised" color="primary" onClick={this.performQuery}>
                            Go
                            <Icon className={classes.rightIcon}>send</Icon>
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        {
                            <TableEnhanced
                                title={`Bot History`}
                                tableData={tableData}
                                columnData={this.getColumnData()}
                                orderBy='ms'
                                order='desc'
                            />
                        }

                    </Grid>
                </Grid>

            </div>
        );

    }
}

Historic.propTypes = {
    classes: PropTypes.object,
    statistics: PropTypes.object.isRequired,
    updateMinutes: PropTypes.func.isRequired
};

export default withRouter(withStyles(styles)(Historic));
