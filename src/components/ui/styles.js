import green from '@material-ui/core/colors/green';

export const drawerWidth = 240;
export const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        marginTop: 0,
        zIndex: 1,
        overflow: 'hidden',
        flexGrow: 1
    },
    flex: {
        flex: 1
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%'
    },
    appBar: {
        position: 'absolute',
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    appBarShiftRight: {
        marginRight: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36
    },
    menuButtonRight: {
        marginLeft: 36,
        marginRight: 12
    },
    hide: {
        display: 'none'
    },
    demo: {
        minHeight: `calc(100vh - 100px)`,
        display: 'block',
        margin: 'auto'
    },
    container: {
        height: 'calc(100vh - 260px)',
        marginLeft: '10px',
        marginRight: '10px',
        overflowY: 'auto',
        flexFlow: 'row wrap',
        marginTop: '10px',
        width: 'calc(100% - 20px)'
    },
    drawerPaper: {
        position: 'relative',
        height: '100%',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerPaperClose: {
        width: 60,
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    drawerInner: {
        // Make the items inside not wrap when transitioning:
        width: drawerWidth
    },
    content: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: 50,
        paddingTop: 0,
        height: 'calc(100% - 56px)',
        marginTop: 56,
        overflow: 'auto',
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 64
        }
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar
    },
    me: {
        float: 'right'
    },
    clear: {
        clear: 'both'
    },
    logout: {
        marginLeft: 12,
        marginRight: 36
    },
    avatarWrapper: {
        verticalAlign: 'top',
        marginRight: '10px',
        display: 'inline-block'
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minWidth: '20%',
        maxWidth: '60%',
        flexGrow: 1
    },
    formControl: {
        margin: theme.spacing.unit
    },
    textFieldRoot: {
        padding: 0,
        'label + &': {
            marginTop: theme.spacing.unit * 3
        }
    },
    textFieldInput: {
        borderRadius: 4,
        background: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        width: 'calc(100% - 24px)',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
        }
    },
    button: {
        margin: theme.spacing.unit
    },
    progress: {
        margin: 'auto'
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700]
        }
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    },
    listsRoot: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    }

});

export const LeftNavStyles = (theme) => ({

    drawerPaper: {
        position: 'relative',
        height: '100%',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerPaperClose: {
        width: 60,
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    drawerInner: {
        // Make the items inside not wrap when transitioning:
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar
    }
});
