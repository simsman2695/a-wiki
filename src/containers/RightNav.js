import { Right } from '../components/Nav/Drawers';
import { withRouter } from 'react-router-dom';
import { toggleDrawer } from '../actions';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
    return {
        navigation: state.navigation
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeDrawerCallback () {
            dispatch(
                toggleDrawer('right')
            );
        }

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Right));
