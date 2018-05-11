import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import FolderIcon from 'material-ui-icons/Folder';
import pink from 'material-ui/colors/pink';
import green from 'material-ui/colors/green';
import deepOrange from 'material-ui/colors/deepOrange';
import deepPurple from 'material-ui/colors/deepPurple';

const imageStyles = {
    row: {
        display: 'flex',
        justifyContent: 'center'
    },
    bigAvatar: {
        width: 60,
        height: 60
    }
};

const ImageAvatars = (props) => {
    const { classes, firstName, lastName, imageUrl, big } = props;
    return (
        <Avatar
            alt={`${firstName} ${lastName}`}
            src={imageUrl}
            className={classNames(classes.avatar, big && classes.bigAvatar)}
        />
    );
};

ImageAvatars.propTypes = {
    classes: PropTypes.object.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    big: PropTypes.bool.isRequired
};

export const ImageAvatar = withStyles(imageStyles)(ImageAvatars);

const iconStyles = {
    pinkAvatar: {
        color: '#fff',
        backgroundColor: pink[500]
    },
    greenAvatar: {
        color: '#fff',
        backgroundColor: green[500]
    },
    row: {
        display: 'flex',
        justifyContent: 'center'
    }
};

const IconAvatars = (props) => {
    const { classes } = props;
    return (
        <Avatar className={classes.avatar}>
            <FolderIcon/>
        </Avatar>
    );
};

IconAvatars.propTypes = {
    classes: PropTypes.object.isRequired
};

export const IconAvatar = withStyles(iconStyles)(IconAvatars);

const styles = {

    orangeAvatar: {
        color: '#fff',
        backgroundColor: deepOrange[500]
    },
    purpleAvatar: {
        color: '#fff',
        backgroundColor: deepPurple[500]
    },
    row: {
        display: 'flex',
        justifyContent: 'center'
    }
};

const LetterAvatars = (props) => {
    const { classes, text, color } = props;
    let colorClass = classes.avatar;
    switch (color.toLowerCase()) {
        case 'purple':
            colorClass = classes.purpleAvatar;
            break;
        case 'orange':
            colorClass = classes.orangeAvatar;
            break;
    }
    return (
        <Avatar className={colorClass}>{text}</Avatar>

    );
};

LetterAvatars.propTypes = {
    classes: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
};

export const LetterAvatar = withStyles(styles)(LetterAvatars);
