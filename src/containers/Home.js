import Home from '../components/Home/Home';
import { withRouter } from 'react-router-dom';
import {
    addIntentsStatisticData,
    addListenedStatisticData,
    addRetortsStatisticData,
    closeDrawer,
    deleteAllIntentsStatisticData,
    deleteAllListenedStatisticData,
    deleteAllRetortsStatisticData,
    logOut,
    openDrawer,
    setLoginStatus,
    setUser
} from '../actions';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
    return {
        navigation: state.navigation,
        statistics: state.statistics,
        router: props.router
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout () {
            dispatch(
                setUser({})
            );
            dispatch(
                setLoginStatus(false)
            );
            dispatch(
                logOut()
            );
        },
        drawerOpen (side) {
            dispatch(
                openDrawer(side)
            );
            switch (side) {
                case 'left':
                    dispatch(
                        closeDrawer('right')
                    );
                    break;
                case 'right':
                    dispatch(
                        closeDrawer('left')
                    );
            }
        },
        drawerClose (side) {
            dispatch(
                closeDrawer(side)
            );
        },
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
        deleteAllListenedStatisticData () {
            dispatch(
                deleteAllListenedStatisticData()
            );
        },
        deleteAllRetortsStatisticData () {
            dispatch(
                deleteAllRetortsStatisticData()
            );
        },
        deleteAllIntentsStatisticData () {
            dispatch(
                deleteAllIntentsStatisticData()
            );
        }

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
