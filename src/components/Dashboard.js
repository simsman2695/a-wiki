import React from 'react';
import RealTimeChart from '../containers/RealTimeChart';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TableEnhanced from './Tables/TableEnhanced';
import NativeSelect from './Selects/NativeSelect';
import { withStyles } from '@material-ui/core/styles/index';

const alasql = require('alasql');

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

const Dashboard = (props) => {
    const {
        statistics,
        minutes,
        updateMinutes

    } = props;
    const getTableData = () => {
        const unixTimeNow = Math.floor(Date.now() / 1000);
        return Object.keys(statistics).map(key => {
            if (key !== 'minutes') {
                const data = typeof statistics[key] !== 'undefined' ? statistics[key].data : [];
                const res = alasql(`SELECT * FROM ? WHERE ts > ${unixTimeNow - minutes * 60}`, [data]);
                return { name: key, count: res.length };
            }
        });
    };

    const getColumnData = () => {
        return [
            { id: 'name', numeric: false, disablePadding: false, label: 'Action' },
            { id: 'count', numeric: true, disablePadding: false, label: 'Occurrences' }
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
                        Chat Bot RTA
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

                <Grid item xs={12} sm={12} md={8}>
                    {
                        <RealTimeChart
                            width='100%'
                            height='50px'
                            minutes={Number(minutes)}
                            title='Real Time Stats'
                            subscribers={
                                [
                                    {
                                        statistic: 'listened',
                                        label: 'Listened',
                                        rgb: '255, 99, 132',
                                        data: statistics.listened.data
                                    },
                                    {
                                        statistic: 'retorts',
                                        label: 'Retorts',
                                        rgb: '0, 150, 44',
                                        data: statistics.retorts.data
                                    },
                                    {
                                        statistic: 'intents',
                                        label: 'Intents',
                                        rgb: '11, 28, 232',
                                        data: statistics.intents.data
                                    }
                                ]
                            }
                        />
                    }

                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                    {
                    <TableEnhanced
                        title={`Actions last ${minutes} min.`}
                        tableData={getTableData(minutes)}
                        columnData={getColumnData()}
                        order='desc'
                        orderBy='name'
                    />
                    }

                </Grid>
            </Grid>

        </div>
    );

};

Dashboard.propTypes = {
    classes: PropTypes.object,
    statistics: PropTypes.object.isRequired,
    minutes: PropTypes.number.isRequired,
    updateMinutes: PropTypes.func.isRequired
};

export default withRouter(withStyles(styles)(Dashboard));
