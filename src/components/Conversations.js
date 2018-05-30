import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TableEnhanced from './Tables/TableEnhanced';
import NativeSelect from './Selects/NativeSelect';
import { withStyles } from '@material-ui/core/styles/index';

const alasql = require('alasql');
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
    }
});

const Conversations = (props) => {
    const {
        statistics,
        minutes,
        updateMinutes

    } = props;
    const getTableData = () => {
        const unixTimeNow = Math.floor(Date.now() / 1000);
        const data = statistics.retorts.data;
        const res = alasql(`SELECT userId as user, \`query\`, response, ms FROM ? WHERE ts > ${unixTimeNow - minutes * 60} ORDER BY ms desc`, [data]);
        let returnArray = [];
        for (let i in res) {
            if (i) {
                let ms = new Date(Number(res[i].ms));
                returnArray.push({
                    user: res[i].user,
                    query: res[i].query,
                    response: res[i].response,
                    ms: dateFormat(ms, 'yyyy-mm-dd HH:MM:ss.l')
                });
            }
        }
        return returnArray;

    };

    const getColumnData = () => {
        return [
            { id: 'user', numeric: false, disablePadding: false, label: 'User' },
            { id: 'query', numeric: true, disablePadding: false, label: 'User Said' },
            { id: 'response', numeric: true, disablePadding: false, label: 'Bot Retort' },
            { id: 'ms', numeric: true, disablePadding: false, label: 'Time' }
        ];
    };

    const setMinutes = (min) => {
        updateMinutes(min);
    };

    return (
        <div>
            <Grid container spacing={24}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography variant="title" gutterBottom>
                        Chat Bot Real Time Conversations
                    </Typography>
                </Grid>
                <Grid item xs={2} sm={3} md={4} lg={4}>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1}>
                    <NativeSelect
                        label='Minutes'
                        setDefault={Number(minutes)}
                        values={[
                            { value: 5, label: '5' },
                            { value: 10, label: '10' },
                            { value: 15, label: '15' },
                            { value: 30, label: '30' },
                            { value: 60, label: '60' }
                        ]}
                        helperText='Select history length'
                        handleChange={setMinutes}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {
                        <TableEnhanced
                            title={`Actions last ${minutes} min.`}
                            tableData={getTableData(minutes)}
                            columnData={getColumnData()}
                            orderBy='ms'
                            order='desc'
                        />
                    }

                </Grid>
            </Grid>

        </div>
    );

};

Conversations.propTypes = {
    classes: PropTypes.object,
    statistics: PropTypes.object.isRequired,
    minutes: PropTypes.number.isRequired,
    updateMinutes: PropTypes.func.isRequired
};

export default withRouter(withStyles(styles)(Conversations));
