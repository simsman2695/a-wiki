import RealTimeChart from '../components/RealTimeChart';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = (state, store) => {
    return {
        statistics: state.statistics,
        store: store
    };
};

const mapDispatchToProps = dispatch => {
    return {
        /* updateIntents (intents) {
                   dispatch(
                       updateDialogFlowIntentData(intents)
                   );
                   dispatch(
                       dialogFlowIntentFetching(false)
                   );
               }
               */

    };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(RealTimeChart);

export default withRouter(Container);
