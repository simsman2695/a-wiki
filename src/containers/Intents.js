import Intents from '../components/Intents/Intents';
import { withRouter } from 'react-router-dom';
import {
    dialogFlowIntentFetching,
    dialogFlowIntentSearching,
    updateDialogFlowIntentData,
    updateDialogFlowIntentSearchResults
} from '../actions';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
    return {
        searching: state.dialogflow.intents.searching,
        fetching: state.dialogflow.intents.fetching,
        search_query: state.dialogflow.intents.search_query,
        search_results: state.dialogflow.intents.search_results,
        intentsData: state.dialogflow.intents.data,
        user: state.user,
        router: props.router
    };
};

const mapDispatchToProps = dispatch => {
    return {
        isSearching () {
            dispatch(
                dialogFlowIntentSearching(true)
            );
        },
        setSearchResults (results) {
            dispatch(
                updateDialogFlowIntentSearchResults(results)
            );
            dispatch(
                dialogFlowIntentSearching(false)
            );
        },
        fetchingData (state) {
            dispatch(
                dialogFlowIntentFetching(state)
            );
        },
        updateData (data) {
            dispatch(
                updateDialogFlowIntentData(data)
            );
            dispatch(
                dialogFlowIntentFetching(false)
            );
        }

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Intents));
