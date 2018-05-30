import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chart from 'chart.js';

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

class RealTimeChart extends React.Component {

    constructor (props) {
        super(props);
        this.setLabels = this.setLabels.bind(this);
        this.setData = this.setData.bind(this);
        this.getLabels = this.getLabels.bind(this);
        this.lables = this.getLabels();
        this.state = {
            minutes: props.minutes
        };
    }

    componentWillReceiveProps (nextProps) {
        if (Number(nextProps.minutes) !== this.minutes) {
            this.setState({ ['minutes']: nextProps.minutes });
            this.chart.destroy();
            this.initChart(nextProps.minutes);
            clearInterval(this.intervalCounter);
            this.renderChart();
        }
    }

    initChart (minutes) {
        this.minutes = minutes;
        this.startTime = Math.round((new Date()).getTime() / 1000);
        this.seconds = this.minutes * 60;
        this.interval = 1000;
        this.labelsCount = 60 * this.minutes;
    }

    componentDidMount () {
        this.initChart(this.props.minutes);
        this.renderChart();
    }

    renderChart () {
        this.ctx = document.getElementById('myChart').getContext('2d');
        const labels = this.getLabels();
        const data = this.getDataFromSubscribers(labels);
        this.data = {
            labels: labels,
            datasets: data
        };
        this.options = {
            title: {
                display: true,
                text: this.props.title
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: 'white',
                        fontSize: 0,
                        stepSize: 30
                    },
                    scaleLabel: {
                        display: true,
                        labelString: `Over ${this.minutes} minutes`
                    },
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'APS'
                    }
                }]
            }
        };

        this.chart = new Chart(
            this.ctx,
            {
                type: 'line',
                data: this.data,
                options: this.options
            }
        );
        this.intervalCounter = setInterval(() => {
            this.setLabels(this.data.labels);
            for (let x in this.data.datasets) {
                this.setData(this.data.datasets[x].data, this.data.datasets[x].label, this.data.labels);
            }
            this.chart.update();
        }, this.interval);
    }

    getDataFromSubscribers (lables) {
        let resArray = [];
        const state = window.store.getState();
        for (let x in this.props.subscribers) {
            if (state.statistics[this.props.subscribers[x].statistic]) {
                const obj = {
                    fill: false,
                    pointRadius: 0,
                    borderWidth: 2,
                    lineTension: 0,
                    pointHoverRadius: 5,
                    label: this.props.subscribers[x].label,
                    pointBorderColor: `rgba(${this.props.subscribers[x].rgb},1)`,
                    pointBackgroundColor: `rgba(${this.props.subscribers[x].rgb},0.2)`,
                    backgroundColor: [
                        `rgba(${this.props.subscribers[x].rgb}, 0.2)`

                    ],
                    borderColor: [
                        `rgba(${this.props.subscribers[x].rgb},1)`

                    ],
                    data: this.getData(state.statistics[this.props.subscribers[x].statistic].data, lables)
                };

                resArray.push(obj);
            }
        }
        return resArray;
    }

    getLabels () {
        let array = [];
        let x = 1;
        let time = this.startTime;
        while (x <= this.labelsCount) {
            array.push(time);
            time--;
            x++;
        }
        return array.reverse();
    }

    getData (raw, lables) {
        let array = [];
        const countName = typeof raw[0] !== 'undefined' ? Object.keys(raw[0]) : 'none';
        const oldest = this.startTime - this.seconds;
        const res = alasql(`SELECT COUNT(\`${countName[0]}\`) AS \`count\`, ts FROM ? WHERE ts >= ${oldest} AND ts <= ${this.startTime} GROUP BY ts`, [raw]);
        const parsed = {};
        for (let i in res) {
            parsed[res[i].ts] = res[i].count;
        }
        for (let x in lables) {
            if (parsed[lables[x]]) {
                array.push(parsed[lables[x]]);
            } else {
                array.push(0);
            }
        }

        return array;
    }

    getCanvas (minutes) {
        return (<canvas id="myChart" width={this.props.width} height={this.props.height}>

        </canvas>);
    }

    setLabels (labels) {
        const lastItem = labels[labels.length - 1];
        const next = lastItem + 1;
        labels.push(next);
        labels.shift();
    }

    setData (data, label, labels) {
        const state = window.store.getState();
        const raw = state.statistics[label.toLowerCase()].data;

        const countName = typeof raw[0] !== 'undefined' ? Object.keys(raw[0]) : 'none';
        const lastItem = labels[labels.length - 1] - 3;
        const res = alasql(`SELECT COUNT(\`${countName[0]}\`) AS \`count\`, ts FROM ? WHERE ts = ${lastItem} GROUP BY ts`, [raw]);
        data.shift();
        data.push(res[0].count);

    }

    render () {
        const { classes } = this.props;
        const { minutes } = this.state;
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {this.getCanvas(minutes)
                        }
                    </Paper>
                </Grid>

            </Grid>
        );
    }
}

RealTimeChart.propTypes = {
    classes: PropTypes.object.isRequired,
    subscribers: PropTypes.array.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    minutes: PropTypes.number.isRequired,
    statistics: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
};

export default withRouter(withStyles(styles)(RealTimeChart));
