import React from 'react';
import PropTypes from 'prop-types';
import FaShield from 'react-icons/lib/fa/shield';

const Member = (props) => {

    const style = {
        backgroundColor: 'gray'
    };

    const { name, thumbnail, email } = props;

    const makeAdmin = () => {
        console.log('made admin');
    };

    const admin = () => {
        return true;
    };

    return (
        <div className="member" style={style}>
            <h1>{name} {(admin) ? <FaShield/> : null}</h1>
            <a onClick={makeAdmin}>Make Admin</a>
            <img src={thumbnail} alt="profile picture"/>
            <p><a href={`mailto:${email}`}>{email}</a></p>

        </div>
    );
};

Member.propTypes = {
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
};

export default Member;
