import Login from '../components/Login/Login';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { dialogFlowIntentFetching, isLoggedIn, setUser, updateDialogFlowIntentData } from '../actions';

const mapStateToProps = (state) => {
    return {
        user: state.user,
        fetching: state.user.fetching,
        loggedIn: state.loggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogin (user) {

            dispatch(
                setUser(user)
            );
            dispatch(
                isLoggedIn(true)
            );
        },
        updateIntents (intents) {
            dispatch(
                updateDialogFlowIntentData(intents)
            );
            dispatch(
                dialogFlowIntentFetching(false)
            );
        }

    };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Login);

export default withRouter(Container);
