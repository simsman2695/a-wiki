import DrawerMenu from '../components/Nav/DrawerMenu';
import { withRouter } from 'react-router-dom';
import { toggleDialog } from '../actions';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
    return {
        modals: state.modals
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleLogoutDialog () {
            dispatch(
                toggleDialog('logout')
            );
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DrawerMenu));
