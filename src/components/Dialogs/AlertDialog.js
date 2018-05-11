import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

function Transition (props) {
    return <Slide direction="up" {...props} />;
}

class AlertDialog extends React.Component {

    constructor (props) {
        super(props);

    }

    state = {
        open: false
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    onAgreeClick = () => {

        const { onAgree } = this.props;
        if (typeof onAgree === 'function') {
            onAgree();
        }
        this.handleRequestClose();
    };
    onDisagreeClick = () => {
        this.handleRequestClose();
    };

    render () {
        this.props.component.onClick = this.handleClickOpen;
        return (
            <div>
                <Button color={(this.props.color ? this.props.color : 'default')}
                        className={(this.props.buttonText ? '' : 'hidden')}
                        onClick={this.handleClickOpen}>{this.props.buttonText}</Button>
                <p className={(this.props.text ? '' : 'hidden')}>{this.props.text}</p>
                {this.props.component}
                <Dialog
                    open={this.state.open}
                    transition={Transition}
                    keepMounted
                    onClose={this.handleRequestClose}
                >
                    <DialogTitle>{this.props.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.props.content}
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

AlertDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    content: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    text: PropTypes.string,
    component: PropTypes.func,
    color: PropTypes.string,
    onAgree: PropTypes.func
};

export default AlertDialog;
