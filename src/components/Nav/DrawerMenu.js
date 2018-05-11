import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ChatIcon from 'material-ui-icons/Chat';
import PowerSettingsNew from 'material-ui-icons/PowerSettingsNew';
import Dashboard from 'material-ui-icons/Dashboard';
import ShowChart from 'material-ui-icons/ShowChart';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import { Bug, Robot } from 'mdi-material-ui';
import { withRouter } from 'react-router-dom';

function Transition (props) {
    return <Slide direction="up" {...props} />;
}

const ToolStyles = theme => ({
    root: {},
    listItem: {
        paddingLeft: 12
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4
    }
});

class DrawerMenu extends React.Component {

    state = { open: false };

    constructor (props) {
        super(props);

    }

    logOutUser = () => {
        this.props.onLogout();
        this.props.history.push('/login');
    };

    toggleDialog = () => {
        this.props.toggleLogoutDialog();
    };

    closeDrawer = () => {
        this.props.closeDrawerMethod();
    };

    onAgreeClick = () => {

        this.logOutUser();
        this.toggleDialog();
    };

    onDisagreeClick = () => {
        this.toggleDialog();
    };

    handleCollapse = () => {
        this.setState({ open: !this.state.open });
    };

    render () {
        const {
            modals,
            classes
        } = this.props;
        return (
            <div>
                <List>
                    <ListItem button onClick={this.handleCollapse}>
                        <ListItemIcon>
                            <Robot/>
                        </ListItemIcon>
                        <ListItemText inset primary="Chat Bot"/>
                        {this.state.open ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>

                            <ListItem
                                className={classes.nested}
                                onClick={this.closeDrawer}
                                button
                                component="a"
                                href="#dashboard">
                                <ListItemIcon>
                                    <Dashboard/>
                                </ListItemIcon>
                                <ListItemText primary="Dashboard"/>
                            </ListItem>

                            <ListItem
                                className={classes.nested}
                                onClick={this.closeDrawer}
                                button
                                component="a"
                                href="#conversations">
                                <ListItemIcon>
                                    <ChatIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Conversations"/>
                            </ListItem>

                            <Divider/>

                            <ListItem
                                className={classes.nested}
                                onClick={this.closeDrawer}
                                button
                                component="a"
                                href="#Historic">
                                <ListItemIcon>
                                    <ShowChart/>
                                </ListItemIcon>
                                <ListItemText primary="Historic Data"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <Divider/>

                    <ListItem
                        button
                        onClick={this.toggleDialog}>
                        <ListItemIcon>
                            <Bug/>
                        </ListItemIcon>
                        <ListItemText primary="Report a Bug"/>
                    </ListItem>

                    <ListItem
                        button
                        onClick={this.toggleDialog}>
                        <ListItemIcon>
                            <PowerSettingsNew/>
                        </ListItemIcon>
                        <ListItemText primary="Logout"/>
                    </ListItem>
                </List>
                <Dialog
                    open={modals.logout.open}
                    transition={Transition}
                    keepMounted
                    onClose={this.toggleDialog}
                >
                    <DialogTitle>Logout?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to logout?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onDisagreeClick} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.onAgreeClick} color="primary">
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

DrawerMenu.propTypes = {
    classes: PropTypes.object,
    onLogout: PropTypes.func,
    toggleLogoutDialog: PropTypes.func,
    closeDrawerMethod: PropTypes.func,
    modals: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(withStyles(ToolStyles)(DrawerMenu));
