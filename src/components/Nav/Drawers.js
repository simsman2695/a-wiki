import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,withTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DrawerMenu from '../../containers/DrawerMenu';
import List from '@material-ui/core/List';
import * as styles from '../ui/styles';

const LeftNav = (props) => {

    const {
        classes,
        closeDrawerCallback = f => f,
        navigation
    } = props;

    const handleDrawerClose = () => {
        closeDrawerCallback();
    };

    return (
        <Drawer
            type="permanent"
            classes={{
                paper: classNames(classes.drawerPaper, !navigation.leftDrawer.open && classes.drawerPaperClose)
            }}
            style={{ width: '240px' }}
            open={navigation.leftDrawer.open}
            onClose={handleDrawerClose}
        >
            <div className={classes.drawerInner}>
                <div className={classes.drawerHeader}>
                    <h3></h3>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List
                    className={classes.list}>
                    <DrawerMenu
                        closeDrawerMethod={() => handleDrawerClose()}
                    />
                </List>
            </div>
        </Drawer>

    );

};

LeftNav.propTypes = {
    classes: PropTypes.object,
    theme: PropTypes.object,
    navigation: PropTypes.object,
    closeDrawerCallback: PropTypes.func
};

export const Left = withTheme()(withStyles(styles.LeftNavStyles, { withTheme: true })(LeftNav));
