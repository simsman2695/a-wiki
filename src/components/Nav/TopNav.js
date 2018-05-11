import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { styles } from '../ui/styles';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import classNames from 'classnames';

const TopNav = (props) => {
    const {
        classes,
        navigation,
        drawerOpen = f => f
    } = props;

    const handleDrawerOpen = (side) => {
        drawerOpen(side);
    };

    return (
        <AppBar
            className={classNames(classes.appBar, navigation.leftDrawer.open && classes.appBarShift, navigation.rightDrawer.open && classes.appBarShiftRight)}>
            <Toolbar>
                <IconButton
                    color="contrast"
                    aria-label="open drawer"
                    onClick={() => handleDrawerOpen('left')}
                    className={classNames(classes.menuButton, navigation.leftDrawer.open && classes.hide)}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography type="title" color="inherit" className={classes.flex}>
                    Slack Bot Management Interface
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

TopNav.propTypes = {
    classes: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    drawerOpen: PropTypes.func
};

export default withStyles(styles)(TopNav);
