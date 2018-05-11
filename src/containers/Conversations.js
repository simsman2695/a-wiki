import Conversations from '../components/Conversations';
import { withRouter } from 'react-router-dom';
import {
    addIntentsStatisticData,
    addListenedStatisticData,
    addRetortsStatisticData,
    setMinutes
} from '../actions';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        statistics: state.statistics,
        minutes: state.dashboard.minutes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addListenedStatisticData (data) {
            dispatch(
                addListenedStatisticData(data)
            );
        },
        addRetortsStatisticData (data) {
            dispatch(
                addRetortsStatisticData(data)
            );
        },
        addIntentsStatisticData (data) {
            dispatch(
                addIntentsStatisticData(data)
            );
        },
        updateMinutes (min) {
            dispatch(
                setMinutes(min)
            );
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Conversations));
