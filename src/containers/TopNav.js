import TopNav from '../components/Nav/TopNav';
import { withRouter } from 'react-router-dom';
import { openDrawer } from '../actions';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
    return {
        navigation: state.navigation,
        router: props.router
    };
};

const mapDispatchToProps = dispatch => {
    return {
        drawerOpen (side) {
            dispatch(
                openDrawer(side)
            );
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopNav));
