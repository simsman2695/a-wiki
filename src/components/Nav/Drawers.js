import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import DrawerMenu from '../../containers/DrawerMenu';
import List from 'material-ui/List';
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

export const Left = withStyles(styles.LeftNavStyles, { withTheme: true })(LeftNav);
