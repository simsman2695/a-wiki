import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { styles } from '../ui/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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

                    aria-label="open drawer"
                    onClick={() => handleDrawerOpen('left')}
                    className={classNames(classes.menuButton, navigation.leftDrawer.open && classes.hide)}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography type="title" className={classes.flex}>
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

export default withTheme()(withStyles(styles)(TopNav));
