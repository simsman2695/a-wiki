import Register from '../components/Register/Register';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { isLoggedIn, setUser } from '../actions';

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
        }

    };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Register);

export default withRouter(Container);
